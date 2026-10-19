'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'mern-learn-progress'

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

const defaultState: ProgressState = {
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

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function loadState(): ProgressState {
  if (typeof window === 'undefined') return defaultState
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultState
    const parsed = JSON.parse(stored)
    return { ...defaultState, ...parsed }
  } catch {
    return defaultState
  }
}

function saveState(state: ProgressState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    // Dispatch custom event so other components can react
    window.dispatchEvent(new CustomEvent('progress-updated', { detail: state }))
  } catch (e) {
    console.error('Failed to save progress:', e)
  }
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(defaultState)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Hydrate from localStorage (external store) on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadState())
    setIsLoaded(true)

    const handleUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setState(detail)
    }
    window.addEventListener('progress-updated', handleUpdate)
    return () => window.removeEventListener('progress-updated', handleUpdate)
  }, [])

  const updateStreak = useCallback((current: ProgressState): ProgressState => {
    const today = getToday()
    const { lastActiveDate, current: currentStreak, longest } = current.streak

    if (lastActiveDate === today) return current

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const newCurrent = lastActiveDate === yesterdayStr ? currentStreak + 1 : 1
    const newLongest = Math.max(newCurrent, longest)

    return {
      ...current,
      streak: {
        current: newCurrent,
        longest: newLongest,
        lastActiveDate: today,
      },
    }
  }, [])

  const markComplete = useCallback((lessonId: string, xpReward: number, completed: boolean) => {
    setState((prev) => {
      const wasCompleted = prev.lessons[lessonId]?.completed ?? false
      let xpDelta = 0

      if (completed && !wasCompleted) xpDelta = xpReward
      else if (!completed && wasCompleted) xpDelta = -xpReward

      let next: ProgressState = {
        ...prev,
        lessons: {
          ...prev.lessons,
          [lessonId]: {
            ...prev.lessons[lessonId],
            completed,
            completedAt: completed ? new Date().toISOString() : undefined,
          },
        },
        xp: Math.max(0, prev.xp + xpDelta),
      }

      if (completed) {
        next = updateStreak(next)
      }

      saveState(next)
      return next
    })
  }, [updateStreak])

  const saveNotes = useCallback((lessonId: string, notes: string) => {
    setState((prev) => {
      const next: ProgressState = {
        ...prev,
        lessons: {
          ...prev.lessons,
          [lessonId]: { ...prev.lessons[lessonId], completed: prev.lessons[lessonId]?.completed ?? false, notes },
        },
      }
      saveState(next)
      return next
    })
  }, [])

  const toggleBookmark = useCallback((lessonId: string) => {
    setState((prev) => {
      const bookmarks = prev.bookmarks.includes(lessonId)
        ? prev.bookmarks.filter((id) => id !== lessonId)
        : [...prev.bookmarks, lessonId]
      const next = { ...prev, bookmarks }
      saveState(next)
      return next
    })
  }, [])

  const setLastVisited = useCallback((track: string, module: string, lesson: string) => {
    setState((prev) => {
      const next: ProgressState = {
        ...prev,
        lastVisited: { track, module, lesson, timestamp: new Date().toISOString() },
      }
      saveState(next)
      return next
    })
  }, [])

  const resetProgress = useCallback(() => {
    saveState(defaultState)
    setState(defaultState)
  }, [])

  const isCompleted = useCallback((lessonId: string) => {
    return state.lessons[lessonId]?.completed ?? false
  }, [state.lessons])

  const getCompletedCount = useCallback(() => {
    return Object.values(state.lessons).filter((l) => l.completed).length
  }, [state.lessons])

  return {
    state,
    isLoaded,
    markComplete,
    saveNotes,
    toggleBookmark,
    setLastVisited,
    resetProgress,
    isCompleted,
    getCompletedCount,
    bookmarks: state.bookmarks,
    xp: state.xp,
    streak: state.streak,
  }
}

// Helper: progress for a specific module
export function getModuleProgress(state: ProgressState, lessonIds: string[]) {
  const completed = lessonIds.filter((id) => state.lessons[id]?.completed).length
  return {
    completed,
    total: lessonIds.length,
    percentage: lessonIds.length ? Math.round((completed / lessonIds.length) * 100) : 0,
  }
}