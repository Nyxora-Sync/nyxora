'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ProjectDetail } from '@/lib/community-types'
import { tracks } from '@/lib/curriculum'

const emptyForm = {
  title: '',
  description: '',
  track: 'developer',
  githubUrl: '',
  demoUrl: '',
  imageUrl: '',
  tags: '',
}

function formFromProject(project: ProjectDetail | null | undefined) {
  if (!project) return emptyForm
  return {
    title: project.title,
    description: project.description,
    track: project.track,
    githubUrl: project.githubUrl ?? '',
    demoUrl: project.demoUrl ?? '',
    imageUrl: project.imageUrl ?? '',
    tags: project.tags.join(', '),
  }
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  project,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: ProjectDetail | null
  onSaved: (project: ProjectDetail) => void
}) {
  const editing = Boolean(project)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit project' : 'Share your project'}</DialogTitle>
          <DialogDescription>
            {editing
              ? 'Fix a typo, update a link, or refresh the screenshot. Your comments and upvotes stay intact.'
              : 'Show what you built with the MERN stack. A live demo and a repo link help people learn from your work — rough edges are welcome.'}
          </DialogDescription>
        </DialogHeader>

        {/* Radix unmounts the dialog content when closed, so the form starts from
            the current project values every time it opens. */}
        <ProjectForm
          key={project?.id ?? 'new'}
          project={project}
          onSaved={onSaved}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

function ProjectForm({
  project,
  onSaved,
  onClose,
}: {
  project?: ProjectDetail | null
  onSaved: (project: ProjectDetail) => void
  onClose: () => void
}) {
  const router = useRouter()
  const editing = Boolean(project)
  const [form, setForm] = useState(() => formFromProject(project))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch(
        editing && project ? `/api/community/projects/${project.id}` : '/api/community/projects',
        {
          method: editing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            tags: form.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean),
          }),
        }
      )

      const body = await response.json().catch(() => null)
      if (response.status === 401) {
        const callbackUrl = project
          ? `/community/showcase/${project.id}`
          : '/community/showcase'
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`)
        return
      }
      if (!response.ok) {
        throw new Error(
          body?.error?.message ??
            (editing ? 'Could not save your changes.' : 'Could not share your project.')
        )
      }

      onSaved(body.data as ProjectDetail)
      onClose()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : editing
            ? 'Could not save your changes.'
            : 'Could not share your project.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="project-title">Title</Label>
        <Input
          id="project-title"
          value={form.title}
          onChange={(event) => update('title', event.target.value)}
          placeholder="Movie watchlist with reviews"
          minLength={4}
          maxLength={100}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="project-description">What did you build?</Label>
        <Textarea
          id="project-description"
          value={form.description}
          onChange={(event) => update('description', event.target.value)}
          placeholder="The problem, the stack, and the one thing you are proud of. Links to the tricky parts are gold."
          rows={5}
          minLength={30}
          maxLength={4000}
          required
        />
        <p className="text-xs text-muted-foreground">
          {form.description.trim().length} / 4000 characters (minimum 30)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="project-track">Track</Label>
          <select
            id="project-track"
            value={form.track}
            onChange={(event) => update('track', event.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          >
            {tracks.map((track) => (
              <option key={track.key} value={track.key}>
                {track.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="project-tags">Tags</Label>
          <Input
            id="project-tags"
            value={form.tags}
            onChange={(event) => update('tags', event.target.value)}
            placeholder="react, express, mongodb"
          />
          <p className="text-xs text-muted-foreground">Comma separated, up to 8.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="project-github">GitHub URL</Label>
          <Input
            id="project-github"
            type="url"
            value={form.githubUrl}
            onChange={(event) => update('githubUrl', event.target.value)}
            placeholder="https://github.com/you/project"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="project-demo">Live demo URL</Label>
          <Input
            id="project-demo"
            type="url"
            value={form.demoUrl}
            onChange={(event) => update('demoUrl', event.target.value)}
            placeholder="https://your-project.vercel.app"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="project-image">Screenshot URL</Label>
        <Input
          id="project-image"
          type="url"
          value={form.imageUrl}
          onChange={(event) => update('imageUrl', event.target.value)}
          placeholder="https://.../screenshot.png"
        />
        <p className="text-xs text-muted-foreground">
          Optional. A direct image link (16:9 works best). If the screenshot is on your computer,
          upload it first, then paste the direct image URL here.
        </p>
        <details className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs">
          <summary className="cursor-pointer font-medium">How do I get a screenshot URL?</summary>
          <div className="mt-2 space-y-2 text-muted-foreground">
            <p>
              <strong className="text-foreground">GitHub (easiest):</strong> commit the image to
              your project repo, open it on GitHub, click <em>Raw</em>, and copy the address bar
              URL. It should look like{' '}
              <code className="rounded bg-background px-1 py-0.5">
                raw.githubusercontent.com/you/repo/main/screenshot.png
              </code>
              .
            </p>
            <p>
              You can also drag the image into a GitHub issue or comment and copy the generated
              image link, or upload it to any image host that gives you a direct{' '}
              <code className="rounded bg-background px-1 py-0.5">https://...png</code> URL.
            </p>
            <p>
              Paste the <strong className="text-foreground">image</strong> URL, not the page that
              displays the image.
            </p>
          </div>
        </details>
      </div>

      {error && (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting} className="gap-2">
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : editing ? (
            <Save className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          {editing ? 'Save changes' : 'Publish project'}
        </Button>
      </DialogFooter>
    </form>
  )
}
