import Link from 'next/link'
import { ArrowRight, BookOpen, Code2, Layers, Rocket } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { LanguagePaths } from '@/components/language-paths'
import { Reveal } from '@/components/motion/reveal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { tracks } from '@/lib/curriculum'
import { pageMetadata } from '@/lib/seo'

const languages = tracks.filter((track) => track.category === 'programming-languages')

const lessonCount = new Set(
  languages.flatMap((track) =>
    track.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id))
  )
).size

const moduleCount = languages.reduce((sum, track) => sum + track.modules.length, 0)

export const metadata = pageMetadata({
  title: 'Programming Language Paths',
  description: `Learn C, C++, C#, and Python from beginner to mastery with ${lessonCount} free written lessons, real projects, and a structured path through each language.`,
  path: '/learn/languages',
  keywords: [
    'learn C',
    'learn C++',
    'learn C#',
    'learn Python',
    'programming languages',
    'free coding curriculum',
    'beginner to advanced',
  ],
})

const principles = [
  {
    icon: Layers,
    title: 'Three deliberate levels',
    description:
      'Every path starts with foundations, moves into professional practice, and finishes with mastery topics and a capstone. No random tutorial order.',
  },
  {
    icon: Code2,
    title: 'Written, not just linked',
    description:
      'The core explanation, runnable examples, common mistakes, and practice work are on the page. External documentation is there for depth, not as a substitute.',
  },
  {
    icon: Rocket,
    title: 'Projects at every level',
    description:
      'Each level ends with a project that forces you to combine the ideas: a calculator, a contact book, an API, a scheduler, a pipeline, or a small server.',
  },
]

export default function LanguagesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="border-b border-border/50 bg-muted/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/learn"
              className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              ← All learning paths
            </Link>
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-4">
                <BookOpen className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Programming Languages
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Learn the language{' '}
                <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-amber-500 bg-clip-text text-transparent">
                  behind the abstraction
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
                Four complete paths from first program to mastery. Learn how memory, types,
                concurrency, and production tooling actually work — then build something with each
                language.
              </p>
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span>
                  <strong className="text-2xl font-bold text-foreground">{languages.length}</strong>{' '}
                  languages
                </span>
                <span>
                  <strong className="text-2xl font-bold text-foreground">{moduleCount}</strong>{' '}
                  levels
                </span>
                <span>
                  <strong className="text-2xl font-bold text-foreground">{lessonCount}</strong>{' '}
                  written lessons
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <LanguagePaths />
          </Reveal>
        </section>

        <section className="border-y border-border/50 bg-muted/30 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How every language path works
              </h2>
              <p className="mt-4 text-muted-foreground">
                The syntax changes. The learning structure does not.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {principles.map((principle) => (
                <Card key={principle.title} className="h-full">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <principle.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold">{principle.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{principle.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight">Not sure where to start?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Start with Python if you want the gentlest on-ramp. Choose C if you want to understand
              memory and the machine. Choose C++ for performance-sensitive systems, or C# for a
              batteries-included path into application and web development.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild className="gap-2">
                <Link href="/learn/python">
                  Start with Python
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/learn">See the full catalog</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              More language and stack paths are added as complete curricula, never as empty
              placeholders.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
