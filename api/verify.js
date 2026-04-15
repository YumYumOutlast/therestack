// POST /api/verify
// Header: x-verify-secret: <per-user verify_token from profiles>
// Body:   { page, workflow_id, step_number, source }
//
// Required SQL (run once):
//   alter table profiles add column if not exists verify_token text unique;
//   alter table progress
//     add constraint if not exists progress_user_page_workflow_step_key
//     unique (user_id, page, workflow_id, step_number);

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'server_misconfigured' })
  }

  const token = req.headers['x-verify-secret']
  if (!token || typeof token !== 'string') {
    return res.status(401).json({ error: 'missing_token' })
  }

  const { page, workflow_id, step_number, source } = req.body || {}
  if (!page || !workflow_id || step_number == null || !source) {
    return res.status(400).json({ error: 'missing_fields' })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const { data: profile, error: lookupErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('verify_token', token)
    .maybeSingle()
  if (lookupErr) {
    console.error('profile lookup failed:', lookupErr)
    return res.status(500).json({ error: 'lookup_failed' })
  }
  if (!profile) return res.status(401).json({ error: 'invalid_token' })

  const now = new Date().toISOString()
  const { error: progErr } = await supabase.from('progress').upsert(
    {
      user_id: profile.id,
      page,
      workflow_id,
      step_number: Number(step_number),
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
    return res.status(500).json({ error: 'upsert_failed' })
  }

  return res.status(200).json({ ok: true })
}
