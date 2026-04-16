import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Adonis from '../components/Adonis'
import XPBar from '../components/XPBar'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { RANK_META } from '../lib/rankMeta'

const TOTAL_STEPS = 155

const TIERS = [
  {
    id: 'free',
    total: 20,
    badge: 'Free',
    title: 'FlowState Guide',
    subtitle: '5 foundational workflows',
    href: '/free',
    badgeClass: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  },
  {
    id: 'starter',
    total: 45,
    badge: 'Starter · $27',
    title: 'AI-Proof Starter Kit',
    subtitle: '15 advanced workflows',
    href: '/starter',
    badgeClass: 'bg-zinc-700 text-zinc-300 border-zinc-600',
  },
  {
    id: 'playbook',
    total: 40,
    badge: 'Playbook · $79',
    title: 'AI-Proof Playbook',
    subtitle: 'The promotion system',
    href: '/playbook',
    badgeClass: 'bg-zinc-700 text-zinc-300 border-zinc-600',
  },
  {
    id: 'operator',
    total: 50,
    badge: 'Operator · $149',
    title: 'Automation Consultant Kit',
    subtitle: 'Your consulting business',
    href: '/operator',
    badgeClass: 'bg-zinc-700 text-zinc-300 border-zinc-600',
  },
]

export default function Profile() {
  const { user } = useAuth()
  const [counts, setCounts] = useState({ free: 0, starter: 0, playbook: 0, operator: 0 })
  const [certs, setCerts] = useState([])
  const [showAdonis, setShowAdonis] = useState(false)

  useEffect(() => {
    if (!user) {
      setCounts({ free: 0, starter: 0, playbook: 0, operator: 0 })
      setCerts([])
      return
    }
    let cancelled = false
    supabase
      .from('progress')
      .select('page')
      .eq('user_id', user.id)
      .eq('completed', true)
      .then(({ data }) => {
        if (cancelled || !data) return
        const next = { free: 0, starter: 0, playbook: 0, operator: 0 }
        for (const row of data) {
          if (row.page in next) next[row.page]++
        }
        setCounts(next)
      })
    supabase
      .from('certifications')
      .select('*')
      .eq('user_id', user.id)
      .order('issued_at', { ascending: true })
      .then(({ data }) => {
        if (!cancelled) setCerts(data ?? [])
      })
    return () => {
      cancelled = true
    }
  }, [user])

  const totalDone = counts.free + counts.starter + counts.playbook + counts.operator
  const totalPct = Math.round((totalDone / TOTAL_STEPS) * 100)

  const tierCounts = TIERS.map((t) => ({
    ...t,
    done: counts[t.id],
    pct: Math.round((counts[t.id] / t.total) * 100),
  }))

  const nextTier =
    tierCounts.find((t) => t.pct === 0) ??
    tierCounts.reduce((a, b) => (a.pct <= b.pct ? a : b))

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ backgroundColor: '#111118' }}>
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-10 pb-24 w-full flex-1">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Stack</h1>
          <p className="text-zinc-400">Track your progress across every tier.</p>
        </div>

        {/* XP + Rank */}
        <XPBar />

        {/* Overall progress */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-400 text-sm">Overall Progress</span>
            <span className="text-teal-400 font-bold text-sm">{totalDone} steps complete</span>
          </div>
          <div className="w-full bg-zinc-800 h-2 rounded-full mb-3">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all"
              style={{ width: `${totalPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-zinc-500 text-sm">Keep going. Each step compounds.</p>
            <span className="text-zinc-500 text-sm">{totalPct}%</span>
          </div>
        </div>

        {/* Tier cards */}
        <div className="mb-8">
          {tierCounts.map((tier) => (
            <div
              key={tier.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded border ${tier.badgeClass} mb-2 inline-block`}
                  >
                    {tier.badge}
                  </span>
                  <h3 className="text-white font-bold text-base">{tier.title}</h3>
                  <p className="text-zinc-400 text-sm">{tier.subtitle}</p>
                </div>
                <Link
                  to={tier.href}
                  className="shrink-0 text-teal-400 text-xs font-bold border border-teal-500/40 px-3 py-1.5 rounded-lg hover:bg-teal-500/10 transition-colors no-underline whitespace-nowrap"
                >
                  Go to {tier.badge.split(' ·')[0]} →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-zinc-800 h-1.5 rounded-full">
                  <div
                    className="bg-teal-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${tier.pct}%` }}
                  />
                </div>
                <span className="text-zinc-400 text-xs shrink-0">
                  {tier.done}/{tier.total} steps
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Next Step callout */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">
            Recommended next step
          </p>
          <h3 className="text-white font-bold text-base mb-1">{nextTier.title}</h3>
          <p className="text-zinc-400 text-sm mb-4">{nextTier.subtitle}</p>
          <Link
            to={nextTier.href}
            className="inline-block bg-teal-500 hover:bg-teal-400 text-black font-bold px-5 py-2.5 rounded-lg transition-colors no-underline text-sm"
          >
            Start now →
          </Link>
        </div>

        {/* Adonis section */}
        <div className="bg-zinc-900/50 border border-teal-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-teal-400 font-bold text-lg">✦ Adonis</p>
              <p className="text-zinc-400 text-sm">Your AI Mentor</p>
            </div>
          </div>
          <p className="text-zinc-300 text-sm leading-relaxed mb-5">
            Adonis knows every workflow in your stack. Ask what to do next, where you're stuck, or
            how to apply a specific step to your job. He reads your progress and gives you a straight
            answer — not a generic one.
          </p>
          {!showAdonis ? (
            <button
              onClick={() => setShowAdonis(true)}
              className="inline-block bg-teal-500 hover:bg-teal-400 text-black font-bold px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              Talk to Adonis →
            </button>
          ) : (
            <p className="text-teal-400 text-sm font-semibold">
              Adonis is ready ↗ (bottom right)
            </p>
          )}
        </div>

        {/* Earned certifications */}
        {certs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-bold text-lg mb-4">Your Certificates</h2>
            <div className="flex flex-col gap-3">
              {certs.map((cert) => {
                const meta = RANK_META[cert.rank]
                if (!meta) return null
                return (
                  <div
                    key={cert.id}
                    className={`border rounded-xl px-5 py-4 flex items-center justify-between gap-4 ${meta.border} ${meta.bg}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-2xl font-bold shrink-0 ${meta.color}`}>{meta.icon}</span>
                      <div className="min-w-0">
                        <p className={`font-bold text-sm ${meta.color}`}>{meta.label}</p>
                        <p className="text-zinc-500 text-xs font-mono truncate">{cert.credential_id}</p>
                        <p className="text-zinc-600 text-xs">
                          {new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <a
                      href={cert.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`shrink-0 text-xs font-bold border px-3 py-1.5 rounded-lg transition-colors no-underline ${meta.color} ${meta.border} hover:opacity-80`}
                    >
                      ⬇ Download
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Credential teaser */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 opacity-70">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="text-white font-bold">The Restack Certified Operator</p>
              <p className="text-zinc-400 text-sm">Complete the full stack to earn your credential. Coming soon.</p>
            </div>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mb-4">
            <div
              className="bg-teal-500/50 h-1.5 rounded-full transition-all"
              style={{ width: `${totalPct}%` }}
            />
          </div>
          <p className="text-zinc-500 text-sm">
            No admissions committee. No debt. Complete the stack, earn the credential.
          </p>
        </div>
      </main>

      {showAdonis && <Adonis autoOpen={true} />}

      <footer className="py-8 text-center border-t border-zinc-800">
        <p className="text-zinc-500 text-sm">© 2026 The Restack. Built for the ones who didn't wait.</p>
      </footer>
    </div>
  )
}
