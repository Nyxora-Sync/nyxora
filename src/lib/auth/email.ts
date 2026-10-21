export async function sendVerificationRequest(params: {
  identifier: string
  url: string
  provider: { from?: string | null }
}) {
  const { identifier: email, url, provider } = params
  const from = provider.from || process.env.EMAIL_FROM || 'Nyxora Sync <noreply@localhost>'

  const { default: nodemailer } = await import('nodemailer')

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })

  await transporter.sendMail({
    from,
    to: email,
    subject: `Sign in to Nyxora Sync`,
    text: `Sign in to Nyxora Sync\n${url}\n\nThis link expires in 24 hours.`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a2e; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 40px; text-align: center;">
            <h1 style="color: #fff; margin: 0 0 16px; font-size: 28px;">Nyxora Sync</h1>
            <p style="color: #a0aec0; margin: 0 0 32px;">Sign in to continue your learning journey</p>
            <a href="${url}" style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Sign in to Nyxora Sync</a>
            <p style="color: #718096; margin: 24px 0 0; font-size: 14px;">This link expires in 24 hours.<br>If you didn't request this, please ignore this email.</p>
          </div>
        </body>
      </html>
    `,
  })
}