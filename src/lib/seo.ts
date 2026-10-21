import type { Metadata } from 'next'

// Static output (sitemap, canonical links, Open Graph URLs) is generated at
// build time. Fall back to the production Worker origin when no explicit
// public URL is supplied, while keeping local development on localhost.
const fallbackUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://sync.nyxora.workers.dev'
    : 'http://localhost:3000'

const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : fallbackUrl)

export const siteUrl = configuredUrl.replace(/\/+$/, '')
export const siteName = 'Nyxora Sync'
export const defaultDescription =
  'Learn web development and programming languages for free. MERN, C, C++, C#, and Python paths from beginner to mastery, with written lessons, projects, playgrounds, and progress tracking.'
export const defaultOgImage = '/og-image.jpg'

// Modules shared by the beginner and developer tracks render the same lessons.
// The developer-track copies are canonical so search engines index one URL.
const sharedCoreModuleKeys = new Set(['node-express', 'mongodb', 'react', 'fullstack'])
const canonicalSharedTrack = 'developer'

export function canonicalTrackForModule(trackKey: string, moduleKey: string): string {
  return sharedCoreModuleKeys.has(moduleKey) ? canonicalSharedTrack : trackKey
}

export function canonicalLearnPath(
  trackKey: string,
  moduleKey?: string,
  lessonId?: string
): string {
  if (!moduleKey) return `/learn/${trackKey}`
  const canonicalTrack = canonicalTrackForModule(trackKey, moduleKey)
  return `/learn/${canonicalTrack}/${moduleKey}${lessonId ? `/${lessonId}` : ''}`
}

interface PageMetadataOptions {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  noIndex?: boolean
  keywords?: string[]
}

export function absoluteUrl(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return new URL(normalized, siteUrl).toString()
}

/**
 * Per-page metadata with a canonical URL and explicit social images.
 * The root layout only provides defaults; pages must opt into their canonical.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
  noIndex = false,
  keywords,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path)

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type,
      siteName,
      locale: 'en_US',
      title,
      description,
      url,
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${siteName} — free web development and programming curriculum`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [defaultOgImage],
    },
  }
}
