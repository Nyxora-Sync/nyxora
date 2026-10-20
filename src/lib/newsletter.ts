import { createHmac, timingSafeEqual } from 'node:crypto'
import nodemailer from 'nodemailer'
import type SMTPPool from 'nodemailer/lib/smtp-pool'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'

const DAY_SECONDS = 24 * 60 * 60
const CONFIRM_TTL_SECONDS = 2 * DAY_SECONDS
const UNSUBSCRIBE_TTL_SECONDS = 10 * 365 * DAY_SECONDS

export type NewsletterTokenPurpose = 'confirm' | 'unsubscribe'

interface TokenPayload {
  sub: string
  purpose: NewsletterTokenPurpose
  exp: number
  v: 1
}

function tokenSecret(): string | null {
  return (
    process.env.NEWSLETTER_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    null
  )
}

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('base64url')
}

export function createNewsletterToken(
  subscriberId: string,
  purpose: NewsletterTokenPurpose
): string | null {
  const secret = tokenSecret()
  if (!secret) return null

  const ttl = purpose === 'confirm' ? CONFIRM_TTL_SECONDS : UNSUBSCRIBE_TTL_SECONDS
  const payload: TokenPayload = {
    sub: subscriberId,
    purpose,
    exp: Math.floor(Date.now() / 1000) + ttl,
    v: 1,
  }
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  return `${encoded}.${sign(encoded, secret)}`
}

export function verifyNewsletterToken(
  token: string,
  purpose: NewsletterTokenPurpose
): { subscriberId: string } | null {
  const secret = tokenSecret()
  if (!secret) return null

  const [encoded, signature, extra] = token.split('.')
  if (!encoded || !signature || extra) return null

  const expected = sign(encoded, secret)
  const provided = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (provided.length !== expectedBuffer.length || !timingSafeEqual(provided, expectedBuffer)) {
    return null
  }

  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as Partial<TokenPayload>
    if (
      parsed.v !== 1 ||
      parsed.purpose !== purpose ||
      typeof parsed.sub !== 'string' ||
      parsed.sub.length < 5 ||
      typeof parsed.exp !== 'number' ||
      parsed.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null
    }
    return { subscriberId: parsed.sub }
  } catch {
    return null
  }
}

interface SmtpConfig {
  host: string
  port: number
  secure: boolean
  auth?: { user: string; pass: string }
}

function smtpConfig(): SmtpConfig | null {
  if (process.env.EMAIL_SERVER_HOST) {
    const port = Number(process.env.EMAIL_SERVER_PORT || 587)
    return {
      host: process.env.EMAIL_SERVER_HOST,
      port,
      secure: port === 465,
      ...(process.env.EMAIL_SERVER_USER
        ? {
            auth: {
              user: process.env.EMAIL_SERVER_USER,
              pass: process.env.EMAIL_SERVER_PASSWORD || '',
            },
          }
        : {}),
    }
  }

  const server = process.env.EMAIL_SERVER
  if (!server) return null

  try {
    const url = new URL(server)
    const port = Number(url.port || (url.protocol === 'smtps:' ? 465 : 587))
    return {
      host: url.hostname,
      port,
      secure: url.protocol === 'smtps:' || port === 465,
      ...(url.username
        ? {
            auth: {
              user: decodeURIComponent(url.username),
              pass: decodeURIComponent(url.password),
            },
          }
        : {}),
    }
  } catch {
    return null
  }
}

export function newsletterEmailConfigured(): boolean {
  return Boolean(smtpConfig() && process.env.EMAIL_FROM)
}

export function isNewsletterAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  const admins = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
  return admins.includes(email.trim().toLowerCase())
}

function fromAddress(): string {
  return process.env.EMAIL_FROM || 'MERN Learn <noreply@localhost>'
}

function createTransport(pool = false) {
  const config = smtpConfig()
  if (!config) throw new Error('Email is not configured')

  if (pool) {
    const options: SMTPPool.Options = {
      ...config,
      pool: true,
      maxConnections: 3,
      maxMessages: 50,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    }
    return nodemailer.createTransport(options)
  }

  const options: SMTPTransport.Options = {
    ...config,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  }
  return nodemailer.createTransport(options)
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function actionUrl(origin: string, path: string, token: string): string {
  const url = new URL(path, origin)
  url.searchParams.set('token', token)
  return url.toString()
}

function emailShell({
  heading,
  bodyHtml,
  footerHtml,
}: {
  heading: string
  bodyHtml: string
  footerHtml: string
}): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
    <div style="max-width:600px;margin:0 auto;padding:32px 16px;">
      <div style="background:#ffffff;border:1px solid #e4e4e7;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#064e3b,#4c1d95);padding:22px 28px;">
          <div style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">MERN Learn</div>
        </div>
        <div style="padding:30px 28px;">
          <h1 style="margin:0 0 18px;font-size:24px;line-height:1.3;color:#18181b;">${escapeHtml(heading)}</h1>
          ${bodyHtml}
        </div>
        <div style="padding:18px 28px;border-top:1px solid #e4e4e7;background:#fafafa;color:#71717a;font-size:12px;line-height:1.6;">
          ${footerHtml}
        </div>
      </div>
    </div>
  </body>
</html>`
}

export async function sendNewsletterConfirmation({
  email,
  subscriberId,
  origin,
}: {
  email: string
  subscriberId: string
  origin: string
}): Promise<void> {
  const token = createNewsletterToken(subscriberId, 'confirm')
  if (!token) throw new Error('Newsletter token secret is not configured')

  const confirmUrl = actionUrl(origin, '/newsletter/confirm', token)
  const transport = createTransport()

  try {
    await transport.sendMail({
      from: fromAddress(),
      to: email,
      subject: 'Confirm your MERN Learn newsletter subscription',
      text: [
        'Confirm your MERN Learn newsletter subscription',
        '',
        `Open this link to confirm: ${confirmUrl}`,
        '',
        'The link expires in 48 hours. If you did not sign up, ignore this email and nothing will be sent to you.',
      ].join('\n'),
      html: emailShell({
        heading: 'Confirm your subscription',
        bodyHtml: `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#3f3f46;">You asked to receive occasional MERN Learn curriculum updates. Confirm your address to join the list.</p>
          <p style="margin:0 0 24px;"><a href="${escapeHtml(confirmUrl)}" style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:8px;">Confirm subscription</a></p>
          <p style="margin:0;font-size:13px;line-height:1.6;color:#71717a;">This link expires in 48 hours. If you did not sign up, ignore this email and nothing will be sent to you.</p>`,
        footerHtml: 'You received this because someone entered this address on mern-learn. If that was not you, no action is needed.',
      }),
    })
  } finally {
    transport.close()
  }
}

export interface NewsletterRecipient {
  id: string
  email: string
}

export async function sendNewsletterBroadcast({
  subject,
  body,
  recipients,
  origin,
  testTo,
}: {
  subject: string
  body: string
  recipients: NewsletterRecipient[]
  origin: string
  testTo?: string
}): Promise<{ sent: number; failed: number }> {
  const transport = createTransport(true)
  const htmlBody = `<div style="margin:0;font-size:15px;line-height:1.75;color:#3f3f46;white-space:pre-wrap;">${escapeHtml(body)}</div>`

  async function sendOne(
    email: string,
    unsubscribeUrl: string,
    isTest: boolean,
    oneClickUrl?: string
  ) {
    const finalSubject = isTest ? `[TEST] ${subject}` : subject
    const footerText = isTest
      ? 'This is a test send from the MERN Learn newsletter admin page.'
      : 'You are receiving this because you confirmed your subscription to MERN Learn updates.'

    await transport.sendMail({
      from: fromAddress(),
      to: email,
      replyTo: process.env.CONTACT_INBOX || undefined,
      subject: finalSubject,
      text: [
        body,
        '',
        '---',
        footerText,
        `Unsubscribe: ${unsubscribeUrl}`,
        'Unsubscribing deletes your address from the list.',
      ].join('\n'),
      html: emailShell({
        heading: subject,
        bodyHtml: htmlBody,
        footerHtml: `${escapeHtml(footerText)}<br><a href="${escapeHtml(unsubscribeUrl)}" style="color:#4f46e5;">Unsubscribe</a> — this deletes your address from the list.`,
      }),
      ...(isTest || !oneClickUrl
        ? {}
        : {
            headers: {
              'List-Unsubscribe': `<${oneClickUrl}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
              Precedence: 'bulk',
              'X-Auto-Response-Suppress': 'OOF',
            },
          }),
    })
  }

  try {
    if (testTo) {
      await sendOne(testTo, new URL('/newsletter', origin).toString(), true)
      return { sent: 1, failed: 0 }
    }

    let sent = 0
    let failed = 0

    // Keep concurrency modest so small SMTP providers do not throttle the send.
    for (let index = 0; index < recipients.length; index += 5) {
      const batch = recipients.slice(index, index + 5)
      const results = await Promise.allSettled(
        batch.map((recipient) => {
          const token = createNewsletterToken(recipient.id, 'unsubscribe')
          if (!token) throw new Error('Newsletter token secret is not configured')
          return sendOne(
            recipient.email,
            actionUrl(origin, '/newsletter/unsubscribe', token),
            false,
            actionUrl(origin, '/api/newsletter/unsubscribe', token)
          )
        })
      )
      for (const result of results) {
        if (result.status === 'fulfilled') sent += 1
        else failed += 1
      }
    }

    return { sent, failed }
  } finally {
    transport.close()
  }
}
