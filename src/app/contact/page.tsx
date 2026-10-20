import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ContactForm } from '@/components/contact-form'
import {
  ArrowRight,
  BookOpen,
  Bug,
  Clock,
  Lock,
  Mail,
  MessageSquare,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { GithubIcon } from '@/components/icons/brand'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description:
    'Contact the Nyxora Sync maintainers: lesson corrections, bugs, privacy requests, code of conduct reports, and security concerns.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="border-b border-border/50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Badge variant="outline" className="mb-4">
              <Mail className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Contact
            </Badge>
            <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Tell us what is{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
                broken, confusing, or missing
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              A lesson that did not land is useful feedback. So is a typo, an outdated API, or a
              community problem. Pick the route that fits.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold">Send a private message</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This form is for messages that should not be public: account requests, conduct
                    reports, security details, or feedback you would rather not post.
                  </p>
                  <div className="mt-6">
                    <ContactForm />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="flex items-center gap-2 font-semibold">
                      <MessageSquare className="h-4 w-4 text-blue-500" aria-hidden="true" />
                      Lesson questions
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Ask under the lesson itself. The answer stays searchable for the next learner,
                      which a private email does not.
                    </p>
                    <Button asChild variant="outline" size="sm" className="mt-4 gap-2">
                      <Link href="/learn">
                        <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                        Browse lessons
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h2 className="flex items-center gap-2 font-semibold">
                      <Bug className="h-4 w-4 text-rose-500" aria-hidden="true" />
                      Bugs and broken pages
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      A public issue is best for reproducible bugs: include the page, expected result,
                      actual result, and browser. Do not paste secrets or personal data.
                    </p>
                    <Button asChild variant="outline" size="sm" className="mt-4 gap-2">
                      <a
                        href="https://github.com/Nyxora-Sync/mern-learn/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GithubIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        Open an issue
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-rose-500/20 bg-rose-500/5">
                  <CardContent className="pt-6">
                    <h2 className="flex items-center gap-2 font-semibold">
                      <ShieldAlert className="h-4 w-4 text-rose-500" aria-hidden="true" />
                      Security concerns
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Do not disclose a vulnerability in a public issue. Use the repository&apos;s
                      private security reporting tab and include reproduction steps and impact.
                    </p>
                    <Button asChild variant="outline" size="sm" className="mt-4 gap-2">
                      <a
                        href="https://github.com/Nyxora-Sync/mern-learn/security"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                        Security reporting
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h2 className="flex items-center gap-2 font-semibold">
                      <Users className="h-4 w-4 text-violet-500" aria-hidden="true" />
                      Community
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Share a project, leave feedback, or read the rules for every community space.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm" className="gap-2">
                        <Link href="/community/showcase">
                          Showcase
                          <ArrowRight className="h-3 w-3" aria-hidden="true" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="sm">
                        <Link href="/code-of-conduct">Code of Conduct</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-start gap-2 px-1 text-xs text-muted-foreground">
                  <Clock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                  <p>
                    Replies are best effort, usually within a week. This is a free project, not a
                    support desk or a one-to-one tutoring service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
