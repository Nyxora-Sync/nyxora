import type { MetadataRoute } from 'next'
import { tracks } from '@/lib/curriculum'
import { absoluteUrl, canonicalLearnPath } from '@/lib/seo'

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>

const staticPages: Array<{
  path: string
  priority: number
  changeFrequency: ChangeFrequency
}> = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/learn', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/roadmap', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/resources', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/playground', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/community', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/community/showcase', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/contribute', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/newsletter', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/code-of-conduct', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/accessibility', priority: 0.3, changeFrequency: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries = new Map<string, MetadataRoute.Sitemap[number]>()

  function add(path: string, priority: number, changeFrequency: ChangeFrequency) {
    if (entries.has(path)) return
    entries.set(path, {
      url: absoluteUrl(path),
      changeFrequency,
      priority,
    })
  }

  for (const page of staticPages) {
    add(page.path, page.priority, page.changeFrequency)
  }

  for (const track of tracks) {
    add(`/learn/${track.key}`, 0.8, 'weekly')

    for (const mod of track.modules) {
      add(canonicalLearnPath(track.key, mod.key), 0.7, 'monthly')

      for (const lesson of mod.lessons) {
        add(canonicalLearnPath(track.key, mod.key, lesson.id), 0.6, 'monthly')
      }
    }
  }

  return [...entries.values()]
}
