import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { RANK_META } from '../lib/rankMeta'
import { generateCredentialId, generateCertificate } from '../lib/generateCertificate'

// ── Gate configuration ─────────────────────────────────────────────────────

const GATE_COPY = {
  free: `You've got the blueprint. Now prove you used it. To file your Claim, you need one thing: 3 completed workflows documented somewhere. Google Doc, Notion, screenshot — anything that shows you did the work. Paste the link. Adonis confirms it's real. You rank up.`,
  starter: `You've been systematizing. Now build something that didn't exist before. To file your Claim, you need one thing: a custom workflow you designed for your actual job. Not from the curriculum. Yours. Adonis reads it and scores it on three things: is it specific to your role, can someone else run it, does it use AI. Hit 2 of 3 and you're through.`,
  playbook: `You think in systems now. Prove it to the world — and to one other person. To file your Claim, you need two things: a public post about systems, automation, or AI (paste the URL), and one person you walked through a workflow (their name, what you built, what changed).`,
  operator: `This is the last gate. A human reviews this one. To file your Claim, you need one of three things: a paid invoice or receipt, a testimonial from someone whose work you changed, or a case study. Submit your Claim. Reviewed within 48 hours.`,
}

// Rank the user earns when each gate is approved
const GATE_RANK = { free: 'flow', starter: 'builder', playbook: 'strategist', operator: 'sovereign' }

const GATE_LABELS = { free: 'Gate 1', starter: 'Gate 2', playbook: 'Gate 3', operator: 'Gate 4 — Human Review' }

// Gate 2 rejection feedback per failed criterion
const GATE2_FEEDBACK = {
  specific:   `Your workflow reads generic. Tie it to your actual job role or a specific work context.`,
  repeatable: `Someone else couldn't follow this. Add clearer steps so it's runnable.`,
  uses_ai:    `Your workflow doesn't mention an AI tool. Add which tool (ChatGPT, Claude, Zapier AI, etc.) and resubmit.`,
}

const HOW_FOUND_OPTIONS = ['Reddit', 'Google', 'Word of mouth', 'X / Twitter', 'LinkedIn', 'Other']

// ── Gate 2 AI scoring ──────────────────────────────────────────────────────

const GATE2_PROMPT = `You are evaluating a workflow submission for The Restack, an AI automation education platform.

The user was asked to describe a custom workflow they designed for their actual job — not from the curriculum, but something they built themselves.

SUBMISSION:
"""
[SUBMISSION]
"""

Score this on exactly three criteria:
1. SPECIFIC — Is it clearly tied to a real job role or actual work context (not vague or generic)?
2. REPEATABLE — Is it described clearly enough that someone else could follow and run it?
3. USES_AI — Does it explicitly involve at least one AI tool (ChatGPT, Claude, Zapier AI, etc.)?

Respond with JSON only. No explanation. No preamble. Example format:
{"specific": true, "repeatable": false, "uses_ai": true}`

async function scoreGate2(text) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return null

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [{ role: 'user', content: GATE2_PROMPT.replace('[SUBMISSION]', text) }],
    }),
  })
  if (!res.ok) return null
  const data = await res.json()
  const raw = data.content?.[0]?.text ?? '{}'
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) return null
  try { return JSON.parse(match[0]) } catch { return null }
}

// ── Status display ─────────────────────────────────────────────────────────

function StatusCard({ submission, certification, onReset, onGenerateCert, generatingCert }) {
  if (!submission) return null

  if (submission.status === 'approved') {
    return (
      <div className="border border-teal-500/40 bg-teal-500/5 rounded-xl px-5 py-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">✦</span>
          <p className="font-bold text-sm text-teal-400">Claim Approved</p>
        </div>
        <p className="text-zinc-300 text-sm leading-relaxed mb-4">
          Your rank has been updated. Keep going.
        </p>
        {certification?.certificate_url ? (
          <a
            href={certification.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-black font-bold px-4 py-2 rounded-lg transition-colors text-sm no-underline"
          >
            ⬇ Download Certificate
          </a>
        ) : (
          <button
            onClick={onGenerateCert}
            disabled={generatingCert}
            className="bg-teal-500 hover:bg-teal-400 text-black font-bold px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingCert ? 'Generating...' : 'Generate Certificate →'}
          </button>
        )}
        {certification?.credential_id && (
          <p className="text-zinc-600 text-xs mt-3">
            Credential ID: {certification.credential_id}
          </p>
        )}
      </div>
    )
  }

  if (submission.status === 'pending') {
    return (
      <div className="border border-zinc-700 bg-zinc-900 rounded-xl px-5 py-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">⏳</span>
          <p className="font-bold text-sm text-white">Under Review</p>
        </div>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Your Claim has been submitted. A human reviewer will get back to you within 48 hours.
        </p>
      </div>
    )
  }

  if (submission.status === 'rejected') {
    return (
      <div className="border border-red-500/30 bg-red-500/5 rounded-xl px-5 py-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">↩</span>
          <p className="font-bold text-sm text-red-400">Not Approved — Resubmit</p>
        </div>
        <p className="text-zinc-300 text-sm leading-relaxed mb-3">{submission.content}</p>
        <button
          onClick={onReset}
          className="text-teal-400 text-xs font-bold border border-teal-500/40 px-3 py-1.5 rounded-lg hover:bg-teal-500/10 transition-colors"
        >
          Fix and resubmit →
        </button>
      </div>
    )
  }

  return null
}

// ── Main component ─────────────────────────────────────────────────────────

export default function ClaimForm({ gate }) {
  const { user, profile } = useAuth()

  // ── Submission + cert state
  const [existing, setExisting] = useState(null)
  const [certification, setCertification] = useState(null)
  const [phase, setPhase] = useState('loading') // loading | info | idle | submitting | reviewing | certifying | done

  // ── Claim fields
  const [url, setUrl] = useState('')
  const [content, setContent] = useState('')
  const [submissionType, setSubmissionType] = useState('receipt')

  // ── Personal info fields
  const [fullName, setFullName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [department, setDepartment] = useState('')
  const [company, setCompany] = useState('')
  const [memberState, setMemberState] = useState('')
  const [howTheyFound, setHowTheyFound] = useState('')

  // ── On-demand cert generation (Gate 4 + error recovery)
  const [generatingCert, setGeneratingCert] = useState(false)

  const copy = GATE_COPY[gate]
  const gateLabel = GATE_LABELS[gate]

  // ── Load existing submission + certification ────────────────────────────
  useEffect(() => {
    if (!user) { setPhase('idle'); return }
    let cancelled = false
    Promise.all([
      supabase
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('rank_gate', gate)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('certifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('rank', GATE_RANK[gate])
        .maybeSingle(),
    ]).then(([{ data: sub }, { data: cert }]) => {
      if (cancelled) return
      if (cert) setCertification(cert)
      if (sub && sub.status !== 'rejected') {
        setExisting(sub)
        setPhase('done')
      } else {
        setPhase('idle')
      }
    })
    return () => { cancelled = true }
  }, [user, gate])

  // ── Check if info step is needed (fires after loading + profile ready) ──
  useEffect(() => {
    if (phase !== 'idle') return
    if (!profile) return
    if (!profile.full_name) setPhase('info')
  }, [profile, phase])

  // ── Auto-review + cert generation ─────────────────────────────────────
  async function runAutoReview(rowId) {
    let approved = false
    let feedback = []

    if (gate === 'free') {
      approved = url.trim().startsWith('http')
    } else if (gate === 'starter') {
      setPhase('reviewing')
      const scores = await scoreGate2(content.trim())
      if (!scores) {
        approved = true // API failure → optimistic approve
      } else {
        const passes = [scores.specific, scores.repeatable, scores.uses_ai].filter(Boolean).length
        approved = passes >= 2
        if (!approved) {
          if (!scores.specific)   feedback.push(GATE2_FEEDBACK.specific)
          if (!scores.repeatable) feedback.push(GATE2_FEEDBACK.repeatable)
          if (!scores.uses_ai)    feedback.push(GATE2_FEEDBACK.uses_ai)
        }
      }
    } else if (gate === 'playbook') {
      approved = url.trim().startsWith('http') && content.trim().length > 20
    }
    // gate === 'operator': no auto-review, stays pending

    const status = gate === 'operator' ? 'pending' : approved ? 'approved' : 'rejected'
    const rejectionNote = feedback.join(' ')

    await supabase
      .from('submissions')
      .update({
        status,
        reviewed_by: gate === 'operator' ? null : 'adonis',
        reviewed_at: gate === 'operator' ? null : new Date().toISOString(),
        ...(status === 'rejected' ? { content: rejectionNote } : {}),
      })
      .eq('id', rowId)

    if (status === 'rejected') {
      setExisting({ id: rowId, status: 'rejected', content: rejectionNote })
      setPhase('done')
      return
    }

    if (status === 'approved') {
      const newRank = GATE_RANK[gate]
      await supabase.from('profiles').update({ rank: newRank }).eq('id', user.id)

      // Generate certificate
      setPhase('certifying')
      try {
        await issueCertificate(newRank)
      } catch (err) {
        console.error('Certificate generation failed:', err)
        // Rank updated, cert failed — user can generate on-demand from StatusCard
      }
    }

    setExisting({ id: rowId, status })
    setPhase('done')
  }

  // ── Certificate issuance (shared between auto-review and on-demand) ─────
  async function issueCertificate(rank) {
    const effective = {
      fullName:  fullName  || profile?.full_name  || '',
      jobTitle:  jobTitle  || profile?.job_title  || '',
      department: department || profile?.department || '',
      company:   company   || profile?.company    || '',
      state:     memberState || profile?.state    || '',
    }

    const credentialId = await generateCredentialId(rank)
    const certUrl = await generateCertificate({
      credentialId,
      rank,
      fullName:  effective.fullName,
      jobTitle:  effective.jobTitle,
      company:   effective.company,
      state:     effective.state,
    })

    await supabase.from('certifications').insert({
      user_id:        user.id,
      rank,
      full_name:      effective.fullName,
      job_title:      effective.jobTitle,
      department:     effective.department,
      company:        effective.company,
      state:          effective.state,
      email:          user.email,
      credential_id:  credentialId,
      certificate_url: certUrl,
    })

    setCertification({ credential_id: credentialId, certificate_url: certUrl, rank })
  }

  // ── On-demand cert generation (Gate 4 / error recovery) ────────────────
  async function handleGenerateCert() {
    if (generatingCert) return
    setGeneratingCert(true)
    try {
      await issueCertificate(GATE_RANK[gate])
    } catch (err) {
      console.error('Certificate generation failed:', err)
      alert('Certificate generation failed. Please try again.')
    } finally {
      setGeneratingCert(false)
    }
  }

  // ── Info step submit ───────────────────────────────────────────────────
  async function handleInfoSubmit(e) {
    e.preventDefault()
    if (!fullName.trim()) return

    await supabase.from('profiles').update({
      full_name:     fullName.trim(),
      job_title:     jobTitle.trim() || null,
      department:    department.trim() || null,
      company:       company.trim() || null,
      state:         memberState.trim() || null,
      how_they_found: howTheyFound || null,
    }).eq('id', user.id)

    setPhase('idle')
  }

  // ── Claim submit ───────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    if (!user || phase === 'submitting' || phase === 'reviewing') return

    if (gate === 'free' && !url.trim().startsWith('http')) {
      alert('Please paste a valid URL starting with http.')
      return
    }
    if (gate === 'starter' && content.trim().length < 50) {
      alert('Your workflow description is too short. Add more detail.')
      return
    }
    if (gate === 'playbook' && (!url.trim().startsWith('http') || content.trim().length < 10)) {
      alert('Please fill in both the URL and the colleague description.')
      return
    }
    if (gate === 'operator' && !url.trim() && !content.trim()) {
      alert('Please add either a URL or a description.')
      return
    }

    setPhase('submitting')

    const { data: row, error } = await supabase
      .from('submissions')
      .insert({
        user_id:         user.id,
        rank_gate:       gate,
        submission_type: gate === 'operator' ? submissionType : null,
        url:             url.trim() || null,
        content:         content.trim() || null,
        status:          'pending',
      })
      .select('id')
      .single()

    if (error || !row) {
      setPhase('idle')
      alert('Something went wrong saving your submission. Try again.')
      return
    }

    await runAutoReview(row.id)
  }

  function handleReset() {
    setExisting(null)
    setUrl('')
    setContent('')
    setSubmissionType('receipt')
    setPhase('idle')
  }

  // ── Render ─────────────────────────────────────────────────────────────

  if (phase === 'loading') {
    return (
      <div className="h-24 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ── Info step ────────────────────────────────────────────────────────────
  if (phase === 'info') {
    return (
      <div>
        <div className="border-l-4 border-teal-400 bg-zinc-900 rounded-r-xl px-6 py-5 mb-6">
          <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">Before you file your claim</p>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Your certificate will use these details. Fill in what you can — only your name is required.
          </p>
        </div>
        <form onSubmit={handleInfoSubmit} className="space-y-4">
          <div>
            <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
              Full Name <span className="text-teal-400">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Smith"
              required
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Operations Manager"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Marketing"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">State / Region</label>
              <input
                type="text"
                value={memberState}
                onChange={(e) => setMemberState(e.target.value)}
                placeholder="California"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">How did you find The Restack?</label>
            <select
              value={howTheyFound}
              onChange={(e) => setHowTheyFound(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
            >
              <option value="">Select one (optional)</option>
              {HOW_FOUND_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-400 text-black font-bold py-3 rounded-lg transition-colors text-sm"
          >
            Continue to Claim →
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      {/* How to Rank Up copy */}
      <div className="border-l-4 border-teal-400 bg-zinc-900 rounded-r-xl px-6 py-5 mb-6">
        <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">How to Rank Up — {gateLabel}</p>
        <p className="text-zinc-300 text-sm leading-relaxed">{copy}</p>
      </div>

      {/* Status or form */}
      {phase === 'done' && existing ? (
        <StatusCard
          submission={existing}
          certification={certification}
          onReset={handleReset}
          onGenerateCert={handleGenerateCert}
          generatingCert={generatingCert}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gate 1: URL only */}
          {gate === 'free' && (
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
                Documentation URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://docs.google.com/..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
                required
              />
            </div>
          )}

          {/* Gate 2: Text only */}
          {gate === 'starter' && (
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
                Your Custom Workflow
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe the workflow you built for your job. Include: your role, what it does, step by step, and which AI tool(s) it uses."
                rows={8}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                required
              />
            </div>
          )}

          {/* Gate 3: URL + text */}
          {gate === 'playbook' && (
            <>
              <div>
                <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
                  Public Post URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://linkedin.com/posts/... or any public URL"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
                  Who you helped + what changed
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Example: I walked my colleague Sarah (operations manager) through the email drafting workflow. She now spends 20 min instead of 90 min on her weekly comms."
                  rows={5}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                  required
                />
              </div>
            </>
          )}

          {/* Gate 4: Choice + URL or text */}
          {gate === 'operator' && (
            <>
              <div>
                <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-3">
                  What are you submitting?
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { val: 'receipt',    label: 'Paid invoice or receipt' },
                    { val: 'testimonial', label: 'Testimonial from a client or colleague' },
                    { val: 'case-study', label: 'Case study' },
                  ].map(({ val, label }) => (
                    <label key={val} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="submissionType"
                        value={val}
                        checked={submissionType === val}
                        onChange={(e) => setSubmissionType(e.target.value)}
                        className="accent-teal-400"
                      />
                      <span className="text-zinc-300 text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
                  URL (if applicable)
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
                  Description or paste text
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste the testimonial, describe the case study, or add any context for the reviewer."
                  rows={6}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                />
              </div>
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={phase === 'submitting' || phase === 'reviewing' || phase === 'certifying'}
            className="w-full bg-teal-500 hover:bg-teal-400 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {phase === 'submitting'  && 'Saving...'}
            {phase === 'reviewing'   && 'Adonis is reviewing...'}
            {phase === 'certifying'  && 'Generating certificate...'}
            {phase === 'idle'        && 'File Your Claim →'}
          </button>

          {!user && (
            <p className="text-zinc-500 text-xs text-center">
              You need to be signed in to file a claim.
            </p>
          )}
        </form>
      )}
    </div>
  )
}
