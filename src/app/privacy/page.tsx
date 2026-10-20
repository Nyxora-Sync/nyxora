import Link from 'next/link'
import { LegalPage } from '@/components/legal-page'
import { NEWSLETTER_ENABLED } from '@/lib/newsletter-feature'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'What MERN Learn stores, where it lives, why it exists, and how to remove it. Local-first progress, optional accounts, no ads or trackers.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <LegalPage
      badge="Legal"
      title="Privacy Policy"
      intro="Learning does not require an account. This page explains the data that does exist, why, and how to get rid of it."
      updated="October 20, 2026"
    >
      <h2>The short version</h2>
      <ul>
        <li>Progress and notes stay in your browser unless you sign in.</li>
        <li>An account stores your identity from GitHub, Google, or email, plus synced progress.</li>
        <li>Comments, projects, and profile fields you publish are public.</li>
        <li>We do not sell data, run advertising, or use third-party tracking scripts.</li>
      </ul>

      <h2>What stays in your browser</h2>
      <p>
        Lesson completion, XP, streaks, bookmarks, notes, your last visited lesson, and your theme
        preference are stored in <code>localStorage</code>. They are not sent to a server while you
        are signed out. You can clear them at any time through your browser&apos;s site-data
        settings; doing so removes your local progress and notes.
      </p>

      <h2>What we store when you sign in</h2>
      <ul>
        <li>
          <strong>Account identity:</strong> email address, display name, profile image URL, and the
          provider account id from GitHub or Google. If you use an email sign-in link, we store the
          email address.
        </li>
        <li>
          <strong>Session data:</strong> a session record with an expiry date so you stay signed in
          until you sign out or the session expires.
        </li>
        <li>
          <strong>Synced progress:</strong> lesson completion, XP, streak, bookmarks, notes, and your
          last visited lesson. Sync happens only after you sign in.
        </li>
        <li>
          <strong>Preferences:</strong> theme, preferred track, whether your progress is visible to
          others
          {NEWSLETTER_ENABLED
            ? ', and whether you opted into email updates.'
            : ', and any legacy email-updates preference saved before the newsletter was paused.'}
        </li>
      </ul>
      <p>
        We do not store passwords. Authentication is handled by OAuth providers or a single-use
        email link.
      </p>

      <h2>What is public</h2>
      <p>
        Lesson comments, project showcase entries, your display name, profile image, bio, and the
        profile links you choose to add are visible to anyone. If you turn off{' '}
        <strong>Show my learning progress</strong> in <Link href="/settings">settings</Link>, your XP,
        completed lessons, streaks, and badges are hidden from other people. Your email address is
        never shown on a public profile.
      </p>
      <p>
        Comments and projects can be deleted by their author. Deleting a parent comment also removes
        its replies.
      </p>

      {NEWSLETTER_ENABLED ? (
        <>
          <h2>Newsletter</h2>
          <p>
            If you subscribe, we store your email address, where it was collected (the footer or the
            newsletter page), the signup date, and when a confirmation email was sent. We send one
            confirmation email; only confirmed addresses receive updates. Confirmation and unsubscribe
            links are signed and expire, and unsubscribe links appear in every newsletter. Unsubscribing
            on the <Link href="/newsletter">newsletter page</Link> or through an email link deletes the
            stored address. For each broadcast we keep an audit record containing the sender, subject,
            recipient count, failure count, and date — not the email body. A global rate limit protects
            the signup form from abuse.
          </p>
        </>
      ) : (
        <>
          <h2>Newsletter (paused)</h2>
          <p>
            Newsletter signup and delivery are currently disabled. Any address submitted before the
            newsletter was paused remains in the database but will not receive emails. To remove it,
            use the <Link href="/contact">contact form</Link>.
          </p>
        </>
      )}

      <h2>Contact messages</h2>
      <p>
        The <Link href="/contact">contact form</Link> stores your optional name, email address, topic,
        message, and the date. Messages are used only to read and respond to you. If the mail server
        is configured, a notification is emailed to the maintainers; a copy of the message remains
        in the database until it is resolved or deleted.
      </p>

      <h2>Cookies and local storage</h2>
      <ul>
        <li>
          <strong>Essential cookies:</strong> the NextAuth session cookie (when signed in) and a
          short-lived CSRF cookie during sign-in. These are required for authentication.
        </li>
        <li>
          <strong>Local storage:</strong> theme, progress, notes, and bookmarks. These stay on your
          device.
        </li>
        <li>
          <strong>No tracking cookies:</strong> this site does not include advertising pixels,
          third-party analytics, or session-replay scripts.
        </li>
      </ul>

      <h2>Service providers</h2>
      <p>These providers process data on our behalf so the site works:</p>
      <ul>
        <li>
          <strong>Vercel</strong> hosts the site and keeps operational logs that may include IP
          addresses and user agents for security and diagnostics.
        </li>
        <li>
          <strong>Neon</strong> hosts the PostgreSQL database that contains accounts, progress,
          comments, projects, newsletter subscribers, and contact messages.
        </li>
        <li>
          <strong>GitHub and Google</strong> handle OAuth sign-in when you choose those providers.
        </li>
        <li>
          <strong>Our email provider</strong> delivers sign-in links and, when configured, contact
          notifications.
          {NEWSLETTER_ENABLED
            ? ' It also delivers newsletter confirmation and broadcast emails.'
            : ' Newsletter delivery is currently disabled.'}
        </li>
      </ul>
      <p>
        These providers may process data in countries other than yours. Their own privacy policies
        and security terms apply to their processing.
      </p>

      <h2>What we do not do</h2>
      <p>
        We do not sell personal data, use it for advertising, build advertising profiles, or send
        your notes and private messages to third parties. Public content is public because you chose
        to publish it, not because it was harvested.
      </p>

      <h2>Retention</h2>
      <ul>
        <li>Account data remains until you request deletion.</li>
        <li>Comments and projects remain until you delete them or your account is deleted.</li>
        {NEWSLETTER_ENABLED ? (
          <li>
            Newsletter addresses remain until you unsubscribe, including unconfirmed addresses that
            never completed the double opt-in step.
          </li>
        ) : (
          <li>
            Newsletter addresses collected before the newsletter was paused remain stored until you
            request deletion through the contact form.
          </li>
        )}
        <li>Contact messages remain until they are resolved or deleted.</li>
        <li>Hosting logs are retained according to the hosting provider&apos;s policy.</li>
      </ul>

      <h2>Your choices and rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct, export, or delete
        your personal data, and to object to or restrict certain processing. You can:
      </p>
      <ul>
        <li>Edit your profile and hide your progress in <Link href="/settings">settings</Link>.</li>
        <li>Delete your comments and projects directly on the site.</li>
        {NEWSLETTER_ENABLED && (
          <li>
            Unsubscribe from the newsletter on the <Link href="/newsletter">newsletter page</Link> or
            through the link in any newsletter email.
          </li>
        )}
        <li>
          Request an account export or deletion through the <Link href="/contact">contact form</Link>.
          We may ask you to verify control of the account first.
        </li>
        <li>Clear local progress and notes through your browser.</li>
      </ul>
      <p>
        Nothing here limits rights you have under mandatory local law, including the right to complain
        to your data protection authority.
      </p>

      <h2>Security</h2>
      <p>
        The site is served over HTTPS. Database access is restricted to the application, and
        authentication uses OAuth or single-use email links rather than stored passwords. No system
        is perfectly secure; if you find a vulnerability, please report it privately through the{' '}
        <Link href="/contact">contact page</Link> instead of posting details publicly.
      </p>

      <h2>Children</h2>
      <p>
        The site is intended for learners aged 13 and older, or 16 and older where local law sets a
        higher age for digital consent. It is not directed at younger children. If we learn that a
        child below the applicable age created an account, we will delete it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If the data practices change, this page will be updated and the date at the top will change.
        Material changes that affect existing accounts will be announced on the site before they take
        effect.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions and requests go through the <Link href="/contact">contact form</Link>,
        choosing the &ldquo;Privacy or account request&rdquo; topic.
      </p>
    </LegalPage>
  )
}
