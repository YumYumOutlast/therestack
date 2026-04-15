// GET /api/auth/google/callback?code=...&state=...
// Google redirects here after the user consents. We verify state, exchange code,
// store tokens in user_tokens, and (on success) upsert the verified progress row.
//
// Required SQL (run once):
//   create table if not exists user_tokens (
//     id uuid primary key default gen_random_uuid(),
//     user_id uuid not null references auth.users(id) on delete cascade,
//     provider text not null,
//     access_token text not null,
//     refresh_token text,
//     expires_at timestamptz,
//     created_at timestamptz not null default now(),
//     unique (user_id, provider)
//   );
//   alter table user_tokens enable row level security;
//   -- No public policies: service role only.

const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const VERIFY_SECRET = process.env.VERIFY_SECRET
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

const MAX_STATE_AGE_MS = 15 * 60 * 1000

function verifyState(state) {
  if (!state || typeof state !== 'string') return null
  const [b64, mac] = state.split('.')
  if (!b64 || !mac) return null
  const expected = crypto.createHmac('sha256', VERIFY_SECRET).update(b64).digest('hex')
  const macBuf = Buffer.from(mac, 'hex')
  const expBuf = Buffer.from(expected, 'hex')
  if (macBuf.length !== expBuf.length) return null
  if (!crypto.timingSafeEqual(macBuf, expBuf)) return null
  try {
    const json = Buffer.from(b64, 'base64url').toString('utf8')
    const payload = JSON.parse(json)
    if (typeof payload.ts !== 'number' || Date.now() - payload.ts > MAX_STATE_AGE_MS) return null
    return payload
  } catch {
    return null
  }
}

// TODO: per-workflow Gmail/Sheets API checks. For now OAuth success alone = verified.
async function checkCondition(/* workflow_id, tokens */) {
  return true
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).send('method_not_allowed')
  }
  if (
    !SUPABASE_URL ||
    !SUPABASE_SERVICE_ROLE_KEY ||
    !VERIFY_SECRET ||
    !GOOGLE_CLIENT_ID ||
    !GOOGLE_CLIENT_SECRET
  ) {
    return res.status(500).send('server_misconfigured')
  }

  const { code, state, error: oauthError } = req.query || {}
  if (oauthError) {
    return res.redirect(302, `/profile?verify_error=${encodeURIComponent(String(oauthError))}`)
  }
  if (!code || !state) return res.status(400).send('missing_code_or_state')

  const payload = verifyState(String(state))
  if (!payload) return res.status(400).send('invalid_state')

  const { user_id, page, workflow_id, step_number, source } = payload

  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim()
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const redirectUri = `${proto}://${host}/api/auth/google/callback`

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: String(code),
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })
  if (!tokenRes.ok) {
    const errText = await tokenRes.text()
    console.error('Google token exchange failed:', errText)
    return res.status(502).send('token_exchange_failed')
  }
  const tokens = await tokenRes.json()
  const expiresAt = new Date(Date.now() + (tokens.expires_in || 3600) * 1000).toISOString()

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const provider = `google_${source}`
  const { error: tokenUpsertErr } = await supabase.from('user_tokens').upsert(
    {
      user_id,
      provider,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || null,
      expires_at: expiresAt,
    },
    { onConflict: 'user_id,provider' }
  )
  if (tokenUpsertErr) {
    console.error('user_tokens upsert failed:', tokenUpsertErr)
    return res.status(500).send('token_store_failed')
  }

  const verified = await checkCondition(workflow_id, tokens)
  if (verified) {
    const now = new Date().toISOString()
    const { error: progErr } = await supabase.from('progress').upsert(
      {
        user_id,
        page,
        workflow_id,
        step_number,
        completed: true,
        completed_at: now,
        verified: true,
        verified_source: source,
        verified_at: now,
      },
      { onConflict: 'user_id,page,workflow_id,step_number' }
    )
    if (progErr) {
      console.error('progress upsert failed:', progErr)
      return res.status(500).send('progress_update_failed')
    }
  }

  return res.redirect(
    302,
    `/${page}?verified=${encodeURIComponent(`${workflow_id}_${step_number}`)}`
  )
}
