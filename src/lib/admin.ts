/**
 * Maintainer access is controlled by a comma-separated ADMIN_EMAILS
 * environment variable. Keep this server-only; never expose it to clients.
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false

  const admins = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  return admins.includes(email.trim().toLowerCase())
}
