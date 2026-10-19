import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowRight,
  BookOpen,
  Bug,
  ExternalLink,
  GitPullRequest,
  Globe2,
  HandHeart,
  MessageSquare,
  Rocket,
  Star,
} from 'lucide-react'
import { GithubIcon } from '@/components/icons/brand'
import { getAccent } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Contribute',
  description:
    'Help build MERN Learn: write lessons, add free resources, share projects, report bugs, or translate the curriculum.',
}

const ways = [
  {
    icon: BookOpen,
    title: 'Improve a lesson',
    description:
      'Fix an error, sharpen an explanation, add a worked example, or write a missing lesson. The authoring guide covers the format.',
    href: 'https://github.com/mern-learn/mern-learn/blob/main/docs/lesson-authoring.md',
    external: true,
    color: 'emerald',
  },
  {
    icon: ExternalLink,
    title: 'Add a free resource',
    description:
      'A tutorial, video, or reference that earned its place. Include why it helps and what it assumes.',
    href: '#resources',
    external: false,
    color: 'blue',
  },
  {
    icon: Rocket,
    title: 'Share a project',
    description:
      'The showcase is community content too. Post what you built and explain the part that took the longest.',
    href: '/community/showcase',
    external: false,
    color: 'violet',
  },
  {
    icon: Bug,
    title: 'Report a bug',
    description:
      'Broken code sample, incorrect claim, inaccessible control, or a 404. Include the page and what you expected.',
    href: 'https://github.com/mern-learn/mern-learn/issues',
    external: true,
    color: 'amber',
  },
  {
    icon: Globe2,
    title: 'Translate',
    description:
      'Lessons are plain MDX. Translate one lesson at a time and keep code samples untouched.',
    href: '#translate',
    external: false,
    color: 'rose',
  },
  {
    icon: MessageSquare,
    title: 'Help in discussions',
    description:
      'Answer a question under a lesson. Explaining a concept is the best test of whether you know it.',
    href: '/learn',
    external: false,
    color: 'slate',
  },
]

const steps = [
  {
    title: 'Pick one small thing',
    description: 'A typo, a confusing paragraph, one resource. Small pull requests get reviewed fastest.',
  },
  {
    title: 'Fork and branch',
    description: 'Create a branch named after the change, for example docs/fix-jwt-typo. Keep the diff focused.',
  },
  {
    title: 'Follow the lesson format',
    description: 'Lessons use MDX components and a fixed structure: hook, sections, examples, callouts, quiz, exercise, summary.',
  },
  {
    title: 'Open a pull request',
    description: 'Explain what changed and why. Link the lesson or issue. A maintainer reviews and merges.',
  },
]

const standards = [
  'Every code sample must run with the versions stated in the lesson.',
  'Prefer official documentation and free resources; no paywalled links.',
  'Teach one idea at a time, with a concrete example before theory.',
  'Accessibility is not optional: labels, focus states, and readable contrast.',
  'Credit sources and respect their licenses.',
]

export default function ContributePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border/50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Badge variant="outline" className="mb-4">
              <HandHeart className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Contribute
            </Badge>
            <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Make this{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
                better for the next learner
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              MERN Learn is free and open source. Every fix, explanation, resource, and shared
              project compounds — someone you will never meet gets unstuck because of it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="gap-2">
                <a href="https://github.com/mern-learn/mern-learn" target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="h-4 w-4" aria-hidden="true" />
                  Open the repository
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/community">
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  Community guidelines
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight">Ways to help</h2>
            <p className="mt-2 text-muted-foreground">No contribution is too small. Pick what fits your time.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ways.map((way) => (
                <Link
                  key={way.title}
                  href={way.href}
                  target={way.external ? '_blank' : undefined}
                  rel={way.external ? 'noopener noreferrer' : undefined}
                  className="group"
                >
                  <Card className="h-full transition-shadow group-hover:shadow-md">
                    <CardContent className="pt-6">
                      <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${getAccent(way.color).icon}`}>
                        <way.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="font-semibold">{way.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{way.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                        Get started
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/50 bg-muted/30 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">How a lesson contribution works</h2>
                <ol className="mt-6 space-y-5">
                  {steps.map((step, index) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <Card id="resources">
                <CardContent className="pt-6">
                  <h2 className="flex items-center gap-2 font-semibold">
                    <Star className="h-4 w-4 text-amber-500" aria-hidden="true" />
                    Resource standards
                  </h2>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {standards.map((standard) => (
                      <li key={standard} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" />
                        {standard}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-2">
              <Card id="translate">
                <CardContent className="pt-6">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <Globe2 className="h-5 w-5 text-rose-500" aria-hidden="true" />
                    Translating lessons
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Open an issue naming the lesson and language first, so two people do not translate
                    the same file. Keep code blocks, component names, and technical terms in English
                    unless the term is commonly translated.
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Translations live beside the English lesson and are linked from the lesson page once
                    reviewed.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <GitPullRequest className="h-5 w-5 text-blue-500" aria-hidden="true" />
                    Reviewing pull requests
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Running the code, checking claims against current docs, and flagging unclear
                    explanations is as valuable as writing. Comment with the specific sentence and a
                    suggested fix.
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-4 gap-2">
                    <a
                      href="https://github.com/mern-learn/mern-learn/pulls"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open pull requests
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-10 rounded-xl border border-border/50 bg-card p-6 text-center">
              <h2 className="text-xl font-bold tracking-tight">Not sure where to start?</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
                Open an issue describing what confused you. Confusion is a bug report — it usually
                points at the exact paragraph that needs work.
              </p>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild className="gap-2">
                  <a
                    href="https://github.com/mern-learn/mern-learn/issues/new"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <GithubIcon className="h-4 w-4" aria-hidden="true" />
                    Open an issue
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/community/showcase">
                    <Rocket className="h-4 w-4" aria-hidden="true" />
                    Share a project instead
                  </Link>
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
