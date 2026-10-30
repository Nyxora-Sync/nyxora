import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, ArrowRight, Users, Trophy, Zap, BookOpen, ExternalLink, Globe, Code2, Database, Award, Construction, AlertCircle, Cpu, Smartphone, FileCode, Rocket, Clock } from 'lucide-react'
import { GithubIcon } from '@/components/icons/brand'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroVisual } from '@/components/home/hero-visual'
import { LanguagePaths } from '@/components/language-paths'
import { SpecializationsBanner } from '@/components/specializations-banner'
import { Reveal } from '@/components/motion/reveal'
import { cn, getAccent } from '@/lib/utils'
import { tracks as curriculumTracks, trackCategories, getTrackDisplay } from '@/lib/curriculum'
import { pageMetadata } from '@/lib/seo'

const stats = [
  { value: '100%', label: 'Free Forever' },
  { value: '200+', label: 'Written Lessons' },
  { value: '500+', label: 'Free Resources' },
  { value: '12', label: 'Portfolio Projects' },
]

const primaryTracks = curriculumTracks
  .filter((t) => t.category === 'web-development' && t.key !== 'specializations')
  .slice(0, 2)

const features = [
  {
    icon: BookOpen,
    title: 'Written Lessons',
    description: '200+ free, structured lessons — no video walls, no fluff. Read at your own pace, on any connection.',
    color: 'emerald',
  },
  {
    icon: Zap,
    title: 'In-Browser Playgrounds',
    description: 'Run HTML, CSS, JS, React, Node, Express, Python instantly. Zero setup, works on slow connections.',
    color: 'amber',
  },
  {
    icon: Trophy,
    title: 'Portfolio Projects',
    description: 'Every track ends with a real, deployable capstone. Live demos, clean Git history, case study templates included.',
    color: 'violet',
  },
  {
    icon: Users,
    title: 'Community & Progress',
    description: 'Track completion, earn XP, unlock badges, get informal certificates. Discuss lessons, showcase projects.',
    color: 'blue',
  },
]

export const metadata = pageMetadata({
  title: 'Nyxora Sync — Free Learning Paths for Developers',
  description: 'Learn web development and programming languages with 200+ free written lessons, real portfolio projects, in-browser playgrounds, and progress tracking. 100% free, no paywalls.',
  path: '/',
  keywords: ['web development', 'programming languages', 'MERN', 'React', 'Node.js', 'free coding curriculum', 'portfolio projects'],
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
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 mb-6">
                <span className="relative flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                <span>New: Job-Ready Fast Track — portfolio projects included</span>
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-tight">
                Learn to build.{' '}
                <span className="bg-gradient-to-r from-emerald-500 via-violet-500 to-amber-500 bg-clip-text text-transparent">
                  Go deeper.
                </span>{' '}
                Master the craft.
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl">
                Master web development and programming languages through written lessons, real portfolio projects,
                interactive playgrounds, and progress tracking. 100% free, open source, no paywalls.
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

              {/* Stats Bar */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-center">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center gap-1">
                    <span className="text-3xl font-bold text-foreground sm:text-4xl">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-center text-xs text-muted-foreground/60 sm:gap-8">
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
                <div className="flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-rose-500" aria-hidden="true" />
                  <span>Showcase Certificates</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Learning Tracks */}
        <section className="py-20 sm:py-24 bg-muted/30">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Two paths. One goal: a hiring portfolio.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Both tracks end with deployable capstones. Pick based on your starting point.
              </p>
            </div>

            <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" delay={0.1}>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {primaryTracks.map((track) => {
                  const display = getTrackDisplay(track)
                  return (
                    <Link key={track.key} href={`/learn/${track.key}`} className="group">
                      <Card className={cn('relative overflow-hidden transition-all motion-safe:hover:-translate-y-1 hover:shadow-xl h-full border-border/50', track.isFastTrack && 'ring-1 ring-emerald-500/30')}>
                        <div
                          className={cn(
                            'absolute inset-x-0 top-0 h-1 bg-gradient-to-r',
                            getAccent(track.color).gradient
                          )}
                        />
                        {track.isFastTrack && (
                          <div className="absolute top-4 right-4 z-10">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                              <Zap className="h-3 w-3" aria-hidden="true" />
                              Fast Track
                            </span>
                          </div>
                        )}
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
                          {track.fastTrackDescription && (
                            <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                                {track.fastTrackDescription}
                              </p>
                            </div>
                          )}
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 rounded-lg bg-muted/50">
                              <p className="text-2xl font-bold">{display.duration}</p>
                              <p className="text-xs text-muted-foreground">Estimated Time</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                              <p className="text-2xl font-bold">{track.modules.length}</p>
                              <p className="text-xs text-muted-foreground">Core Modules</p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50">
                              <p className="text-2xl font-bold">{display.lessons}</p>
                              <p className="text-xs text-muted-foreground">Lessons</p>
                            </div>
                          </div>
                          <Separator />
                          <ul className="space-y-2" role="list">
                            {display.modulesList.map((module, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
                                {module.name}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter className="border-t-0 pt-0">
                          <Button className="w-full" variant={track.isFastTrack ? 'default' : 'outline'}>
                            {track.isFastTrack ? 'Start Fast Track' : 'Start Track'} <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  )
                })}
              </div>
              <SpecializationsBanner className="mt-8" />
            </Reveal>
          </Reveal>
        </section>

        {/* Key Features */}
        <section className="py-20 sm:py-24">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Built for how you actually learn
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                No video walls, no paywalls, no fluff. Just structured paths that respect your time and connection speed.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="group transition-all motion-safe:hover:-translate-y-0.5 hover:shadow-lg border-border/50">
                  <CardHeader>
                    <div className={cn('mb-3 flex h-12 w-12 items-center justify-center rounded-xl', getAccent(feature.color).icon)}>
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Language Paths (condensed) */}
        <section id="languages" className="py-20 sm:py-24 bg-muted/30">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  Programming Languages
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Go deeper than the framework
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Four complete beginner-to-mastery paths. Each level ends with a project, each path with a capstone.
                </p>
              </div>
              <Button asChild variant="outline" className="gap-2 self-start sm:self-auto">
                <Link href="/learn/languages">
                  Explore all language paths
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <LanguagePaths />
          </Reveal>
        </section>

        {/* What's Planned (condensed) */}
        <section id="planned" className="py-20 sm:py-24">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100/50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 mb-3">
                  <Construction className="h-3 w-3" aria-hidden="true" />
                  <span>Planned Content</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  What comes next
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Mobile, Data Science, Game Dev, Desktop Apps, and advanced language modules are planned.
                  <Link href="/planned" className="font-medium text-primary underline hover:text-primary-foreground ml-1">
                    View all planned tracks →
                  </Link>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'Mobile Development', desc: 'React Native, Expo, offline sync, store deployment', icon: Smartphone, color: 'violet' },
                { title: 'Data Science & AI', desc: 'Python data stack, ML, LLMs, RAG, MLOps', icon: FileCode, color: 'rose' },
                { title: 'Game Development', desc: '2D/3D engines, multiplayer, networking', icon: Globe, color: 'orange' },
                { title: 'Desktop Apps', desc: 'Tauri, Rust, system integration, distribution', icon: Globe, color: 'slate' },
                { title: 'Advanced Language Modules', desc: 'C kernel, C++ SIMD, C# Orleans, Python internals', icon: AlertCircle, color: 'blue' },
              ].map((item) => (
                <Card key={item.title} className="group transition-all motion-safe:hover:-translate-y-0.5 hover:shadow-lg h-full border-border/50">
                  <CardHeader>
                    <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-xl', getAccent(item.color).icon)}>
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">{item.desc}</CardDescription>
                  </CardContent>
                  <CardFooter className="border-t-0 pt-0">
                    <span className="text-xs text-muted-foreground">Planned</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Final CTA */}
        <section className="py-20 sm:py-24">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-violet-500/10 to-amber-500/10 border-border/50">
              <CardContent className="relative py-16 sm:py-24 text-center">
                <div className="mx-auto max-w-2xl">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Ready to start learning?
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Join learners worldwide building real projects — free, self-paced, and open source.
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