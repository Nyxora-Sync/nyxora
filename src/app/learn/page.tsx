import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BookOpen, Code2, ArrowRight, CheckCircle, Clock, Users, Trophy, Code2 as Code2Icon } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { cn, getAccent } from '@/lib/utils'
import { tracks as curriculumTracks } from '@/lib/curriculum'
import { pageMetadata } from '@/lib/seo'

const trackIcons: Record<string, typeof BookOpen> = {
  beginner: BookOpen,
  developer: Code2,
}

const tracks = curriculumTracks.map((track) => {
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
    icon: trackIcons[track.key] ?? BookOpen,
    modulesList: track.modules.map((m) => ({
      key: m.key,
      name: m.name,
      weeks: Math.max(1, Math.round(m.estimatedHours / 10)),
      lessons: m.lessons.length,
    })),
  }
})

const uniqueLessonCount = new Set(
  curriculumTracks.flatMap((track) =>
    track.modules.flatMap((mod) => mod.lessons.map((lesson) => lesson.id))
  )
).size

export const metadata = pageMetadata({
  title: 'Learn the MERN Stack',
  description: `Choose a beginner foundations track or go straight to the MERN core. ${uniqueLessonCount} free written lessons, playgrounds, and a path to production mastery.`,
  path: '/learn',
  keywords: ['learn MERN', 'MERN roadmap', 'beginner web development', 'MongoDB Express React Node'],
})

export default function LearnPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-emerald-500 via-violet-500 to-amber-500 bg-clip-text text-transparent">
                Learning Path
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Two tracks, same destination. Pick based on your experience level. Switch anytime.
            </p>
          </div>
        </section>

        {/* Track Cards */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {tracks.map((track) => (
                <Link key={track.key} href={`/learn/${track.key}`} className="group">
                  <Card className="relative overflow-hidden transition-all hover:shadow-xl h-full border-border/50">
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
          </div>
        </section>

        {/* Why MERN Learn */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Learn with MERN Learn?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We aren&apos;t just another tutorial site. We&apos;re a complete learning platform.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: CheckCircle, title: '100% Free Forever', desc: 'No paywalls, no subscriptions, no upsells. All content is free and open source.', color: 'emerald' },
                { icon: Clock, title: 'Self-Paced Learning', desc: 'Learn on your schedule. Track progress, pick up where you left off, no deadlines.', color: 'violet' },
                { icon: Trophy, title: 'Real Projects', desc: 'Build a portfolio site, blog, e-commerce app, and a multi-tenant SaaS capstone.', color: 'amber' },
                { icon: Code2, title: 'Interactive Playgrounds', desc: 'Run HTML, CSS, JavaScript, React, Node, and Express examples in your browser. Zero setup required.', color: 'rose' },
                { icon: Users, title: 'Community', desc: 'Lesson discussions, a project showcase, and public learner profiles.', color: 'blue' },
                { icon: BookOpen, title: 'Curated Resources', desc: 'Hand-picked from freeCodeCamp, Net Ninja, official docs, and top educators.', color: 'indigo' },
              ].map((feature) => (
                <Card key={feature.title} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className={cn('mb-4 flex h-12 w-12 items-center justify-center rounded-xl', getAccent(feature.color).icon)}>
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-violet-500/10 to-amber-500/10 border-border/50">
              <CardContent className="relative py-12 sm:py-16 text-center">
                <div className="mx-auto max-w-2xl">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Ready to become a MERN master?
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Both tracks are free, written, and self-paced. Start where you are.
                  </p>
                  <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button size="lg" asChild className="gap-2 w-full sm:w-auto">
                      <Link href="/learn/beginner">
                        Start Beginner Track
                        <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="gap-2 w-full sm:w-auto">
                      <Link href="/learn/developer">Start Developer Track</Link>
                    </Button>
                  </div>
                  <p className="mt-6 text-sm text-muted-foreground">
                    Not sure? <Link href="/roadmap" className="font-medium text-foreground underline hover:text-primary">View the full roadmap first</Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}