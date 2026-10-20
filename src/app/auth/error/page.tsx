'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Configuration Error',
    description: 'Authentication is not properly configured. Please contact support or try again later.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in. Please check your credentials or contact support.',
  },
  Verification: {
    title: 'Verification Failed',
    description: 'The sign-in link has expired or has already been used. Please request a new one.',
  },
  OAuthSignin: {
    title: 'OAuth Error',
    description: 'An error occurred during OAuth sign-in. Please try again or use a different provider.',
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'An error occurred during the OAuth callback. Please try again.',
  },
  OAuthCreateAccount: {
    title: 'Account Creation Error',
    description: 'Could not create account. An account with this email may already exist.',
  },
  EmailCreateAccount: {
    title: 'Account Creation Error',
    description: 'Could not create account. Please try signing in with a different method.',
  },
  Callback: {
    title: 'Callback Error',
    description: 'An error occurred during the authentication callback. Please try again.',
  },
  EmailSignin: {
    title: 'Email Sign In Error',
    description: 'Failed to send sign-in email. Please check your email address and try again.',
  },
  CredentialsSignin: {
    title: 'Invalid Credentials',
    description: 'The provided credentials are invalid. Please check and try again.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An unexpected error occurred. Please try again or contact support.',
  },
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Default'
  const errorInfo = errorMessages[error] || errorMessages.Default

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <Card>
            <CardHeader>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-7 w-7 text-destructive" aria-hidden="true" />
              </div>
              <CardTitle>{errorInfo.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{errorInfo.description}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => window.history.back()}>
                  <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                  Try Again
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/signin">Back to Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <p className="mt-6 text-sm text-muted-foreground">
            Need help? <Link href="/contact" className="underline hover:text-foreground">Contact support</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}