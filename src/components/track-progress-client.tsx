'use client'

import Link from 'next/link'
import { useProgress } from '@/hooks/use-progress'
import { getTrack } from '@/lib/curriculum'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, BookOpen, Zap } from 'lucide-react'
import { calculateLevel } from '@/lib/utils'

export function TrackProgressClient({ trackKey }: { trackKey: string }) {
  const { state, isLoaded, xp } = useProgress()

  const track = getTrack(trackKey)
  if (!track) return null

  const allLessons = track.modules.flatMap((m) => m.lessons)
  const completedCount = allLessons.filter((l) => state.lessons[l.id]?.completed).length
  const percentage = allLessons.length ? Math.round((completedCount / allLessons.length) * 100) : 0

  // Find next incomplete lesson in order
  let nextLesson: { moduleKey: string; lessonId: string } | null = null
  outer: for (const m of track.modules) {
    for (const lesson of m.lessons) {
      if (!state.lessons[lesson.id]?.completed) {
        nextLesson = { moduleKey: m.key, lessonId: lesson.id }
        break outer
      }
    }
  }

  const { level } = calculateLevel(xp)

  return (
    <Card className="w-full lg:w-80 flex-shrink-0 border-border/50">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Your Progress</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-amber-500" aria-hidden="true" />
            {xp} XP
          </div>
        </div>

        {/* Circular progress */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative h-20 w-20 flex-shrink-0">
            <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                className="stroke-muted"
                strokeWidth="3"
              />
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke="currentColor"
                className="text-emerald-500 transition-all duration-500"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${percentage} ${100 - percentage}`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
              {percentage}%
            </span>
          </div>
          <div className="text-sm">
            <p className="font-medium">
              {isLoaded ? `${completedCount} of ${allLessons.length} lessons` : 'Loading...'}
            </p>
            <p className="text-muted-foreground">Level {isLoaded ? level : '—'}</p>
          </div>
        </div>

        {isLoaded && nextLesson && (
          <Button className="w-full gap-2" asChild>
            <Link href={`/learn/${track.key}/${nextLesson.moduleKey}/${nextLesson.lessonId}`}>
              {completedCount > 0 ? 'Continue learning' : 'Start the track'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        )}
        {isLoaded && !nextLesson && allLessons.length > 0 && (
          <div className="rounded-lg bg-emerald-500/10 p-3 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
            🎉 Track complete! Congratulations!
          </div>
        )}
        {!isLoaded && (
          <Button className="w-full" disabled>
            <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />
            Loading...
          </Button>
        )}
      </CardContent>
    </Card>
  )
}