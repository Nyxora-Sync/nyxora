interface ContactMessageInput {
  name: string | null
  email: string
  topic: string
  message: string
}

/**
 * Best-effort notification. The message is always stored first; a mail failure
 * must never turn a successfully stored message into an error for the sender.
 */
export async function sendContactNotification(input: ContactMessageInput): Promise<void> {
  const host = process.env.EMAIL_SERVER_HOST
  if (!host) return

  // Load nodemailer only when email is actually configured. Keeping it out of
  // the module graph lets the app run on Cloudflare Workers without SMTP.
  const { default: nodemailer } = await import('nodemailer')
  const port = Number(process.env.EMAIL_SERVER_PORT || 587)
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: process.env.EMAIL_SERVER_USER
      ? {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        }
      : undefined,
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  })

  const from = process.env.EMAIL_FROM || 'Nyxora Sync <noreply@localhost>'
  const to = process.env.CONTACT_INBOX || process.env.EMAIL_FROM || 'noreply@localhost'

  await transporter.sendMail({
    from,
    to,
    replyTo: input.email,
    subject: `[Nyxora Sync] ${input.topic} message`,
    text: [
      `From: ${input.name ?? 'Anonymous'} <${input.email}>`,
      `Topic: ${input.topic}`,
      '',
      input.message,
    ].join('\n'),
  })
}
