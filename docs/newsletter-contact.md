# Newsletter and contact operations

Both features store data in the shared PostgreSQL database and degrade to a `503`
when `DATABASE_URL` is missing. The rest of the site keeps working.

## Newsletter

- Route: `POST /api/newsletter` with `{ email, source, website }`.
- `source` is `footer` or `newsletter`; it defaults to `site` for direct API calls.
- `website` is a honeypot. A non-empty value returns success without storing anything.
- Signups are upserted by email, so submitting the same address twice keeps one row.
- Route: `DELETE /api/newsletter` with `{ email }`. It deletes the row and returns
  success even when the address was not on the list, so the response cannot be used
  to discover subscribers.
- The global limit is 200 new signup requests per hour. It is a blunt abuse guard,
  not an analytics metric.

Read or export the list with:

```bash
npm run db:studio
```

Then open `NewsletterSubscriber`. The `source` and `createdAt` columns are useful for
understanding where signups came from. Unsubscribing deletes the address rather than
flagging it, so there is no suppression list to maintain.

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

- Newsletter addresses are used only for curriculum updates and are deleted on
  unsubscribe.
- Contact messages are private to the maintainers. Do not paste them into public
  issues without the sender's permission.
- Both tables are covered by the site's privacy policy. If the retention or purpose
  changes, update that page and the date at the top.
