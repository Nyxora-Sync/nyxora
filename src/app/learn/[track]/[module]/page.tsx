import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const instant = false
import Link from 'next/link'
import { getTrack, getModule, tracks } from '@/lib/curriculum'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { JsonLd } from '@/components/structured-data'
import { absoluteUrl, canonicalLearnPath, canonicalTrackForModule, pageMetadata } from '@/lib/seo'
import { Badge } from '@/components/ui/badge'
import { ModuleLessonsClient } from '@/components/module-lessons-client'
import { BookOpen, Clock, Zap } from 'lucide-react'

export function generateStaticParams() {
  const params: { track: string; module: string }[] = []
  for (const track of tracks) {
    for (const m of track.modules) {
      params.push({ track: track.key, module: m.key })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string; module: string }>
}): Promise<Metadata> {
  const { track: trackKey, module: moduleKey } = await params
  const track = getTrack(trackKey)
  const mod = getModule(trackKey, moduleKey)

  if (!track || !mod) {
    return { title: 'Module not found', robots: { index: false, follow: false } }
  }

  const canonicalTrack = getTrack(canonicalTrackForModule(track.key, mod.key)) ?? track

  return pageMetadata({
    title: mod.name,
    description: `${mod.description} Explore ${mod.lessons.length} free written lessons in the ${canonicalTrack.name} on Nyxora Sync.`,
    path: canonicalLearnPath(track.key, mod.key),
    keywords: [mod.name, track.name, 'MERN module', 'learn MERN'],
  })
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

  const modulePath = `/learn/${track.key}/${mod.key}`
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Learn', item: absoluteUrl('/learn') },
      { '@type': 'ListItem', position: 3, name: track.name, item: absoluteUrl(`/learn/${track.key}`) },
      { '@type': 'ListItem', position: 4, name: mod.name, item: absoluteUrl(modulePath) },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={breadcrumbSchema} />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
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