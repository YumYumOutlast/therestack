import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { RANK_ORDER, RANK_META } from '../lib/rankMeta'
import { RANK_XP_BOUNDS, getRankProgress } from '../lib/rankThresholds'
import { fetchUserXp } from '../lib/xp'

export default function XPBar({ refreshKey = 0 }) {
  const { user, profile } = useAuth()
  const [xp, setXp] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setXp(0)
      setLoading(false)
      return
    }
    let cancelled = false
    fetchUserXp(user.id).then((total) => {
      if (!cancelled) {
        setXp(total)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [user, refreshKey])

  const rank = profile?.rank ?? 'recruit'
  const meta = RANK_META[rank] ?? RANK_META.recruit
  const rankIndex = RANK_ORDER.indexOf(rank)
  const nextRank = RANK_ORDER[rankIndex + 1]
  const nextMeta = nextRank ? RANK_META[nextRank] : null
  const bounds = RANK_XP_BOUNDS[rank] ?? RANK_XP_BOUNDS.recruit
  const { pct } = getRankProgress(xp, rank)
  const atMaxRank = bounds.upper == null

  if (loading) return null

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${meta.color} ${meta.border} ${meta.bg}`}
          >
            {meta.icon ? `${meta.icon} ` : ''}{meta.label}
          </span>
          {nextMeta && (
            <span className="text-zinc-600 text-xs">→ {nextMeta.label} next</span>
          )}
          {!nextRank && (
            <span className="text-amber-400 text-xs font-semibold">Max rank reached</span>
          )}
        </div>
        <span className="text-teal-400 font-bold text-sm tabular-nums">{xp.toLocaleString()} XP</span>
      </div>
      <div className="w-full bg-zinc-800 h-1.5 rounded-full">
        <div
          className="bg-teal-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <p className="text-zinc-600 text-xs">
          {atMaxRank
            ? `${xp.toLocaleString()} XP earned`
            : `${xp.toLocaleString()} / ${bounds.upper.toLocaleString()} XP`}
        </p>
        <p className="text-zinc-600 text-xs">{pct}%</p>
      </div>
    </div>
  )
}
