import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SubmissionModal({ challenge, userId, onComplete, onClose }) {
  const [proof, setProof] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const row = {
      user_id: userId,
      challenge_id: challenge.id,
      xp_earned: challenge.xp,
    }
    if (proof.trim()) {
      if (challenge.proofType === 'url') row.proof_url = proof.trim()
      else row.proof_text = proof.trim()
    }

    const { error: err } = await supabase.from('arena_completions').insert(row)

    if (err) {
      setError(err.message)
      setSubmitting(false)
    } else {
      onComplete(challenge.id)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        style={{ backgroundColor: '#0e0e14', border: '1px solid #27272a', maxWidth: 420 }}
        className="w-full rounded-2xl p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-teal-400 font-bold text-sm mb-0.5">{challenge.title}</p>
            <p className="text-zinc-500 text-xs">+{challenge.xp} XP on completion</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xl leading-none transition-colors w-7 h-7 flex items-center justify-center shrink-0"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="border-t border-zinc-800" />

        {/* Proof field */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {challenge.proofType === 'url' ? (
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
                Link to your work <span className="text-zinc-600 font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                placeholder="https://..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
              />
              <p className="text-zinc-600 text-xs mt-1.5">Zapier Zap, Google Doc, screenshot link, published post — anything that shows you did it.</p>
            </div>
          ) : (
            <div>
              <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
                Describe what you built <span className="text-zinc-600 font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                placeholder="What did you build, and what changed because of it?"
                rows={4}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-teal-500 transition-colors resize-none"
              />
            </div>
          )}

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-teal-500 hover:bg-teal-400 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {submitting ? 'Completing…' : 'Complete Challenge →'}
          </button>

          <p className="text-zinc-600 text-xs text-center">
            Self-reported. We trust you to actually do the work.
          </p>
        </form>
      </div>
    </div>
  )
}
