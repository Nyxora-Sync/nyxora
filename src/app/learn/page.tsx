import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { BookOpen, Code2, ArrowRight, CheckCircle, Clock, Users, Trophy, Code2 as Code2Icon, Sparkles, Cpu, Smartphone, Brain, Cloud, Gamepad2, Monitor, Globe } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { LanguagePaths } from '@/components/language-paths'
import { SpecializationsBanner } from '@/components/specializations-banner'
import { Reveal } from '@/components/motion/reveal'
import { cn, getAccent } from '@/lib/utils'
import { tracks as curriculumTracks, trackCategories } from '@/lib/curriculum'
import { pageMetadata } from '@/lib/seo'

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

const trackIcons: Record<string, typeof BookOpen> = {
  beginner: BookOpen,
  developer: Code2,
  specializations: Sparkles,
  c: BookOpen,
  cpp: Code2,
  csharp: Code2,
  python: BookOpen,
  embedded: Cpu,
}

const tracks = curriculumTracks.map((track) => {
  const lessons = track.modules.reduce((sum, m) => sum + m.lessons.length, 0)
  const totalHours = track.modules.reduce((sum, m) => sum + m.estimatedHours, 0)
  return {
    key: track.key,
    name: track.name,
    description: track.description,
    category: track.category,
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
  title: 'Explore All Learning Paths',
  description: `Choose from ${trackCategories.filter(c => curriculumTracks.some(t => t.category === c.id)).length} categories with ${uniqueLessonCount} free written lessons across web development, programming languages, embedded systems, and more.`,
  path: '/learn',
  keywords: ['web development', 'programming languages', 'embedded systems', 'IoT', 'Arduino', 'ESP32', 'C', 'C++', 'C#', 'Python', 'MERN', 'React', 'Node.js', 'free coding curriculum'],
})

export default function LearnPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
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
              Browse all categories: web development, programming languages, embedded systems, and more.
              Every path is free, written, and organized from beginner to mastery.
            </p>
          </div>
        </section>

        {/* Categories Overview */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">All Learning Categories</h2>
              <p className="mt-3 text-muted-foreground">
                Pick a category to explore its learning paths. Each path takes you from beginner to mastery.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
              {trackCategories
                .filter((cat) => curriculumTracks.some((t) => t.category === cat.id))
                .map((category) => {
                  const categoryTracks = tracks.filter((t) => t.category === category.id)
                  const totalLessons = categoryTracks.reduce((sum, t) => sum + t.lessons, 0)
                  const totalTracks = categoryTracks.length
                  const Icon = categoryIcons[category.id] ?? Globe
                  return (
                    <Link
                      key={category.id}
                      href={`/categories/${category.id}`}
                      className="group relative block"
                    >
                      <Card className="relative h-full overflow-hidden transition-all motion-safe:hover:-translate-y-1 hover:shadow-xl border-border/50">
                        <div
                          className={cn(
                            'absolute inset-x-0 top-0 h-1 bg-gradient-to-r',
                            getAccent(category.color).gradient
                          )}
                        />
                        <CardContent className="pt-6 pb-8 flex flex-col h-full">
                          <div className={cn('mb-4 flex h-12 w-12 items-center justify-center rounded-xl', getAccent(category.color).icon)}>
                            <Icon className="h-6 w-6" aria-hidden="true" />
                          </div>
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground flex-1">
                            {category.description}
                          </p>
                          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50 pt-4">
                            <span>{totalTracks} tracks</span>
                            <span>{totalLessons} lessons</span>
                          </div>
                          <ArrowRight
                            className="absolute bottom-4 right-4 h-5 w-5 text-muted-foreground/50 group-hover:text-foreground group-hover:right-3 transition-all"
                            aria-hidden="true"
                          />
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
            </div>
          </Reveal>
        </section>

        {/* Web Development Tracks */}
        <section className="py-16 sm:py-20">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Web Development
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Build and operate modern web applications
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Start from zero or bring your JavaScript experience. Both MERN paths lead to the same
                  production foundations.
                </p>
              </div>
              <Button asChild variant="outline" className="gap-2 self-start sm:self-auto">
                <Link href="/categories/web-development">
                  View all web tracks
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              {tracks
                .filter((track) => track.category === 'web-development' && track.key !== 'specializations')
                .map((track) => (
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
          <SpecializationsBanner className="mt-8" />
        </section>

        {/* Programming Languages */}
        <section id="languages" className="py-16 sm:py-20 bg-muted/30 scroll-mt-20">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Programming Languages
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Go deeper than the framework
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Four complete beginner-to-mastery paths. Each level ends with a project, and each
                  path ends with a capstone.
                </p>
              </div>
              <Button asChild variant="outline" className="gap-2 self-start sm:self-auto">
                <Link href="/learn/languages">
                  Explore all language paths
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <LanguagePaths />
          </Reveal>
        </section>

        {/* Embedded Systems */}
        <section id="embedded" className="py-16 sm:py-20 scroll-mt-20">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Embedded Systems & IoT
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Code that touches the physical world
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Arduino, ESP32, sensors, actuators, and IoT cloud.
                </p>
              </div>
              <Button asChild variant="outline" className="gap-2 self-start sm:self-auto">
                <Link href="/categories/embedded-systems">
                  View embedded tracks
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'Arduino Fundamentals', desc: 'GPIO, PWM, I2C/SPI, interrupts, and libraries', color: 'amber' },
                { title: 'ESP32 WiFi & Bluetooth', desc: 'Web servers, BLE, MQTT, OTA updates', color: 'amber' },
                { title: 'Sensors & Actuators', desc: 'Temperature, distance, motors, displays', color: 'amber' },
                { title: 'RTOS & FreeRTOS', desc: 'Tasks, queues, semaphores, timing', color: 'amber' },
                { title: 'IoT Cloud Integration', desc: 'AWS IoT, Azure, MQTT brokers', color: 'amber' },
                { title: 'PCB Design Basics', desc: 'KiCad, schematics, layout, manufacturing', color: 'amber' },
              ].map((item) => (
                <Card key={item.title} className="group transition-all motion-safe:hover:-translate-y-0.5 hover:shadow-lg h-full border-border/50">
                  <CardHeader>
                    <div className={cn('mb-3 flex h-12 w-12 items-center justify-center rounded-xl', getAccent(item.color).icon)}>
                      <Cpu className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{item.desc}</CardDescription>
                  </CardContent>
                  <CardFooter className="border-t-0 pt-0">
                    <span className="text-xs text-muted-foreground">Coming Soon</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Coming Soon Categories */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Coming Soon</h2>
              <p className="mt-3 text-muted-foreground">
                More categories are being built. Check back for new learning paths.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: 'Mobile Development', desc: 'iOS, Android, React Native, Flutter', icon: Smartphone, color: 'violet' },
                { name: 'Data Science & AI', desc: 'Python, ML, visualization, LLMs', icon: Brain, color: 'rose' },
                { name: 'DevOps & Cloud', desc: 'Docker, Kubernetes, AWS, CI/CD', icon: Cloud, color: 'indigo' },
                { name: 'Game Development', desc: 'Unity, Godot, graphics, physics', icon: Gamepad2, color: 'orange' },
                { name: 'Desktop Apps', desc: 'Tauri, Electron, native cross-platform', icon: Monitor, color: 'slate' },
              ].map((cat) => (
                <Card key={cat.name} className="group transition-all motion-safe:hover:-translate-y-0.5 hover:shadow-lg h-full border-border/50">
                  <CardHeader>
                    <div className={cn('mb-3 flex h-12 w-12 items-center justify-center rounded-xl', getAccent(cat.color).icon)}>
                      <cat.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <CardTitle>{cat.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{cat.desc}</CardDescription>
                  </CardContent>
                  <CardFooter className="border-t-0 pt-0">
                    <span className="text-xs text-muted-foreground">Planned</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Why Nyxora Sync */}
        <section className="py-16 sm:py-20">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why learn with Nyxora Sync?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We aren&apos;t just another tutorial site. We&apos;re a complete, free learning platform.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: CheckCircle, title: '100% Free Forever', desc: 'No paywalls, no subscriptions, no upsells. All content is free and open source.', color: 'emerald' },
                { icon: Clock, title: 'Self-Paced Learning', desc: 'Learn on your schedule. Track progress, pick up where you left off, no deadlines.', color: 'violet' },
                { icon: Trophy, title: 'Real Projects', desc: 'Build a portfolio site, blog, e-commerce app, and a multi-tenant SaaS capstone.', color: 'amber' },
                { icon: Code2, title: 'Interactive Playgrounds', desc: 'Run HTML, CSS, JavaScript, React, Node, Express, Python examples in your browser. Zero setup.', color: 'rose' },
                { icon: Users, title: 'Community', desc: 'Lesson discussions, a project showcase, and public learner profiles.', color: 'blue' },
                { icon: BookOpen, title: 'Curated Resources', desc: 'Hand-picked from freeCodeCamp, official documentation, and trusted educators across every path.', color: 'indigo' },
              ].map((feature) => (
                <Card key={feature.title} className="group transition-all motion-safe:hover:-translate-y-0.5 hover:shadow-lg">
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
          </Reveal>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-violet-500/10 to-amber-500/10 border-border/50">
              <CardContent className="relative py-12 sm:py-16 text-center">
                <div className="mx-auto max-w-2xl">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Ready to choose your next skill?
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Every path is free, written, and self-paced. Start where you are.
                  </p>
                  <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button size="lg" asChild className="gap-2 w-full sm:w-auto">
                      <Link href="/learn/beginner">
                        Start the Beginner Track
                        <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="gap-2 w-full sm:w-auto">
                      <Link href="/learn/languages">Explore Language Paths</Link>
                    </Button>
                  </div>
                  <p className="mt-6 text-sm text-muted-foreground">
                    Not sure? <Link href="/roadmap" className="font-medium text-foreground underline hover:text-primary">View the full roadmap first</Link>
                  </p>
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