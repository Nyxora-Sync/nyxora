import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { NewsletterActionPage } from '@/components/newsletter-action-page'
import { NEWSLETTER_ENABLED } from '@/lib/newsletter-feature'

export const metadata: Metadata = {
  title: 'Unsubscribe from the newsletter',
  robots: { index: false, follow: false },
}

// The token only exists at request time; render this page on demand.

export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>
}) {
  if (!NEWSLETTER_ENABLED) redirect('/')

  const { token } = await searchParams
  return (
    <NewsletterActionPage
      mode="unsubscribe"
      token={typeof token === 'string' ? token : null}
    />
  )
}
