import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProfileClient } from '@/components/community/profile-client'



export const metadata: Metadata = {
  title: 'Learner Profile',
  description: 'A Nyxora Sync community profile: shared projects, discussions, and learning progress.',
  robots: { index: false, follow: true },
}

// The profile id is only known at request time; render the shell on demand.

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 py-10 sm:py-14 pb-20 sm:pb-0">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ProfileClient id={id} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
