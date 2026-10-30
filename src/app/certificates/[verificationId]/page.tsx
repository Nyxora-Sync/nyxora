import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Award, BadgeCheck, CalendarDays, ExternalLink, ShieldCheck } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { CertificateNotice } from '@/components/certificates/certificate-notice'
import { PrintButton } from '@/components/certificates/print-button'
import { getCertificateByVerificationId } from '@/lib/certificates'
import { CERTIFICATE_DISCLAIMER, CERTIFICATE_DISCLAIMER_SHORT } from '@/lib/certificate-copy'
import { siteUrl } from '@/lib/seo'
import { shortDate } from '@/lib/time'

type PageProps = {
  params: Promise<{ verificationId: string }>
  searchParams: Promise<{ print?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { verificationId } = await params
  const certificate = await getCertificateByVerificationId(verificationId)

  if (!certificate) {
    return { title: 'Certificate not found', robots: { index: false, follow: false } }
  }

  return {
    title: `${certificate.trackName} certificate`,
    description: `Informal, non-accredited Nyxora Sync completion record for ${certificate.recipientName ?? 'a learner'}. Showcase only; not a recognized qualification.`,
    robots: { index: false, follow: false },
  }
}

export const dynamic = 'force-dynamic'

export default async function CertificatePage({ params, searchParams }: PageProps) {
  const { verificationId } = await params
  const { print } = await searchParams
  const certificate = await getCertificateByVerificationId(verificationId)
  if (!certificate) notFound()

  const verifyUrl = `${siteUrl}/certificates/${certificate.verificationId}`
  const recipient = certificate.recipientName?.trim() || certificate.user.name?.trim() || 'Nyxora Sync Learner'

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3" data-print-hide>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/certificates">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                My certificates
              </Link>
            </Button>
            <PrintButton auto={print === '1'} />
          </div>

          <article className="relative overflow-hidden rounded-2xl border-2 border-emerald-600/30 bg-gradient-to-br from-emerald-50 via-background to-amber-50 p-6 shadow-xl sm:p-10 lg:p-14 dark:from-emerald-950/30 dark:via-background dark:to-amber-950/20">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative space-y-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-600/30 bg-emerald-500/10">
                  <Award className="h-9 w-9 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-400">
                  Nyxora Sync
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Certificate of Completion</h1>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Informal completion record · Not an accredited certificate
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm uppercase tracking-wide text-muted-foreground">This is to acknowledge that</p>
                <p className="text-3xl font-bold tracking-tight sm:text-5xl">{recipient}</p>
                <p className="mx-auto max-w-2xl text-muted-foreground">
                  has successfully completed every lesson in the
                </p>
                <p className="text-2xl font-semibold text-emerald-700 dark:text-emerald-400 sm:text-3xl">
                  {certificate.trackName}
                </p>
              </div>

              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 border-t border-border/60 pt-6 text-sm sm:grid-cols-3">
                <div className="flex items-center justify-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span>{shortDate(certificate.issuedAt.toISOString())}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  <span>All lessons complete</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span>ID {certificate.verificationId.slice(0, 12)}…</span>
                </div>
              </div>

              <div className="mx-auto max-w-xl rounded-xl border border-dashed border-border/70 bg-background/60 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Verification link
                </p>
                <Link
                  href={`/certificates/${certificate.verificationId}`}
                  className="mt-1 inline-flex max-w-full items-center gap-1.5 break-all text-sm font-medium text-primary hover:underline"
                >
                  {verifyUrl}
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </Link>
                <p className="mt-2 text-xs text-muted-foreground">
                  This link confirms that the record exists on Nyxora Sync. It does not verify
                  identity, accreditation, or any formal qualification.
                </p>
              </div>

              <CertificateNotice className="mx-auto max-w-2xl text-left" text={CERTIFICATE_DISCLAIMER} />
            </div>
          </article>

          <p className="text-center text-xs text-muted-foreground" data-print-hide>
            {CERTIFICATE_DISCLAIMER_SHORT}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
