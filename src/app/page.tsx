import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Code2, Database, Server, Globe, CheckCircle, ArrowRight, Users, Trophy, Zap, BookOpen, ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/icons/brand'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroVisual } from '@/components/home/hero-visual'
import { SpecializationsBanner } from '@/components/specializations-banner'
import { Reveal } from '@/components/motion/reveal'
import { cn, getAccent } from '@/lib/utils'
import { tracks as curriculumTracks } from '@/lib/curriculum'
import { pageMetadata } from '@/lib/seo'

const trackIcons: Record<string, typeof BookOpen> = {
  beginner: BookOpen,
  developer: Code2,
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
    title: 'Core Tracks + Specializations',
    description: 'Start with beginner foundations or go straight to MERN. Then choose a specialization and ship something more ambitious.',
    color: 'violet',
  },
  {
    icon: Zap,
    title: 'Interactive Playgrounds',
    description: 'Run HTML, CSS, JavaScript, React, Node, and Express examples directly in your browser.',
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
    description: 'Build a portfolio site, a blog, an e-commerce app, and a multi-tenant SaaS capstone.',
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
    duration: `~${Math.round(totalHours / 10)} wks`,
    modules: track.modules.length,
    lessons,
    color: track.color,
    icon: trackIcons[track.key] ?? BookOpen,
    modulesList: track.modules.map(
      (m) => `${m.name} (~${Math.round(m.estimatedHours / 10)} wks)`
    ),
  }
})

const coreTracks = tracks.filter((track) => track.key !== 'specializations')

const lessonIds = new Set<string>()
const resourceUrls = new Set<string>()
const projectLessonIds = new Set<string>()

for (const track of curriculumTracks) {
  for (const mod of track.modules) {
    for (const lesson of mod.lessons) {
      lessonIds.add(lesson.id)
      for (const resource of lesson.resources) resourceUrls.add(resource.url)
      if (lesson.resources.some((resource) => resource.type === 'project')) {
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
  title: 'MERN Learn — Master the MERN Stack for Free',
  description: `Learn MongoDB, Express, React, and Node.js with ${totalLessons} free written lessons, playgrounds, progress tracking, and a full roadmap from beginner to production.`,
  path: '/',
  keywords: ['MERN stack', 'learn MERN', 'MongoDB', 'Express', 'React', 'Node.js', 'free coding curriculum'],
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
                <span>v2.0 launched — Now with interactive playgrounds!</span>
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Master the{' '}
                <span className="bg-gradient-to-r from-emerald-500 via-violet-500 to-amber-500 bg-clip-text text-transparent">
                  MERN Stack
                </span>{' '}
                from Zero to Mastery
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
                Learn MongoDB, Express, React, and Node.js with curated free resources, interactive code playgrounds,
                progress tracking, and a supportive community. 100% free, open source, no paywalls.
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

        {/* Choose Your Track */}
        <section className="py-20 sm:py-24 bg-muted/30">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose Your Learning Path</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Two core tracks, same destination. Pick based on your experience level, then specialize when you are ready.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              {coreTracks.map((track) => (
                <Link key={track.key} href={`/learn/${track.key}`} className="group">
                  <Card className="relative overflow-hidden transition-all motion-safe:hover:-translate-y-1 hover:shadow-xl h-full border-border/50">
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
          </Reveal>
          <SpecializationsBanner className="mt-8" />
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

        {/* Curriculum Preview */}
        <section className="py-20 sm:py-24 bg-muted/30">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What You&apos;ll Learn</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Comprehensive curriculum covering the entire MERN ecosystem.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-4">
              {[
                { title: 'Node.js & Express', icon: Server, color: 'emerald', topics: ['REST APIs', 'Authentication', 'Middleware', 'Testing', 'Deployment'] },
                { title: 'MongoDB & Mongoose', icon: Database, color: 'emerald', topics: ['Data Modeling', 'Aggregation', 'Indexes', 'Transactions', 'Performance'] },
                { title: 'React & Ecosystem', icon: Globe, color: 'violet', topics: ['Hooks & State', 'Routing', 'Forms', 'Data Fetching', 'Performance'] },
                { title: 'Full Stack Mastery', icon: Code2, color: 'amber', topics: ['Architecture', 'Real-time', 'File Uploads', 'CI/CD', 'Docker'] },
              ].map((phase) => (
                <Card key={phase.title} className="h-full">
                  <CardHeader>
                    <div className={cn('mb-3 flex h-11 w-11 items-center justify-center rounded-xl', getAccent(phase.color).icon)}>
                      <phase.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <CardTitle>{phase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2" role="list">
                      {phase.topics.map((topic) => (
                        <li key={topic} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className={cn('h-3.5 w-3.5', getAccent(phase.color).text)} aria-hidden="true" />
                          {topic}
                        </li>
                      ))}
                    </ul>
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
                    Ready to start your MERN journey?
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Join learners building real projects with the MERN stack — free, self-paced, and open source.
                  </p>
                  <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button size="lg" asChild className="gap-2 w-full sm:w-auto">
                      <Link href="/learn">
                        Start Learning Now
                        <ArrowRight className="h-5 w-5" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="gap-2 w-full sm:w-auto">
                      <Link href="https://github.com/Nyxora-Sync/mern-learn" target="_blank" rel="noopener noreferrer">
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