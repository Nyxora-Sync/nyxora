import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProjectDetailClient } from '@/components/community/project-detail-client'



export const metadata: Metadata = {
  title: 'Project',
  description: 'A project shared by a Nyxora Sync learner.',
  robots: { index: false, follow: true },
}

// The project id is only known at request time; render the shell on demand.

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ProjectDetailClient id={id} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
