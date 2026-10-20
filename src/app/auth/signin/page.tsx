import { SignInClient } from './signin-client'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Sign In',
  description: 'Sign in to Nyxora Sync to sync your progress across devices.',
  path: '/auth/signin',
  noIndex: true,
})

export default function SignInPage() {
  const enabled = {
    github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    email: Boolean(process.env.EMAIL_SERVER),
  }

  return <SignInClient enabled={enabled} />
}