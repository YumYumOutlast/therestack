import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

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
        <h1 className="text-white text-2xl font-bold mb-2">Sign in</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Welcome back. Let's pick up where you left off.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-colors text-sm"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-colors text-sm"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#00D4AA', color: '#111118' }}
            className="w-full font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="text-center">
            <Link
              to="/reset-password"
              className="text-zinc-500 text-xs hover:text-zinc-400 transition-colors"
            >
              Forgot password?
            </Link>
          </p>
          <p className="text-zinc-400 text-sm text-center mt-4">
            New here?{' '}
            <Link
              to="/signup"
              style={{ color: '#00D4AA' }}
              className="no-underline hover:opacity-80 transition-opacity"
            >
              Start for free →
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
