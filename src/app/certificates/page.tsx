import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Award, CheckCircle2, ExternalLink, Lock, Printer } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { auth } from '@/lib/auth/auth'
import { prisma } from '@/lib/db'
import { tracks } from '@/lib/curriculum'
import { syncUserCertificates, trackProgress } from '@/lib/certificates'
import { shortDate } from '@/lib/time'

export const metadata: Metadata = {
  title: 'Certificates',
  description: 'Your Nyxora Sync completion certificates and track progress.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function CertificatesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/signin?callbackUrl=/certificates')

  const [certificates, completedRows] = await Promise.all([
    syncUserCertificates(session.user.id),
    prisma.userProgress.findMany({
      where: { userId: session.user.id, completed: true },
      select: { lessonKey: true },
    }),
  ])

  const completedIds = new Set(completedRows.map((row) => row.lessonKey))
  const certificateByTrack = new Map(certificates.map((certificate) => [certificate.trackKey, certificate]))
  const inProgress = tracks
    .map((track) => ({
      track,
      progress: trackProgress(track.key, completedIds),
      certificate: certificateByTrack.get(track.key),
    }))
    .filter((entry) => !entry.certificate && entry.progress.completed > 0)
  const notStarted = tracks.filter((track) => {
    const progress = trackProgress(track.key, completedIds)
    return !certificateByTrack.has(track.key) && progress.completed === 0
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            <Badge variant="outline" className="gap-1.5">
              <Award className="h-3.5 w-3.5" aria-hidden="true" />
              Verified achievement
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Certificates</h1>
            <p className="max-w-2xl text-muted-foreground">
              Complete every lesson in a track to earn a shareable certificate with a public
              verification link. Certificates are issued automatically as your progress syncs.
            </p>
          </div>

          {certificates.length > 0 && (
            <section className="mt-10 space-y-4" aria-labelledby="earned-certificates">
              <h2 id="earned-certificates" className="text-xl font-bold tracking-tight">
                Earned ({certificates.length})
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {certificates.map((certificate) => (
                  <Card key={certificate.id} className="border-emerald-500/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                        {certificate.trackName}
                      </CardTitle>
                      <CardDescription>
                        Issued {shortDate(certificate.issuedAt)} · ID {certificate.verificationId.slice(0, 10)}…
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      <Button asChild size="sm" className="gap-1.5">
                        <Link href={`/certificates/${certificate.verificationId}`}>
                          View certificate
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="gap-1.5">
                        <Link href={`/certificates/${certificate.verificationId}?print=1`}>
                          <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                          Print
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {inProgress.length > 0 && (
            <section className="mt-12 space-y-4" aria-labelledby="in-progress-certificates">
              <h2 id="in-progress-certificates" className="text-xl font-bold tracking-tight">
                In progress
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {inProgress.map(({ track, progress }) => (
                  <Card key={track.key}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{track.name}</CardTitle>
                      <CardDescription>
                        {progress.completed} of {progress.total} lessons complete
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Progress value={progress.percent} aria-label={`${track.name} ${progress.percent}% complete`} />
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium">{progress.percent}%</span>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/learn/${track.key}`}>Continue track</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {certificates.length === 0 && inProgress.length === 0 && (
            <Card className="mt-10">
              <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <Lock className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-lg font-semibold">Your first certificate is one track away</p>
                  <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    Complete a lesson to start tracking progress. Certificates unlock when every
                    lesson in a track is complete.
                  </p>
                </div>
                <Button asChild>
                  <Link href="/learn">Start learning</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {notStarted.length > 0 && (certificates.length > 0 || inProgress.length > 0) && (
            <section className="mt-12 space-y-4" aria-labelledby="available-certificates">
              <h2 id="available-certificates" className="text-xl font-bold tracking-tight">
                Available tracks
              </h2>
              <div className="flex flex-wrap gap-2">
                {notStarted.map((track) => (
                  <Button key={track.key} asChild variant="outline" size="sm">
                    <Link href={`/learn/${track.key}`}>{track.name}</Link>
                  </Button>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
