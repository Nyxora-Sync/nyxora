import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Code2, Database, Server, Globe, CheckCircle, ArrowRight, Users, Trophy, Zap, BookOpen, ExternalLink, Cpu, Smartphone, Brain, Cloud, Gamepad2, Monitor } from 'lucide-react'
import { GithubIcon } from '@/components/icons/brand'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroVisual } from '@/components/home/hero-visual'
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

const features = [
  {
    icon: Code2,
    title: 'Curated Free Resources',
    description: 'Hand-picked tutorials, videos, and docs from the best free sources. No paywalls, no fluff.',
    color: 'emerald',
  },
  {
    icon: BookOpen,
    title: 'Structured Learning Paths',
    description: 'From web development to embedded systems — every path takes you from beginner to mastery with real projects.',
    color: 'violet',
  },
  {
    icon: Zap,
    title: 'Interactive Playgrounds',
    description: 'Run HTML, CSS, JavaScript, React, Node, Express, Python, and more directly in your browser.',
    color: 'amber',
  },
  {
    icon: Trophy,
    title: 'Progress Tracking & Badges',
    description: 'Track completion, earn XP, unlock badges, and keep your streak in sync across devices.',
    color: 'rose',
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Lesson discussions, a project showcase, and public learner profiles. No invite-only chat required.',
    color: 'blue',
  },
  {
    icon: Database,
    title: 'Project-Based Learning',
    description: 'Build real projects for your portfolio — web apps, CLI tools, IoT devices, and more.',
    color: 'indigo',
  },
]

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
    icon: track.icon,
    modulesList: track.modules.map(
      (m) => `${m.name} (~${Math.round(m.estimatedHours / 10)} wks)`
    ),
  }
})

const lessonIds = new Set<string>()
const resourceUrls = new Set<string>()
const projectLessonIds = new Set<string>()

for (const track of curriculumTracks) {
  for (const mod of track.modules) {
    for (const lesson of mod.lessons) {
      lessonIds.add(lesson.id)
      for (const resource of lesson.resources) resourceUrls.add(resource.url)
      if (lesson.isProject || lesson.resources.some((resource) => resource.type === 'project')) {
        projectLessonIds.add(lesson.id)
      }
    }
  }
}

const totalLessons = lessonIds.size
const totalResources = resourceUrls.size
const projectCount = projectLessonIds.size

const stats = [
  { value: '100%', label: 'Free Forever' },
  { value: `${totalLessons}`, label: 'Written Lessons' },
  { value: `${totalResources}`, label: 'Free Resources' },
  { value: `${projectCount}`, label: 'Project Lessons' },
]

export const metadata = pageMetadata({
  title: 'Nyxora Sync — Free Learning Paths for Developers',
  description: `Learn web development, programming languages, embedded systems, and more with ${totalLessons} free written lessons, real projects, playgrounds, and progress tracking.`,
  path: '/',
  keywords: ['web development', 'programming languages', 'embedded systems', 'IoT', 'Arduino', 'ESP32', 'C', 'C++', 'C#', 'Python', 'MERN', 'React', 'Node.js', 'free coding curriculum'],
})

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
          <HeroVisual />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 mb-6">
                <span className="relative flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                <span>Now with C, C++, C#, Python, and Embedded Systems paths</span>
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Learn to build.{' '}
                <span className="bg-gradient-to-r from-emerald-500 via-violet-500 to-amber-500 bg-clip-text text-transparent">
                  Go deeper.
                </span>{' '}
                Master the craft.
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
                Master web development, programming languages, embedded systems, and more through written lessons,
                real projects, interactive playgrounds, progress tracking, and a supportive community.
                100% free, open source, no paywalls.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild className="gap-2 w-full sm:w-auto">
                  <Link href="/learn">
                    Start Learning Free
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="gap-2 w-full sm:w-auto">
                  <Link href="/roadmap">View Full Roadmap</Link>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex items-center justify-center gap-8 text-xs text-muted-foreground/60">
              <div className="flex items-center gap-1.5">
                <GithubIcon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                <span>No Account Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Curated External Resources</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                <span>In-Browser Playgrounds</span>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Categories */}
        <section className="py-20 sm:py-24 bg-muted/30">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose Your Path</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Every category contains structured learning paths from beginner to mastery.
                Pick a category, pick a track, start building.
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

        {/* Featured Tracks from Web Development */}
        <section className="py-20 sm:py-24">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Web Development
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Start with the Web
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Two core MERN tracks, same destination. Pick based on your experience level.
                </p>
              </div>
            </div>
            <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" delay={0.1}>
              <div className="grid gap-8 md:grid-cols-2">
                {tracks
                  .filter((t) => t.category === 'web-development' && t.key !== 'specializations')
                  .map((track) => (
                    <Link key={track.key} href={`/learn/${track.key}`} className="group">
                      <Card className="relative overflow-hidden transition-all motion-safe:hover:-translate-y-1 hover:shadow-xl h-full border-border/50">
                        <div
                          className={cn(
                            'absolute inset-x-0 top-0 h-1 bg-gradient-to-r',
                            getAccent(track.color).gradient
                          )}
                        />
                        <CardHeader>
                          <div className={cn('flex items-center gap-2 text-sm font-medium', getAccent(track.color).text)}>
                            <span className="relative flex h-5 w-5" aria-hidden="true">
                              <span className="absolute inset-0 rounded-full border-2 border-current opacity-20" />
                              <span className="absolute inset-0 rounded-full border-2 border-current border-t-transparent animate-spin" />
                            </span>
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
                          <ul className="space-y-2" role="list">
                            {track.modulesList.map((module, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                                {module}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter className="border-t-0 pt-0">
                          <Button className="w-full" variant="outline">
                            Start {track.name} <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
            </div>
            <SpecializationsBanner className="mt-8" />
          </Reveal>
          </Reveal>
        </section>

        {/* Programming Languages */}
        <section id="languages" className="py-20 sm:py-24 scroll-mt-20 bg-muted/30">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Programming Languages
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Go deeper than the framework
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Four complete paths from beginner to mastery. Learn memory, types, concurrency, and
                  production tooling — then build something real in each language.
                </p>
              </div>
              <Button asChild variant="outline" className="gap-2 self-start sm:self-auto">
                <Link href="/learn/languages">
                  Explore languages
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <LanguagePaths />
          </Reveal>
        </section>

        {/* Embedded Systems Preview */}
        <section id="embedded" className="py-20 sm:py-24 scroll-mt-20">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Embedded Systems & IoT
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Code that touches the physical world
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Arduino, ESP32, sensors, actuators, and IoT cloud. Coming soon.
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
                { title: 'Arduino Fundamentals', desc: 'GPIO, PWM, I2C/SPI, interrupts, and libraries', icon: Cpu, color: 'amber' },
                { title: 'ESP32 WiFi & Bluetooth', desc: 'Web servers, BLE, MQTT, OTA updates', icon: Cloud, color: 'amber' },
                { title: 'Sensors & Actuators', desc: 'Temperature, distance, motors, displays', icon: Cpu, color: 'amber' },
                { title: 'RTOS & FreeRTOS', desc: 'Tasks, queues, semaphores, timing', icon: Cpu, color: 'amber' },
                { title: 'IoT Cloud Integration', desc: 'AWS IoT, Azure, MQTT brokers', icon: Cloud, color: 'amber' },
                { title: 'PCB Design Basics', desc: 'KiCad, schematics, layout, manufacturing', icon: Cpu, color: 'amber' },
              ].map((item) => (
                <Card key={item.title} className="group transition-all motion-safe:hover:-translate-y-0.5 hover:shadow-lg h-full border-border/50">
                  <CardHeader>
                    <div className={cn('mb-3 flex h-12 w-12 items-center justify-center rounded-xl', getAccent(item.color).icon)}>
                      <item.icon className="h-6 w-6" aria-hidden="true" />
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

        {/* Features */}
        <section className="py-20 sm:py-24">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything You Need to Succeed</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Built by developers, for developers. Every feature designed to help you learn faster.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="group transition-all motion-safe:hover:-translate-y-0.5 hover:shadow-lg">
                  <CardHeader>
                    <div className={cn('mb-3 flex h-12 w-12 items-center justify-center rounded-xl', getAccent(feature.color).icon)}>
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-24">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-violet-500/10 to-amber-500/10 border-border/50">
              <CardContent className="relative py-16 sm:py-24 text-center">
                <div className="mx-auto max-w-2xl">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Ready to start learning?
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Join thousands of learners building real projects — free, self-paced, and open source.
                  </p>
                  <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button size="lg" asChild className="gap-2 w-full sm:w-auto">
                      <Link href="/learn">
                        Start Learning Now
                        <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="gap-2 w-full sm:w-auto">
                      <Link href="https://github.com/Nyxora-Sync/nyxora-sync" target="_blank" rel="noopener noreferrer">
                        <GithubIcon className="h-5 w-5" aria-hidden="true" />
                        View on GitHub
                      </Link>
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