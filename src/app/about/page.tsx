import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { tracks } from '@/lib/curriculum'
import {
  ArrowRight,
  BookOpen,
  Code2,
  Compass,
  Database,
  Gauge,
  Heart,
  Layers,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { GithubIcon } from '@/components/icons/brand'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'About',
  description:
    'Why MERN Learn exists: a free, complete, written curriculum for the MERN stack, from first HTML tag to production mastery.',
  path: '/about',
  keywords: ['about MERN Learn', 'free MERN curriculum', 'open source coding education'],
})

const moduleKeys = new Set<string>()
const lessonIds = new Set<string>()
for (const track of tracks) {
  for (const mod of track.modules) {
    moduleKeys.add(mod.key)
    for (const lesson of mod.lessons) lessonIds.add(lesson.id)
  }
}

const stats = [
  { value: `${tracks.length}`, label: 'guided paths' },
  { value: `${moduleKeys.size}`, label: 'modules' },
  { value: `${lessonIds.size}`, label: 'written lessons' },
  { value: '$0', label: 'free forever' },
]

const offers = [
  {
    icon: BookOpen,
    title: 'The lesson, in writing',
    description:
      'Every concept is explained on the page, with runnable examples. No video you have to scrub through to find one sentence.',
    color: 'emerald',
  },
  {
    icon: Compass,
    title: 'A path, not a pile',
    description:
      'Two guided tracks: beginner foundations and the developer core, followed by mastery modules in testing, security, DevOps, architecture, and performance.',
    color: 'blue',
  },
  {
    icon: Code2,
    title: 'Practice in the browser',
    description:
      'Playgrounds for HTML, CSS, JavaScript, and React let you change the example and see what breaks before touching your own machine.',
    color: 'violet',
  },
  {
    icon: Users,
    title: 'People on the same road',
    description:
      'Ask under any lesson, share a project in the showcase, or answer the question you just figured out. Community is optional; learning is not gated by it.',
    color: 'amber',
  },
]

const principles = [
  {
    title: 'Free means free',
    description: 'No trial, paywall, upsell, or locked capstone. The whole curriculum is readable without an account.',
  },
  {
    title: 'Written first',
    description: 'Lessons are complete on the page. External links are extra depth, never required reading.',
  },
  {
    title: 'Accuracy over volume',
    description: 'Versions and APIs are checked against current docs. When something breaks, the lesson gets fixed, not buried.',
  },
  {
    title: 'Local-first progress',
    description: 'Progress and notes live in your browser. Sign in only when you want syncing, discussions, or the showcase.',
  },
  {
    title: 'Open source',
    description: 'The site, curriculum, and code are public. Anyone can improve a paragraph or report a broken example.',
  },
  {
    title: 'No dark patterns',
    description: 'No fake urgency, no engagement streaks that punish you, no selling attention. You are here to learn.',
  },
]

const stack = [
  { icon: Layers, label: 'Next.js App Router' },
  { icon: Code2, label: 'React 19' },
  { icon: BookOpen, label: 'MDX + Shiki' },
  { icon: Server, label: 'Node.js + Express' },
  { icon: Database, label: 'MongoDB + Mongoose' },
  { icon: Database, label: 'PostgreSQL + Prisma' },
  { icon: ShieldCheck, label: 'NextAuth' },
  { icon: Gauge, label: 'Vercel' },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border/50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              About
            </Badge>
            <h1 className="max-w-4xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              A complete MERN education,{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
                free and in writing
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              MERN Learn is a free, open-source curriculum for MongoDB, Express, React, and Node.js.
              It starts at the first HTML tag and ends with production concerns: tests, auth, security,
              deployment, and architecture.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="gap-2">
                <Link href="/learn">
                  Start learning
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/roadmap">
                  <Compass className="h-4 w-4" aria-hidden="true" />
                  See the roadmap
                </Link>
              </Button>
              <Button asChild variant="ghost" className="gap-2">
                <a href="https://github.com/Nyxora-Sync/mern-learn" target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="h-4 w-4" aria-hidden="true" />
                  View source
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-b border-border/50 bg-muted/30 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold tabular-nums">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Why this exists</h2>
                <div className="mt-4 space-y-4 text-muted-foreground">
                  <p>
                    Most MERN material is either a video course you cannot search, a paid bootcamp,
                    or a scattering of tutorials that stop before deployment. The free resources that
                    do exist are excellent, but they assume you already know which one to read next.
                  </p>
                  <p>
                    MERN Learn is the site we wanted: the full explanation in text, a sensible order,
                    and links to the best free deep dives when you want more. You can read it on a
                    slow connection, copy the code, and come back six months later and search it.
                  </p>
                  <p>
                    It is also honest about the stack. MongoDB, Express, React, and Node are tools,
                    not a personality. The mastery modules cover the parts that decide whether a
                    project survives: tests, auth, security, deployment, architecture, and performance.
                  </p>
                </div>
              </div>

              <Card className="border-emerald-500/20 bg-emerald-500/5">
                <CardContent className="pt-6">
                  <Heart className="h-6 w-6 text-rose-500" aria-hidden="true" />
                  <h2 className="mt-3 font-semibold">The one rule</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    If a lesson cannot be understood without a paid product, the lesson is not finished.
                    External links are optional depth, never a requirement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-y border-border/50 bg-muted/30 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight">What you get</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              One place for the whole path, with the boring parts included.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {offers.map((offer) => (
                <Card key={offer.title} className="h-full">
                  <CardContent className="pt-6">
                    <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${offer.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : offer.color === 'blue' ? 'bg-blue-500/10 text-blue-500' : offer.color === 'violet' ? 'bg-violet-500/10 text-violet-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      <offer.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold">{offer.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{offer.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight">The path</h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {[
                {
                  icon: BookOpen,
                  title: 'Beginner foundations',
                  description:
                    'How the web works, HTML, CSS, JavaScript, the DOM, async, ES modules, Git, and a first portfolio project. No assumed stack knowledge.',
                  href: '/learn/beginner',
                  cta: 'Beginner track',
                },
                {
                  icon: Code2,
                  title: 'The developer core',
                  description:
                    'Node and Express, REST design, auth, MongoDB and Mongoose, React, and the full-stack connection. The four MERN pillars, in order.',
                  href: '/learn/developer',
                  cta: 'Developer track',
                },
                {
                  icon: Rocket,
                  title: 'Mastery modules',
                  description:
                    'TypeScript, testing, security, DevOps, architecture, performance, and two capstones. The difference between "it runs" and "it ships".',
                  href: '/roadmap',
                  cta: 'See the roadmap',
                },
              ].map((stage) => (
                <Card key={stage.title} className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-violet-500/15 text-emerald-600 dark:text-emerald-400">
                      <stage.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-semibold">{stage.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{stage.description}</p>
                    <Link
                      href={stage.href}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      {stage.cta}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/50 bg-muted/30 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight">Principles</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {principles.map((principle) => (
                <div key={principle.title} className="rounded-xl border border-border/50 bg-card p-5">
                  <h3 className="font-semibold">{principle.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Built with</h2>
                <p className="mt-2 text-muted-foreground">
                  The site practices the stack it teaches. The curriculum itself lives in MDX so
                  lessons are reviewable like code.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {stack.map((item) => (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-sm"
                    >
                      <item.icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight">Who it is for</h2>
                <div className="mt-4 space-y-3 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Complete beginners</strong> who want one
                    coherent path instead of a folder of bookmarks.
                  </p>
                  <p>
                    <strong className="text-foreground">Self-taught developers</strong> filling the
                    gaps around the MERN core: testing, auth, deployment, and architecture.
                  </p>
                  <p>
                    <strong className="text-foreground">Career switchers</strong> who need written
                    material they can revisit, search, and learn from at their own pace.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-xl border border-border/50 bg-card p-6 text-center">
              <h2 className="text-xl font-bold tracking-tight">Built in the open</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                Found a typo, a broken example, or a missing topic? The repository is public and
                contributions are welcome.
              </p>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild className="gap-2">
                  <Link href="/contribute">Contribute</Link>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <a href="https://github.com/Nyxora-Sync/mern-learn" target="_blank" rel="noopener noreferrer">
                    <GithubIcon className="h-4 w-4" aria-hidden="true" />
                    Open the repository
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
