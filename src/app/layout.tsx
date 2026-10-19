import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/providers'
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
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'MERN Learn — Master the MERN Stack for Free',
    template: '%s | MERN Learn',
  },
  description: 'Learn the MERN stack (MongoDB, Express, React, Node.js) from beginner to mastery. Curated free resources, interactive playgrounds, progress tracking, and community.',
  keywords: ['MERN', 'MongoDB', 'Express', 'React', 'Node.js', 'web development', 'full stack', 'learn programming', 'free resources'],
  authors: [{ name: 'MERN Learn Community' }],
  creator: 'MERN Learn',
  publisher: 'MERN Learn',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mern-learn.dev',
    siteName: 'MERN Learn',
    title: 'MERN Learn — Master the MERN Stack for Free',
    description: 'Learn the MERN stack from beginner to mastery with curated free resources, interactive playgrounds, and progress tracking.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MERN Learn - Master the MERN Stack',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MERN Learn — Master the MERN Stack for Free',
    description: 'Learn the MERN stack from beginner to mastery with curated free resources.',
    images: ['/og-image.png'],
    creator: '@mernlearn',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}