import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function ConnectGoogle({ page, workflowId, stepNumber, source, label }) {
  const { user } = useAuth()
  const [verified, setVerified] = useState(false)
  const [verifiedAt, setVerifiedAt] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setVerified(false)
      setVerifiedAt(null)
      return
    }
    let cancelled = false
    supabase
      .from('progress')
      .select('verified, verified_at')
      .eq('user_id', user.id)
      .eq('page', page)
      .eq('workflow_id', workflowId)
      .eq('step_number', stepNumber)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return
        setVerified(data?.verified === true)
        setVerifiedAt(data?.verified_at ?? null)
      })
    return () => {
      cancelled = true
    }
  }, [user, page, workflowId, stepNumber])

  async function handleClick() {
    if (!user || loading) return
    setLoading(true)
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.access_token) {
      setLoading(false)
      return
    }
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        page,
        workflow_id: workflowId,
        step_number: stepNumber,
        source,
      }),
    })
    const data = await res.json().catch(() => null)
    if (data?.url) {
      window.location.href = data.url
    } else {
      setLoading(false)
    }
  }

  if (verified) {
    const when = verifiedAt ? new Date(verifiedAt).toLocaleDateString() : ''
    return (
      <span className="inline-flex items-center gap-1.5 text-teal-400 text-xs font-bold bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 rounded-lg">
        Verified ✓{when && ` · ${when}`}
      </span>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading || !user}
      className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-300 border border-zinc-700 hover:border-teal-500/40 hover:text-teal-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
    >
      {loading ? 'Opening…' : label || 'Verify with Google'}
    </button>
  )
}
