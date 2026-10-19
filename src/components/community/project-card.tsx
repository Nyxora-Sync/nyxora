/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link'
import { ExternalLink, MessageSquare, Rocket } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { UserChip } from '@/components/community/user-chip'
import { UpvoteButton } from '@/components/community/upvote-button'
import type { ProjectListItem } from '@/lib/community-types'
import { timeAgo } from '@/lib/time'
import { cn, getAccent } from '@/lib/utils'
import { GithubIcon } from '@/components/icons/brand'

const trackAccent: Record<string, string> = {
  beginner: 'emerald',
  developer: 'violet',
}

export function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-border hover:shadow-lg">
      {project.imageUrl ? (
        <Link href={`/community/showcase/${project.id}`} className="block overflow-hidden bg-muted">
          <img
            src={project.imageUrl}
            alt=""
            loading="lazy"
            className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>
      ) : (
        <Link
          href={`/community/showcase/${project.id}`}
          className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-emerald-500/10 via-transparent to-violet-500/10"
          aria-hidden="true"
        >
          <Rocket className="h-9 w-9 text-muted-foreground/40" />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className={cn('text-[10px] capitalize', getAccent(trackAccent[project.track] ?? 'slate').text)}>
            {project.track}
          </Badge>
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
              {tag}
            </Badge>
          ))}
        </div>

        <h3 className="text-base font-semibold leading-snug">
          <Link href={`/community/showcase/${project.id}`} className="hover:text-primary transition-colors">
            {project.title}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-3 text-sm text-muted-foreground">{project.description}</p>

        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <UpvoteButton
            projectId={project.id}
            initialUpvotes={project.upvotes}
            initialUpvoted={project.upvoted}
          />
          <Link
            href={`/community/showcase/${project.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-2.5 py-1.5 font-semibold transition-colors hover:text-foreground"
          >
            <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
            {project.commentCount}
          </Link>
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
              title="Live demo"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
              title="Source code"
            >
              <GithubIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Code
            </a>
          )}
        </div>

        <div className="mt-auto border-t border-border/40 pt-3">
          <UserChip user={project.author} meta={timeAgo(project.createdAt)} />
        </div>
      </div>
    </article>
  )
}
