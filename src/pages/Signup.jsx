import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }

    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      navigate('/profile', { replace: true })
    } else {
      setSent(true)
      setLoading(false)
    }
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
        <h1 className="text-white text-2xl font-bold mb-2">Create your account</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Start building your stack. No credit card needed.
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
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-colors text-sm"
              />
              <p className="text-zinc-500 text-xs mt-1.5">At least 8 characters.</p>
            </div>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-colors text-sm"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#00D4AA', color: '#111118' }}
              className="w-full font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            <p className="text-zinc-400 text-sm text-center mt-4">
              Already have an account?{' '}
              <Link
                to="/login"
                style={{ color: '#00D4AA' }}
                className="no-underline hover:opacity-80 transition-opacity"
              >
                Sign in
              </Link>
            </p>
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
                We sent a confirmation link to{' '}
                <span className="text-white">{email}</span>
              </p>
            </div>
            <p className="text-zinc-500 text-xs">
              Click the link to activate your account.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
