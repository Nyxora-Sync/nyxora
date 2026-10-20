import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CommunityStats } from '@/components/community/community-stats'
import { Reveal } from '@/components/motion/reveal'
import {
  Users, MessageCircle, Rocket, Heart, Star,
  ArrowRight, ExternalLink, Code2, HandHeart,
} from 'lucide-react'
import { GithubIcon } from '@/components/icons/brand'
import { cn, getAccent } from '@/lib/utils'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Community',
  description: 'Learn MERN alongside other developers: lesson discussions, project showcase, public profiles, and open-source contribution.',
  path: '/community',
  keywords: ['MERN community', 'developer showcase', 'learn to code with others'],
})

const channels = [
  {
    name: 'Project Showcase',
    description: 'Real apps built by learners. Ask how they work, leave feedback, or share your own.',
    icon: Rocket,
    color: 'emerald',
    cta: 'Browse projects',
    href: '/community/showcase',
    external: false,
  },
  {
    name: 'Lesson Discussions',
    description: 'Every lesson has a thread for questions, corrections, and the context that did not fit in the lesson.',
    icon: MessageCircle,
    color: 'blue',
    cta: 'Open a lesson',
    href: '/learn',
    external: false,
  },
  {
    name: 'GitHub',
    description: 'Source code, issues, and the roadmap behind the curriculum.',
    icon: GithubIcon,
    color: 'slate',
    cta: 'Open the repository',
    href: 'https://github.com/Nyxora-Sync/mern-learn',
    external: true,
  },
  {
    name: 'Contribute',
    description: 'Fix a typo, add a resource, write a lesson, or review someone else\'s pull request.',
    icon: HandHeart,
    color: 'rose',
    cta: 'Start contributing',
    href: '/contribute',
    external: false,
  },
]

const guidelines = [
  { title: 'Be kind', description: 'Everyone was a beginner once. No question is too basic.' },
  { title: 'Be specific', description: 'Share code snippets, error messages, and what you\'ve tried.' },
  { title: 'Give back', description: 'Answer questions once you\'ve learned something. Teaching cements learning.' },
  { title: 'No spam', description: 'Share projects in the showcase; don\'t drop links in every thread.' },
  { title: 'Stay on topic', description: 'Keep discussions related to web development and MERN.' },
  { title: 'Credit sources', description: 'Link to tutorials and docs you reference.' },
]

const waysToContribute = [
  { icon: Code2, title: 'Contribute Lessons', description: 'Write or improve lesson content via pull request.', color: 'emerald', href: '/contribute' },
  { icon: ExternalLink, title: 'Submit Resources', description: 'Found an amazing free resource? Add it to the directory.', color: 'blue', href: '/contribute#resources' },
  { icon: Star, title: 'Star the Repo', description: 'Help others discover the project on GitHub.', color: 'amber', href: 'https://github.com/Nyxora-Sync/mern-learn' },
  { icon: HandHeart, title: 'Translate', description: 'Help translate lessons into Spanish, Portuguese, Hindi, and more.', color: 'rose', href: '/contribute#translate' },
]

export default function CommunityPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="py-12 sm:py-16 border-b border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="outline" className="mb-4">
              <Users className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
              Community
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Learn{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
                Together
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Learning alone is slower. Ask questions under lessons, share what you build, and help
              the next person over the wall.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-10 border-b border-border/50 bg-muted/30">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CommunityStats />
          </Reveal>
        </section>

        {/* Channels */}
        <section className="py-12 sm:py-16">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Where the community lives</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {channels.map((channel) => (
                <Card key={channel.name} className="transition-all motion-safe:hover:-translate-y-0.5 hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn('flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl', getAccent(channel.color).icon)}
                      >
                        <channel.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{channel.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{channel.description}</p>
                        <Button variant="outline" size="sm" className="mt-4" asChild>
                          <Link
                            href={channel.href}
                            target={channel.external ? '_blank' : undefined}
                            rel={channel.external ? 'noopener noreferrer' : undefined}
                          >
                            {channel.cta}
                            <ArrowRight className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Community Guidelines */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight">Community Guidelines</h2>
              <p className="mt-3 text-muted-foreground">
                We keep this community welcoming, helpful, and focused.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {guidelines.map((g) => (
                <div key={g.title} className="rounded-xl border border-border/50 bg-card p-5">
                  <h3 className="font-semibold">{g.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Contribute */}
        <section className="py-12 sm:py-16">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Heart className="h-6 w-6 text-rose-500" aria-hidden="true" />
                Ways to Give Back
              </h2>
              <p className="mt-3 text-muted-foreground">
                Nyxora Sync is 100% open source and community-driven. Every contribution helps.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {waysToContribute.map((way) => (
                <Link
                  key={way.title}
                  href={way.href}
                  target={way.href.startsWith('http') ? '_blank' : undefined}
                  rel={way.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group"
                >
                  <Card className="h-full transition-all motion-safe:hover:-translate-y-0.5 group-hover:shadow-md">
                    <CardContent className="pt-6">
                      <div
                        className={cn('flex h-11 w-11 items-center justify-center rounded-xl mb-4', getAccent(way.color).icon)}
                      >
                        <way.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="font-semibold text-sm">{way.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{way.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                        Learn more
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Ready to join?</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Share what you built, ask the question you are stuck on, or help the next learner.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2">
                <Link href="/community/showcase">
                  <Rocket className="h-5 w-5" aria-hidden="true" />
                  Explore the showcase
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2">
                <Link href="/learn">
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  Start a lesson
                </Link>
              </Button>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  )
}