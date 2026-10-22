import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/motion/reveal'
import { Rocket, Sparkles } from 'lucide-react'
import { pageMetadata } from '@/lib/seo'
import { ShowcaseClientWrapper } from './showcase-client-wrapper'

export const metadata = pageMetadata({
  title: 'Project Showcase',
  description:
    'Real projects built by Nyxora Sync learners. Browse apps, read how they were made, leave feedback, and share your own.',
  path: '/community/showcase',
  keywords: ['developer project showcase', 'MERN projects', 'student portfolio projects'],
})

export default function ShowcasePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="border-b border-border/50 py-12 sm:py-16">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Badge variant="outline" className="mb-4">
              <Rocket className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Project Showcase
            </Badge>
            <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Proof that you{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
                actually built it
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Course projects, side apps, tools, and experiments from other learners. Read what
              they struggled with, ask how it works, and share the thing you are proud of.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
              Rough edges welcome — finished is a direction, not a requirement.
            </p>
          </Reveal>
        </section>

        <section className="py-10 sm:py-12">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ShowcaseClientWrapper />
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  )
}
