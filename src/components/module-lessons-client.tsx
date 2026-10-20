'use client'

import Link from 'next/link'
import { useProgress } from '@/hooks/use-progress'
import type { Lesson } from '@/lib/curriculum'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/motion/reveal'
import { CheckCircle2, Circle, Clock, Play, Zap, FileText, Code2, BookOpen, type LucideIcon } from 'lucide-react'
import { cn, getDifficultyColor, getAccent } from '@/lib/utils'

const typeIcons: Record<string, LucideIcon> = {
  video: Play,
  article: FileText,
  docs: BookOpen,
  interactive: Code2,
  project: Code2,
  cheatsheet: FileText,
}

export function ModuleLessonsClient({
  track,
  moduleKey,
  lessons,
}: {
  track: string
  moduleKey: string
  lessons: Lesson[]
}) {
  const { isLoaded, isCompleted } = useProgress()

  return (
    <div className="space-y-3">
      {lessons.map((lesson, index) => {
        const completed = isLoaded && isCompleted(lesson.id)
        const difficultyColor = getDifficultyColor(lesson.difficulty)
        const resourceTypes = Array.from(new Set(lesson.resources.map((r) => r.type)))

        return (
          <Reveal key={lesson.id} delay={Math.min(index * 0.035, 0.2)} distance={12}>
            <Link
              href={`/learn/${track}/${moduleKey}/${lesson.id}`}
              className="group block"
            >
            <div
              className={cn(
                'flex items-start gap-4 rounded-xl border p-5 transition-all motion-safe:hover:-translate-y-0.5 hover:shadow-md',
                completed
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-border/50 bg-card hover:border-border'
              )}
            >
              {/* Completion indicator */}
              <div className="flex-shrink-0 pt-0.5">
                {isLoaded ? (
                  completed ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" aria-label="Completed" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground/40" aria-label="Not completed" />
                  )
                ) : (
                  <div className="h-6 w-6 animate-pulse rounded-full bg-muted" aria-hidden="true" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-muted-foreground">
                    Lesson {lesson.order}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn('text-xs', getAccent(difficultyColor).borderSoft, getAccent(difficultyColor).text)}
                  >
                    {lesson.difficulty}
                  </Badge>
                  {completed && (
                    <Badge className="text-xs bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15">
                      Completed
                    </Badge>
                  )}
                </div>
                <h3 className={cn(
                  'mt-1 font-semibold group-hover:text-primary transition-colors',
                  completed && 'line-through decoration-emerald-500/40 text-muted-foreground'
                )}>
                  {lesson.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {lesson.description}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {lesson.estimatedMinutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                    {lesson.xpReward} XP
                  </span>
                  <span className="flex items-center gap-1.5" aria-label={`${lesson.resources.length} resources`}>
                    {resourceTypes.map((type) => {
                      const Icon = typeIcons[type] || FileText
                      return <Icon key={type} className="h-3.5 w-3.5" aria-hidden="true" />
                    })}
                    <span>{lesson.resources.length} resources</span>
                  </span>
                </div>
              </div>
            </div>
            </Link>
          </Reveal>
        )
      })}
    </div>
  )
}