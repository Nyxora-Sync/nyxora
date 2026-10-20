import Link from 'next/link'
import { MailCheck, MailX, TriangleAlert } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { NewsletterTokenAction } from '@/components/newsletter-token-action'

export function NewsletterActionPage({
  mode,
  token,
}: {
  mode: 'confirm' | 'unsubscribe'
  token: string | null
}) {
  const confirming = mode === 'confirm'

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 py-12 sm:py-20">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <Card className="overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-violet-500" />
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="space-y-3">
                <Badge variant="outline" className="gap-1.5">
                  {confirming ? (
                    <MailCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <MailX className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  Newsletter
                </Badge>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {confirming ? 'Confirm your subscription' : 'Unsubscribe from the newsletter'}
                </h1>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {confirming
                    ? 'Confirm your email address to join the Nyxora Sync newsletter. We send occasional notes about new modules, major lesson rewrites, and community work — never a daily drip.'
                    : 'This removes your address from the newsletter list immediately. You will not receive any more curriculum updates.'}
                </p>
              </div>

              {token ? (
                <NewsletterTokenAction mode={mode} token={token} />
              ) : (
                <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm">
                  <TriangleAlert
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-medium text-foreground">This link is missing its token</p>
                    <p className="mt-1 text-muted-foreground">
                      Open the link from your email again, or use the{' '}
                      <Link href="/newsletter" className="underline hover:text-foreground">
                        newsletter page
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              )}

              <p className="border-t border-border/60 pt-4 text-xs text-muted-foreground">
                Questions about how your address is stored? Read the{' '}
                <Link href="/privacy" className="underline hover:text-foreground">
                  privacy policy
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
