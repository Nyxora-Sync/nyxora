'use client'

import { useState, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { useProgress } from '@/hooks/use-progress'
import type { Lesson } from '@/lib/curriculum'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  CheckCircle2, Circle, ExternalLink, Play, FileText, BookOpen, Code2,
  ChevronLeft, ChevronRight, Zap, Bookmark, BookmarkCheck, Lightbulb, StickyNote,
  Clock, type LucideIcon,
} from 'lucide-react'
import { cn, getAccent } from '@/lib/utils'

const resourceTypeMeta: Record<string, { icon: LucideIcon; label: string; color: string }> = {
  video: { icon: Play, label: 'Video', color: 'rose' },
  article: { icon: FileText, label: 'Article', color: 'blue' },
  docs: { icon: BookOpen, label: 'Docs', color: 'emerald' },
  interactive: { icon: Code2, label: 'Interactive', color: 'violet' },
  project: { icon: Code2, label: 'Project', color: 'amber' },
  cheatsheet: { icon: FileText, label: 'Cheatsheet', color: 'slate' },
}

interface LessonClientProps {
  lesson: Lesson
  track: string
  moduleKey: string
  prev: { id: string; title: string; moduleKey: string } | null
  next: { id: string; title: string; moduleKey: string } | null
  children?: ReactNode
}

export function LessonClient({ lesson, track, moduleKey, prev, next, children }: LessonClientProps) {
  const { isLoaded, isCompleted, markComplete, saveNotes, state, toggleBookmark, setLastVisited } = useProgress()
  const [notes, setNotes] = useState('')
  const [notesSaved, setNotesSaved] = useState(false)

  const completed = isLoaded && isCompleted(lesson.id)
  const bookmarked = state.bookmarks.includes(lesson.id)

  useEffect(() => {
    if (isLoaded) {
      // Hydrate local notes from the progress store, then record the visit.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotes(state.lessons[lesson.id]?.notes || '')
      setLastVisited(track, moduleKey, lesson.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, lesson.id])

  const handleToggleComplete = () => {
    markComplete(lesson.id, lesson.xpReward, !completed)
  }

  const handleSaveNotes = () => {
    saveNotes(lesson.id, notes)
    setNotesSaved(true)
    setTimeout(() => setNotesSaved(false), 2000)
  }

  return (
    <div className="space-y-10">
      {/* Key Takeaways */}
      {lesson.keyTakeaways.length > 0 && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-amber-500" aria-hidden="true" />
              What you&apos;ll learn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2" role="list">
              {lesson.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  {takeaway}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Written lesson */}
      {children && (
        <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl prose-p:leading-relaxed prose-li:my-1 prose-strong:text-foreground prose-code:rounded-md prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-medium prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none">
          {children}
        </article>
      )}

      {/* Resources */}
      <section aria-labelledby="resources-heading">
        <div className="flex items-center justify-between mb-5">
          <h2 id="resources-heading" className="text-2xl font-bold tracking-tight">
            Go deeper
          </h2>
          <Badge variant="secondary" className="text-xs">{lesson.resources.length} resources</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Optional supplementary material — videos, articles, and docs to reinforce what you just read.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {lesson.resources.map((resource, i) => {
            const meta = resourceTypeMeta[resource.type] || resourceTypeMeta.article
            const Icon = meta.icon
            return (
              <a
                key={i}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-border hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0', getAccent(meta.color).icon)}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                      {meta.label}
                    </Badge>
                    {resource.isVerified && (
                      <Badge className="text-[10px] bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15">
                        ✓ Verified
                      </Badge>
                    )}
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 ml-auto text-muted-foreground/50 group-hover:text-foreground transition-colors flex-shrink-0" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                {resource.description && (
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{resource.description}</p>
                )}
                <div className="mt-auto pt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  {resource.provider && <span>{resource.provider}</span>}
                  {resource.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {resource.duration}
                    </span>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      </section>

      {/* Playground CTA */}
      {lesson.playground && (
        <Card className="border-violet-500/20 bg-violet-500/5">
          <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-500 flex-shrink-0">
                <Code2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold">{lesson.playground.title}</h3>
                <p className="text-sm text-muted-foreground">{lesson.playground.description}</p>
              </div>
            </div>
            <Button asChild variant="outline" className="border-violet-500/30 hover:bg-violet-500/10 flex-shrink-0">
              <Link href={`/playground?template=${lesson.playground.template}`}>
                Open Playground <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <StickyNote className="h-5 w-5 text-blue-500" aria-hidden="true" />
            Your Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Write your notes, key concepts, or things to revisit..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="resize-y"
          />
          <div className="flex items-center gap-3">
            <Button size="sm" onClick={handleSaveNotes} variant={notesSaved ? 'secondary' : 'default'}>
              {notesSaved ? '✓ Saved' : 'Save Notes'}
            </Button>
            <span className="text-xs text-muted-foreground">
              Notes are stored locally in your browser.
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Complete + Bookmark */}
      <Card
        className={cn(
          'transition-colors',
          completed ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border/50'
        )}
      >
        <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {completed ? (
              <CheckCircle2 className="h-8 w-8 text-emerald-500" aria-hidden="true" />
            ) : (
              <Circle className="h-8 w-8 text-muted-foreground/40" aria-hidden="true" />
            )}
            <div>
              <p className="font-semibold">
                {completed ? 'Lesson completed!' : 'Finished this lesson?'}
              </p>
              <p className="text-sm text-muted-foreground">
                {completed
                  ? `You earned ${lesson.xpReward} XP. Great work!`
                  : `Mark it complete to earn ${lesson.xpReward} XP.`}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleBookmark(lesson.id)}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
            >
              {bookmarked ? (
                <BookmarkCheck className="h-5 w-5 text-amber-500" aria-hidden="true" />
              ) : (
                <Bookmark className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
            <Button
              onClick={handleToggleComplete}
              disabled={!isLoaded}
              variant={completed ? 'outline' : 'default'}
              className="gap-2"
            >
              {completed ? (
                <>
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Completed
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" aria-hidden="true" />
                  Mark Complete (+{lesson.xpReward} XP)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Prev/Next Navigation */}
      <Separator />
      <nav className="flex flex-col gap-4 sm:flex-row sm:justify-between" aria-label="Lesson navigation">
        {prev ? (
          <Button variant="outline" asChild className="justify-start h-auto py-3 max-w-full sm:max-w-[45%]">
            <Link href={`/learn/${track}/${prev.moduleKey}/${prev.id}`}>
              <ChevronLeft className="h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true" />
              <span className="flex flex-col items-start min-w-0">
                <span className="text-xs text-muted-foreground">Previous</span>
                <span className="truncate font-medium">{prev.title}</span>
              </span>
            </Link>
          </Button>
        ) : (
          <div />
        )}
        {next ? (
          <Button variant="outline" asChild className="justify-end h-auto py-3 max-w-full sm:max-w-[45%] sm:ml-auto">
            <Link href={`/learn/${track}/${next.moduleKey}/${next.id}`}>
              <span className="flex flex-col items-end min-w-0">
                <span className="text-xs text-muted-foreground">Next</span>
                <span className="truncate font-medium">{next.title}</span>
              </span>
              <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </nav>
    </div>
  )
}