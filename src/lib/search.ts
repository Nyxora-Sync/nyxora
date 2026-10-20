import { tracks } from '@/lib/curriculum'
import { resourcesData } from '@/lib/resources-data'
import { faqSections } from '@/lib/faq'
import { canonicalLearnPath } from '@/lib/seo'
import { communityEnabled } from '@/lib/community'
import { prisma } from '@/lib/db'

export type SearchResultType =
  | 'page'
  | 'track'
  | 'module'
  | 'lesson'
  | 'resource'
  | 'faq'
  | 'project'

export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  description: string
  href: string
  meta?: string
  external?: boolean
  keywords?: string
}

const staticPages: SearchResult[] = [
  {
    id: 'page-home',
    type: 'page',
    title: 'Home',
    description: 'Start learning web development and programming languages for free with written lessons, projects, progress tracking, and a community.',
    href: '/',
    keywords: 'mern python c c++ c# mongodb express react node full stack free curriculum',
  },
  {
    id: 'page-learn',
    type: 'page',
    title: 'All Lessons',
    description: 'Browse web development and programming language paths, module by module.',
    href: '/learn',
    keywords: 'curriculum lessons modules tracks beginner developer specializations languages',
  },
  {
    id: 'page-languages',
    type: 'page',
    title: 'Programming Language Paths',
    description: 'Learn C, C++, C#, and Python from beginner to mastery with written lessons and projects.',
    href: '/learn/languages',
    keywords: 'learn c learn c++ learn c# learn python programming languages beginner mastery',
  },
  {
    id: 'page-roadmap',
    type: 'page',
    title: 'Learning Roadmap',
    description: 'See the recommended order through web foundations, the MERN stack, language paths, advanced topics, and specializations.',
    href: '/roadmap',
    keywords: 'roadmap path order study plan specializations nextjs devops react native python c c++ c#',
  },
  {
    id: 'page-resources',
    type: 'page',
    title: 'Free Resource Directory',
    description: 'A searchable directory of free videos, articles, docs, courses, books, and tools.',
    href: '/resources',
    keywords: 'resources directory links tutorials videos docs free',
  },
  {
    id: 'page-playground',
    type: 'page',
    title: 'Code Playground',
    description: 'Edit HTML, CSS, and JavaScript in your browser and see the result live.',
    href: '/playground',
    keywords: 'playground editor html css javascript live preview sandbox',
  },
  {
    id: 'page-community',
    type: 'page',
    title: 'Community',
    description: 'Learn how discussions, public profiles, and the project showcase work.',
    href: '/community',
    keywords: 'community discussion profiles learners',
  },
  {
    id: 'page-showcase',
    type: 'page',
    title: 'Project Showcase',
    description: 'Browse projects built by learners, leave feedback, and share your own work.',
    href: '/community/showcase',
    keywords: 'projects showcase portfolio feedback upvote',
  },
  {
    id: 'page-contribute',
    type: 'page',
    title: 'Contribute',
    description: 'Help improve lessons, examples, translations, accessibility, and the codebase.',
    href: '/contribute',
    keywords: 'contribute github pull request translation corrections',
  },
  {
    id: 'page-about',
    type: 'page',
    title: 'About Nyxora Sync',
    description: 'Why the curriculum exists, how it is built, and what it does not claim to be.',
    href: '/about',
    keywords: 'about mission project open source',
  },
  {
    id: 'page-faq',
    type: 'page',
    title: 'Frequently Asked Questions',
    description: 'Answers about the tracks, accounts, progress, playground, community, and licenses.',
    href: '/faq',
    keywords: 'faq questions help answers',
  },
  {
    id: 'page-contact',
    type: 'page',
    title: 'Contact',
    description: 'Report a problem, send a correction, or ask a privacy or account question.',
    href: '/contact',
    keywords: 'contact support bug report feedback privacy',
  },
  {
    id: 'page-code-of-conduct',
    type: 'page',
    title: 'Code of Conduct',
    description: 'The standards for discussions, project feedback, and community spaces.',
    href: '/code-of-conduct',
    keywords: 'community rules conduct behaviour safety',
  },
  {
    id: 'page-privacy',
    type: 'page',
    title: 'Privacy Policy',
    description: 'What the site stores, where it lives, and how to remove it.',
    href: '/privacy',
    keywords: 'privacy data cookies local storage account deletion',
  },
  {
    id: 'page-terms',
    type: 'page',
    title: 'Terms of Service',
    description: 'The terms for using Nyxora Sync and the licenses that cover its content and code.',
    href: '/terms',
    keywords: 'terms license copyright cc by-sa mit',
  },
  {
    id: 'page-accessibility',
    type: 'page',
    title: 'Accessibility',
    description: 'The accessibility approach and how to report a barrier on the site.',
    href: '/accessibility',
    keywords: 'accessibility keyboard screen reader wcag reduced motion',
  },
]

const typeOrder: Record<SearchResultType, number> = {
  lesson: 0,
  module: 1,
  track: 2,
  page: 3,
  faq: 4,
  resource: 5,
  project: 6,
}

let cachedStaticEntries: SearchResult[] | null = null

function getStaticEntries(): SearchResult[] {
  if (cachedStaticEntries) return cachedStaticEntries

  const entries = new Map<string, SearchResult>()

  for (const page of staticPages) {
    entries.set(page.href, page)
  }

  for (const track of tracks) {
    entries.set(`/learn/${track.key}`, {
      id: `track-${track.key}`,
      type: 'track',
      title: track.name,
      description: track.description,
      href: `/learn/${track.key}`,
      meta: `${track.modules.length} modules`,
      keywords: `${track.key} track modules curriculum`,
    })

    for (const mod of track.modules) {
      const moduleHref = canonicalLearnPath(track.key, mod.key)
      if (!entries.has(moduleHref)) {
        entries.set(moduleHref, {
          id: `module-${mod.key}`,
          type: 'module',
          title: mod.name,
          description: mod.description,
          href: moduleHref,
          meta: `${mod.lessons.length} lessons · about ${mod.estimatedHours} hours`,
          keywords: `${track.name} ${mod.key} ${mod.lessons.map((lesson) => lesson.title).join(' ')}`,
        })
      }

      for (const lesson of mod.lessons) {
        const lessonHref = canonicalLearnPath(track.key, mod.key, lesson.id)
        if (!entries.has(lessonHref)) {
          entries.set(lessonHref, {
            id: `lesson-${lesson.id}`,
            type: 'lesson',
            title: lesson.title,
            description: lesson.description,
            href: lessonHref,
            meta: `${mod.name} · ${lesson.estimatedMinutes} min · ${lesson.difficulty}`,
            keywords: [
              track.name,
              mod.name,
              lesson.difficulty,
              ...lesson.keyTakeaways,
              ...lesson.resources.map((resource) => resource.title),
            ].join(' '),
          })
        }
      }
    }
  }

  for (const resource of resourcesData) {
    entries.set(resource.url, {
      id: `resource-${resource.id}`,
      type: 'resource',
      title: resource.title,
      description: resource.description,
      href: resource.url,
      external: true,
      meta: `${resource.provider} · ${resource.type} · ${resource.level}`,
      keywords: `${resource.topic} ${resource.tags.join(' ')} ${resource.provider}`,
    })
  }

  for (const section of faqSections) {
    for (const item of section.items) {
      entries.set(`/faq#${item.slug}`, {
        id: `faq-${item.slug}`,
        type: 'faq',
        title: item.question,
        description: item.answer,
        href: `/faq#${item.slug}`,
        meta: `FAQ · ${section.title}`,
        keywords: `${section.title} ${section.description} ${item.answer}`,
      })
    }
  }

  cachedStaticEntries = [...entries.values()]
  return cachedStaticEntries
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim()
}

function queryTerms(query: string): string[] {
  return normalize(query).split(' ').filter(Boolean)
}

function scoreEntry(entry: SearchResult, normalizedQuery: string, terms: string[]): number {
  const title = normalize(entry.title)
  const meta = normalize(entry.meta ?? '')
  const keywords = normalize(entry.keywords ?? '')
  const haystack = `${title} ${normalize(entry.description)} ${meta} ${keywords}`

  if (!terms.every((term) => haystack.includes(term))) return -1

  let score = typeOrder[entry.type] * 0.1

  if (title === normalizedQuery) score += 100
  else if (title.startsWith(normalizedQuery)) score += 60
  else if (title.includes(normalizedQuery)) score += 30

  for (const term of terms) {
    if (title.includes(term)) score += 12
    if (meta.includes(term)) score += 4
    if (keywords.includes(term)) score += 2
  }

  return score
}

function sortResults(results: SearchResult[], normalizedQuery: string, terms: string[]): SearchResult[] {
  return results
    .map((entry) => ({ entry, score: scoreEntry(entry, normalizedQuery, terms) }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .map((item) => item.entry)
}

async function searchProjects(terms: string[]): Promise<SearchResult[]> {
  if (!communityEnabled() || terms.length === 0) return []

  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: terms.map((term) => ({
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
            { tags: { has: term } },
            { modules: { has: term } },
          ],
        })),
      },
      orderBy: [{ upvotes: 'desc' }, { createdAt: 'desc' }],
      take: 8,
      select: {
        id: true,
        title: true,
        description: true,
        tags: true,
        track: true,
        upvotes: true,
      },
    })

    return projects.map((project) => ({
      id: `project-${project.id}`,
      type: 'project' as const,
      title: project.title,
      description: project.description,
      href: `/community/showcase/${project.id}`,
      meta: `${project.track} track · ${project.upvotes} ${project.upvotes === 1 ? 'upvote' : 'upvotes'}`,
      keywords: project.tags.join(' '),
    }))
  } catch {
    // Search should still work when the community database is unavailable.
    return []
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined

  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms)
  })

  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer)
  })
}

export async function searchSite(query: string): Promise<SearchResult[]> {
  const cleanedQuery = query.trim().slice(0, 120)
  const normalizedQuery = normalize(cleanedQuery)
  if (!normalizedQuery) return []

  const terms = queryTerms(cleanedQuery).slice(0, 8)
  const staticResults = sortResults(getStaticEntries(), normalizedQuery, terms)
  // Static results should never wait on a slow or unavailable community database.
  const projectResults = sortResults(
    await withTimeout<SearchResult[]>(searchProjects(terms), 1500, []),
    normalizedQuery,
    terms
  )

  return [...staticResults, ...projectResults]
}

export function groupSearchResults(results: SearchResult[]): Array<{
  type: SearchResultType
  label: string
  results: SearchResult[]
}> {
  const labels: Record<SearchResultType, string> = {
    lesson: 'Lessons',
    module: 'Modules',
    track: 'Tracks',
    page: 'Pages',
    faq: 'FAQ',
    resource: 'Resources',
    project: 'Showcase projects',
  }

  const grouped = new Map<SearchResultType, SearchResult[]>()
  for (const result of results) {
    const list = grouped.get(result.type) ?? []
    list.push(result)
    grouped.set(result.type, list)
  }

  return ([...grouped.entries()] as Array<[SearchResultType, SearchResult[]]>)
    .sort(([a], [b]) => typeOrder[a] - typeOrder[b])
    .map(([type, items]) => ({ type, label: labels[type], results: items }))
}
