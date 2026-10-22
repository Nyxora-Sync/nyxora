import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { AdminReportsClient } from '@/components/admin/reports-client'
import { auth } from '@/lib/auth/auth'
import { isAdmin } from '@/lib/admin'

export const metadata: Metadata = {
  title: 'Moderation queue',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminReportsPage() {
  const session = await auth()
  if (!isAdmin(session?.user?.email)) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 py-10 pb-20 sm:py-14 sm:pb-0">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <AdminReportsClient />
        </div>
      </main>
      <Footer />
    </div>
  )
}
