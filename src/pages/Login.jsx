import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div
      style={{ backgroundColor: '#111118', minHeight: '100vh' }}
      className="flex items-center justify-center px-4"
    >
      <div
        style={{ border: '1px solid #1a1a24', backgroundColor: '#0e0e14' }}
        className="w-full max-w-sm rounded-2xl p-8"
      >
        <p style={{ color: '#00D4AA' }} className="font-bold text-lg mb-1">
          ✦ The Restack
        </p>
        <h1 className="text-white text-2xl font-bold mb-2">Sign in</h1>
        <p className="text-zinc-400 text-sm mb-8">
          We'll send you a magic link — no password needed.
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-colors text-sm"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#00D4AA', color: '#111118' }}
              className="w-full font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Sending...' : 'Send login link'}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-3">
            <div
              style={{ backgroundColor: '#00D4AA12', border: '1px solid #00D4AA30' }}
              className="rounded-xl p-6"
            >
              <p className="text-3xl mb-3">✉</p>
              <p className="text-white font-semibold text-sm">Check your email</p>
              <p className="text-zinc-400 text-xs mt-2">
                We sent a magic link to{' '}
                <span className="text-white">{email}</span>
              </p>
            </div>
            <p className="text-zinc-500 text-xs">
              Link expires in 1 hour · Click it to sign in instantly
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
