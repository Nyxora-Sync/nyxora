// Shared progress state helpers used by the localStorage hook and the
// account-sync layer. This module is safe to import from client components
// (all browser access is guarded) and from route handlers for type sharing.

export interface LessonProgress {
  completed: boolean
  completedAt?: string
  notes?: string
}

export interface ProgressState {
  lessons: Record<string, LessonProgress> // lessonId -> progress
  xp: number
  streak: {
    current: number
    lastActiveDate: string | null
    longest: number
  }
  bookmarks: string[]
  lastVisited: {
    track: string
    module: string
    lesson: string
    timestamp: string
  } | null
}

export const GUEST_STORAGE_KEY = 'mern-learn-progress'
const USER_STORAGE_PREFIX = 'mern-learn-progress:u:'

export const defaultProgressState: ProgressState = {
  lessons: {},
  xp: 0,
  streak: {
    current: 0,
    lastActiveDate: null,
    longest: 0,
  },
  bookmarks: [],
  lastVisited: null,
}

// Which bucket is currently active. Set to the signed-in user's id by
// <ProgressSync>, so `useProgress` reads and writes the right bucket.
let activeUserId: string | null = null

export function getProgressStorageKey(userId: string | null = activeUserId): string {
  return userId ? `${USER_STORAGE_PREFIX}${userId}` : GUEST_STORAGE_KEY
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export function loadProgressState(userId: string | null = activeUserId): ProgressState {
  if (typeof window === 'undefined') return defaultProgressState
  try {
    const stored = localStorage.getItem(getProgressStorageKey(userId))
    if (!stored) return defaultProgressState
    const parsed = JSON.parse(stored) as Partial<ProgressState>
    return {
      ...defaultProgressState,
      ...parsed,
      streak: { ...defaultProgressState.streak, ...parsed.streak },
    }
  } catch {
    return defaultProgressState
  }
}

export function broadcastProgressState(state: ProgressState) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('progress-updated', { detail: state }))
}

export function saveProgressState(state: ProgressState, userId: string | null = activeUserId) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(getProgressStorageKey(userId), JSON.stringify(state))
    broadcastProgressState(state)
  } catch (e) {
    console.error('Failed to save progress:', e)
  }
}

/**
 * Switch the active storage bucket. Called after sign-in resolves so progress
 * is scoped per account instead of leaking between users on a shared browser.
 */
export function switchProgressScope(userId: string | null) {
  activeUserId = userId
  broadcastProgressState(loadProgressState(userId))
}

function earlierDate(a?: string, b?: string): string | undefined {
  if (!a) return b
  if (!b) return a
  return a < b ? a : b
}

function mergeStreaks(a: ProgressState['streak'], b: ProgressState['streak']): ProgressState['streak'] {
  const aDate = a.lastActiveDate ?? ''
  const bDate = b.lastActiveDate ?? ''
  // Keep the most recently active streak, but never lose the best run.
  const latest = aDate >= bDate ? a : b
  return {
    current: latest.current,
    lastActiveDate: latest.lastActiveDate ?? null,
    longest: Math.max(a.longest, b.longest, a.current, b.current),
  }
}

/**
 * Merge two progress snapshots without losing work.
 * `primary` wins note conflicts; completion, bookmarks, and streaks are unioned.
 */
export function mergeProgressStates(primary: ProgressState, secondary: ProgressState): ProgressState {
  const lessons: Record<string, LessonProgress> = {}
  const ids = new Set([...Object.keys(primary.lessons), ...Object.keys(secondary.lessons)])

  for (const id of ids) {
    const a = primary.lessons[id]
    const b = secondary.lessons[id]
    const completed = Boolean(a?.completed || b?.completed)
    const notes = a?.notes?.trim() ? a.notes : b?.notes
    lessons[id] = {
      completed,
      completedAt: completed ? earlierDate(a?.completedAt, b?.completedAt) : undefined,
      ...(notes ? { notes } : {}),
    }
  }

  const bookmarks = Array.from(new Set([...primary.bookmarks, ...secondary.bookmarks]))

  let lastVisited = primary.lastVisited
  if (
    secondary.lastVisited &&
    (!lastVisited || secondary.lastVisited.timestamp > lastVisited.timestamp)
  ) {
    lastVisited = secondary.lastVisited
  }

  return {
    lessons,
    xp: Math.max(primary.xp, secondary.xp),
    streak: mergeStreaks(primary.streak, secondary.streak),
    bookmarks,
    lastVisited,
  }
}
