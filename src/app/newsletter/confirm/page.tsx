import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { NewsletterActionPage } from '@/components/newsletter-action-page'
import { NEWSLETTER_ENABLED } from '@/lib/newsletter-feature'

export const metadata: Metadata = {
  title: 'Confirm newsletter subscription',
  robots: { index: false, follow: false },
}

// The token only exists at request time; render this page on demand.
export const instant = false

export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>
}) {
  if (!NEWSLETTER_ENABLED) redirect('/')

  const { token } = await searchParams
  return (
    <NewsletterActionPage
      mode="confirm"
      token={typeof token === 'string' ? token : null}
    />
  )
}
