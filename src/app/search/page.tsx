import Link from 'next/link'
import Form from 'next/form'
import type { Metadata } from 'next'
import {
  BookOpen,
  ExternalLink,
  FileText,
  FolderTree,
  HelpCircle,
  Library,
  Rocket,
  Route,
  Search,
  Sparkles,
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { groupSearchResults, searchSite, type SearchResult, type SearchResultType } from '@/lib/search'
import { pageMetadata } from '@/lib/seo'
import { cn } from '@/lib/utils'

export const metadata: Metadata = pageMetadata({
  title: 'Search',
  description: 'Search lessons, modules, resources, pages, FAQ answers, and community projects on Nyxora Sync.',
  path: '/search',
  noIndex: true,
})

const typeIcons: Record<SearchResultType, typeof BookOpen> = {
  lesson: BookOpen,
  module: FolderTree,
  track: Route,
  page: FileText,
  faq: HelpCircle,
  resource: Library,
  project: Rocket,
}

const typeColors: Record<SearchResultType, string> = {
  lesson: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  module: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
  track: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  page: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
  faq: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  resource: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  project: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
}

const typeLabels: Record<SearchResultType, string> = {
  lesson: 'Lesson',
  module: 'Module',
  track: 'Track',
  page: 'Page',
  faq: 'FAQ',
  resource: 'Resource',
  project: 'Project',
}

const suggestions = [
  {
    title: 'Start with Web Foundations',
    description: 'New to HTML, CSS, and JavaScript? Begin at the beginning.',
    href: '/learn/beginner',
    icon: BookOpen,
  },
  {
    title: 'Jump into the MERN stack',
    description: 'Already know JavaScript? Go straight to Node, Express, MongoDB, and React.',
    href: '/learn/developer',
    icon: Route,
  },
  {
    title: 'Find a free resource',
    description: 'Search the directory of videos, docs, courses, books, and tools.',
    href: '/resources',
    icon: Library,
  },
  {
    title: 'Browse learner projects',
    description: 'See what other people built and leave useful feedback.',
    href: '/community/showcase',
    icon: Rocket,
  },
]

function ResultCard({ result, typeLabel }: { result: SearchResult; typeLabel: string }) {
  const Icon = typeIcons[result.type]

  const content = (
    <>
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl',
            typeColors[result.type]
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
              {typeLabel}
            </Badge>
            {result.meta && (
              <span className="text-xs text-muted-foreground">{result.meta}</span>
            )}
          </div>
          <h3 className="mt-2 font-semibold leading-snug transition-colors group-hover:text-primary">
            {result.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{result.description}</p>
        </div>
        <ExternalLink
          className={cn(
            'mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground/50 transition-colors group-hover:text-foreground',
            result.external ? 'opacity-100' : 'opacity-0'
          )}
          aria-hidden="true"
        />
      </div>
    </>
  )

  const className =
    'group block rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-border hover:shadow-md motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

  if (result.external) {
    return (
      <a
        href={result.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={result.href} className={className}>
      {content}
    </Link>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>
}) {
  const params = await searchParams
  const rawQuery = params.q
  const query = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery)?.trim().slice(0, 120) ?? ''
  const results = query ? await searchSite(query) : []
  const groups = groupSearchResults(results)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <section className="border-b border-border/50 bg-gradient-to-br from-emerald-500/5 via-background to-violet-500/5 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              <Search className="h-4 w-4" aria-hidden="true" />
              Site search
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Find the lesson, resource, or answer you need.
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Search across lessons, modules, tracks, the free resource directory, public pages,
              FAQ answers, and community projects.
            </p>

            <Form action="/search" role="search" className="mt-7 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Try “React hooks”, “MongoDB”, or “accessibility”..."
                  className="h-11 pl-10"
                  aria-label="Search the site"
                  autoComplete="off"
                />
              </div>
              <Button type="submit" size="lg" className="h-11 gap-2">
                <Search className="h-4 w-4" aria-hidden="true" />
                Search
              </Button>
            </Form>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          {query ? (
            <>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {results.length} {results.length === 1 ? 'result' : 'results'} for{' '}
                  <span className="font-medium text-foreground">“{query}”</span>
                </p>
                <Link
                  href="/search"
                  className="text-sm font-medium text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-400"
                >
                  Clear search
                </Link>
              </div>

              {results.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-dashed border-border/60 bg-muted/20 p-8 text-center sm:p-12">
                  <Sparkles className="mx-auto h-10 w-10 text-muted-foreground/60" aria-hidden="true" />
                  <h2 className="mt-4 text-xl font-semibold">No matches yet</h2>
                  <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
                    Try a shorter phrase, a technology name, or a topic like “forms”, “deployment”,
                    or “testing”. You can also browse the curriculum or ask in the community.
                  </p>
                  <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <Button asChild>
                      <Link href="/learn">Browse lessons</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/contact">Ask for help</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-8 space-y-10">
                  {groups.map((group) => (
                    <section key={group.type} aria-labelledby={`search-${group.type}`}>
                      <div className="mb-4 flex items-center gap-2">
                        <h2 id={`search-${group.type}`} className="text-lg font-semibold">
                          {group.label}
                        </h2>
                        <Badge variant="secondary" className="text-xs">
                          {group.results.length}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {group.results.map((result) => (
                          <ResultCard key={result.id} result={result} typeLabel={typeLabels[result.type]} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Not sure where to start?
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">Pick a path</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <Link
                    key={suggestion.href}
                    href={suggestion.href}
                    className="group rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-border hover:shadow-md motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <suggestion.icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-semibold group-hover:text-primary transition-colors">
                      {suggestion.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{suggestion.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
