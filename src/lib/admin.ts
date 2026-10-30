/**
 * Admin access is ONLY granted to the dedicated admin account (admin@nyxora.local).
 * The ADMIN_EMAILS environment variable is used ONLY for notification purposes
 * (e.g., where to send moderation reports), NOT for granting admin privileges.
 * This prevents OAuth users (Google/GitHub) from accidentally gaining admin access.
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false

  // Only the dedicated admin account has admin privileges
  return email.toLowerCase() === 'admin@nyxora.local'
}

/**
 * Get list of email addresses that should receive admin notifications.
 * This is separate from admin privileges - these emails receive notifications
 * but do NOT get admin access to /admin routes.
 */
export function getAdminNotificationEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
}
