import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function SearchLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="border-b border-border/50 bg-gradient-to-br from-emerald-500/5 via-background to-violet-500/5 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            <div className="mt-4 h-10 w-full max-w-xl animate-pulse rounded bg-muted" />
            <div className="mt-3 h-5 w-full max-w-2xl animate-pulse rounded bg-muted/70" />
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <div className="h-11 flex-1 animate-pulse rounded-md bg-muted" />
              <div className="h-11 w-full animate-pulse rounded-md bg-muted sm:w-28" />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8" aria-busy="true" aria-label="Loading search results">
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-8 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-border/50 bg-card p-4">
                <div className="flex gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                    <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-full animate-pulse rounded bg-muted/70" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
