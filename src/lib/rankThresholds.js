// Pass 9: XP thresholds + next-rank unlock requirements.
// Thresholds are CUMULATIVE XP upper bounds for each rank.

export const RANK_XP_BOUNDS = {
  recruit: { lower: 0, upper: 200 },
  flow: { lower: 200, upper: 500 },
  builder: { lower: 500, upper: 1200 },
  strategist: { lower: 1200, upper: 3000 },
  sovereign: { lower: 3000, upper: 7000 },
  sovereign_operator: { lower: 7000, upper: null },
}

export const NEXT_RANK_UNLOCK = {
  recruit: {
    nextRank: 'flow',
    productName: 'the Free tier',
    requiredTier: 'free',
    price: null,
    gumroadUrl: null,
    claimGate: 'free',
    claimPath: '/free',
  },
  flow: {
    nextRank: 'builder',
    productName: 'the Starter Kit',
    requiredTier: 'starter',
    price: 27,
    gumroadUrl: 'https://getfluxe.gumroad.com/l/FlowStateStarterKit',
    claimGate: 'starter',
    claimPath: '/starter',
  },
  builder: {
    nextRank: 'strategist',
    productName: 'the AI-Proof Playbook',
    requiredTier: 'playbook',
    price: 79,
    gumroadUrl: 'https://getfluxe.gumroad.com/l/AIProofPlaybook',
    claimGate: 'playbook',
    claimPath: '/playbook',
  },
  strategist: {
    nextRank: 'sovereign',
    productName: 'the Automation Consultant Kit',
    requiredTier: 'operator',
    price: 149,
    gumroadUrl: 'https://getfluxe.gumroad.com/l/AutomationConsultant',
    claimGate: 'operator',
    claimPath: '/operator',
  },
  sovereign: {
    nextRank: 'sovereign_operator',
    productName: 'the Sovereign Operator Kit',
    requiredTier: null,
    price: 497,
    // PLACEHOLDER — replace with real product slug when available.
    gumroadUrl: 'https://getfluxe.gumroad.com/l/SovereignOperator',
    claimGate: null,
    claimPath: null,
  },
}

const TIER_LEVEL = { free: 1, starter: 2, playbook: 3, operator: 4 }

export function userHasTier(profileTier, requiredTier) {
  if (!requiredTier) return true
  const userLevel = TIER_LEVEL[profileTier] ?? 0
  const requiredLevel = TIER_LEVEL[requiredTier] ?? 0
  return userLevel >= requiredLevel
}

export function getRankProgress(xp, rank) {
  const bounds = RANK_XP_BOUNDS[rank] ?? RANK_XP_BOUNDS.recruit
  if (bounds.upper == null) {
    return { pct: 100, inRank: xp - bounds.lower, rankSpan: 0, toNext: 0 }
  }
  const inRank = Math.max(0, xp - bounds.lower)
  const rankSpan = bounds.upper - bounds.lower
  const pct = Math.min(100, Math.round((inRank / rankSpan) * 100))
  const toNext = Math.max(0, bounds.upper - xp)
  return { pct, inRank, rankSpan, toNext }
}
