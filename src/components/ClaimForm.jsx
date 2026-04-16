import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

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
  specific: `Your workflow reads generic. Tie it to your actual job role or a specific work context.`,
  repeatable: `Someone else couldn't follow this. Add clearer steps so it's runnable.`,
  uses_ai: `Your workflow doesn't mention an AI tool. Add which tool (ChatGPT, Claude, Zapier AI, etc.) and resubmit.`,
}

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
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY ?? '',
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [{ role: 'user', content: GATE2_PROMPT.replace('[SUBMISSION]', text) }],
    }),
  })
  const data = await res.json()
  const raw = data.content?.[0]?.text ?? '{}'
  // Extract JSON even if the model wraps it in markdown
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) return null
  try { return JSON.parse(match[0]) } catch { return null }
}

// ── Status display ─────────────────────────────────────────────────────────

function StatusCard({ submission, onReset }) {
  const statusMap = {
    approved: {
      icon: '✦',
      heading: 'Claim Approved',
      color: 'border-teal-500/40 bg-teal-500/5',
      headingColor: 'text-teal-400',
      body: `Your rank has been updated. Keep going.`,
    },
    pending: {
      icon: '⏳',
      heading: 'Under Review',
      color: 'border-zinc-700 bg-zinc-900',
      headingColor: 'text-white',
      body: `Your Claim has been submitted. A human reviewer will get back to you within 48 hours.`,
    },
    rejected: {
      icon: '↩',
      heading: 'Not Approved — Resubmit',
      color: 'border-red-500/30 bg-red-500/5',
      headingColor: 'text-red-400',
      body: submission.content,
    },
  }
  const s = statusMap[submission.status]
  if (!s) return null
  return (
    <div className={`border rounded-xl px-5 py-5 ${s.color}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{s.icon}</span>
        <p className={`font-bold text-sm ${s.headingColor}`}>{s.heading}</p>
      </div>
      <p className="text-zinc-300 text-sm leading-relaxed mb-3">{s.body}</p>
      {submission.status === 'rejected' && (
        <button
          onClick={onReset}
          className="text-teal-400 text-xs font-bold border border-teal-500/40 px-3 py-1.5 rounded-lg hover:bg-teal-500/10 transition-colors"
        >
          Fix and resubmit →
        </button>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function ClaimForm({ gate }) {
  const { user } = useAuth()
  const [existing, setExisting] = useState(null)
  const [phase, setPhase] = useState('loading') // loading | idle | submitting | reviewing | done
  const [url, setUrl] = useState('')
  const [content, setContent] = useState('')
  const [submissionType, setSubmissionType] = useState('receipt')
  const [rejectionReasons, setRejectionReasons] = useState([])

  const copy = GATE_COPY[gate]
  const gateLabel = GATE_LABELS[gate]

  // ── Load existing submission ─────────────────────────────────────────────
  useEffect(() => {
    if (!user) { setPhase('idle'); return }
    let cancelled = false
    supabase
      .from('submissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('rank_gate', gate)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return
        if (data && data.status !== 'rejected') {
          setExisting(data)
          setPhase('done')
        } else {
          // rejected → allow resubmit; no submission → show form
          setPhase('idle')
        }
      })
    return () => { cancelled = true }
  }, [user, gate])

  // ── Auto-review logic ────────────────────────────────────────────────────
  async function runAutoReview(rowId) {
    let approved = false
    let feedback = []

    if (gate === 'free') {
      approved = url.trim().startsWith('http')
    } else if (gate === 'starter') {
      setPhase('reviewing')
      const scores = await scoreGate2(content.trim())
      if (!scores) {
        // API failure — optimistically approve rather than blocking the user
        approved = true
      } else {
        const passes = [scores.specific, scores.repeatable, scores.uses_ai].filter(Boolean).length
        approved = passes >= 2
        if (!approved) {
          if (!scores.specific)    feedback.push(GATE2_FEEDBACK.specific)
          if (!scores.repeatable)  feedback.push(GATE2_FEEDBACK.repeatable)
          if (!scores.uses_ai)     feedback.push(GATE2_FEEDBACK.uses_ai)
        }
      }
    } else if (gate === 'playbook') {
      approved = url.trim().startsWith('http') && content.trim().length > 20
    }
    // gate === 'operator': no auto-review, stays pending

    const status = gate === 'operator' ? 'pending' : approved ? 'approved' : 'rejected'
    const rejectionNote = feedback.join(' ')

    // Update submission row
    await supabase
      .from('submissions')
      .update({
        status,
        reviewed_by: gate === 'operator' ? null : 'adonis',
        reviewed_at: gate === 'operator' ? null : new Date().toISOString(),
        // Store rejection reasons in content field if rejected
        ...(status === 'rejected' ? { content: rejectionNote } : {}),
      })
      .eq('id', rowId)

    // Update profile rank on approval
    if (status === 'approved') {
      await supabase
        .from('profiles')
        .update({ rank: GATE_RANK[gate] })
        .eq('id', user.id)
    }

    if (status === 'rejected') {
      setRejectionReasons(feedback)
      setExisting({ id: rowId, status: 'rejected', content: rejectionNote })
    } else {
      setExisting({ id: rowId, status })
    }
    setPhase('done')
  }

  // ── Submit handler ───────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault()
    if (!user || phase === 'submitting' || phase === 'reviewing') return

    // Basic validation
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
        user_id: user.id,
        rank_gate: gate,
        submission_type: gate === 'operator' ? submissionType : null,
        url: url.trim() || null,
        content: content.trim() || null,
        status: 'pending',
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
    setRejectionReasons([])
    setPhase('idle')
  }

  // ── Render ───────────────────────────────────────────────────────────────

  if (phase === 'loading') {
    return <div className="h-24 flex items-center justify-center"><div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" /></div>
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
        <StatusCard submission={existing} onReset={handleReset} />
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
                    { val: 'receipt', label: 'Paid invoice or receipt' },
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
            disabled={phase === 'submitting' || phase === 'reviewing'}
            className="w-full bg-teal-500 hover:bg-teal-400 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {phase === 'submitting' && 'Saving...'}
            {phase === 'reviewing' && 'Adonis is reviewing...'}
            {phase === 'idle' && 'File Your Claim →'}
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
