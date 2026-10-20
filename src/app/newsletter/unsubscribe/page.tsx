import type { Metadata } from 'next'
import { NewsletterActionPage } from '@/components/newsletter-action-page'

export const metadata: Metadata = {
  title: 'Unsubscribe from the newsletter',
  robots: { index: false, follow: false },
}

// The token only exists at request time; render this page on demand.
export const instant = false

export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>
}) {
  const { token } = await searchParams
  return (
    <NewsletterActionPage
      mode="unsubscribe"
      token={typeof token === 'string' ? token : null}
    />
  )
}
