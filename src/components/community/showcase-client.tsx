'use client'


import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Loader2, Plus, Rocket, Search, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProjectCard } from '@/components/community/project-card'
import { ShareProjectDialog } from '@/components/community/share-project-dialog'
import type { ProjectListItem } from '@/lib/community-types'
import { cn } from '@/lib/utils'

type TrackFilter = 'all' | 'beginner' | 'developer'
type SortFilter = 'newest' | 'popular'

export function ShowcaseClient() {
  const { status } = useSession()
  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [track, setTrack] = useState<TrackFilter>('all')
  const [sort, setSort] = useState<SortFilter>('newest')
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 350)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ limit: '12', sort })
        if (track !== 'all') params.set('track', track)
        if (debouncedQuery) params.set('q', debouncedQuery)

        const response = await fetch(`/api/community/projects?${params.toString()}`, {
          signal: controller.signal,
        })
        const body = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(body?.error?.message ?? 'Could not load projects.')
        }
        setProjects(body.data as ProjectListItem[])
        setNextCursor(body.nextCursor ?? null)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Could not load projects.')
        setProjects([])
        setNextCursor(null)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [track, sort, debouncedQuery, reloadKey])

  async function loadMore() {
    if (!nextCursor || loadingMore) return
    setLoadingMore(true)
    try {
      const params = new URLSearchParams({ limit: '12', sort, cursor: nextCursor })
      if (track !== 'all') params.set('track', track)
      if (debouncedQuery) params.set('q', debouncedQuery)
      const response = await fetch(`/api/community/projects?${params.toString()}`)
      const body = await response.json().catch(() => null)
      if (!response.ok) throw new Error(body?.error?.message ?? 'Could not load more projects.')
      setProjects((current) => [...current, ...(body.data as ProjectListItem[])])
      setNextCursor(body.nextCursor ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load more projects.')
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 sm:w-64"
              aria-label="Search projects"
            />
          </div>

          <div className="flex rounded-lg border border-border/60 p-1" role="group" aria-label="Filter by track">
            {(['all', 'beginner', 'developer'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTrack(option)}
                aria-pressed={track === option}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                  track === option ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {option}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortFilter)}
            aria-label="Sort projects"
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          >
            <option value="newest">Newest first</option>
            <option value="popular">Most upvoted</option>
          </select>
        </div>

        {status === 'authenticated' ? (
          <Button onClick={() => setShareOpen(true)} className="gap-2">
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share your project
          </Button>
        ) : (
          <Button asChild variant="outline" className="gap-2">
            <Link href="/auth/signin?callbackUrl=/community/showcase">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Sign in to share
            </Link>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading projects">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-xl border border-border/50 bg-muted/40" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="font-semibold">The showcase is taking a break</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => setReloadKey((key) => key + 1)}>
            Try again
          </Button>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-12 text-center">
          <Rocket className="mx-auto h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-semibold">
            {debouncedQuery || track !== 'all' ? 'No projects match yet' : 'Be the first to share'}
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            {debouncedQuery || track !== 'all'
              ? 'Try a different search or track — or add the project that is missing.'
              : 'Built something with the MERN stack? A course project, a side app, a tool you use — share it and get feedback.'}
          </p>
          {status === 'authenticated' ? (
            <Button className="mt-5 gap-2" onClick={() => setShareOpen(true)}>
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Share your project
            </Button>
          ) : (
            <Button asChild className="mt-5">
              <Link href="/auth/signin?callbackUrl=/community/showcase">Sign in to share</Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {projects.length} project{projects.length === 1 ? '' : 's'}
            {debouncedQuery ? ` matching “${debouncedQuery}”` : ''}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {nextCursor && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={loadMore} disabled={loadingMore} className="gap-2">
                {loadingMore && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {loadingMore ? 'Loading...' : 'Load more projects'}
              </Button>
            </div>
          )}
        </>
      )}

      <ShareProjectDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        onCreated={(project) => {
          setProjects((current) => [project, ...current])
          setTrack('all')
          setQuery('')
        }}
      />
    </div>
  )
}
