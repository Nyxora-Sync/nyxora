import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users, MessageCircle, Rocket, Heart, Star,
  ArrowRight, ExternalLink, Code2, Award, HandHeart,
} from 'lucide-react'
import { GithubIcon, DiscordIcon } from '@/components/icons/brand'
import { cn, getAccent } from '@/lib/utils'

export const metadata = {
  title: 'Community',
  description: 'Join the MERN Learn community: Discord, GitHub Discussions, project showcase, and study groups.',
}

const communityStats = [
  { value: '5,000+', label: 'Discord Members' },
  { value: '1,200+', label: 'GitHub Stars' },
  { value: '350+', label: 'Projects Shared' },
  { value: '24/7', label: 'Peer Support' },
]

const channels = [
  {
    name: 'Discord Server',
    description: 'Real-time chat, voice study rooms, code help, and weekly events.',
    icon: DiscordIcon,
    color: 'indigo',
    cta: 'Join Discord',
    href: 'https://discord.gg/mern-learn',
    external: true,
  },
  {
    name: 'GitHub Discussions',
    description: 'Q&A, show your work, feature requests, and lesson discussions.',
    icon: GithubIcon,
    color: 'slate',
    cta: 'Browse Discussions',
    href: 'https://github.com/mern-learn/mern-learn/discussions',
    external: true,
  },
  {
    name: 'Project Showcase',
    description: 'Share your MERN projects, get feedback, and find inspiration.',
    icon: Rocket,
    color: 'emerald',
    cta: 'View Showcase',
    href: '/community/showcase',
    external: false,
  },
  {
    name: 'Study Groups',
    description: 'Find study buddies at your level. Weekly accountability check-ins.',
    icon: Users,
    color: 'violet',
    cta: 'Find a Group',
    href: '/community/study-groups',
    external: false,
  },
]

const guidelines = [
  { title: 'Be kind', description: 'Everyone was a beginner once. No question is too basic.' },
  { title: 'Be specific', description: 'Share code snippets, error messages, and what you\'ve tried.' },
  { title: 'Give back', description: 'Answer questions once you\'ve learned something. Teaching cements learning.' },
  { title: 'No spam', description: 'No self-promotion, ads, or recruiting without permission.' },
  { title: 'Stay on topic', description: 'Keep discussions related to web development and MERN.' },
  { title: 'Credit sources', description: 'Link to tutorials and docs you reference.' },
]

const waysToContribute = [
  { icon: Code2, title: 'Contribute Lessons', description: 'Write or improve lesson content via pull request.', color: 'emerald' },
  { icon: ExternalLink, title: 'Submit Resources', description: 'Found an amazing free resource? Add it to the directory.', color: 'blue' },
  { icon: Star, title: 'Star the Repo', description: 'Help others discover the project on GitHub.', color: 'amber' },
  { icon: HandHeart, title: 'Translate', description: 'Help translate lessons into Spanish, Portuguese, Hindi, and more.', color: 'rose' },
]

export default function CommunityPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
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
              You don&apos;t have to learn alone. Join thousands of developers helping each other master the MERN stack.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-10 border-b border-border/50 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {communityStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Channels */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Where to Find Us</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {channels.map((channel) => (
                <Card key={channel.name} className="hover:shadow-lg transition-shadow">
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
                          <a
                            href={channel.href}
                            target={channel.external ? '_blank' : undefined}
                            rel={channel.external ? 'noopener noreferrer' : undefined}
                          >
                            {channel.cta}
                            <ArrowRight className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          </div>
        </section>

        {/* Contribute */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Heart className="h-6 w-6 text-rose-500" aria-hidden="true" />
                Ways to Give Back
              </h2>
              <p className="mt-3 text-muted-foreground">
                MERN Learn is 100% open source and community-driven. Every contribution helps.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {waysToContribute.map((way) => (
                <Card key={way.title}>
                  <CardContent className="pt-6">
                    <div
                      className={cn('flex h-11 w-11 items-center justify-center rounded-xl mb-4', getAccent(way.color).icon)}
                    >
                      <way.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-sm">{way.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{way.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Ready to join?</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              The Discord server is the fastest way to get help and meet other learners.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="gap-2">
                <a href="https://discord.gg/mern-learn" target="_blank" rel="noopener noreferrer">
                  <DiscordIcon className="h-5 w-5" aria-hidden="true" />
                  Join Discord Server
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2">
                <a href="https://github.com/mern-learn/mern-learn/discussions" target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="h-5 w-5" aria-hidden="true" />
                  GitHub Discussions
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}