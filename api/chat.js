// POST /api/chat
// Header: Authorization: Bearer <Supabase access_token>
// Body:   { system, messages, model?, max_tokens? }
// Returns: the Anthropic /v1/messages response body verbatim.
//
// Server-side proxy so the Anthropic API key is never exposed to the browser.
// Adonis was previously hitting api.anthropic.com directly with
// anthropic-dangerous-direct-browser-access, which leaked the key to every
// page load and hit CORS issues in some browsers.

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

const DEFAULT_MODEL = 'claude-sonnet-4-20250514'
const DEFAULT_MAX_TOKENS = 1000

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'server_misconfigured' })
  }

  const authHeader = req.headers.authorization || ''
  const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!accessToken) return res.status(401).json({ error: 'missing_auth' })

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  const { data: userData, error: userErr } = await supabase.auth.getUser(accessToken)
  if (userErr || !userData?.user) return res.status(401).json({ error: 'invalid_auth' })

  const { system, messages, model, max_tokens } = req.body || {}
  if (!system || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'missing_fields' })
  }

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model || DEFAULT_MODEL,
      max_tokens: max_tokens || DEFAULT_MAX_TOKENS,
      system,
      messages,
    }),
  })

  const body = await upstream.json().catch(() => ({ error: { message: 'invalid_upstream_response' } }))
  return res.status(upstream.status).json(body)
}
