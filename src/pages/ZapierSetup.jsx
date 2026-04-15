import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const WEBHOOK_URL = 'https://therestack.vercel.app/api/verify'

const VERIFIABLE = [
  {
    page: 'free',
    workflow_id: 'zapier',
    step_number: 2,
    source: 'zapier',
    title: 'Free · Zapier Automations · Step 2',
    desc: 'Fires when any of your 3 starter Zaps runs.',
  },
  {
    page: 'free',
    workflow_id: 'zapier',
    step_number: 3,
    source: 'zapier',
    title: 'Free · Zapier Automations · Step 3',
    desc: 'Fires on your first successful Zap test.',
  },
]

function generateToken() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2)
  )
}

export default function ZapierSetup() {
  const { user } = useAuth()
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState('')

  useEffect(() => {
    if (!user) return
    let cancelled = false
    ;(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('verify_token')
        .eq('id', user.id)
        .single()
      if (cancelled) return
      if (data?.verify_token) {
        setToken(data.verify_token)
        setLoading(false)
        return
      }
      const newToken = generateToken()
      const { error } = await supabase
        .from('profiles')
        .update({ verify_token: newToken })
        .eq('id', user.id)
      if (cancelled) return
      if (!error) setToken(newToken)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [user])

  function copy(text, key) {
    navigator.clipboard?.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <div
      className="min-h-screen text-white flex flex-col"
      style={{ backgroundColor: '#111118' }}
    >
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pt-10 pb-24 w-full flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Zapier Verification Setup</h1>
          <p className="text-zinc-400">
            Set it up once. Your workflow auto-verifies every time the Zap runs.
          </p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
            Your verify token
          </p>
          <p className="text-zinc-400 text-sm mb-3">
            Paste this as the{' '}
            <code className="text-teal-400 bg-zinc-950 px-1.5 py-0.5 rounded">
              x-verify-secret
            </code>{' '}
            header. Don't share it — it's tied to your account.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-teal-400 text-xs font-mono truncate">
              {loading ? 'Generating…' : token || '—'}
            </code>
            <button
              onClick={() => token && copy(token, 'token')}
              disabled={!token}
              className="text-xs font-bold text-zinc-300 border border-zinc-700 hover:border-teal-500/40 hover:text-teal-400 px-3 py-2 rounded-lg transition-colors disabled:opacity-40 shrink-0"
            >
              {copied === 'token' ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
            Webhook URL
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-teal-400 text-xs font-mono truncate">
              {WEBHOOK_URL}
            </code>
            <button
              onClick={() => copy(WEBHOOK_URL, 'url')}
              className="text-xs font-bold text-zinc-300 border border-zinc-700 hover:border-teal-500/40 hover:text-teal-400 px-3 py-2 rounded-lg transition-colors shrink-0"
            >
              {copied === 'url' ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-bold text-lg mb-4">How to wire it up in Zapier</h2>
          <ol className="space-y-3">
            {[
              <>
                In your Zap, add an action:{' '}
                <span className="text-white font-semibold">Webhooks by Zapier → POST</span>.
              </>,
              <>
                Paste the <span className="text-white font-semibold">Webhook URL</span> above
                into the URL field.
              </>,
              <>
                Set <span className="text-white font-semibold">Payload Type</span> to{' '}
                <code className="text-teal-400">json</code>.
              </>,
              <>
                Under <span className="text-white font-semibold">Headers</span>, add key{' '}
                <code className="text-teal-400">x-verify-secret</code> with your token above
                as the value.
              </>,
              <>
                Under <span className="text-white font-semibold">Data</span>, paste the JSON
                for the workflow you're verifying (below).
              </>,
              <>
                Test it. Turn the Zap on. Done — your progress verifies itself every time the
                Zap runs.
              </>,
            ].map((body, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-teal-400 font-bold shrink-0">{i + 1}.</span>
                <div className="text-zinc-300">{body}</div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="text-white font-bold text-lg mb-4">Verifiable workflows</h2>
          {VERIFIABLE.map((w) => {
            const body = {
              page: w.page,
              workflow_id: w.workflow_id,
              step_number: w.step_number,
              source: w.source,
            }
            const json = JSON.stringify(body, null, 2)
            const key = `${w.page}_${w.workflow_id}_${w.step_number}`
            return (
              <div
                key={key}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4"
              >
                <h3 className="text-white font-bold text-base mb-1">{w.title}</h3>
                <p className="text-zinc-400 text-sm mb-3">{w.desc}</p>
                <div className="flex items-start gap-2">
                  <pre className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-teal-400 text-xs font-mono overflow-x-auto whitespace-pre">
                    {json}
                  </pre>
                  <button
                    onClick={() => copy(json, key)}
                    className="text-xs font-bold text-zinc-300 border border-zinc-700 hover:border-teal-500/40 hover:text-teal-400 px-3 py-2 rounded-lg transition-colors shrink-0"
                  >
                    {copied === key ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <Link
          to="/profile"
          className="text-teal-400 text-sm font-bold no-underline hover:underline"
        >
          ← Back to your stack
        </Link>
      </main>
    </div>
  )
}
