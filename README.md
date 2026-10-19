# MERN Learn

A free, open-source learning platform that takes you from zero to MERN stack mastery — with a curated roadmap, hand-picked free resources, interactive code playgrounds, progress tracking, and community features.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Content](https://img.shields.io/badge/content-CC%20BY--SA%204.0-green.svg)

## ✨ Features

- **Dual learning tracks** — Beginner (starts from HTML/CSS/JS) and Developer (straight to MERN)
- **Curated free resources** — A searchable directory plus hand-picked videos, articles, and docs in every lesson. No paywalls, no affiliate links
- **Interactive playground** — In-browser HTML/CSS/JS editor with live preview, plus one-click launches for Node, Express, React, and MongoDB environments via StackBlitz
- **Progress tracking** — Lessons completed, XP, levels, streaks, badges, notes, and bookmarks. Stored locally with optional account sync
- **Dashboard** — Track your journey across both tracks with stats, badges, and bookmarks
- **Searchable resource directory** — Filter by topic, type, and difficulty
- **Community** — Lesson discussions, project showcase, public learner profiles, and contribution guides
- **Dark mode** — System-aware, with a manual toggle

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix) |
| Auth | NextAuth.js (Auth.js v5) — GitHub, Google, Email magic links |
| ORM | Prisma 6 |
| Database | PostgreSQL (any provider: Vercel, Supabase, Neon, local) |
| Icons | Lucide + custom brand SVGs |
| State | React hooks + localStorage |

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 20+
- PostgreSQL 14+ (or a free cloud Postgres: [Neon](https://neon.tech), [Supabase](https://supabase.com), [Vercel Postgres](https://vercel.com/storage/postgres))

### 2. Install

```bash
git clone <your-repo-url> mern-learn
cd mern-learn
npm install
```

### 3. Configure environment

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | Random secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | ✅ | `http://localhost:3000` in dev |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Optional | [Create an OAuth app](https://github.com/settings/developers) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `EMAIL_SERVER*` | Optional | SMTP for magic-link sign-in (e.g. Resend, Gmail, Mailtrap) |

> The app works without auth configured — progress tracking uses localStorage by default.

### 4. Set up the database

```bash
npx prisma migrate dev --name init
npm run db:seed        # optional: seed badges
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Create/apply migrations |
| `npm run db:push` | Push schema without migrations (prototyping) |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed badges |

## 📁 Project Structure

```
src/
├── app/
│   ├── learn/                    # Curriculum routes
│   │   ├── page.tsx              # Track selection
│   │   └── [track]/[module]/[lesson]/
│   ├── dashboard/                # Progress dashboard
│   ├── resources/                # Searchable resource directory
│   ├── playground/               # Interactive code playground
│   ├── roadmap/                  # Visual roadmap
│   ├── community/                # Community hub
│   ├── auth/                     # Sign in / error / verify
│   └── api/auth/[...nextauth]/   # Auth.js route handlers
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   ├── icons/                    # Brand SVG icons
│   └── *.tsx                     # Feature components
├── hooks/
│   └── use-progress.ts           # localStorage progress engine
├── lib/
│   ├── curriculum.ts             # Tracks → modules → lessons
│   ├── resources-data.ts         # Curated resource directory
│   ├── auth/                     # Auth.js config + email
│   ├── db.ts                     # Prisma singleton
│   └── utils.ts                  # cn(), accent colors, XP math
└── types/                        # Types (next-auth augmentation)
```

## 🎓 Curriculum

**Beginner Track (~16 weeks)**
1. Web Foundations — how the web works, HTML, CSS, JS, DOM, async, ES6+, Git, portfolio project
2. Node.js & Express — runtime, routing, REST, auth, testing
3. MongoDB & Mongoose — documents, schemas, relations, aggregation
4. React — components, hooks, routing, state, forms, performance
5. Full Stack Mastery — architecture, integration, Socket.io, uploads, deployment, capstone

**Developer Track (~10 weeks)** — modules 2–5 above, for people who already know JS.

Content lives in `src/lib/curriculum.ts`. Add lessons by appending to a module's `lessons` array.

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit with clear messages
4. Open a pull request

Ideas welcome: new lessons, better resources, translations, accessibility fixes, UI improvements, bug reports.

### Adding a resource

Edit `src/lib/resources-data.ts` and add an entry:

```ts
{
  id: 'unique-id',
  title: 'Resource title',
  url: 'https://…',
  description: 'One or two sentences.',
  type: 'video' | 'article' | 'docs' | 'interactive' | 'course' | 'book' | 'project' | 'tool',
  topic: 'html-css' | 'javascript' | 'node' | 'express' | 'mongodb' | 'react' | 'fullstack' | 'git' | 'testing' | 'deployment',
  provider: 'Provider name',
  level: 'beginner' | 'intermediate' | 'advanced',
  duration: '2 hours',        // optional
  isVerified: true,           // optional: official/high quality
  tags: ['tag1', 'tag2'],
}
```

## 🚢 Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables (`DATABASE_URL`, `AUTH_SECRET`, OAuth keys)
4. Deploy — `postinstall` runs `prisma generate` automatically

Run migrations against your production DB:

```bash
DATABASE_URL="<prod-url>" npx prisma migrate deploy
```

### Other platforms

Any Node host works (Render, Railway, Fly.io). Requirements: Node 20+, build command `npm run build`, start command `npm start`, and the env vars above.

## 🔐 Security Notes

- Never commit `.env.local` (it's gitignored)
- Generate a fresh `AUTH_SECRET` for production
- OAuth callback URLs: `https://your-domain/api/auth/callback/github` (and `/google`)
- Progress data is local-first and syncs to the signed-in account when enabled

## 📄 License

- **Code:** MIT (see `LICENSE`)
- **Content:** CC BY-SA 4.0 (see `LICENSE-CONTENT`)

## 🙏 Acknowledgements

Built with love for the free-learning community. Resources are curated from freeCodeCamp, MDN, The Odin Project, Full Stack Open, Net Ninja, Traversy Media, Web Dev Simplified, official docs, and many other generous educators.
