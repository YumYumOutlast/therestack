import { useState, useEffect } from 'react'

export default function WorkflowStep({ stepNumber, title, children, workflowId }) {
  const storageKey = `restack_${workflowId}_step_${stepNumber}`
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    setChecked(localStorage.getItem(storageKey) === 'true')
  }, [storageKey])

  function handleChange(e) {
    const val = e.target.checked
    setChecked(val)
    localStorage.setItem(storageKey, String(val))
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
