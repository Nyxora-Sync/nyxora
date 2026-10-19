import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { NewsletterForm } from '@/components/newsletter-form'
import { BellOff, BookOpen, CheckCircle2, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { GithubIcon } from '@/components/icons/brand'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Newsletter',
  description:
    'Occasional MERN Learn updates: new modules, major lesson rewrites, and community milestones. No spam, unsubscribe anytime.',
  path: '/newsletter',
})

const updates = [
  'A new module or a substantial batch of lessons.',
  'Major rewrites when a framework or API changes enough to invalidate examples.',
  'Occasional community milestones: a standout showcase project or a curriculum contribution.',
]

export default function NewsletterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border/50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Badge variant="outline" className="mb-4">
              <Mail className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Newsletter
            </Badge>
            <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              One email when something{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
                worth reading ships
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Curriculum updates, not a content calendar. If there is nothing useful to say, the list
              stays quiet.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold">Join the list</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter an email address you actually check. We will only use it for MERN Learn
                    updates.
                  </p>
                  <div className="mt-5 max-w-md">
                    <NewsletterForm />
                  </div>

                  <div className="mt-8 space-y-3 border-t border-border/50 pt-6">
                    <h3 className="text-sm font-semibold">What counts as an update</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {updates.map((update) => (
                        <li key={update} className="flex gap-2">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" aria-hidden="true" />
                          {update}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex items-start gap-2 rounded-lg border border-border/50 bg-muted/20 p-3 text-xs text-muted-foreground">
                    <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <span>
                      Your address is stored only for this list and is never sold. Read the{' '}
                      <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                        privacy policy
                      </Link>
                      .
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="flex items-center gap-2 font-semibold">
                      <BellOff className="h-4 w-4 text-blue-500" aria-hidden="true" />
                      What you will not get
                    </h2>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <li>Daily &ldquo;streak&rdquo; nudges or guilt email.</li>
                      <li>Ads, affiliate pitches, or your address sold to anyone.</li>
                      <li>A fixed schedule invented to keep open rates up.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h2 className="flex items-center gap-2 font-semibold">
                      <BookOpen className="h-4 w-4 text-violet-500" aria-hidden="true" />
                      Prefer to follow along?
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Watch the repository on GitHub and get changes as they land, without another
                      inbox subscription.
                    </p>
                    <Button asChild variant="outline" size="sm" className="mt-4 gap-2">
                      <a href="https://github.com/Nyxora-Sync/mern-learn" target="_blank" rel="noopener noreferrer">
                        <GithubIcon className="h-4 w-4" aria-hidden="true" />
                        Watch on GitHub
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <h2 className="flex items-center gap-2 font-semibold">
                      <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
                      Already subscribed?
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You can leave the list at any time. Unsubscribing deletes the stored address.
                    </p>
                    <div className="mt-4">
                      <NewsletterForm mode="unsubscribe" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
