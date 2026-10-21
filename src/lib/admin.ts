/**
 * Maintainer access is controlled by a comma-separated ADMIN_EMAILS
 * environment variable. Keep this server-only; never expose it to clients.
 * The admin user (admin@nyxora.local) is always considered an admin.
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false

  // The dedicated admin account always has access
  if (email.toLowerCase() === 'admin@nyxora.local') return true

  const admins = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)

  return admins.includes(email.trim().toLowerCase())
}
