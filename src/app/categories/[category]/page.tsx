import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Reveal } from '@/components/motion/reveal'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ArrowRight, Code2 as Code2Icon, CheckCircle, Clock, Trophy, Globe, Cpu, Smartphone, Brain, Cloud, Gamepad2, Monitor, Code2 } from 'lucide-react'
import { trackCategories, tracks as curriculumTracks } from '@/lib/curriculum'
import { cn, getAccent } from '@/lib/utils'
import { pageMetadata } from '@/lib/seo'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

const categoryIcons: Record<string, typeof Globe> = {
  'web-development': Globe,
  'programming-languages': Code2,
  'embedded-systems': Cpu,
  'mobile-development': Smartphone,
  'data-science': Brain,
  'devops-cloud': Cloud,
  'game-development': Gamepad2,
  'desktop-apps': Monitor,
}

const trackIcons: Record<string, typeof Globe> = {
  beginner: Globe,
  developer: Code2,
  specializations: Globe,
  c: Globe,
  cpp: Code2,
  csharp: Code2,
  python: Globe,
  embedded: Cpu,
}

export async function generateStaticParams() {
  return trackCategories
    .filter((cat) => curriculumTracks.some((t) => t.category === cat.id))
    .map((cat) => ({ category: cat.id }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const catInfo = trackCategories.find((c) => c.id === category)
  if (!catInfo) return { title: 'Category Not Found' }
  
  const categoryTracks = curriculumTracks.filter((t) => t.category === category)
  const totalLessons = categoryTracks.reduce((sum, t) => sum + t.modules.reduce((s, m) => s + m.lessons.length, 0), 0)
  
  return pageMetadata({
    title: `${catInfo.name} | Nyxora Sync`,
    description: `${catInfo.description} ${totalLessons} lessons across ${categoryTracks.length} learning paths.`,
    path: `/categories/${category}`,
  })
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const catInfo = trackCategories.find((c) => c.id === category)
  
  if (!catInfo) notFound()
  
  const categoryTracks = curriculumTracks.filter((t) => t.category === category)
  
  if (categoryTracks.length === 0) notFound()
  
  const tracks = categoryTracks.map((track) => {
    const lessons = track.modules.reduce((sum, m) => sum + m.lessons.length, 0)
    const totalHours = track.modules.reduce((sum, m) => sum + m.estimatedHours, 0)
    return {
      key: track.key,
      name: track.name,
      description: track.description,
      duration: `~${Math.round(totalHours / 10)} wks`,
      modules: track.modules.length,
      lessons,
      color: track.color,
      icon: trackIcons[track.key] ?? Globe,
      modulesList: track.modules.map((m) => ({
        key: m.key,
        name: m.name,
        weeks: Math.max(1, Math.round(m.estimatedHours / 10)),
        lessons: m.lessons.length,
      })),
    }
  })
  
  const totalLessons = categoryTracks.reduce((sum, t) => sum + t.modules.reduce((s, m) => s + m.lessons.length, 0), 0)
  const Icon = categoryIcons[category] ?? Globe

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* Category Hero */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />
                  All Categories
                </Link>
                <div className={cn('mb-3 flex h-12 w-12 items-center justify-center rounded-xl', getAccent(catInfo.color).icon)}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{catInfo.name}</h1>
                <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{catInfo.description}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>{tracks.length} learning paths</p>
                <p>{totalLessons} total lessons</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tracks in this category */}
        <section className="py-16 sm:py-20">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {tracks.map((track) => (
                <Link key={track.key} href={`/learn/${track.key}`} className="group">
                  <Card className="relative overflow-hidden transition-all motion-safe:hover:-translate-y-1 hover:shadow-xl h-full border-border/50">
                    <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r', getAccent(track.color).gradient)} />
                    <CardHeader>
                      <div className={cn('flex items-center gap-2 text-sm font-medium', getAccent(track.color).text)}>
                        <track.icon className="h-5 w-5" aria-hidden="true" />
                        {track.name}
                      </div>
                      <CardTitle className="text-2xl">{track.name}</CardTitle>
                      <CardDescription className="text-base">{track.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-2xl font-bold">{track.duration}</p>
                          <p className="text-xs text-muted-foreground">Estimated Time</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-2xl font-bold">{track.modules}</p>
                          <p className="text-xs text-muted-foreground">Modules</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-2xl font-bold">{track.lessons}</p>
                          <p className="text-xs text-muted-foreground">Lessons</p>
                        </div>
                      </div>
                      <Separator />
                      <ul className="space-y-3" role="list">
                        {track.modulesList.map((module) => (
                          <li key={module.key} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 group-hover:bg-muted/50 transition-colors">
                            <div className={cn('flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center', getAccent(track.color).icon)}>
                              <Code2Icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{module.name}</p>
                              <p className="text-xs text-muted-foreground">{module.weeks} weeks • {module.lessons} lessons</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" aria-hidden="true" />
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="border-t-0 pt-0">
                      <Button className="w-full" variant="default">
                        Start {track.name} <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-violet-500/10 to-amber-500/10 border-border/50">
              <CardContent className="relative py-12 sm:py-16 text-center">
                <div className="mx-auto max-w-2xl">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Not sure where to start?
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Every path is free, written, and self-paced. Start where you are.
                  </p>
                  <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button size="lg" asChild className="gap-2 w-full sm:w-auto">
                      <Link href="/learn">
                        Browse All Categories
                        <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="gap-2 w-full sm:w-auto">
                      <Link href="/roadmap">View Full Roadmap</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  )
}