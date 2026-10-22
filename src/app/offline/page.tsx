import type { Metadata } from 'next'
import Link from 'next/link'
import { WifiOff } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'You are offline',
  robots: { index: false, follow: false },
}

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="max-w-md space-y-5 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <WifiOff className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">You are offline</h1>
            <p className="text-muted-foreground">
              Nyxora Sync needs a connection for lessons and community pages. Your saved
              progress will sync when you reconnect.
            </p>
          </div>
          <Button asChild>
            <Link href="/">Try again</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
