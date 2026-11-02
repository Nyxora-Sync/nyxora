# Newsletter & Contact System

## Newsletter

Nyxora Sync offers an optional newsletter for curriculum updates.

### Features
- **Double opt-in** — Confirmation email required before subscribing
- **Low frequency** — Only when substantial updates ship
- **Easy unsubscribe** — One-click, deletes address immediately
- **No tracking** — No open rates, no click tracking, no pixels

### What Triggers an Email
- New module or substantial batch of lessons
- Major rewrites when framework/API changes invalidate examples
- Occasional community milestones (standout showcase project, curriculum contribution)

### What You Won't Get
- Daily/weekly "streak" nudges
- Ads, affiliate pitches, or sold addresses
- Fixed schedule invented for open rates

### Technical Implementation
- Stored in `NewsletterSubscriber` table (email, confirmed, confirmedAt, unsubscribedAt)
- Confirmation token sent via email (expires 24h)
- Unsubscribe token in every email
- Admin interface at `/admin/newsletter` (maintainers only)

### Privacy
- Addresses stored only for this list
- Never sold or shared
- Only confirmed addresses receive emails
- Every email includes unsubscribe link that deletes the address
- See [Privacy Policy](../PRIVACY.md) for full details

---

## Contact Form

The floating contact button opens a contact form for:
- General inquiries
- Bug reports
- Partnership requests
- Press inquiries

### Processing
- Submissions stored in `ContactMessage` table
- Email notification attempted (optional, requires SMTP config)
- Maintainers read/reply at `/admin/messages`
- Same page linked from Settings → Privacy → Maintainer tools

### Admin Features
- View all messages with status (new, read, replied, archived)
- Reply by email (opens mailto: with context)
- Mark handled
- Filter by status, date

### Technical
- No external dependencies for core functionality
- SMTP optional (`EMAIL_SERVER_*`, `EMAIL_FROM`, `CONTACT_INBOX`)
- Rate limited (5 submissions/hour per IP)
- honeypot field for bot detection

---

## Related Documentation
- [Privacy Policy](privacy.md)
- [Contributing Guide](../CONTRIBUTING.md)