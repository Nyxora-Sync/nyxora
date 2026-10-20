'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { cn } from '@/lib/utils'

export default function VerifyRequestPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>}>
      <VerifyRequestContent />
    </Suspense>
  )
}

function VerifyRequestContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type') || 'email'
  const error = searchParams.get('error')

  const isError = !!error

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <Card>
            <CardHeader>
              <div className={cn(
                'mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full',
                isError ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              )}>
                {isError ? (
                  <AlertCircle className="h-7 w-7" aria-hidden="true" />
                ) : type === 'email' ? (
                  <Mail className="h-7 w-7" aria-hidden="true" />
                ) : (
                  <CheckCircle className="h-7 w-7" aria-hidden="true" />
                )}
              </div>
              <CardTitle>
                {isError ? 'Something went wrong' : 'Check your email'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isError ? (
                <>
                  <p className="text-destructive">
                    {error === 'Config' ? 'Email not configured. Try GitHub or Google sign-in.' : 'Failed to send email. Please try again.'}
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/auth/signin">Back to Sign In</Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    We&apos;ve sent a magic link to your email. The link expires in 24 hours.
                  </p>
                  <div className="rounded-lg bg-muted p-4 text-left text-sm">
                    <p className="font-medium mb-2">What happens next:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" aria-hidden="true" />Open your email inbox</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" aria-hidden="true" />Find the email from MERN Learn</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" aria-hidden="true" />Click the sign-in link</li>
                      <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" aria-hidden="true" />Start learning!</li>
                    </ul>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Didn&apos;t receive it? Check spam folder or{' '}
                    <Link href="/auth/signin" className="underline hover:text-foreground">request another</Link>
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <p className="mt-6 text-sm text-muted-foreground">
            <Link href="/" className="underline hover:text-foreground">← Back to home</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}