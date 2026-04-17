// Canonical rank metadata — single source of truth for DB values, display names, cert codes, icons.
// DB values (profiles.rank): recruit | flow | builder | strategist | sovereign
// recruit = pre-gate default, no credential issued.

export const RANK_ORDER = ['recruit', 'flow', 'builder', 'strategist', 'sovereign']

export const RANK_META = {
  recruit: {
    label: 'Automation Trainee',
    code: null,
    icon: null,
    color: 'text-zinc-400',
    border: 'border-zinc-600',
    bg: 'bg-zinc-800',
  },
  flow: {
    label: 'Automation Operator I',
    code: 'AO1',
    icon: '◈',
    color: 'text-teal-400',
    border: 'border-teal-500/40',
    bg: 'bg-teal-500/10',
  },
  builder: {
    label: 'Automation Operator II',
    code: 'AO2',
    icon: '◆',
    color: 'text-blue-400',
    border: 'border-blue-500/40',
    bg: 'bg-blue-500/10',
  },
  strategist: {
    label: 'Certified Automation Operator',
    code: 'CAO',
    icon: '⬡',
    color: 'text-purple-400',
    border: 'border-purple-500/40',
    bg: 'bg-purple-500/10',
  },
  sovereign: {
    label: 'Automation Architect',
    code: 'AA',
    icon: '⬢',
    color: 'text-amber-400',
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
  },
  // Reserved — not wired to any gate yet
  sovereign_operator: {
    label: 'Sovereign Automation Operator',
    code: 'SAO',
    icon: '✦',
    color: 'text-rose-400',
    border: 'border-rose-500/40',
    bg: 'bg-rose-500/10',
  },
}
