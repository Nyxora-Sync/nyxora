# Newsletter and contact operations

> **Newsletter status: disabled.** The newsletter is switched off with
> `NEWSLETTER_ENABLED = false` in `src/lib/newsletter-feature.ts`. No signup form
> or navigation link is rendered, `/newsletter` and its confirmation and
> unsubscribe pages redirect home, and the newsletter and admin API routes return
> `404`. The implementation, database models, and existing addresses are
> preserved. See [Re-enabling the newsletter](#re-enabling-the-newsletter) before
> turning it back on.
>
> The contact form is still active. It stores data in the shared PostgreSQL
> database and degrades to a `503` when `DATABASE_URL` is missing.

## Newsletter

The newsletter uses double opt-in. A signup is **not** added to the sending list
until the address opens the confirmation email and presses the confirm button.

### Signup and confirmation flow

1. The footer or `/newsletter` form posts to `POST /api/newsletter`.
2. The route validates the email, applies the global rate limit, and upserts one
   `NewsletterSubscriber` row per address.
3. If the address is unconfirmed, the route sends one confirmation email. The
   signed link is valid for 48 hours.
4. `POST /api/newsletter/confirm` verifies the signed token and sets
   `confirmedAt`. The page at `/newsletter/confirm?token=...` performs the call
   from a button; the page itself does not mutate anything.
5. Only rows with `confirmedAt` set are included in a broadcast.

If the address is already confirmed, submitting the form again returns
`alreadyConfirmed` and sends nothing. If a confirmation was sent in the last 60
seconds, the route returns `alreadySent` instead of sending a duplicate.

### Signed links

Confirmation and unsubscribe tokens are HMAC-SHA256 signed, contain the
subscriber id, purpose, and expiry, and are verified without a token table.
`NEWSLETTER_SECRET` is optional; the code falls back to `AUTH_SECRET`.
Rotating either secret invalidates links already in inboxes.

- Confirmation links expire after 48 hours.
- Unsubscribe links expire after 10 years, so old newsletters still work.
- Unsubscribe links appear in every broadcast. Unsubscribing deletes the row
  immediately instead of adding a suppression record.

### API

| Method | Path | Auth | Behavior |
| --- | --- | --- | --- |
| `POST` | `/api/newsletter` | public | `{ email, source, website }`; `source` is `footer`, `newsletter`, or `site`; `website` is a honeypot. Returns `confirmationRequired`, `alreadyConfirmed`, or `alreadySent`. |
| `DELETE` | `/api/newsletter` | public | `{ email }` or `{ token }`; deletes the address and always succeeds for unknown email addresses. |
| `POST` | `/api/newsletter/confirm` | public | `{ token }`; idempotently marks the subscription confirmed. |
| `POST` | `/api/newsletter/unsubscribe` | public | `{ token }` or `?token=...`; used by the unsubscribe page and by mailbox-provider one-click unsubscribe. |
| `POST` | `/api/admin/newsletter` | admin | Sends a test or broadcast. See below. |

Broadcasts include:

```text
List-Unsubscribe: <https://your-site/api/newsletter/unsubscribe?token=...>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```

Mailbox providers can therefore POST to the API with no JSON body. The token is
read from the query string.

### Admin broadcasts

Open `/admin/newsletter` while signed in with an address listed in
`ADMIN_EMAILS` (comma separated, case-insensitive). Leave `ADMIN_EMAILS` empty
to disable the page. The page is `noindex` and is not linked from public
navigation.

The composer is plain text only, which avoids HTML injection and keeps the
emails readable in every client. It supports:

- **Send test to me** — prefixes the subject with `[TEST]` and uses a placeholder
  unsubscribe link. Test sends are recorded in the audit table.
- **Send to confirmed subscribers** — requires typing `SEND`. There is no undo,
  scheduling, or automatic retry.

Limits and safety:

- 500 confirmed recipients per request. For a larger list, send in batches or
  replace this with a queue before the list grows.
- One real broadcast per minute, to catch accidental double clicks.
- Partial failures return the sent/failed counts and are recorded; the admin
  must inspect the mail server before retrying.
- The message body is not stored. `NewsletterSend` records the sender, subject,
  recipient count, failure count, test flag, and date.

### Re-enabling the newsletter

1. Set `NEWSLETTER_ENABLED` to `true` in `src/lib/newsletter-feature.ts`.
2. Add working SMTP credentials for the production environment. These normally
   come from the email provider's dashboard; do not copy placeholder values from
   `.env.example`.
3. Set `ADMIN_EMAILS` to the exact email address used to sign in to the admin
   account. Optionally set `NEWSLETTER_SECRET`; otherwise the code falls back to
   `AUTH_SECRET`.
4. Confirm `NEXT_PUBLIC_SITE_URL` is the public production origin, or let Vercel
   derive it from `VERCEL_PROJECT_PRODUCTION_URL`, so confirmation and
   unsubscribe links point at the live domain.
5. Redeploy. Environment variable changes do not apply to an existing build.
6. Submit a real address, open the confirmation email, and complete a test send
   before broadcasting to the list.

Existing rows from before double opt-in are unconfirmed and will not receive
broadcasts. Any address submitted before the newsletter was disabled must be
submitted again to receive a fresh confirmation email.

### Email configuration

Newsletter signup and broadcasts require SMTP. The code accepts either:

```bash
EMAIL_SERVER_HOST=...
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=...
EMAIL_SERVER_PASSWORD=...
EMAIL_FROM="Nyxora Sync <newsletter@your-domain>"
```

or the legacy URL form:

```bash
EMAIL_SERVER="smtp://user:pass@host:587"
EMAIL_FROM="Nyxora Sync <newsletter@your-domain>"
```

`EMAIL_FROM` is required. Without usable SMTP, signup returns a friendly `503`
instead of silently storing an address that can never be confirmed.

### Production checklist

In Vercel, open **Project → Settings → Environment Variables → Production** and
add the SMTP values supplied by your email provider:

- `EMAIL_SERVER_HOST`
- `EMAIL_SERVER_PORT`
- `EMAIL_SERVER_USER`
- `EMAIL_SERVER_PASSWORD`
- `EMAIL_FROM`

Then add `ADMIN_EMAILS` with the exact email address you use to sign in to the
site. Optionally add `NEWSLETTER_SECRET`; otherwise the site falls back to
`AUTH_SECRET`. Confirm that `NEXT_PUBLIC_SITE_URL` is the public production
origin (or let Vercel derive it from `VERCEL_PROJECT_PRODUCTION_URL`) so
confirmation and unsubscribe links point at the live domain.

Redeploy after changing environment variables. While the feature flag is off,
the API returns `404` and no address is stored. When the flag is on but SMTP is
not configured, `POST /api/newsletter` returns `503` and no address is stored.

### Database and operations

The double opt-in migration added:

- `NewsletterSubscriber.confirmedAt` — null until the email is confirmed.
- `NewsletterSubscriber.confirmationSentAt` — used for the 60-second resend
  throttle.
- `NewsletterSubscriber.updatedAt` — row update timestamp.
- `NewsletterSend` — metadata-only audit trail for test and real sends.

Existing rows from before double opt-in are unconfirmed. They do not receive
broadcasts. To let one of those addresses join, submit it again through the
signup form so it gets a fresh confirmation email.

Read or export the list with:

```bash
npm run db:studio
```

Open `NewsletterSubscriber`. `confirmedAt IS NULL` means the address never
completed confirmation. `NewsletterSend` contains the send history. The global
limit is 200 signup requests per hour; it is a blunt abuse guard, not an
analytics metric.

### Not built

- No queue, scheduler, retry worker, or bounce/complaint handling.
- No open, click, or conversion tracking.
- No HTML composer or per-segment audiences.
- No suppression list; unsubscribe deletes the row.

For a much larger list, move sends to a background job and use a dedicated
email provider with bounce webhooks.

## Contact

- Route: `POST /api/contact` with `{ name, email, topic, message, website }`.
- Topics: `general`, `bug`, `content`, `conduct`, `privacy`, `security`.
- The message is validated (20–4000 characters), stored in `ContactMessage`, and then
  a notification email is attempted.
- `CONTACT_INBOX` is the notification recipient. It falls back to `EMAIL_FROM`.
- A mail failure is logged but does not fail the request: the message is already stored.
- Limits: three messages per sender email per hour and 100 messages per hour globally.
- The same `website` honeypot is used.

Read messages with `npm run db:studio` and open `ContactMessage`. Filter on
`handled = false`, and mark rows as handled after replying. Contact messages are not
visible in any public UI.

## Privacy notes

- Newsletter addresses are used only for curriculum updates. They are deleted on
  unsubscribe, and only confirmed addresses receive broadcasts.
- Contact messages are private to the maintainers. Do not paste them into public
  issues without the sender's permission.
- Both tables are covered by the site's privacy policy. If the retention or purpose
  changes, update that page and the date at the top.
