import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { DashboardClient } from '@/components/dashboard-client'
import { Reveal } from '@/components/motion/reveal'
import { Button } from '@/components/ui/button'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'My Progress',
  description: 'Track your MERN learning journey: lessons completed, XP earned, badges unlocked, and streaks.',
  path: '/dashboard',
  noIndex: true,
})

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-12 sm:py-16 border-b border-border/50">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">My Progress</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Your learning journey at a glance. Data stored locally in your browser.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/learn">Browse Curriculum</Link>
              </Button>
            </div>
          </Reveal>
        </section>

        <section className="py-12 sm:py-16">
          <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <DashboardClient />
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  )
}