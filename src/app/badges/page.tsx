import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Reveal } from '@/components/motion/reveal'
import { badgeDefinitions } from '@/lib/badges'
import { pageMetadata } from '@/lib/seo'
import { BadgesClientWrapper } from './badges-client-wrapper'

export const metadata = pageMetadata({
  title: 'Badge Collection',
  description: 'Every Nyxora Sync badge, what it takes to unlock, and the ones you have earned.',
  path: '/badges',
  noIndex: true,
})

export default function BadgesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="py-12 sm:py-16 border-b border-border/50">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">All Badges</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Browse all {badgeDefinitions.length} badges and track what you have unlocked.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="py-12 sm:py-16">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <BadgesClientWrapper />
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  )
}
