/**
 * Newsletter feature switch.
 *
 * The newsletter implementation is intentionally kept in the repository so it
 * can be re-enabled later. While this is `false`:
 *
 * - no newsletter form or link is rendered anywhere on the site
 * - `/newsletter`, `/newsletter/confirm`, and `/newsletter/unsubscribe` redirect home
 * - every newsletter and newsletter-admin API route returns 404
 * - the admin page returns 404
 *
 * The database models and any previously submitted addresses are retained.
 *
 * To re-enable:
 * 1. Set this to `true`.
 * 2. Configure SMTP and `ADMIN_EMAILS` in the deployment environment.
 * 3. Redeploy.
 *
 * The sitemap entry and public links follow this flag automatically.
 */
export const NEWSLETTER_ENABLED = false
