'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Send } from 'lucide-react'
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
import type { ProjectListItem } from '@/lib/community-types'

const initialForm = {
  title: '',
  description: '',
  track: 'developer',
  githubUrl: '',
  demoUrl: '',
  imageUrl: '',
  tags: '',
}

export function ShareProjectDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (project: ProjectListItem) => void
}) {
  const router = useRouter()
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/community/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })

      const body = await response.json().catch(() => null)
      if (response.status === 401) {
        router.push('/auth/signin?callbackUrl=/community/showcase')
        return
      }
      if (!response.ok) {
        throw new Error(body?.error?.message ?? 'Could not share your project.')
      }

      onCreated(body.data as ProjectListItem)
      setForm(initialForm)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not share your project.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Share your project</DialogTitle>
          <DialogDescription>
            Show what you built with the MERN stack. A live demo and a repo link help people
            learn from your work — rough edges are welcome.
          </DialogDescription>
        </DialogHeader>

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
                <option value="beginner">Beginner</option>
                <option value="developer">Developer</option>
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
              Optional. A direct image link (16:9 works best).
            </p>
          </div>

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="gap-2">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
              Publish project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
