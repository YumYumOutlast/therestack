import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return res.status(500).json({ error: 'server_misconfigured' })
  }

  const { email } = req.body || {}

  if (typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'invalid_email' })
  }

  const normalized = email.trim().toLowerCase()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(normalized)) {
    return res.status(400).json({ error: 'invalid_email' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const { error } = await supabase.from('subscribers').insert({
    email: normalized,
    sequence_step: 0,
    created_at: new Date().toISOString(),
    unsubscribed: false,
  })

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'already_subscribed' })
    }
    console.error('Supabase insert failed:', error)
    return res.status(500).json({ error: 'supabase_error' })
  }

  return res.status(200).json({ ok: true })
}
