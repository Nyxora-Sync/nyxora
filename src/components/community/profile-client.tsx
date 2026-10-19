'use client'


import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Award,
  BookOpen,
  ExternalLink,
  Flame,
  MessageSquare,
  Pencil,
  Rocket,
  ThumbsUp,
  Zap,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { ProjectListItem } from '@/lib/community-types'
import { shortDate, timeAgo } from '@/lib/time'
import { getAccent } from '@/lib/utils'
import { GithubIcon } from '@/components/icons/brand'

interface ProfileResponse {
  id: string
  name: string | null
  image: string | null
  bio: string | null
  website: string | null
  githubUrl: string | null
  twitterUrl: string | null
  createdAt: string
  isSelf: boolean
  progress: {
    xp: number
    streakCurrent: number
    streakLongest: number
    lessonsCompleted: number
    badges: {
      key: string
      name: string
      description: string
      icon: string
      category: string
      earnedAt: string
    }[]
  } | null
  projects: ProjectListItem[]
  contributions: {
    projects: number
    comments: number
    upvotes: number
  }
}

function displayName(user: { name: string | null }): string {
  return user.name?.trim() || 'Anonymous learner'
}

export function ProfileClient({ id }: { id: string }) {
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/community/people/${id}`, {
          signal: controller.signal,
        })
        const payload = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(payload?.error?.message ?? 'Could not load this profile.')
        }
        setProfile(payload.data as ProfileResponse)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Could not load this profile.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading profile">
        <div className="h-40 animate-pulse rounded-xl bg-muted/50" />
        <div className="h-32 animate-pulse rounded-xl bg-muted/30" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="rounded-xl border border-border/60 bg-muted/20 p-10 text-center">
        <h1 className="text-xl font-semibold">Profile not available</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {error ?? 'This learner may have removed their profile.'}
        </p>
        <Button asChild variant="outline" className="mt-5 gap-2">
          <Link href="/community/showcase">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to the showcase
          </Link>
        </Button>
      </div>
    )
  }

  const name = displayName(profile)
  const links = [
    profile.website && { href: profile.website, label: 'Website', icon: ExternalLink },
    profile.githubUrl && { href: profile.githubUrl, label: 'GitHub', icon: GithubIcon },
    profile.twitterUrl && { href: profile.twitterUrl, label: 'Twitter', icon: ExternalLink },
  ].filter(Boolean) as { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[]

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-emerald-500/20 via-blue-500/10 to-violet-500/20" aria-hidden="true" />
        <CardContent className="relative pt-0">
          <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="h-20 w-20 border-4 border-background">
                <AvatarImage src={profile.image || ''} alt="" />
                <AvatarFallback className="text-2xl">{name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="pb-1">
                <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
                <p className="text-sm text-muted-foreground">Joined {shortDate(profile.createdAt)}</p>
              </div>
            </div>
            {profile.isSelf && (
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href="/settings">
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  Edit profile
                </Link>
              </Button>
            )}
          </div>

          {profile.bio && (
            <p className="mt-5 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {profile.bio}
            </p>
          )}

          {links.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <link.icon className="h-4 w-4" aria-hidden="true" />
                  {link.label}
                </a>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-5 border-t border-border/50 pt-4 text-sm">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Rocket className="h-4 w-4" aria-hidden="true" />
              <strong className="text-foreground">{profile.contributions.projects}</strong> projects
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              <strong className="text-foreground">{profile.contributions.comments}</strong> comments
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <ThumbsUp className="h-4 w-4" aria-hidden="true" />
              <strong className="text-foreground">{profile.contributions.upvotes}</strong> upvotes given
            </span>
          </div>
        </CardContent>
      </Card>

      {profile.progress ? (
        <>
          <section aria-labelledby="progress-heading">
            <h2 id="progress-heading" className="mb-4 text-xl font-bold tracking-tight">
              Learning progress
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: Zap, label: 'XP earned', value: profile.progress.xp.toLocaleString(), color: 'text-amber-500' },
                { icon: BookOpen, label: 'Lessons completed', value: profile.progress.lessonsCompleted, color: 'text-emerald-500' },
                { icon: Flame, label: 'Current streak', value: `${profile.progress.streakCurrent}d`, color: 'text-orange-500' },
                { icon: Award, label: 'Longest streak', value: `${profile.progress.streakLongest}d`, color: 'text-violet-500' },
              ].map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="pt-5">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} aria-hidden="true" />
                    <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {profile.progress.badges.length > 0 && (
            <section aria-labelledby="badges-heading">
              <h2 id="badges-heading" className="mb-4 flex items-center gap-2 text-xl font-bold tracking-tight">
                <Award className="h-5 w-5 text-amber-500" aria-hidden="true" />
                Badges
              </h2>
              <div className="flex flex-wrap gap-3">
                {profile.progress.badges.map((badge) => (
                  <div
                    key={badge.key}
                    className="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3"
                    title={badge.description}
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${getAccent('amber').icon}`}>
                      <Award className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">Earned {timeAgo(badge.earnedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <p className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-5 text-sm text-muted-foreground">
          This learner keeps their progress private. Their shared projects and comments are still public.
        </p>
      )}

      <section aria-labelledby="projects-heading">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="projects-heading" className="text-xl font-bold tracking-tight">
            Shared projects
          </h2>
          <Badge variant="secondary" className="text-xs">
            {profile.contributions.projects}
          </Badge>
        </div>

        {profile.projects.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/50 p-6 text-center text-sm text-muted-foreground">
            No projects shared yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.projects.map((project) => (
              <Card key={project.id} className="transition-shadow hover:shadow-md">
                <CardContent className="pt-5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {project.track}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{timeAgo(project.createdAt)}</span>
                  </div>
                  <h3 className="mt-2 font-semibold">
                    <Link href={`/community/showcase/${project.id}`} className="hover:text-primary transition-colors">
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
                      {project.upvotes}
                    </span>
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {profile.isSelf && (
        <>
          <Separator />
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/20 p-4 text-sm">
            <p className="text-muted-foreground">
              This is your public profile. Add a bio and links so other learners can find you.
            </p>
            <Button asChild size="sm" variant="outline" className="gap-2">
              <Link href="/settings">
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                Edit settings
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
