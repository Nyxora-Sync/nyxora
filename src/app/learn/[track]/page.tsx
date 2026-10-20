import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const instant = false
import Link from 'next/link'
import { getTrack, tracks, getTotalXP, getTotalMinutes } from '@/lib/curriculum'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { JsonLd } from '@/components/structured-data'
import { absoluteUrl, pageMetadata } from '@/lib/seo'
import { Badge } from '@/components/ui/badge'
import { TrackProgressClient } from '@/components/track-progress-client'
import { Reveal } from '@/components/motion/reveal'
import { BookOpen, Code2, Server, Database, Atom, Layers, FileCode, FlaskConical, ShieldCheck, Container, Network, Gauge, Rocket, Cloud, Boxes, Smartphone, Sparkles, ArrowRight, Clock, Zap, Braces, Hash, Terminal, type LucideIcon } from 'lucide-react'
import { cn, getAccent } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
  BookOpen, Code2, Server, Database, Atom, Layers,
  FileCode, FlaskConical, ShieldCheck, Container, Network, Gauge, Rocket,
  Cloud, Boxes, Smartphone, Sparkles, Braces, Hash, Terminal,
}

export function generateStaticParams() {
  return tracks.map((track) => ({ track: track.key }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string }>
}): Promise<Metadata> {
  const { track: trackKey } = await params
  const track = getTrack(trackKey)

  if (!track) {
    return { title: 'Track not found', robots: { index: false, follow: false } }
  }

  return pageMetadata({
    title: track.name,
    description: track.description,
    path: `/learn/${track.key}`,
    keywords:
      track.category === 'programming-languages'
        ? [track.name, 'learn ' + track.name, 'programming', 'beginner to mastery', 'free coding course']
        : [track.name, 'MERN curriculum', 'learn MERN', 'MongoDB', 'Express', 'React', 'Node.js'],
  })
}

export default async function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track: trackKey } = await params
  const track = getTrack(trackKey)

  if (!track) notFound()

  const totalXP = getTotalXP(track.key)
  const totalMinutes = getTotalMinutes(track.key)
  const totalHours = Math.round(totalMinutes / 60)
  const totalLessons = track.modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const educationalLevel =
    track.key === 'beginner'
      ? 'Beginner'
      : track.key === 'specializations'
        ? 'Advanced'
        : track.category === 'programming-languages'
          ? 'Beginner to mastery'
          : 'Beginner to advanced'
  const TrackIcon = iconMap[track.icon] || BookOpen

  const trackPath = `/learn/${track.key}`
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${track.name} — Nyxora Sync`,
    description: track.description,
    url: absoluteUrl(trackPath),
    provider: {
      '@type': 'Organization',
      name: 'Nyxora Sync',

      url: absoluteUrl('/'),
    },
    isAccessibleForFree: true,
    inLanguage: 'en',
    educationalLevel,
    teaches: track.modules.map((module) => module.name),
    offers: {
      '@type': 'Offer',
      category: 'Free',
      price: 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `PT${totalHours}H`,
    },
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Learn', item: absoluteUrl('/learn') },
      { '@type': 'ListItem', position: 3, name: track.name, item: absoluteUrl(trackPath) },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={[breadcrumbSchema, courseSchema]} />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* Track Header */}
        <section className="py-12 sm:py-16 border-b border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/learn"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              ← All tracks
            </Link>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div
                  className={cn('inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium mb-4', getAccent(track.color).pill)}
                >
                  <TrackIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {track.name}
                </div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{track.name}</h1>
                <p className="mt-3 text-lg text-muted-foreground">{track.description}</p>
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-4 w-4" aria-hidden="true" />
                    {track.modules.length} modules
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    {totalLessons} lessons
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    ~{totalHours} hours
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4" aria-hidden="true" />
                    {totalXP} XP available
                  </div>
                </div>
              </div>

              {/* Progress card (client) */}
              <TrackProgressClient trackKey={track.key} />
            </div>
          </div>
        </section>

        {/* Modules List */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Curriculum</h2>
            <div className="space-y-4">
              {track.modules.map((module, index) => {
                const Icon = iconMap[module.icon] || Layers
                const moduleLessons = module.lessons.length
                const moduleXP = module.lessons.reduce((sum, l) => sum + l.xpReward, 0)
                return (
                  <Reveal key={module.id} delay={Math.min(index * 0.04, 0.24)}>
                    <Link
                      href={`/learn/${track.key}/${module.key}`}
                      className="group block"
                    >
                    <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-5 sm:p-6 transition-all motion-safe:hover:-translate-y-0.5 hover:border-border hover:shadow-md">
                      <div
                        className={cn('hidden sm:flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl', getAccent(track.color).icon)}
                      >
                        <Icon className="h-7 w-7" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs font-medium text-muted-foreground">
                            Module {index + 1}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {module.estimatedHours}h
                          </Badge>
                        </div>
                        <h3 className="mt-1 text-lg font-semibold group-hover:text-primary transition-colors">
                          {module.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {module.description}
                        </p>
                        <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                          <span>{moduleLessons} lessons</span>
                          <span>{moduleXP} XP</span>
                        </div>
                      </div>
                      <ArrowRight
                        className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground"
                        aria-hidden="true"
                      />
                      </div>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}