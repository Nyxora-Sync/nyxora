import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Compass, Home, BookOpen } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
            <Compass className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold">404</h1>
          <p className="mt-3 text-lg font-medium">Page not found</p>
          <p className="mt-2 text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/learn">
                <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />
                Browse Curriculum
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}