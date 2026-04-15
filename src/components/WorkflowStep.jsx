import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function WorkflowStep({ stepNumber, title, children, workflowId }) {
  const { user } = useAuth()
  const [checked, setChecked] = useState(false)

  // workflowId is the legacy "{page}_{slug}" form, e.g. "free_email", "starter_clients_1"
  const [page, ...rest] = workflowId.split('_')
  const slug = rest.join('_')

  useEffect(() => {
    if (!user) {
      setChecked(false)
      return
    }
    let cancelled = false
    supabase
      .from('progress')
      .select('completed')
      .eq('user_id', user.id)
      .eq('page', page)
      .eq('workflow_id', slug)
      .eq('step_number', stepNumber)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setChecked(data?.completed === true)
      })
    return () => {
      cancelled = true
    }
  }, [user, page, slug, stepNumber])

  async function handleChange(e) {
    const val = e.target.checked
    setChecked(val)
    if (!user) return
    await supabase.from('progress').upsert(
      {
        user_id: user.id,
        page,
        workflow_id: slug,
        step_number: stepNumber,
        completed: val,
        completed_at: val ? new Date().toISOString() : null,
      },
      { onConflict: 'user_id,page,workflow_id,step_number' }
    )
  }

  return (
    <div
      className={`border rounded-xl p-5 mb-4 transition-all ${
        checked ? 'bg-teal-500/5 border-teal-500/50' : 'bg-zinc-900/50 border-zinc-800'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-teal-500/20 text-teal-400 text-xs font-bold px-2 py-1 rounded">
            Step {stepNumber}
          </span>
          <span className="text-white font-semibold text-sm">{title}</span>
        </div>
        <label className="flex items-center gap-1.5 shrink-0 cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            className="accent-teal-400 cursor-pointer"
          />
          <span className="text-zinc-500 text-xs whitespace-nowrap">Mark complete</span>
        </label>
      </div>
      <div>{children}</div>
    </div>
  )
}
