'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Play, FileText, BookOpen, Code2, GraduationCap, Book, Wrench, FolderGit2,
  ExternalLink, Search, Clock, X, SlidersHorizontal, CheckCircle2, type LucideIcon,
} from 'lucide-react'
import type { DirectoryResource } from '@/lib/resources-data'
import { resourceTopics, resourceTypes, resourceLevels } from '@/lib/resources-data'
import { cn, getDifficultyColor, getAccent } from '@/lib/utils'

const typeMeta: Record<string, { icon: LucideIcon; label: string; color: string }> = {
  video: { icon: Play, label: 'Video', color: 'rose' },
  article: { icon: FileText, label: 'Article', color: 'blue' },
  docs: { icon: BookOpen, label: 'Docs', color: 'emerald' },
  interactive: { icon: Code2, label: 'Interactive', color: 'violet' },
  course: { icon: GraduationCap, label: 'Course', color: 'amber' },
  book: { icon: Book, label: 'Book', color: 'slate' },
  project: { icon: FolderGit2, label: 'Project', color: 'indigo' },
  tool: { icon: Wrench, label: 'Tool', color: 'cyan' },
}

export function ResourcesClient({ resources }: { resources: DirectoryResource[] }) {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('all')
  const [type, setType] = useState('all')
  const [level, setLevel] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      if (topic !== 'all' && r.topic !== topic) return false
      if (type !== 'all' && r.type !== type) return false
      if (level !== 'all' && r.level !== level) return false
      if (query) {
        const q = query.toLowerCase()
        const haystack = `${r.title} ${r.description} ${r.provider} ${r.tags.join(' ')}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [resources, query, topic, type, level])

  const hasActiveFilters = topic !== 'all' || type !== 'all' || level !== 'all' || query !== ''

  const clearFilters = () => {
    setQuery('')
    setTopic('all')
    setType('all')
    setLevel('all')
  }

  return (
    <div>
      {/* Search bar */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            placeholder="Search resources by title, topic, or provider..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            aria-label="Search resources"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2 sm:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      <div className={cn('space-y-4 mb-8', !showFilters && 'hidden sm:block')}>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Topic</p>
          <div className="flex flex-wrap gap-2">
            {resourceTopics.map((t) => (
              <button
                key={t.key}
                onClick={() => setTopic(t.key)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  topic === t.key
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-accent'
                )}
                aria-pressed={topic === t.key}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {resourceTypes.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setType(t.key)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    type === t.key
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:bg-accent'
                  )}
                  aria-pressed={type === t.key}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Level</p>
            <div className="flex flex-wrap gap-2">
              {resourceLevels.map((l) => (
                <button
                  key={l.key}
                  onClick={() => setLevel(l.key)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    level === l.key
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:bg-accent'
                  )}
                  aria-pressed={level === l.key}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'resource' : 'resources'}
          {hasActiveFilters && (
            <button onClick={clearFilters} className="ml-3 inline-flex items-center gap-1 text-xs underline hover:text-foreground">
              <X className="h-3 w-3" aria-hidden="true" />
              Clear filters
            </button>
          )}
        </p>
      </div>

      {/* Resource grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-medium">No resources found</p>
          <p className="mt-2 text-muted-foreground">Try adjusting your search or filters.</p>
          <Button variant="outline" className="mt-6" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => {
            const meta = typeMeta[resource.type] || typeMeta.article
            const Icon = meta.icon
            const levelColor = getDifficultyColor(resource.level)
            return (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-border hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0', getAccent(meta.color).icon)}>
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                    {meta.label}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('text-[10px]', getAccent(levelColor).borderSoft, getAccent(levelColor).text)}
                  >
                    {resource.level}
                  </Badge>
                  <ExternalLink className="h-3.5 w-3.5 ml-auto text-muted-foreground/50 group-hover:text-foreground transition-colors" aria-hidden="true" />
                </div>
                <h3 className="font-semibold group-hover:text-primary transition-colors leading-snug">
                  {resource.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">
                  {resource.description}
                </p>
                <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span className="font-medium">{resource.provider}</span>
                  {resource.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {resource.duration}
                    </span>
                  )}
                  {resource.isVerified && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400" title="Verified quality">
                      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                      Verified
                    </span>
                  )}
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}