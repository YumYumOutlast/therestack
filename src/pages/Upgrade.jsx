import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const TIER_LABELS = { free: 'Free', starter: 'Starter', playbook: 'Playbook', operator: 'Operator' }

const NEXT_TIER_LINK = {
  free: 'https://getfluxe.gumroad.com/l/FlowStateStarterKit',
  starter: 'https://getfluxe.gumroad.com/l/AIProofPlaybook',
  playbook: 'https://getfluxe.gumroad.com/l/AutomationConsultant',
  operator: 'https://getfluxe.gumroad.com/l/AutomationConsultant',
}

export default function Upgrade() {
  const { profile } = useAuth()
  const currentTier = profile?.tier || 'free'
  const gumroadLink = NEXT_TIER_LINK[currentTier]

  return (
    <div
      style={{ backgroundColor: '#111118', minHeight: '100vh' }}
      className="flex items-center justify-center px-4"
    >
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6">🔒</div>
        <h1 className="text-white text-3xl font-bold mb-3">Upgrade your access</h1>
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          This content requires a higher tier. You're currently on{' '}
          <span style={{ color: '#00D4AA' }} className="font-semibold">
            {TIER_LABELS[currentTier]}
          </span>
          .
        </p>

        {profile && (
          <div className="mb-8">
            <span
              style={{
                backgroundColor: '#00D4AA15',
                border: '1px solid #00D4AA30',
                color: '#00D4AA',
              }}
              className="inline-block rounded-full px-4 py-1 text-xs font-semibold"
            >
              Current: {TIER_LABELS[currentTier]}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-3 items-center">
          <a
            href={gumroadLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: '#00D4AA', color: '#111118' }}
            className="font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity text-sm inline-block"
          >
            Upgrade your access →
          </a>
          <Link
            to="/profile"
            className="text-zinc-500 hover:text-white text-sm transition-colors no-underline"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
