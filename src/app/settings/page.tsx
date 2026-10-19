import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SettingsClient } from '@/components/settings/settings-client'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your MERN Learn profile, links, and privacy preferences.',
}

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="mt-2 text-muted-foreground">
              Your profile, links, and what other learners can see.
            </p>
          </div>
          <SettingsClient />
        </div>
      </main>
      <Footer />
    </div>
  )
}
