const TIER_RANK = { free: 1, starter: 2, playbook: 3, operator: 4 }

export function useTierAccess(profile, requiredTier) {
  if (!requiredTier) return true
  if (!profile) return false
  const userRank = TIER_RANK[profile.tier] ?? 0
  const required = TIER_RANK[requiredTier] ?? 0
  return userRank >= required
}
