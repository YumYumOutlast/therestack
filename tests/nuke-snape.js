import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars')
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const EMAIL = 'snape@therestack.com'

async function main() {
  console.log(`→ Looking up ${EMAIL} across all auth users...`)
  let page = 1
  let foundUser = null

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) { console.error('listUsers error:', error.message); process.exit(1) }
    const hit = data.users.find((u) => (u.email || '').toLowerCase() === EMAIL)
    if (hit) { foundUser = hit; break }
    if (data.users.length < 1000) break
    page++
  }

  if (!foundUser) {
    console.log(`✓ No user with email ${EMAIL} exists. Nothing to delete.`)
    return
  }

  console.log(`→ Found ${EMAIL} with UUID ${foundUser.id}. Deleting...`)
  const { error: delErr } = await admin.auth.admin.deleteUser(foundUser.id)
  if (delErr) { console.error('deleteUser error:', delErr.message); process.exit(1) }

  console.log(`✓ Deleted ${EMAIL} (UUID ${foundUser.id}).`)
}

main().catch((e) => { console.error('crashed:', e.message || e); process.exit(1) })
