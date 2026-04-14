import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const TEAL = '#00D4AA'
const BG = '#111118'
const SURFACE = '#1a1a24'
const BORDER = '#2a2a38'

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block mr-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

const tiers = [
  {
    id: 'free',
    name: 'Free',
    price: null,
    description: 'Start here. Build your foundation.',
    locked: false,
    route: '/free',
  },
  {
    id: 'starter',
    name: 'Starter Kit',
    price: '$27',
    description: 'Your first real AI stack, step by step.',
    locked: true,
    route: '/starter',
  },
  {
    id: 'playbook',
    name: 'AI-Proof Playbook',
    price: '$79',
    description: 'The strategies that compound over time.',
    locked: true,
    route: '/playbook',
  },
  {
    id: 'operator',
    name: 'Automation Consultant Kit',
    price: '$149',
    description: 'Go from learner to operator. Build leverage.',
    locked: true,
    route: '/operator',
  },
]

export default function Landing() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ backgroundColor: BG }} className="min-h-screen text-white">
      <Navbar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-white mb-6">
          The system wasn't built for you.<br className="hidden sm:block" /> Build your own.
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          The Restack is where the next generation of operators learn to stack AI skills and build real leverage.
        </p>

        {/* Email Capture */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{
              backgroundColor: SURFACE,
              border: `1px solid ${BORDER}`,
              color: 'white',
              outline: 'none',
            }}
            onFocus={(e) => { e.target.style.borderColor = TEAL }}
            onBlur={(e) => { e.target.style.borderColor = BORDER }}
            className="flex-1 px-4 py-3 rounded-lg text-sm placeholder-gray-500 transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{ backgroundColor: TEAL, color: '#111118' }}
            className="px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 whitespace-nowrap"
          >
            {status === 'loading' ? 'Joining…' : 'Join The Restack'}
          </button>
        </form>

        {status === 'success' && (
          <p style={{ color: TEAL }} className="text-sm mb-3">You're in. Welcome to The Restack.</p>
        )}
        {status === 'error' && (
          <p className="text-red-400 text-sm mb-3">Something went wrong. Try again.</p>
        )}

        <a
          href="https://getfluxe.gumroad.com/l/FlowState"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: TEAL }}
          className="text-sm hover:underline transition-all"
        >
          Start Free →
        </a>
      </section>

      {/* Tiers */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-center text-2xl font-bold text-white mb-3">Choose Your Level</h2>
        <p className="text-center text-gray-400 mb-12 text-sm">Every stack starts somewhere. Pick yours.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              style={{
                backgroundColor: SURFACE,
                border: `1px solid ${tier.locked ? BORDER : TEAL}`,
              }}
              className="rounded-2xl p-6 flex flex-col"
            >
              <div className="mb-4">
                {tier.price ? (
                  <span style={{ color: TEAL }} className="text-xs font-semibold tracking-wider uppercase">
                    {tier.price}
                  </span>
                ) : (
                  <span style={{ color: TEAL }} className="text-xs font-semibold tracking-wider uppercase">
                    Free
                  </span>
                )}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{tier.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-6">{tier.description}</p>

              {tier.locked ? (
                <a
                  href="https://getfluxe.gumroad.com/l/FlowState"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ borderColor: TEAL, color: TEAL }}
                  className="border rounded-lg px-4 py-2.5 text-sm font-semibold text-center hover:opacity-80 transition-opacity no-underline flex items-center justify-center"
                >
                  <LockIcon />
                  Unlock This Tier
                </a>
              ) : (
                <Link
                  to={tier.route}
                  style={{ backgroundColor: TEAL, color: '#111118' }}
                  className="rounded-lg px-4 py-2.5 text-sm font-semibold text-center hover:opacity-90 transition-opacity no-underline"
                >
                  Join Free
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${BORDER}` }} className="py-8 text-center">
        <p className="text-gray-500 text-sm">
          © 2026 The Restack. Built for the ones who didn't wait.
        </p>
      </footer>
    </div>
  )
}
