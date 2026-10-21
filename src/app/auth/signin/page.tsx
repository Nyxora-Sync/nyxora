import { SignInClient } from './signin-client'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Sign In',
  description: 'Sign in to Nyxora Sync to sync your progress across devices.',
  path: '/auth/signin',
  noIndex: true,
})

// Force dynamic rendering so DATABASE_URL is read at request time (available in Vercel runtime)
export const dynamic = 'force-dynamic'

export default function SignInPage() {
  const enabled = {
    github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    email: Boolean(process.env.EMAIL_SERVER),
  }
  const hasDatabase = Boolean(process.env.DATABASE_URL)

  return <SignInClient enabled={enabled} hasDatabase={hasDatabase} />
}