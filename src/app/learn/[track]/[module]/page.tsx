import { notFound } from 'next/navigation'

export const instant = false
import Link from 'next/link'
import { getTrack, getModule, tracks } from '@/lib/curriculum'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { ModuleLessonsClient } from '@/components/module-lessons-client'
import { BookOpen, CheckCircle, Clock, Zap } from 'lucide-react'

export function generateStaticParams() {
  const params: { track: string; module: string }[] = []
  for (const track of tracks) {
    for (const m of track.modules) {
      params.push({ track: track.key, module: m.key })
    }
  }
  return params
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ track: string; module: string }>
}) {
  const { track: trackKey, module: moduleKey } = await params
  const track = getTrack(trackKey)
  const mod = getModule(trackKey, moduleKey)

  if (!track || !mod) notFound()

  const totalXP = mod.lessons.reduce((sum, l) => sum + l.xpReward, 0)
  const totalMinutes = mod.lessons.reduce((sum, l) => sum + l.estimatedMinutes, 0)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-16 border-b border-border/50">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Link
              href={`/learn/${track.key}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              ← {track.name}
            </Link>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline">
                Module {mod.order} of {track.modules.length}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{mod.name}</h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">{mod.description}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                {mod.lessons.length} lessons
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                ~{mod.estimatedHours} hours
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4" aria-hidden="true" />
                {totalXP} XP
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <ModuleLessonsClient
              track={track.key}
              moduleKey={mod.key}
              lessons={mod.lessons}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}