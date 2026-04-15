// POST /api/auth/google
// Header: Authorization: Bearer <Supabase access_token>
// Body:   { page, workflow_id, step_number, source: 'gmail' | 'sheets' }
// Returns: { url } — the Google OAuth consent URL for the client to navigate to.
//
// State is JSON of {user_id, page, workflow_id, step_number, source, ts}, base64url-encoded,
// HMAC-SHA256 signed with VERIFY_SECRET. The callback verifies and rejects stale/tampered state.

const { createClient } = require('@supabase/supabase-js')
const crypto = require('crypto')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const VERIFY_SECRET = process.env.VERIFY_SECRET
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID

const SCOPES = {
  gmail: 'https://www.googleapis.com/auth/gmail.readonly',
  sheets: 'https://www.googleapis.com/auth/spreadsheets.readonly',
}

function signState(payload) {
  const json = JSON.stringify(payload)
  const b64 = Buffer.from(json).toString('base64url')
  const mac = crypto.createHmac('sha256', VERIFY_SECRET).update(b64).digest('hex')
  return `${b64}.${mac}`
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !VERIFY_SECRET || !GOOGLE_CLIENT_ID) {
    return res.status(500).json({ error: 'server_misconfigured' })
  }

  const authHeader = req.headers.authorization || ''
  const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!accessToken) return res.status(401).json({ error: 'missing_auth' })

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const { data: userData, error: userErr } = await supabase.auth.getUser(accessToken)
  if (userErr || !userData?.user) return res.status(401).json({ error: 'invalid_auth' })

  const { page, workflow_id, step_number, source } = req.body || {}
  if (!page || !workflow_id || step_number == null || !source) {
    return res.status(400).json({ error: 'missing_fields' })
  }
  if (!SCOPES[source]) return res.status(400).json({ error: 'invalid_source' })

  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim()
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const redirectUri = `${proto}://${host}/api/auth/google/callback`

  const state = signState({
    user_id: userData.user.id,
    page,
    workflow_id,
    step_number: Number(step_number),
    source,
    ts: Date.now(),
  })

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES[source],
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state,
  })
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

  return res.status(200).json({ url })
}
