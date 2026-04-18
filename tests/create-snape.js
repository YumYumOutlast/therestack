/* eslint-disable no-console */
/**
 * Create the Snape E2E test user via the Supabase admin API.
 *
 * This is the programmatic alternative to tests/snape-seed.sql — it delegates
 * password hashing to GoTrue, so sign-in is guaranteed to work with whatever
 * format the running auth server expects.
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... \
 *   node tests/create-snape.js
 *
 * Idempotent: if the user already exists, the password + metadata are updated
 * (and tier is ensured on the profile row) instead of erroring.
 *
 * After running, tests/snape.js can sign in as:
 *   email:    snape@therestack.com
 *   password: TestSnape123!
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const EMAIL = 'snape@therestack.com'
const PASSWORD = 'TestSnape123!'

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('✗ Missing env: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Same UUID tests/snape-seed.sql used, so if that seed ran first we can find the row.
const SEED_UUID = 'a0000000-0000-4000-a000-000000000002'

async function main() {
  console.log(`→ Creating/updating ${EMAIL} on ${SUPABASE_URL}`)

  let userId

  // Strategy: try the known seed UUID first. If it exists, reset password via update.
  // If not, try createUser. If createUser says the email is taken (but the UUID we
  // tried wasn't the right one), delete the known UUID row and retry — this handles
  // the case where the earlier SQL seed left a corrupt/partial row that blocks
  // createUser but whose id we know.
  const byId = await admin.auth.admin.getUserById(SEED_UUID)
  if (byId.data?.user) {
    console.log(`  found seeded user at ${SEED_UUID} — resetting password`)
    const { data, error } = await admin.auth.admin.updateUserById(SEED_UUID, {
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
    })
    if (error) throw error
    userId = data.user.id
  } else {
    const created = await admin.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
    })
    if (created.error) {
      const msg = created.error.message || ''
      if (/already/i.test(msg) || /registered/i.test(msg) || /duplicate/i.test(msg)) {
        console.log(`  createUser says email exists — deleting seed UUID and retrying`)
        await admin.auth.admin.deleteUser(SEED_UUID).catch(() => {})
        const retry = await admin.auth.admin.createUser({
          email: EMAIL,
          password: PASSWORD,
          email_confirm: true,
        })
        if (retry.error) throw retry.error
        userId = retry.data.user.id
        console.log(`  created new user (id ${userId})`)
      } else {
        throw created.error
      }
    } else {
      userId = created.data.user.id
      console.log(`  created new user (id ${userId})`)
    }
  }

  // Ensure a profile row exists with tier = 'free' so Snape can reach /free.
  const { error: profileErr } = await admin
    .from('profiles')
    .upsert({ id: userId, tier: 'free' }, { onConflict: 'id' })
  if (profileErr) {
    // Non-fatal: the profile may be auto-created by a trigger, or the column
    // set may differ. Log and continue — sign-in will still work.
    console.warn(`  ! profile upsert warning: ${profileErr.message}`)
  } else {
    console.log(`  profile row ready (tier=free)`)
  }

  console.log(`✓ Snape is ready. email=${EMAIL} password=${PASSWORD}`)
}

main().catch((err) => {
  console.error('✗ Failed:', err?.message || err)
  process.exit(1)
})
