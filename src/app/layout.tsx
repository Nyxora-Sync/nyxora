import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import { JsonLd } from '@/components/structured-data'
import { CookieNotice } from '@/components/site/cookie-notice'
import { FloatingActions } from '@/components/site/floating-actions'
import { OutboundUtm } from '@/components/site/outbound-utm'
import { absoluteUrl, defaultDescription, siteName, siteUrl } from '@/lib/seo'
import './globals.css'
import './print.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  // Code examples are below the fold on every page. Loading the mono face on
  // demand keeps it off the critical path for the first paint.
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Nyxora Sync — Learn MERN, C, C++, C#, and Python for Free',
    template: '%s | Nyxora Sync',
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: ['MERN', 'MongoDB', 'Express', 'React', 'Node.js', 'C', 'C++', 'C#', 'Python', 'web development', 'full stack', 'learn programming', 'free resources'],
  authors: [{ name: 'Nyxora Sync Community' }],
  creator: 'Nyxora Sync',
  publisher: 'Nyxora Sync',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: absoluteUrl('/'),
    siteName,
    title: 'Nyxora Sync — Learn MERN, C, C++, C#, and Python for Free',
    description: defaultDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nyxora Sync — learn web development and programming languages',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nyxora Sync — Learn MERN, C, C++, C#, and Python for Free',
    description: defaultDescription,
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

const organizationId = `${siteUrl}/#organization`
const websiteId = `${siteUrl}/#website`

const siteSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: siteName,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/icon-512.png'),
    description:
      'A free, open-source curriculum for the MERN stack, C, C++, C#, and Python, with written lessons, playgrounds, progress tracking, and a project showcase.',
    sameAs: ['https://github.com/Nyxora-Sync/nyxora-sync'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: siteName,
    url: absoluteUrl('/'),
    description: defaultDescription,
    inLanguage: 'en',
    publisher: { '@id': organizationId },
  },
]

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <noscript>
          <style>{'[data-motion-reveal]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <JsonLd data={siteSchema} />
        <Providers>
          {children}
          <FloatingActions />
          <CookieNotice />
          <OutboundUtm />
        </Providers>
      </body>
    </html>
  )
}