import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Reveal } from '@/components/motion/reveal'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen, Code2, Server, Database, Atom, Layers, ArrowRight,
  Globe, GitBranch, Cloud, Boxes, TestTube2, Shield,
  Rocket, Smartphone, Brain, Braces, FileCode, Hash, Terminal,
  type LucideIcon,
} from 'lucide-react'
import { cn, getAccent } from '@/lib/utils'
import { getTrack, tracks } from '@/lib/curriculum'
import { pageMetadata } from '@/lib/seo'

const beginnerRoadmap = [
  {
    phase: 'Foundations',
    color: 'emerald',
    weeks: 'Weeks 1-5',
    icon: BookOpen,
    steps: [
      { name: 'How the Web Works', icon: Globe },
      { name: 'HTML Fundamentals', icon: Code2 },
      { name: 'CSS & Responsive Design', icon: Layers },
      { name: 'JavaScript Fundamentals', icon: Code2 },
      { name: 'DOM & Events', icon: Code2 },
      { name: 'Async JS, Promises, Fetch', icon: Code2 },
      { name: 'Modern JavaScript (ES6+)', icon: Code2 },
      { name: 'Git, GitHub & Terminal', icon: GitBranch },
      { name: 'Project: Portfolio Page', icon: Rocket },
    ],
  },
  {
    phase: 'Node.js & Express',
    color: 'emerald',
    weeks: 'Weeks 6-8',
    icon: Server,
    steps: [
      { name: 'Node.js Fundamentals', icon: Server },
      { name: 'Express Routing & Middleware', icon: Server },
      { name: 'REST API Design', icon: Globe },
      { name: 'Authentication (JWT, bcrypt)', icon: Shield },
      { name: 'Testing & Error Handling', icon: TestTube2 },
      { name: 'Project: REST API', icon: Rocket },
    ],
  },
  {
    phase: 'MongoDB & Mongoose',
    color: 'emerald',
    weeks: 'Weeks 9-10',
    icon: Database,
    steps: [
      { name: 'MongoDB Fundamentals', icon: Database },
      { name: 'Mongoose Schemas & Models', icon: Database },
      { name: 'Relationships & Population', icon: GitBranch },
      { name: 'Aggregation Pipeline', icon: Boxes },
      { name: 'Project: Blog Backend', icon: Rocket },
    ],
  },
  {
    phase: 'React',
    color: 'emerald',
    weeks: 'Weeks 11-14',
    icon: Atom,
    steps: [
      { name: 'React Fundamentals', icon: Atom },
      { name: 'Hooks Deep Dive', icon: Brain },
      { name: 'React Router', icon: Globe },
      { name: 'State Management', icon: Boxes },
      { name: 'Forms & Data Fetching', icon: Code2 },
      { name: 'Performance', icon: Rocket },
      { name: 'Project: Full SPA', icon: Rocket },
    ],
  },
  {
    phase: 'Full Stack Mastery',
    color: 'emerald',
    weeks: 'Weeks 15-16',
    icon: Layers,
    steps: [
      { name: 'Architecture & Monorepo', icon: Layers },
      { name: 'Connecting Frontend & Backend', icon: GitBranch },
      { name: 'Real-time with Socket.io', icon: Brain },
      { name: 'File Uploads', icon: Cloud },
      { name: 'Deployment & CI/CD', icon: Rocket },
      { name: 'Capstone Project', icon: Rocket },
    ],
  },
]

const developerRoadmap = beginnerRoadmap.slice(1).map((phase, i) => ({
  ...phase,
  weeks: ['Weeks 1-3', 'Weeks 4-5', 'Weeks 6-8', 'Weeks 9-10'][i],
}))

const specializationTrack = getTrack('specializations')

const specializationIcons: Record<string, typeof Atom> = {
  Atom,
  Cloud,
  Boxes,
  Smartphone,
}

const languageTracks = tracks.filter(
  (track) => track.category === 'programming-languages'
)

const languageIcons: Record<string, LucideIcon> = {
  c: FileCode,
  cpp: Braces,
  csharp: Hash,
  python: Terminal,
}

function LanguageRoadmap({
  track,
  index,
}: {
  track: (typeof languageTracks)[number]
  index: number
}) {
  const Icon = languageIcons[track.key] ?? FileCode
  const lessonCount = track.modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  )
  const hours = track.modules.reduce((sum, module) => sum + module.estimatedHours, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 rounded-xl border border-border/50 bg-card p-5">
        <div
          className={cn(
            'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl',
            getAccent(track.color).icon
          )}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold">{track.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{track.description}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {track.modules.length} levels · {lessonCount} lessons · ~{hours} hours
          </p>
        </div>
      </div>

      {track.modules.map((module, moduleIndex) => (
        <Reveal key={module.id} delay={Math.min((index + moduleIndex) * 0.05, 0.2)}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                  {moduleIndex + 1}
                </span>
                <div>
                  <h4 className="font-semibold">{module.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {module.lessons.length} lessons · ~{module.estimatedHours} hours
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{module.description}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {module.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/learn/${track.key}/${module.key}/${lesson.id}`}
                    className="group flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-background text-[10px] font-semibold text-muted-foreground">
                      {lesson.order}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                    <ArrowRight
                      className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </Reveal>
      ))}

      <div className="pt-2 text-center">
        <Button asChild variant="outline" className="gap-2">
          <Link href={`/learn/${track.key}`}>
            Start the {track.name} path
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

function RoadmapPhase({ phase, index, color }: { phase: typeof beginnerRoadmap[0]; index: number; color: string }) {
  const Icon = phase.icon
  return (
    <div className="relative">
      {/* Connector line */}
      {index > 0 && (
        <div className="absolute left-7 top-0 -translate-y-full h-8 w-px bg-border" aria-hidden="true" />
      )}
      <Card className="overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div
              className={cn('flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl', getAccent(color).icon)}
            >
              <Icon className="h-7 w-7" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-bold">{phase.phase}</h3>
                <Badge variant="outline" className="text-xs">{phase.weeks}</Badge>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {phase.steps.map((step, si) => (
                  <div
                    key={si}
                    className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm"
                  >
                    <step.icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">{step.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const metadata = pageMetadata({
  title: 'Full Learning Roadmap',
  description: 'Complete roadmaps for MERN, C, C++, C#, and Python, from beginner foundations to advanced projects, mastery, and specializations, with estimated timelines.',
  path: '/roadmap',
  keywords: ['MERN roadmap', 'C roadmap', 'C++ roadmap', 'C# roadmap', 'Python roadmap', 'full stack roadmap', 'learn programming', 'Next.js roadmap', 'React Native roadmap'],
})

export default function RoadmapPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="py-12 sm:py-16 border-b border-border/50">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4">Visual Roadmap</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Your Path to{' '}
              <span className="bg-gradient-to-r from-emerald-500 via-violet-500 to-amber-500 bg-clip-text text-transparent">
                Mastery
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Complete, structured paths from absolute beginner to job-ready developer — for the web
              and for the languages behind it.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="beginner">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-10">
                <TabsTrigger value="beginner" className="gap-2">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  Beginner Track
                </TabsTrigger>
                <TabsTrigger value="developer" className="gap-2">
                  <Code2 className="h-4 w-4" aria-hidden="true" />
                  Developer Track
                </TabsTrigger>
              </TabsList>

              <TabsContent value="beginner" className="space-y-6">
                <div className="text-center mb-8">
                  <p className="text-muted-foreground">
                    16 weeks · No prior experience needed · ~110 hours of learning
                  </p>
                </div>
                {beginnerRoadmap.map((phase, i) => (
                  <Reveal key={phase.phase} delay={Math.min(i * 0.06, 0.24)}>
                    <RoadmapPhase phase={phase} index={i} color="emerald" />
                  </Reveal>
                ))}
                <div className="pt-6 text-center">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/learn/beginner">
                      Start Beginner Track <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="developer" className="space-y-6">
                <div className="text-center mb-8">
                  <p className="text-muted-foreground">
                    10 weeks · Requires JS/ES6+, Git, and basic terminal knowledge · ~65 hours of learning
                  </p>
                </div>
                {developerRoadmap.map((phase, i) => (
                  <Reveal key={phase.phase} delay={Math.min(i * 0.06, 0.24)}>
                    <RoadmapPhase phase={phase} index={i} color="violet" />
                  </Reveal>
                ))}
                <div className="pt-6 text-center">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/learn/developer">
                      Start Developer Track <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Programming Languages */}
        {languageTracks.length > 0 && (
          <section className="border-y border-border/50 py-12 sm:py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 text-center">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Programming Languages
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                  Choose a language path
                </h2>
                <p className="mt-3 mx-auto max-w-2xl text-muted-foreground">
                  Each path has three levels and twelve written lessons. Every level ends with a
                  project; every path ends with a capstone.
                </p>
              </div>
              <Tabs defaultValue={languageTracks[0].key}>
                <TabsList className="mx-auto mb-10 grid w-full max-w-2xl grid-cols-2 sm:grid-cols-4">
                  {languageTracks.map((track) => {
                    const Icon = languageIcons[track.key] ?? FileCode
                    return (
                      <TabsTrigger key={track.key} value={track.key} className="gap-2">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {track.name}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
                {languageTracks.map((track, index) => (
                  <TabsContent key={track.key} value={track.key}>
                    <LanguageRoadmap track={track} index={index} />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </section>
        )}

        {/* Specializations */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">After MERN: Specialize</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Finished the core MERN curriculum? Pick a complete specialization module and keep going.
              </p>
            </div>
            {specializationTrack && (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  {specializationTrack.modules.map((spec) => {
                    const Icon = specializationIcons[spec.icon] ?? Atom
                    return (
                      <Link
                        key={spec.id}
                        href={`/learn/${specializationTrack.key}/${spec.key}`}
                        className="group block"
                      >
                        <Card className="h-full hover:shadow-md transition-shadow">
                          <CardContent className="pt-6 flex items-start gap-4">
                            <div className={cn('flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl', getAccent(spec.color).icon)}>
                              <Icon className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold group-hover:text-primary transition-colors">{spec.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {spec.lessons.length} lessons
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{spec.description}</p>
                              <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-primary">
                                Start specialization
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
                <div className="mt-8 text-center">
                  <Button asChild variant="outline" className="gap-2">
                    <Link href={`/learn/${specializationTrack.key}`}>
                      Explore all specializations
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}