'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  defaultProgressState,
  getToday,
  loadProgressState,
  saveProgressState,
  type ProgressState,
} from '@/lib/progress-state'

export type { LessonProgress, ProgressState } from '@/lib/progress-state'

export function useProgress() {
  const [state, setState] = useState<ProgressState>(defaultProgressState)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Hydrate from localStorage (external store) on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(loadProgressState())
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

      saveProgressState(next)
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
      saveProgressState(next)
      return next
    })
  }, [])

  const toggleBookmark = useCallback((lessonId: string) => {
    setState((prev) => {
      const bookmarks = prev.bookmarks.includes(lessonId)
        ? prev.bookmarks.filter((id) => id !== lessonId)
        : [...prev.bookmarks, lessonId]
      const next = { ...prev, bookmarks }
      saveProgressState(next)
      return next
    })
  }, [])

  const setLastVisited = useCallback((track: string, module: string, lesson: string) => {
    setState((prev) => {
      const next: ProgressState = {
        ...prev,
        lastVisited: { track, module, lesson, timestamp: new Date().toISOString() },
      }
      saveProgressState(next)
      return next
    })
  }, [])

  const resetProgress = useCallback(() => {
    saveProgressState(defaultProgressState)
    setState(defaultProgressState)
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