import type { Metadata } from 'next'
import { NewsletterActionPage } from '@/components/newsletter-action-page'

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
  const { token } = await searchParams
  return (
    <NewsletterActionPage
      mode="confirm"
      token={typeof token === 'string' ? token : null}
    />
  )
}
