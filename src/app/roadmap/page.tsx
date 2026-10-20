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
  Rocket, Smartphone, Brain,
} from 'lucide-react'
import { cn, getAccent } from '@/lib/utils'
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

const specializations = [
  { name: 'Advanced React / Next.js', icon: Atom, description: 'Server components, SSR/SSG, App Router' },
  { name: 'DevOps & Cloud', icon: Cloud, description: 'Docker, Kubernetes, AWS, monitoring' },
  { name: 'Scalable Systems', icon: Boxes, description: 'Microservices, Redis, message queues' },
  { name: 'React Native', icon: Smartphone, description: 'Mobile apps with MERN backend' },
]

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
  title: 'Full MERN Roadmap',
  description: 'Complete visual roadmap for learning the MERN stack, from beginner foundations to production mastery, with estimated timelines.',
  path: '/roadmap',
  keywords: ['MERN roadmap', 'full stack roadmap', 'learn MERN', 'web developer roadmap'],
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
              <span className="bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
                MERN Mastery
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              A complete, structured path from absolute beginner to job-ready full stack developer.
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

        {/* Specializations */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">After MERN: Specialize</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Completed the core tracks? Pick a specialization to stand out.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {specializations.map((spec) => (
                <Card key={spec.name} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-500">
                      <spec.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{spec.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{spec.description}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">Coming soon</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}