'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Mail, Loader2, Code2, BookOpen, ShieldCheck } from 'lucide-react'
import { GithubIcon } from '@/components/icons/brand'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export type EnabledProviders = {
  github: boolean
  google: boolean
  email: boolean
}

const oauthProviders = [
  { id: 'github', name: 'GitHub', icon: GithubIcon },
  { id: 'google', name: 'Google', icon: Mail },
]

export function SignInClient({ enabled }: { enabled: EnabledProviders }) {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInContent enabled={enabled} />
    </Suspense>
  )
}

function SignInFallback() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="h-96 animate-pulse rounded-xl bg-muted" aria-hidden="true" />
        </div>
      </main>
      <Footer />
    </div>
  )
}

function SignInContent({ enabled }: { enabled: EnabledProviders }) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/learn'
  const error = searchParams.get('error')
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [email, setEmail] = useState('')

  const availableOAuth = oauthProviders.filter(
    (p) => enabled[p.id as 'github' | 'google']
  )
  const hasAnyProvider = availableOAuth.length > 0 || enabled.email

  const handleOAuthSignIn = (provider: string) => {
    setIsLoading(provider)
    signIn(provider, { callbackUrl })
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsLoading('email')
    await signIn('email', { email, callbackUrl })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-violet-600">
                <Code2 className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-2xl">MERN Learn</span>
            </Link>
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">Sign in to sync progress across devices and join the community</p>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle>{hasAnyProvider ? 'Choose a sign-in method' : 'Accounts coming soon'}</CardTitle>
              <CardDescription>
                {hasAnyProvider ? 'All free. No passwords. Magic links or OAuth.' : 'No sign-in provider is configured on this deployment yet.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                  {error === 'Configuration' ? 'Authentication is not configured on this deployment.' : 'Something went wrong. Please try again.'}
                </div>
              )}

              {!hasAnyProvider && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
                  <div className="flex items-center gap-2 font-medium text-sm">
                    <BookOpen className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    You don&apos;t need an account to learn
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All lessons, resources, and the playground are free and open. Your progress,
                    XP, streaks, and notes are saved automatically in this browser.
                  </p>
                  <Button asChild className="w-full gap-2">
                    <Link href="/learn">
                      Start learning now
                    </Link>
                  </Button>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    No account, no tracking, no paywall.
                  </p>
                </div>
              )}

              {availableOAuth.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {availableOAuth.map((provider) => (
                    <Button
                      key={provider.id}
                      variant="outline"
                      className="gap-2"
                      onClick={() => handleOAuthSignIn(provider.id)}
                      disabled={isLoading !== null}
                    >
                      {isLoading === provider.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <provider.icon className="h-4 w-4" aria-hidden="true" />
                      )}
                      {provider.name}
                    </Button>
                  ))}
                </div>
              )}

              {enabled.email && (
                <>
                  {availableOAuth.length > 0 && <Separator className="my-4" />}
                  <form onSubmit={handleEmailSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading !== null}
                        required
                        autoComplete="email"
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2" disabled={isLoading !== null || !email}>
                      {isLoading === 'email' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4" aria-hidden="true" />
                          Send Magic Link
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}

              {hasAnyProvider && (
                <p className="text-center text-xs text-muted-foreground">
                  By continuing, you agree to our{' '}
                  <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t-0 pt-0">
              <p className="text-sm text-muted-foreground">
                New here?{' '}
                <Link href="/learn" className="font-medium text-foreground underline hover:text-primary">
                  Explore without signing in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}