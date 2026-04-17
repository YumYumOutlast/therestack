import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
}

export default function ResetPassword() {
  const [mode, setMode] = useState('request')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
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
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 pr-11 text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-colors text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                <p className="text-zinc-500 text-xs mt-1.5">At least 8 characters.</p>
              </div>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 pr-11 text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
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
