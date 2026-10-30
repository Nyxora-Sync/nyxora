'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  defaultProgressState,
  getToday,
  loadProgressState,
  saveProgressState,
  type ProgressState,
  type PracticeProgress,
} from '@/lib/progress-state'

export type { LessonProgress, ProgressState, PracticeProgress } from '@/lib/progress-state'

function updatePracticeStreak(current: PracticeProgress): PracticeProgress {
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
}

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

  // Practice-specific actions
  const gradeFlashcard = useCallback((flashcardId: string, grade: number, xpReward: number) => {
    setState((prev) => {
      const now = new Date().toISOString()
      const card = prev.practice.flashcards[flashcardId] ?? {
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        nextReview: now,
        lastReviewed: null,
        lastGrade: null,
      }

      // SM-2 algorithm
      let { easeFactor, interval, repetitions } = card
      if (grade < 2) {
        repetitions = 0
        interval = 1
      } else {
        repetitions += 1
        if (repetitions === 1) interval = 1
        else if (repetitions === 2) interval = 6
        else interval = Math.ceil(interval * easeFactor)
      }

      easeFactor = Math.max(1.3, easeFactor + (0.1 - (2.5 - grade) * (0.08 + (2.5 - grade) * 0.02)))

      const nextDate = new Date()
      nextDate.setDate(nextDate.getDate() + interval)

      const xpDelta = grade >= 2 ? xpReward : 0

      let next: ProgressState = {
        ...prev,
        practice: {
          ...prev.practice,
          flashcards: {
            ...prev.practice.flashcards,
            [flashcardId]: {
              easeFactor,
              interval,
              repetitions,
              nextReview: nextDate.toISOString(),
              lastReviewed: now,
              lastGrade: grade,
            },
          },
        },
        xp: Math.max(0, prev.xp + xpDelta),
      }

      if (grade >= 2) {
        next = { ...next, practice: updatePracticeStreak(next.practice) }
      }

      saveProgressState(next)
      return next
    })
  }, [])

  const completeKata = useCallback((kataId: string, xpReward: number) => {
    setState((prev) => {
      const now = new Date().toISOString()
      const wasCompleted = prev.practice.katas[kataId]?.completed ?? false
      const xpDelta = wasCompleted ? 0 : xpReward

      let next: ProgressState = {
        ...prev,
        practice: {
          ...prev.practice,
          katas: {
            ...prev.practice.katas,
            [kataId]: {
              completed: true,
              completedAt: now,
              attempts: (prev.practice.katas[kataId]?.attempts ?? 0) + 1,
            },
          },
        },
        xp: Math.max(0, prev.xp + xpDelta),
      }

      if (!wasCompleted) {
        next = { ...next, practice: updatePracticeStreak(next.practice) }
      }

      saveProgressState(next)
      return next
    })
  }, [])

  const completeProject = useCallback((projectId: string, xpReward: number, submissionUrl?: string) => {
    setState((prev) => {
      const now = new Date().toISOString()
      const wasCompleted = prev.practice.projects[projectId]?.completed ?? false
      const xpDelta = wasCompleted ? 0 : xpReward

      let next: ProgressState = {
        ...prev,
        practice: {
          ...prev.practice,
          projects: {
            ...prev.practice.projects,
            [projectId]: {
              completed: true,
              completedAt: now,
              submissionUrl,
            },
          },
        },
        xp: Math.max(0, prev.xp + xpDelta),
      }

      if (!wasCompleted) {
        next = { ...next, practice: updatePracticeStreak(next.practice) }
      }

      saveProgressState(next)
      return next
    })
  }, [])

  const completeDrill = useCallback((drillId: string, xpReward: number, notes?: string) => {
    setState((prev) => {
      const now = new Date().toISOString()
      const wasCompleted = prev.practice.drills[drillId]?.completed ?? false
      const xpDelta = wasCompleted ? 0 : xpReward

      let next: ProgressState = {
        ...prev,
        practice: {
          ...prev.practice,
          drills: {
            ...prev.practice.drills,
            [drillId]: {
              completed: true,
              completedAt: now,
              notes,
            },
          },
        },
        xp: Math.max(0, prev.xp + xpDelta),
      }

      if (!wasCompleted) {
        next = { ...next, practice: updatePracticeStreak(next.practice) }
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

  // Practice getters
  const getFlashcardProgress = useCallback((flashcardId: string) => {
    return state.practice.flashcards[flashcardId]
  }, [state.practice.flashcards])

  const getKataProgress = useCallback((kataId: string) => {
    return state.practice.katas[kataId]
  }, [state.practice.katas])

  const getProjectProgress = useCallback((projectId: string) => {
    return state.practice.projects[projectId]
  }, [state.practice.projects])

  const getDrillProgress = useCallback((drillId: string) => {
    return state.practice.drills[drillId]
  }, [state.practice.drills])

  const getPracticeStats = useCallback(() => {
    const p = state.practice
    const flashcardsReviewed = Object.values(p.flashcards).filter(f => f.lastReviewed).length
    const katasCompleted = Object.values(p.katas).filter(k => k.completed).length
    const projectsCompleted = Object.values(p.projects).filter(p => p.completed).length
    const drillsCompleted = Object.values(p.drills).filter(d => d.completed).length
    return {
      flashcardsReviewed,
      katasCompleted,
      projectsCompleted,
      drillsCompleted,
      practiceStreak: p.streak.current,
      practiceLongestStreak: p.streak.longest,
    }
  }, [state.practice])

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
    // Practice
    gradeFlashcard,
    completeKata,
    completeProject,
    completeDrill,
    getFlashcardProgress,
    getKataProgress,
    getProjectProgress,
    getDrillProgress,
    getPracticeStats,
    practice: state.practice,
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