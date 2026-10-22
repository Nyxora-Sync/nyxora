'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Home, RotateCcw, AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="relative flex-1 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-rose-500/5 via-background to-rose-500/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto flex min-h-full max-w-4xl flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-600 shadow-sm dark:text-rose-400">
              <AlertCircle className="h-10 w-10" aria-hidden="true" />
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              500 · Server Error
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Something went wrong.
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
              We encountered an unexpected error and logged the details. Please try again in a few
              moments or go back to the homepage.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button onClick={() => reset()} className="gap-2">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Try again
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                  Go home
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 flex-shrink-0"
                aria-hidden="true"
              >
                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09" />
              </svg>
              Looking for a learner project?{' '}
              <Link
                href="/community/showcase"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Browse the showcase
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
