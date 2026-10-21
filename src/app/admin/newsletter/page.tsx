import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Mail, ShieldCheck, TriangleAlert } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { NewsletterAdminForm } from '@/components/admin/newsletter-admin-form'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import { isNewsletterAdmin, newsletterEmailConfigured } from '@/lib/newsletter'
import { NEWSLETTER_ENABLED } from '@/lib/newsletter-feature'

export const metadata: Metadata = {
  title: 'Newsletter admin',
  robots: { index: false, follow: false },
}

// Authentication and subscriber counts are request-specific.

function readableDate(date: Date): string {
  return `${date.toISOString().replace('T', ' ').slice(0, 16)} UTC`
}

export default async function NewsletterAdminPage() {
  if (!NEWSLETTER_ENABLED) notFound()

  const session = await auth()
  if (!isNewsletterAdmin(session?.user?.email)) notFound()
  if (!process.env.DATABASE_URL) notFound()

  const [confirmedCount, pendingCount, recentSends] = await Promise.all([
    prisma.newsletterSubscriber.count({ where: { confirmedAt: { not: null } } }),
    prisma.newsletterSubscriber.count({ where: { confirmedAt: null } }),
    prisma.newsletterSend.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
  ])

  const emailReady = newsletterEmailConfigured()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 py-10 sm:py-14 pb-20 sm:pb-0">
        <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            <Badge variant="outline" className="gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Maintainer only
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Newsletter admin</h1>
            <p className="max-w-2xl text-muted-foreground">
              Write one plain-text email and send it to confirmed subscribers. Every email includes
              a signed unsubscribe link. Nothing is scheduled or retried automatically.
            </p>
            <p className="text-xs text-muted-foreground">
              Signed in as {session?.user?.email} · {confirmedCount} confirmed · {pendingCount}{' '}
              unconfirmed
            </p>
          </div>

          {!emailReady && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
              <TriangleAlert className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium">Email delivery is not configured</p>
                <p className="mt-1">
                  Set <code>EMAIL_SERVER_HOST</code>, <code>EMAIL_SERVER_PORT</code>, and{' '}
                  <code>EMAIL_FROM</code> before sending. Newsletter signup will stay unavailable
                  until then.
                </p>
              </div>
            </div>
          )}

          <Card>
            <CardContent className="pt-6">
              <div className="mb-6 flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                <h2 className="text-lg font-semibold">Compose</h2>
              </div>
              <NewsletterAdminForm
                adminEmail={session!.user.email!}
                confirmedCount={confirmedCount}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold">Recent sends</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Metadata only. The message body is not stored. Test sends are included.
              </p>
              {recentSends.length === 0 ? (
                <p className="mt-4 rounded-lg border border-dashed border-border/70 px-3 py-6 text-center text-sm text-muted-foreground">
                  No newsletter emails have been sent yet.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-border/60 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-2 py-2 font-medium">Subject</th>
                        <th className="px-2 py-2 font-medium">Type</th>
                        <th className="px-2 py-2 font-medium">Recipients</th>
                        <th className="px-2 py-2 font-medium">Failed</th>
                        <th className="px-2 py-2 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSends.map((send) => (
                        <tr key={send.id} className="border-b border-border/40 last:border-0">
                          <td className="max-w-xs truncate px-2 py-3">{send.subject}</td>
                          <td className="px-2 py-3">
                            <Badge variant={send.isTest ? 'secondary' : 'outline'}>
                              {send.isTest ? 'Test' : 'Broadcast'}
                            </Badge>
                          </td>
                          <td className="px-2 py-3">{send.recipientCount}</td>
                          <td className="px-2 py-3">{send.failedCount}</td>
                          <td className="whitespace-nowrap px-2 py-3 text-muted-foreground">
                            {readableDate(send.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardContent className="pt-6">
              <h2 className="text-sm font-semibold">How the list works</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Signups are unconfirmed until the address opens its confirmation email.</li>
                <li>Only confirmed addresses are included in a broadcast.</li>
                <li>
                  Unsubscribe links are signed, work from old emails, and delete the address
                  immediately.
                </li>
                <li>
                  Each real send is limited to 500 recipients and one broadcast per minute to avoid
                  accidental duplicate sends.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
