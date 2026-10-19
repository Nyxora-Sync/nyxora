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
import { Mail, Loader2, Code2 } from 'lucide-react'
import { GithubIcon } from '@/components/icons/brand'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const providers = [
  { id: 'github', name: 'GitHub', icon: GithubIcon },
  { id: 'google', name: 'Google', icon: Mail },
]

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInContent />
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

function SignInContent() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/learn'
  const error = searchParams.get('error')
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [email, setEmail] = useState('')

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
            <p className="mt-2 text-muted-foreground">Sign in to track progress, earn badges, and join the community</p>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle>Choose a sign-in method</CardTitle>
              <CardDescription>All free. No passwords. Magic links or OAuth.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                  {error === 'Configuration' ? 'Authentication not configured. Please try GitHub or Google.' : 'Something went wrong. Please try again.'}
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                {providers.map((provider) => (
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

              <Separator className="my-4" />

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

              <p className="text-center text-xs text-muted-foreground">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
              </p>
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