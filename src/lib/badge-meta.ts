import type { ProgressState } from '@/lib/progress-state'

// Badge tier and category constants
export const tierLabels = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
  diamond: 'Diamond',
  legendary: 'Legendary',
} as const

export const tierIcons = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
  diamond: '💠',
  legendary: '🏆',
} as const

export const tierColors = {
  bronze: 'border-amber-500/40 bg-amber-500/5 text-amber-600',
  silver: 'border-slate-400/40 bg-slate-400/5 text-slate-600',
  gold: 'border-amber-500/40 bg-amber-500/5 text-amber-600',
  platinum: 'border-violet-400/40 bg-violet-400/5 text-violet-600',
  diamond: 'border-cyan-400/40 bg-cyan-400/5 text-cyan-600',
  legendary: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-600',
} as const

export const tierOrder = {
  legendary: 0,
  diamond: 1,
  platinum: 2,
  gold: 3,
  silver: 4,
  bronze: 5,
} as const

export const categoryIcons = {
  milestone: '🏁',
  streak: '🔥',
  xp: '⚡',
  project: '🏗️',
  community: '👥',
  mastery: '🎓',
  special: '✨',
} as const

export type BadgeTier = keyof typeof tierLabels
export type BadgeCategory = keyof typeof categoryIcons

export interface CommunityStats {
  contributions: {
    projects: number
    comments: number
    upvotes: number
  }
  followers: number
  joinedAt: string | null
}

export interface BadgeContext extends CommunityStats {
  state: ProgressState
}

export interface BadgeDefinition {
  key: string
  name: string
  icon: string
  description: string
  check: (context: BadgeContext) => boolean
  category: BadgeCategory
  tier: BadgeTier
}

export const EMPTY_COMMUNITY_STATS: CommunityStats = {
  contributions: { projects: 0, comments: 0, upvotes: 0 },
  followers: 0,
  joinedAt: null,
}
