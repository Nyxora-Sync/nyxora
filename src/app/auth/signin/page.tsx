import type { Metadata } from 'next'
import { SignInClient } from './signin-client'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to MERN Learn to sync your progress across devices.',
}

export default function SignInPage() {
  const enabled = {
    github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    email: Boolean(process.env.EMAIL_SERVER),
  }

  return <SignInClient enabled={enabled} />
}