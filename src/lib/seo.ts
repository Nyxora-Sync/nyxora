import type { Metadata } from 'next'

const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')

export const siteUrl = configuredUrl.replace(/\/+$/, '')
export const siteName = 'MERN Learn'
export const defaultDescription =
  'Learn the MERN stack (MongoDB, Express, React, Node.js) from beginner to mastery with free written lessons, playgrounds, progress tracking, and a community.'
export const defaultOgImage = '/og-image.png'

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
          alt: `${siteName} — free MERN stack curriculum`,
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
