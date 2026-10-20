/**
 * Shared shape for the project JSON returned by the showcase routes.
 * Keeping this in one place means create, list, detail, and edit responses
 * stay in sync as fields are added.
 */
export function serializeProject(
  project: {
    id: string
    title: string
    description: string
    githubUrl: string | null
    demoUrl: string | null
    imageUrl: string | null
    track: string
    modules: string[]
    tags: string[]
    upvotes: number
    createdAt: Date
    user: {
      id: string
      name: string | null
      image: string | null
      bio: string | null
      website: string | null
      githubUrl: string | null
      twitterUrl: string | null
      createdAt: Date
    }
    upvoteRows: { id: string }[]
  },
  commentCount = 0
) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    githubUrl: project.githubUrl,
    demoUrl: project.demoUrl,
    imageUrl: project.imageUrl,
    track: project.track,
    modules: project.modules,
    tags: project.tags,
    upvotes: project.upvotes,
    commentCount,
    createdAt: project.createdAt.toISOString(),
    author: project.user,
    upvoted: project.upvoteRows.length > 0,
  }
}
