import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import XPBar from '../components/XPBar'
import SubmissionModal from '../components/SubmissionModal'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useTierAccess } from '../hooks/useTierAccess'
import { ARENA_CHALLENGES } from '../lib/arenaChallenges'
import { RANK_META } from '../lib/rankMeta'
import { NEXT_RANK_UNLOCK, RANK_XP_BOUNDS, getRankProgress, userHasTier } from '../lib/rankThresholds'
import { fetchUserXp } from '../lib/xp'

const SECTIONS = [
  { key: 'free',      label: 'Automation Trainee Challenges',            tier: 'free' },
  { key: 'starter',   label: 'Automation Operator I Challenges',         tier: 'starter' },
  { key: 'playbook',  label: 'Automation Operator II Challenges',        tier: 'playbook' },
  { key: 'operator',  label: 'Certified Automation Operator Challenges', tier: 'operator' },
  { key: 'architect', label: 'Automation Architect Builds',              tier: 'operator' },
]

const TIER_UPGRADE = {
  starter: { price: 27,  name: 'Starter Kit',           url: NEXT_RANK_UNLOCK.flow.gumroadUrl },
  playbook: { price: 79,  name: 'AI-Proof Playbook',     url: NEXT_RANK_UNLOCK.builder.gumroadUrl },
  operator: { price: 149, name: 'Operator Kit',          url: NEXT_RANK_UNLOCK.strategist.gumroadUrl },
}

const DIFFICULTY_COLOR = {
  Easy:   'text-teal-400 border-teal-500/40',
  Medium: 'text-blue-400 border-blue-500/40',
  Hard:   'text-amber-400 border-amber-500/40',
  Expert: 'text-rose-400 border-rose-500/40',
}

// ── Challenge card ──────────────────────────────────────────────────────────

function ChallengeCard({ challenge, locked, completed, onOpenModal }) {
  const [expanded, setExpanded] = useState(false)
  const diffClass = DIFFICULTY_COLOR[challenge.difficulty] ?? 'text-zinc-400 border-zinc-600'
  const upgrade = TIER_UPGRADE[challenge.tier]

  return (
    <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded border ${diffClass}`}>
          {challenge.difficulty}
        </span>
        <span className="text-teal-400 font-bold text-sm tabular-nums">+{challenge.xp} XP</span>
      </div>

      <h3 className="text-white font-bold text-base mb-2">{challenge.title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4">{challenge.description}</p>

      {/* Tools */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {challenge.tools.map((tool) => (
          <span key={tool} className="text-zinc-500 text-xs border border-zinc-700 rounded px-2 py-0.5">
            {tool}
          </span>
        ))}
      </div>

      {/* Expandable steps */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="text-teal-400 text-xs font-semibold hover:text-teal-300 transition-colors mb-3 text-left"
      >
        {expanded ? '▼ Hide steps' : '▶ Show steps'}
      </button>
      {expanded && (
        <ol className="list-decimal list-inside text-zinc-300 text-sm space-y-2 mb-4 pl-1">
          {challenge.steps.map((step, i) => (
            <li key={i} className="leading-relaxed">{step}</li>
          ))}
        </ol>
      )}

      {/* CTA */}
      <div className="mt-auto">
        {completed ? (
          <div className="text-center border border-teal-500/40 bg-teal-500/10 text-teal-400 font-semibold text-sm py-2.5 rounded-lg">
            ✓ Completed · +{challenge.xp} XP
          </div>
        ) : (
          <button
            onClick={onOpenModal}
            className="w-full bg-teal-500 hover:bg-teal-400 text-black font-bold text-sm py-2.5 rounded-lg transition-colors"
          >
            Submit Proof →
          </button>
        )}
      </div>

      {/* Tier-locked overlay */}
      {locked && (
        <div
          className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 text-center px-6"
          style={{ backgroundColor: 'rgba(14,14,20,0.88)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        >
          <span className="text-3xl">🔒</span>
          {upgrade ? (
            <>
              <p className="text-white font-semibold text-sm">
                {upgrade.name} — ${upgrade.price}
              </p>
              <a
                href={upgrade.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal-500 hover:bg-teal-400 text-black font-bold text-sm px-5 py-2 rounded-lg transition-colors no-underline"
              >
                Unlock Access →
              </a>
            </>
          ) : (
            <Link
              to="/upgrade"
              className="bg-teal-500 hover:bg-teal-400 text-black font-bold text-sm px-5 py-2 rounded-lg transition-colors no-underline"
            >
              Upgrade →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────

function ChallengeSection({ section, challenges, profile, user, completions, onOpenModal }) {
  const hasAccess = useTierAccess(profile, section.tier)
  const locked = !user || !hasAccess

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-white text-xl font-bold">{section.label}</h2>
        <span className="text-zinc-500 text-sm">{challenges.length}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            locked={locked}
            completed={completions.has(challenge.id)}
            onOpenModal={() => onOpenModal(challenge)}
          />
        ))}
      </div>
    </section>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Arena() {
  const { user, profile } = useAuth()
  const [completions, setCompletions] = useState(new Set())
  const [xp, setXp] = useState(0)
  const [xpRefreshKey, setXpRefreshKey] = useState(0)
  const [modalChallenge, setModalChallenge] = useState(null)

  useEffect(() => {
    if (!user) { setCompletions(new Set()); setXp(0); return }
    let cancelled = false
    Promise.all([
      supabase.from('arena_completions').select('challenge_id').eq('user_id', user.id),
      fetchUserXp(user.id),
    ]).then(([{ data }, totalXp]) => {
      if (cancelled) return
      setCompletions(new Set((data ?? []).map((r) => r.challenge_id)))
      setXp(totalXp)
    })
    return () => { cancelled = true }
  }, [user])

  function handleComplete(challengeId) {
    setCompletions((prev) => { const next = new Set(prev); next.add(challengeId); return next })
    setModalChallenge(null)
    if (user) fetchUserXp(user.id).then(setXp)
    setXpRefreshKey((k) => k + 1)
  }

  // ── Soft-wall / 80% warning ───────────────────────────────────────────────
  const currentRank = profile?.rank ?? 'recruit'
  const unlock = NEXT_RANK_UNLOCK[currentRank]
  const { pct } = getRankProgress(xp, currentRank)
  const hasNextTier = !unlock || userHasTier(profile?.tier, unlock.requiredTier)
  const nextRankLabel = unlock ? (RANK_META[unlock.nextRank]?.label ?? unlock.nextRank) : ''
  const showSoftWall = pct >= 100 && !hasNextTier && unlock?.gumroadUrl
  const show80Warning = pct >= 80 && pct < 100 && !hasNextTier && unlock?.gumroadUrl

  const grouped = useMemo(() => {
    const map = { free: [], starter: [], playbook: [], operator: [], architect: [] }
    for (const c of ARENA_CHALLENGES) { if (map[c.section] !== undefined) map[c.section].push(c) }
    return map
  }, [])

  return (
    <div style={{ backgroundColor: '#111118', minHeight: '100vh' }} className="text-white flex flex-col">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 pt-10 pb-24 w-full flex-1">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">The Arena</h1>
          <p className="text-zinc-400 text-sm">
            14 real-world automation challenges built with Claude Code. Complete them to stack XP and unlock ranks.
            Self-reported — we trust you to actually do the work.
          </p>
        </div>

        {user && <XPBar refreshKey={xpRefreshKey} />}

        {/* Claude Code callout */}
        <div className="border-l-4 border-teal-400 bg-zinc-900 rounded-r-xl px-6 py-5 mb-6">
          <div className="flex items-start justify-between gap-4">
            <p className="text-zinc-300 text-sm leading-relaxed">
              We build everything here with <span className="text-white font-semibold">Claude Code</span>.
              The Pro plan works. The Max plan ($100/mo) is the unfair advantage — it pays for itself
              the first time a client pays you $500 for an automation you built in 2 hours.
            </p>
            <a
              href="https://claude.ai/code"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-teal-400 text-xs font-bold border border-teal-500/40 px-3 py-1.5 rounded-lg hover:bg-teal-500/10 transition-colors no-underline whitespace-nowrap"
            >
              claude.ai/code →
            </a>
          </div>
        </div>

        {/* 80% warning band */}
        {show80Warning && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-4 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-amber-400 font-bold text-sm mb-1">
                You're close to {nextRankLabel}
              </p>
              <p className="text-zinc-300 text-sm">
                To claim it when you get there, you'll need {unlock.productName}
                {unlock.price ? ` — $${unlock.price}` : ''}.
              </p>
            </div>
            {unlock.gumroadUrl && (
              <a
                href={unlock.gumroadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-amber-400 text-xs font-bold border border-amber-500/40 px-3 py-1.5 rounded-lg hover:bg-amber-500/10 transition-colors no-underline"
              >
                Learn more →
              </a>
            )}
          </div>
        )}

        {/* Soft wall banner */}
        {showSoftWall && (
          <div className="mb-6 bg-rose-500/10 border border-rose-500/40 rounded-xl px-5 py-4 flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-rose-400 font-bold text-sm mb-1">
                Rank capped — you've earned enough XP for {nextRankLabel}
              </p>
              <p className="text-zinc-300 text-sm">
                To claim that rank, you need {unlock.productName}
                {unlock.price ? ` — $${unlock.price}` : ''}.
              </p>
            </div>
            <a
              href={unlock.gumroadUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: '#00D4AA', color: '#111118' }}
              className="shrink-0 text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity no-underline"
            >
              Unlock {nextRankLabel} →
            </a>
          </div>
        )}

        {/* Challenge sections */}
        {SECTIONS.map((section) => {
          const challenges = grouped[section.key]
          if (!challenges?.length) return null
          return (
            <ChallengeSection
              key={section.key}
              section={section}
              challenges={challenges}
              profile={profile}
              user={user}
              completions={completions}
              onOpenModal={setModalChallenge}
            />
          )
        })}
      </main>

      <footer className="py-8 text-center border-t border-zinc-800">
        <p className="text-zinc-500 text-sm">© 2026 The Restack. Built for the ones who didn't wait.</p>
      </footer>

      {/* Submission modal */}
      {modalChallenge && user && (
        <SubmissionModal
          challenge={modalChallenge}
          userId={user.id}
          onComplete={handleComplete}
          onClose={() => setModalChallenge(null)}
        />
      )}
    </div>
  )
}
