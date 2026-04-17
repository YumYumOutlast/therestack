import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const [mode, setMode] = useState('request')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('update')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleRequest(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  async function handleUpdate(e) {
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
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/profile', { replace: true })
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

        {mode === 'request' ? (
          <>
            <h1 className="text-white text-2xl font-bold mb-2">Reset password</h1>
            <p className="text-zinc-400 text-sm mb-8">
              We'll send you a link to set a new one.
            </p>

            {!sent ? (
              <form onSubmit={handleRequest} className="space-y-4">
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
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
                <p className="text-zinc-400 text-sm text-center mt-4">
                  Remembered it?{' '}
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
                    We sent a reset link to{' '}
                    <span className="text-white">{email}</span>
                  </p>
                </div>
                <p className="text-zinc-500 text-xs">
                  Click the link to set a new password.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="text-white text-2xl font-bold mb-2">Set new password</h1>
            <p className="text-zinc-400 text-sm mb-8">
              Choose something strong. You've got this.
            </p>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-colors text-sm"
                />
                <p className="text-zinc-500 text-xs mt-1.5">At least 8 characters.</p>
              </div>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-colors text-sm"
              />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#00D4AA', color: '#111118' }}
                className="w-full font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Saving...' : 'Set new password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
