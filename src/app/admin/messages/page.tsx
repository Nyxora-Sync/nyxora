import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, Clock, Inbox, Mail, ShieldCheck } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ContactMessageActions } from '@/components/admin/contact-message-actions'
import { auth } from '@/lib/auth/auth'
import { isAdmin } from '@/lib/admin'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Contact inbox',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 20

type InboxFilter = 'all' | 'open' | 'handled'

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function readableDate(date: Date): string {
  return `${date.toISOString().replace('T', ' ').slice(0, 16)} UTC`
}

function pageHref(page: number, filter: InboxFilter): string {
  const params = new URLSearchParams()
  if (filter !== 'all') params.set('filter', filter)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/admin/messages?${query}` : '/admin/messages'
}

export default async function ContactInboxPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[]; filter?: string | string[] }>
}) {
  const session = await auth()
  if (!isAdmin(session?.user?.email)) notFound()
  if (!process.env.DATABASE_URL) notFound()

  const params = await searchParams
  const filterParam = firstParam(params.filter)
  const filter: InboxFilter =
    filterParam === 'open' || filterParam === 'handled' ? filterParam : 'all'
  const requestedPage = Number.parseInt(firstParam(params.page) ?? '1', 10)
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1

  const where =
    filter === 'open'
      ? { handled: false }
      : filter === 'handled'
        ? { handled: true }
        : {}

  const [total, openCount] = await Promise.all([
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.count({ where: { handled: false } }),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const messages = await prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  })

  const emailNotifications = Boolean(process.env.EMAIL_SERVER_HOST)

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
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact inbox</h1>
            <p className="max-w-2xl text-muted-foreground">
              Private messages sent through the contact form. Reply by email, then mark the message
              handled so it disappears from the open queue.
            </p>
            <p className="text-xs text-muted-foreground">
              Signed in as {session?.user?.email} · {openCount} unhandled · {total}{' '}
              {filter === 'all' ? 'total' : filter === 'open' ? 'open' : 'handled'}
            </p>
          </div>

          {!emailNotifications && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
              <Mail className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium">Email notifications are not configured</p>
                <p className="mt-1">
                  Messages are still stored safely. Check this inbox instead of relying on email.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant={filter === 'all' ? 'default' : 'outline'}>
                <Link href={pageHref(1, 'all')}>All messages</Link>
              </Button>
              <Button asChild size="sm" variant={filter === 'open' ? 'default' : 'outline'}>
                <Link href={pageHref(1, 'open')}>Open {openCount > 0 ? `(${openCount})` : ''}</Link>
              </Button>
              <Button asChild size="sm" variant={filter === 'handled' ? 'default' : 'outline'}>
                <Link href={pageHref(1, 'handled')}>Handled</Link>
              </Button>
            </div>
            <Badge variant="secondary" className="gap-1.5">
              <Inbox className="h-3.5 w-3.5" aria-hidden="true" />
              {total} in this view
            </Badge>
          </div>

          {messages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
                <Inbox className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
                <div>
                  <p className="font-medium">No messages here</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {filter === 'open'
                      ? 'Everything is handled. Nice.'
                      : 'Messages sent through the contact form will appear here.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className={message.handled ? 'opacity-75' : undefined}>
                  <CardContent className="pt-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold">{message.name?.trim() || 'Anonymous'}</h2>
                          <Badge variant="outline" className="capitalize">
                            {message.topic}
                          </Badge>
                          {message.handled ? (
                            <Badge variant="secondary" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                              Handled
                            </Badge>
                          ) : (
                            <Badge variant="default" className="gap-1">
                              <Clock className="h-3 w-3" aria-hidden="true" />
                              Open
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {readableDate(message.createdAt)} · {message.email}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-start gap-2">
                        <Button asChild size="sm" variant="outline" className="gap-2">
                          <a
                            href={`mailto:${message.email}?subject=${encodeURIComponent(
                              `Re: [Nyxora Sync] ${message.topic} message`
                            )}`}
                          >
                            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                            Reply
                          </a>
                        </Button>
                        <ContactMessageActions id={message.id} handled={message.handled} />
                      </div>
                    </div>
                    <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed">
                      {message.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              {currentPage > 1 ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={pageHref(currentPage - 1, filter)}>Previous</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
              )}
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Button asChild variant="outline" size="sm">
                  <Link href={pageHref(currentPage + 1, filter)}>Next</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
