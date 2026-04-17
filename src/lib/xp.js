import { supabase } from './supabase'

export async function fetchUserXp(userId) {
  if (!userId) return 0
  const [
    { count: stepsCount },
    { count: claimsCount },
    { data: arenaRows },
  ] = await Promise.all([
    supabase
      .from('progress')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true),
    supabase
      .from('submissions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'approved'),
    supabase
      .from('arena_completions')
      .select('xp_earned')
      .eq('user_id', userId),
  ])
  const arenaXp = (arenaRows ?? []).reduce(
    (sum, row) => sum + (row.xp_earned ?? 0),
    0
  )
  return (stepsCount ?? 0) * 25 + (claimsCount ?? 0) * 100 + arenaXp
}
