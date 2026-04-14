import { useState } from 'react'

export default function PromptBlock({ content, label }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(content).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mb-4">
      {label && (
        <p className="text-teal-400 text-xs font-bold tracking-widest uppercase mb-2">
          {label}
        </p>
      )}
      <div className="relative">
        <pre className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 pr-16 font-mono text-sm text-teal-300 whitespace-pre-wrap overflow-x-auto">
          {content}
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-xs px-2 py-1 rounded transition-colors"
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
