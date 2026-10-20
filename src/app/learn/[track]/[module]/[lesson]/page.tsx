import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const instant = false
import type { ComponentType } from 'react'
import Link from 'next/link'
import { getTrack, getModule, getLesson, tracks } from '@/lib/curriculum'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { JsonLd } from '@/components/structured-data'
import { absoluteUrl, canonicalLearnPath, canonicalTrackForModule, pageMetadata } from '@/lib/seo'
import { LessonClient } from '@/components/lesson-client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatLessonUpdated, getLessonUpdated } from '@/lib/lesson-updates'
import { Clock, Zap, BookOpen, Construction, CalendarDays } from 'lucide-react'
import { cn, getDifficultyColor, getAccent } from '@/lib/utils'

export function generateStaticParams() {
  const params: { track: string; module: string; lesson: string }[] = []
  for (const track of tracks) {
    for (const m of track.modules) {
      for (const lesson of m.lessons) {
        params.push({ track: track.key, module: m.key, lesson: lesson.id })
      }
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string; module: string; lesson: string }>
}): Promise<Metadata> {
  const { track: trackKey, module: moduleKey, lesson: lessonId } = await params
  const track = getTrack(trackKey)
  const mod = getModule(trackKey, moduleKey)
  const lesson = getLesson(trackKey, moduleKey, lessonId)

  if (!track || !mod || !lesson) {
    return { title: 'Lesson not found', robots: { index: false, follow: false } }
  }

  const canonicalTrack = getTrack(canonicalTrackForModule(track.key, mod.key)) ?? track

  return pageMetadata({
    title: lesson.title,
    description: `${lesson.description} A free ${lesson.difficulty} lesson in the ${mod.name} module of the ${canonicalTrack.name} on MERN Learn.`,
    path: canonicalLearnPath(track.key, mod.key, lesson.id),
    type: 'article',
    keywords: [lesson.title, mod.name, track.name, 'MERN lesson', 'free coding lesson'],
  })
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ track: string; module: string; lesson: string }>
}) {
  const { track: trackKey, module: moduleKey, lesson: lessonId } = await params
  const track = getTrack(trackKey)
  const mod = getModule(trackKey, moduleKey)
  const lesson = getLesson(trackKey, moduleKey, lessonId)

  if (!track || !mod || !lesson) notFound()

  // Compute prev/next lessons across the whole track
  const allLessons = track.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleKey: m.key, moduleName: m.name }))
  )
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id)
  const prev = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const next = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  const difficultyColor = getDifficultyColor(lesson.difficulty)

  // Written lesson content is authored as MDX. Not every lesson has been
  // written yet, so missing files fall back to a friendly notice.
  let LessonContent: ComponentType | null = null
  try {
    const mdx = await import(`@/content/lessons/${lesson.id}.mdx`)
    LessonContent = mdx.default as ComponentType
  } catch {
    LessonContent = null
  }

  const lessonPath = `/learn/${track.key}/${mod.key}/${lesson.id}`
  const canonicalPath = canonicalLearnPath(track.key, mod.key, lesson.id)
  const canonicalTrackKey = canonicalTrackForModule(track.key, mod.key)
  const canonicalTrack = getTrack(canonicalTrackKey) ?? track
  const updated = getLessonUpdated(lesson.id)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Learn', item: absoluteUrl('/learn') },
      { '@type': 'ListItem', position: 3, name: track.name, item: absoluteUrl(`/learn/${track.key}`) },
      { '@type': 'ListItem', position: 4, name: mod.name, item: absoluteUrl(`/learn/${track.key}/${mod.key}`) },
      { '@type': 'ListItem', position: 5, name: lesson.title, item: absoluteUrl(lessonPath) },
    ],
  }
  const learningResourceSchema = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: lesson.title,
    description: lesson.description,
    url: absoluteUrl(canonicalPath),
    learningResourceType: 'Lesson',
    educationalLevel: lesson.difficulty,
    isAccessibleForFree: true,
    inLanguage: 'en',
    timeRequired: `PT${lesson.estimatedMinutes}M`,
    ...(updated ? { dateModified: `${updated}T00:00:00.000Z` } : {}),
    teaches: lesson.keyTakeaways,
    isPartOf: {
      '@type': 'Course',
      name: canonicalTrack.name,
      url: absoluteUrl(`/learn/${canonicalTrackKey}`),
    },
    provider: {
      '@type': 'Organization',
      name: 'MERN Learn',
      url: absoluteUrl('/'),
    },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={[breadcrumbSchema, learningResourceSchema]} />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link href="/learn" className="hover:text-foreground transition-colors">Learn</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/learn/${track.key}`} className="hover:text-foreground transition-colors">{track.name}</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/learn/${track.key}/${mod.key}`} className="hover:text-foreground transition-colors">{mod.name}</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground font-medium truncate max-w-[200px]" aria-current="page">{lesson.title}</li>
            </ol>
          </nav>

          {/* Lesson header */}
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge variant="outline" className="text-xs">
                Lesson {lesson.order} of {mod.lessons.length}
              </Badge>
              <Badge
                variant="outline"
                className={cn('text-xs', getAccent(difficultyColor).borderSoft, getAccent(difficultyColor).text)}
              >
                {lesson.difficulty}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{lesson.title}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{lesson.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {lesson.estimatedMinutes} min estimated
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4" aria-hidden="true" />
                {lesson.xpReward} XP
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                {lesson.resources.length} curated resources
              </span>
              {updated && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  Last updated{' '}
                  <time dateTime={updated}>{formatLessonUpdated(updated)}</time>
                </span>
              )}
            </div>
          </header>

          <LessonClient
            lesson={lesson}
            track={track.key}
            moduleKey={mod.key}
            prev={prev}
            next={next}
          >
            {LessonContent ? (
              <LessonContent />
            ) : (
              <Card className="border-dashed bg-muted/20">
                <CardContent className="flex gap-3 pt-6">
                  <Construction className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">Full written lesson coming soon</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      We are writing this lesson directly on the site. Until then, the curated
                      resources below cover the topic end to end.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </LessonClient>
        </div>
      </main>
      <Footer />
    </div>
  )
}