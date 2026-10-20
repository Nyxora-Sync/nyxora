import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================
// Accent color system
// Tailwind v4 can't generate classes from dynamic strings, so we
// keep a static map of literal class names for every accent we use.
// ============================================================

export type AccentColor =
  | 'emerald' | 'violet' | 'amber' | 'rose' | 'blue' | 'indigo' | 'slate' | 'cyan'

export interface AccentClasses {
  /** Icon container: soft bg + strong fg, works in light & dark */
  icon: string
  /** Strong text color */
  text: string
  /** Soft background tint */
  bgSoft: string
  /** Soft border tint */
  borderSoft: string
  /** Badge-ish soft pill */
  pill: string
  /** Gradient bar (for top borders) */
  gradient: string
}

export const accent: Record<AccentColor, AccentClasses> = {
  emerald: {
    icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    text: 'text-emerald-700 dark:text-emerald-400',
    bgSoft: 'bg-emerald-500/10',
    borderSoft: 'border-emerald-500/40',
    pill: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  violet: {
    icon: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
    text: 'text-violet-600 dark:text-violet-400',
    bgSoft: 'bg-violet-500/10',
    borderSoft: 'border-violet-500/40',
    pill: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
    gradient: 'from-violet-500 to-violet-600',
  },
  amber: {
    icon: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    text: 'text-amber-600 dark:text-amber-400',
    bgSoft: 'bg-amber-500/10',
    borderSoft: 'border-amber-500/40',
    pill: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
    gradient: 'from-amber-500 to-amber-600',
  },
  rose: {
    icon: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
    text: 'text-rose-600 dark:text-rose-400',
    bgSoft: 'bg-rose-500/10',
    borderSoft: 'border-rose-500/40',
    pill: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
    gradient: 'from-rose-500 to-rose-600',
  },
  blue: {
    icon: 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
    text: 'text-blue-600 dark:text-blue-400',
    bgSoft: 'bg-blue-500/10',
    borderSoft: 'border-blue-500/40',
    pill: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
    gradient: 'from-blue-500 to-blue-600',
  },
  indigo: {
    icon: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
    text: 'text-indigo-600 dark:text-indigo-400',
    bgSoft: 'bg-indigo-500/10',
    borderSoft: 'border-indigo-500/40',
    pill: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400',
    gradient: 'from-indigo-500 to-indigo-600',
  },
  slate: {
    icon: 'bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400',
    text: 'text-slate-600 dark:text-slate-400',
    bgSoft: 'bg-slate-500/10',
    borderSoft: 'border-slate-500/40',
    pill: 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-400',
    gradient: 'from-slate-500 to-slate-600',
  },
  cyan: {
    icon: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400',
    text: 'text-cyan-600 dark:text-cyan-400',
    bgSoft: 'bg-cyan-500/10',
    borderSoft: 'border-cyan-500/40',
    pill: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400',
    gradient: 'from-cyan-500 to-cyan-600',
  },
}

export function getAccent(color: string): AccentClasses {
  return accent[(color as AccentColor)] ?? accent.slate
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function calculateLevel(xp: number): { level: number; xpForNext: number; progress: number } {
  const level = Math.floor(Math.sqrt(xp / 100)) + 1
  const xpForCurrent = (level - 1) ** 2 * 100
  const xpForNext = level ** 2 * 100
  const progress = ((xp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100
  return { level, xpForNext, progress: Math.min(100, Math.max(0, progress)) }
}

export function getTrackColor(track: string): string {
  switch (track) {
    case 'beginner': return 'emerald'
    case 'developer': return 'violet'
    case 'specializations': return 'cyan'
    case 'c': return 'blue'
    case 'cpp': return 'indigo'
    case 'csharp': return 'violet'
    case 'python': return 'amber'
    default: return 'slate'
  }
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'beginner': return 'emerald'
    case 'intermediate': return 'amber'
    case 'advanced': return 'rose'
    default: return 'slate'
  }
}