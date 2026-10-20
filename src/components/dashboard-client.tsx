'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useProgress, type ProgressState } from '@/hooks/use-progress'
import { tracks, type Lesson } from '@/lib/curriculum'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Trophy, Zap, Flame, CheckCircle2, ArrowRight,
  Bookmark, RotateCcw, Play, Cloud, CloudOff,
} from 'lucide-react'
import { calculateLevel, cn } from '@/lib/utils'

// Badge definitions (mirrors prisma seed, but computed client-side)
const badgeDefinitions: {
  key: string
  name: string
  icon: string
  description: string
  check: (s: ProgressState) => boolean
}[] = [
  { key: 'first-lesson', name: 'First Steps', icon: '🎯', description: 'Complete your first lesson', check: (s) => Object.values(s.lessons).some((l) => l.completed) },
  { key: 'five-lessons', name: 'Getting Warmed Up', icon: '🔥', description: 'Complete 5 lessons', check: (s) => Object.values(s.lessons).filter((l) => l.completed).length >= 5 },
  { key: 'ten-lessons', name: 'Committed', icon: '💪', description: 'Complete 10 lessons', check: (s) => Object.values(s.lessons).filter((l) => l.completed).length >= 10 },
  { key: 'twenty-lessons', name: 'Halfway Hero', icon: '🚀', description: 'Complete 20 lessons', check: (s) => Object.values(s.lessons).filter((l) => l.completed).length >= 20 },
  { key: 'streak-3', name: 'On Fire', icon: '🔥', description: '3-day learning streak', check: (s) => s.streak.longest >= 3 },
  { key: 'streak-7', name: 'Unstoppable', icon: '⚡', description: '7-day learning streak', check: (s) => s.streak.longest >= 7 },
  { key: 'xp-100', name: 'Century Club', icon: '💯', description: 'Earn 100 XP', check: (s) => s.xp >= 100 },
  { key: 'xp-500', name: 'XP Hunter', icon: '🏆', description: 'Earn 500 XP', check: (s) => s.xp >= 500 },
  { key: 'xp-1000', name: 'MERN Master', icon: '👑', description: 'Earn 1000 XP', check: (s) => s.xp >= 1000 },
]

export function DashboardClient() {
  const { state, isLoaded, xp, streak, resetProgress, bookmarks } = useProgress()
  const { data: session } = useSession()
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false)

  if (!isLoaded) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="h-20 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const completedLessons = Object.values(state.lessons).filter((l) => l.completed).length
  const totalLessons = tracks.reduce((sum, t) => sum + t.modules.reduce((s, m) => s + m.lessons.length, 0), 0)
  const { level, xpForNext, progress: levelProgress } = calculateLevel(xp)
  const earnedBadges = badgeDefinitions.filter((b) => b.check(state))

  // Find continue learning target
  let continueTarget: { track: string; module: string; lesson: string; title: string } | null = null
  if (state.lastVisited) {
    const { track: tKey, module: mKey, lesson: lId } = state.lastVisited
    const track = tracks.find((t) => t.key === tKey)
    const mod = track?.modules.find((m) => m.key === mKey)
    const lesson = mod?.lessons.find((l) => l.id === lId)
    if (track && mod && lesson) {
      continueTarget = { track: tKey, module: mKey, lesson: lId, title: lesson.title }
    }
  }

  // Per-track stats
  const trackStats = tracks.map((track) => {
    const lessons = track.modules.flatMap((m) => m.lessons)
    const done = lessons.filter((l) => state.lessons[l.id]?.completed).length
    const percentage = lessons.length ? Math.round((done / lessons.length) * 100) : 0
    return { track, done, total: lessons.length, percentage }
  })

  const bookmarkedLessons = bookmarks
    .map((id) => {
      for (const track of tracks) {
        for (const m of track.modules) {
          const lesson = m.lessons.find((l) => l.id === id)
          if (lesson) return { track: track.key, module: m.key, lesson }
        }
      }
      return null
    })
    .filter(Boolean) as { track: string; module: string; lesson: Lesson }[]

  return (
    <div className="space-y-10">
      {/* Sync status */}
      <div
        className={cn(
          'flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between',
          session
            ? 'border-emerald-500/20 bg-emerald-500/5'
            : 'border-border bg-muted/40'
        )}
      >
        <div className="flex items-start gap-3">
          {session ? (
            <Cloud className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
          ) : (
            <CloudOff className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          )}
          <div>
            <p className="text-sm font-medium">
              {session
                ? `Synced to ${session.user?.email}`
                : 'Saved in this browser only'}
            </p>
            <p className="text-sm text-muted-foreground">
              {session
                ? 'Your progress, XP, streaks, notes, and bookmarks follow you to any device.'
                : 'Sign in to sync your progress across devices — everything you have now will be merged into your account.'}
            </p>
          </div>
        </div>
        {!session && (
          <Button asChild variant="outline" className="shrink-0 gap-2">
            <Link href="/auth/signin?callbackUrl=/dashboard">Sign in to sync</Link>
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="text-3xl font-bold mt-1">{xp}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                <Zap className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                <span>Level {level}</span>
                <span>{xpForNext - xp} XP to Level {level + 1}</span>
              </div>
              <Progress value={levelProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lessons Completed</p>
                <p className="text-3xl font-bold mt-1">
                  {completedLessons}
                  <span className="text-lg text-muted-foreground font-normal">/{totalLessons}</span>
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0}% of all content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold mt-1">
                  {streak.current}
                  <span className="text-lg text-muted-foreground font-normal"> days</span>
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/15 text-rose-500">
                <Flame className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Longest streak: {streak.longest} {streak.longest === 1 ? 'day' : 'days'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Badges Earned</p>
                <p className="text-3xl font-bold mt-1">
                  {earnedBadges.length}
                  <span className="text-lg text-muted-foreground font-normal">/{badgeDefinitions.length}</span>
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-500">
                <Trophy className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {badgeDefinitions.length - earnedBadges.length} more to unlock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning */}
      {continueTarget && (
        <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-violet-500/5">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                  <Play className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Continue where you left off</p>
                  <p className="font-semibold">{continueTarget.title}</p>
                </div>
              </div>
              <Button asChild className="flex-shrink-0">
                <Link href={`/learn/${continueTarget.track}/${continueTarget.module}/${continueTarget.lesson}`}>
                  Resume <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Track Progress */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Track Progress</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {trackStats.map(({ track, done, total, percentage }) => (
            <Card key={track.key}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{track.name}</CardTitle>
                  <Badge variant="outline">{percentage}%</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={percentage} className="h-2" />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{done} of {total} lessons completed</span>
                  <Link
                    href={`/learn/${track.key}`}
                    className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors"
                  >
                    View track <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Badges</h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {badgeDefinitions.map((badge) => {
            const earned = earnedBadges.some((b) => b.key === badge.key)
            return (
              <Card
                key={badge.key}
                className={cn(
                  'text-center transition-all',
                  earned ? 'border-amber-500/40 bg-amber-500/5' : 'opacity-50 grayscale'
                )}
              >
                <CardContent className="pt-6">
                  <div className="text-4xl mb-2" aria-hidden="true">{badge.icon}</div>
                  <p className="font-semibold text-sm">{badge.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                  {earned && (
                    <Badge className="mt-3 text-[10px] bg-amber-500/15 text-amber-600 border-amber-500/20 hover:bg-amber-500/15">
                      ✓ Earned
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Bookmarks */}
      {bookmarkedLessons.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-amber-500" aria-hidden="true" />
            Bookmarked Lessons
          </h2>
          <div className="space-y-2">
            {bookmarkedLessons.map(({ track, module, lesson }) => (
              <Link
                key={lesson.id}
                href={`/learn/${track}/${module}/${lesson.id}`}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-4 hover:border-border hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Bookmark className="h-4 w-4 text-amber-500 flex-shrink-0" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground">{track} · {lesson.estimatedMinutes} min</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Reset */}
      <Separator />
      <div data-print-hide className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-sm">Reset progress</p>
          <p className="text-xs text-muted-foreground">
            This clears lesson completion, XP, streaks, bookmarks, and notes. Signed-in resets also
            sync to your account. Cannot be undone.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => setResetConfirmOpen(true)}
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          Reset Progress
        </Button>
      </div>

      <ConfirmDialog
        open={resetConfirmOpen}
        onOpenChange={setResetConfirmOpen}
        title="Reset all progress?"
        description="This clears lesson completion, XP, streaks, bookmarks, and notes. If you are signed in, the reset also syncs to your account. It cannot be undone."
        confirmLabel="Reset progress"
        destructive
        onConfirm={() => {
          resetProgress()
          setResetConfirmOpen(false)
        }}
      />
    </div>
  )
}