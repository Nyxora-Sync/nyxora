import Link from 'next/link'
import type { Metadata } from 'next'
import { ChevronDown, HelpCircle, MessageCircle, Sparkles } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { FaqHashOpener } from '@/components/faq/faq-hash-opener'
import { JsonLd } from '@/components/structured-data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FAQ_LAST_REVIEWED, faqSections } from '@/lib/faq'
import { absoluteUrl, pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Frequently Asked Questions',
  description:
    'Answers about MERN Learn: cost, accounts, tracks, progress, the playground, contributing, accessibility, and licenses.',
  path: '/faq',
})

const reviewedDate = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
  timeZone: 'UTC',
}).format(new Date(`${FAQ_LAST_REVIEWED}T00:00:00Z`))

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  url: absoluteUrl('/faq'),
  dateModified: `${FAQ_LAST_REVIEWED}T00:00:00.000Z`,
  mainEntity: faqSections.flatMap((section) =>
    section.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    }))
  ),
}

export default function FaqPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={faqSchema} />
      <FaqHashOpener />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="border-b border-border/50 bg-gradient-to-br from-amber-500/5 via-background to-emerald-500/5 py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Badge variant="outline" className="mb-4">
              <HelpCircle className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Help
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Short answers about the lessons, accounts, progress, community, and the limits of a
              free curriculum. If your question is not here, the contact form is open.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Last reviewed <time dateTime={FAQ_LAST_REVIEWED}>{reviewedDate}</time>
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="space-y-12">
            {faqSections.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
                <div className="mb-5">
                  <h2 id={`${section.id}-heading`} className="text-2xl font-bold tracking-tight">
                    {section.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
                </div>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <details
                      key={item.slug}
                      id={item.slug}
                      className="faq-item group scroll-mt-24 rounded-xl border border-border/60 bg-card transition-colors open:border-border open:bg-card"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 font-medium transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                        <span>{item.question}</span>
                        <ChevronDown
                          className="faq-chevron h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform"
                          aria-hidden="true"
                        />
                      </summary>
                      <div className="faq-answer border-t border-border/50 px-5 pb-5 pt-4">
                        <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                        {item.related && (
                          <Link
                            href={item.related.href}
                            className="mt-3 inline-flex text-sm font-medium text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
                          >
                            {item.related.label}
                          </Link>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="mt-14 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Still stuck?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask in the lesson discussion, open an issue for a content or code problem, or send
                  a private message about privacy and account requests.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button asChild size="sm">
                    <Link href="/contact">Contact the maintainers</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/community">Browse the community</Link>
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Search can find individual answers across the whole site.
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
