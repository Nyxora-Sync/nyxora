import Link from 'next/link'
import Form from 'next/form'
import type { Metadata } from 'next'
import {
  ArrowRight,
  BookOpen,
  Compass,
  HelpCircle,
  Home,
  Library,
  Rocket,
  Route,
  Search,
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Reveal } from '@/components/motion/reveal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you requested does not exist. Search MERN Learn lessons, resources, and answers instead.',
  robots: { index: false, follow: false },
}

const startingPoints = [
  {
    title: 'Beginner track',
    description: 'New to HTML, CSS, and JavaScript? Start at zero.',
    href: '/learn/beginner',
    icon: BookOpen,
  },
  {
    title: 'Developer track',
    description: 'Know JavaScript? Go straight to the MERN stack.',
    href: '/learn/developer',
    icon: Route,
  },
  {
    title: 'Resource directory',
    description: 'Find a free video, course, book, or reference.',
    href: '/resources',
    icon: Library,
  },
  {
    title: 'FAQ',
    description: 'Quick answers about accounts, progress, and the site.',
    href: '/faq',
    icon: HelpCircle,
  },
]

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="relative flex-1 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/5 via-background to-violet-500/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Reveal>
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-sm dark:text-emerald-400">
                <Compass className="h-10 w-10" aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                404 · Page not found
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                This page took a wrong turn.
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
                The URL may be mistyped, the page may have moved, or the link may be out of date.
                Search the site or pick up from a useful starting point.
              </p>

              <Form
                action="/search"
                role="search"
                className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    type="search"
                    name="q"
                    placeholder="Search lessons and resources..."
                    className="h-11 pl-10"
                    aria-label="Search the site"
                  />
                </div>
                <Button type="submit" size="lg" className="h-11 gap-2">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Search
                </Button>
              </Form>

              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Button asChild variant="outline">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                    Go home
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/learn">
                    Browse curriculum
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-14 grid gap-4 sm:grid-cols-2">
              {startingPoints.map((point) => (
                <Link
                  key={point.href}
                  href={point.href}
                  className="group flex items-start gap-4 rounded-xl border border-border/50 bg-card/80 p-5 text-left shadow-sm backdrop-blur transition-all hover:border-border hover:shadow-md motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <point.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-semibold transition-colors group-hover:text-primary">
                      {point.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">{point.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              <Rocket className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              Looking for a learner project?{' '}
              <Link
                href="/community/showcase"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Browse the showcase
              </Link>
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </div>
  )
}
