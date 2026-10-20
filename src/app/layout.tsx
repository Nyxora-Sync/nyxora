import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
import { JsonLd } from '@/components/structured-data'
import { absoluteUrl, defaultDescription, siteName, siteUrl } from '@/lib/seo'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MERN Learn — Master the MERN Stack for Free',
    template: '%s | MERN Learn',
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: ['MERN', 'MongoDB', 'Express', 'React', 'Node.js', 'web development', 'full stack', 'learn programming', 'free resources'],
  authors: [{ name: 'MERN Learn Community' }],
  creator: 'MERN Learn',
  publisher: 'MERN Learn',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: absoluteUrl('/'),
    siteName,
    title: 'MERN Learn — Master the MERN Stack for Free',
    description: defaultDescription,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MERN Learn - Master the MERN Stack',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MERN Learn — Master the MERN Stack for Free',
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
      'A free, open-source MERN stack curriculum with written lessons, playgrounds, progress tracking, and a project showcase.',
    sameAs: ['https://github.com/Nyxora-Sync/mern-learn'],
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
        <noscript>
          <style>{'[data-motion-reveal]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
        <JsonLd data={siteSchema} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}