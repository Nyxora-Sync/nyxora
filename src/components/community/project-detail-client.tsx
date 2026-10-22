'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Loader2,
  MessageSquare,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Separator } from '@/components/ui/separator'
import { UserChip } from '@/components/community/user-chip'
import { UpvoteButton } from '@/components/community/upvote-button'
import { CommentThread } from '@/components/community/comment-thread'
import { ProjectFormDialog } from '@/components/community/project-form-dialog'
import { ReportButton } from '@/components/community/report-button'
import type { ProjectDetail } from '@/lib/community-types'
import { shortDate, timeAgo } from '@/lib/time'
import { getAccent, getTrackColor } from '@/lib/utils'
import { GithubIcon } from '@/components/icons/brand'

export function ProjectDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/community/projects/${id}`, {
          signal: controller.signal,
        })
        const payload = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(payload?.error?.message ?? 'Could not load this project.')
        }
        setProject(payload.data as ProjectDetail)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Could not load this project.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [id])

  async function handleDelete() {
    if (!project || deleting) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const response = await fetch(`/api/community/projects/${project.id}`, { method: 'DELETE' })
      if (response.ok) {
        setDeleteConfirmOpen(false)
        router.push('/community/showcase')
        router.refresh()
        return
      }
      const payload = await response.json().catch(() => null)
      setDeleteError(payload?.error?.message ?? 'Could not delete the project.')
    } catch {
      setDeleteError('Could not delete the project. Check your connection and try again.')
    } finally {
      setDeleting(false)
      setDeleteConfirmOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Loading project">
        <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-72 animate-pulse rounded-xl bg-muted/60" />
        <div className="h-32 animate-pulse rounded-xl bg-muted/40" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="rounded-xl border border-border/60 bg-muted/20 p-10 text-center">
        <h1 className="text-xl font-semibold">Project not available</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {error ?? 'This project may have been removed.'}
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

  return (
    <div className="space-y-10">
      <Link
        href="/community/showcase"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All projects
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={`capitalize ${getAccent(getTrackColor(project.track)).text}`}
            >
              {project.track} track
            </Badge>
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>

          {project.imageUrl && (
            <div className="mt-6 overflow-hidden rounded-xl border border-border/50 bg-muted">
              <img
                src={project.imageUrl}
                alt=""
                loading="eager"
                decoding="async"
                className="max-h-[480px] w-full object-cover"
              />
            </div>
          )}

          <div className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
            {project.description}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {project.demoUrl && (
              <Button asChild className="gap-2">
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Open live demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button asChild variant="outline" className="gap-2">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="h-4 w-4" aria-hidden="true" />
                  View source
                </a>
              </Button>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Shared by</p>
                <UserChip user={project.author} meta={`Joined ${shortDate(project.author.createdAt)}`} size="md" className="mt-2" />
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-3">
                <UpvoteButton
                  projectId={project.id}
                  initialUpvotes={project.upvotes}
                  initialUpvoted={project.upvoted}
                  size="lg"
                />
                <a
                  href="#discussion-heading"
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  {project.commentCount} {project.commentCount === 1 ? 'comment' : 'comments'}
                </a>
              </div>

              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  Published {timeAgo(project.createdAt)}
                </div>
                {new Date(project.updatedAt).getTime() - new Date(project.createdAt).getTime() > 60_000 && (
                  <div className="flex items-center gap-1.5">
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Updated {timeAgo(project.updatedAt)}
                  </div>
                )}
              </div>

              {!project.isOwner && (
                <ReportButton targetType="project" targetId={project.id} className="w-full justify-start" />
              )}

              {project.isOwner && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditOpen(true)}
                      className="w-full gap-2"
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      Edit project
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDeleteError(null)
                        setDeleteConfirmOpen(true)
                      }}
                      disabled={deleting}
                      className="w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      {deleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      )}
                      Delete project
                    </Button>
                    {deleteError && (
                      <p className="text-sm text-destructive" role="alert">
                        {deleteError}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardContent className="pt-6 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Built something too?</p>
              <p className="mt-1">
                Share the project you learned on. Feedback from other learners is the fastest review you
                will ever get.
              </p>
              <Button asChild size="sm" variant="outline" className="mt-3">
                <Link href="/community/showcase">Share a project</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>

      <ProjectFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        project={project}
        onSaved={(updated) => {
          setProject(updated)
          setEditOpen(false)
          router.refresh()
        }}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete this project?"
        description="The project, its screenshot, and all of its comments will be removed. This cannot be undone."
        confirmLabel="Delete project"
        destructive
        pending={deleting}
        onConfirm={handleDelete}
      />

      <Separator />

      <CommentThread
        targetType="project"
        targetId={project.id}
        title="Feedback & questions"
        description="Ask how something was built, leave a suggestion, or cheer the builder on."
      />
    </div>
  )
}
