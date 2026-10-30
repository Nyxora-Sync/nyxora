import Link from 'next/link'
import {
  ArrowRight,
  Braces,
  FileCode,
  Hash,
  Layers,
  Terminal,
  type LucideIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getTotalMinutes, getTotalXP, tracks } from '@/lib/curriculum'
import { cn, getAccent } from '@/lib/utils'

const languageIcons: Record<string, LucideIcon> = {
  c: FileCode,
  cpp: Braces,
  csharp: Hash,
  python: Terminal,
}

const languageTracks = tracks
  .filter((track) => track.category === 'programming-languages')
  .map((track) => ({
    ...track,
    modules: track.modules.filter((module) => module.status !== 'advanced' && module.status !== 'planned'),
  }))

export function LanguagePaths({ className }: { className?: string }) {
  if (languageTracks.length === 0) return null

  return (
    <div className={cn('grid grid-cols-1 gap-6 md:grid-cols-2', className)}>
      {languageTracks.map((track) => {
        const Icon = languageIcons[track.key] ?? Terminal
        const lessonCount = track.modules.reduce(
          (sum, module) => sum + module.lessons.length,
          0
        )
        const hours = Math.round(getTotalMinutes(track.key) / 60)
        const xp = getTotalXP(track.key)

        return (
          <Link key={track.key} href={`/learn/${track.key}`} className="group block min-w-0">
            <Card className="relative h-full overflow-hidden border-border/50 transition-all motion-safe:hover:-translate-y-1 hover:shadow-xl">
              <div
                className={cn(
                  'absolute inset-x-0 top-0 h-1 bg-gradient-to-r',
                  getAccent(track.color).gradient
                )}
              />
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl',
                        getAccent(track.color).icon
                      )}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{track.name}</CardTitle>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Beginner → Mastery
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {lessonCount} lessons
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{track.description}</p>
                <ul className="space-y-2" role="list">
                  {track.modules.map((module, index) => (
                    <li
                      key={module.id}
                      className="flex items-center gap-3 rounded-lg bg-muted/30 px-3 py-2 text-sm"
                    >
                      <span
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                          getAccent(track.color).pill
                        )}
                      >
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {module.name}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {module.lessons.length} lessons
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                    {track.modules.length} levels
                  </span>
                  <span>~{hours} hours</span>
                  <span>{xp} XP</span>
                </div>
              </CardContent>
              <CardFooter className="border-t-0 pt-0">
                <Button variant="outline" className="w-full justify-between">
                  Explore the {track.name} path
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
