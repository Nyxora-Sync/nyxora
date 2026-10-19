# Community Features

Community features turn MERN Learn from a course into a place to learn with other people.
Everything here is optional: without `DATABASE_URL` the lessons, playground, and local progress
tracking keep working, and the community routes return a clear `503` instead of crashing.

## What exists

| Surface | Route | Source |
| --- | --- | --- |
| Community hub | `/community` | `src/app/community/page.tsx` |
| Project showcase | `/community/showcase` | `src/app/community/showcase/page.tsx` |
| Project detail + discussion | `/community/showcase/[id]` | `src/app/community/showcase/[id]/page.tsx` |
| Public learner profile | `/community/people/[id]` | `src/app/community/people/[id]/page.tsx` |
| Profile & privacy settings | `/settings` | `src/app/settings/page.tsx` |
| Lesson discussion | bottom of every lesson | `src/components/lesson-client.tsx` |
| Contribution guide | `/contribute` | `src/app/contribute/page.tsx` |

`/showcase` permanently redirects to `/community/showcase` for old links.

## Data model

Added in `prisma/migrations/20261019213529_community`:

- `User.bio`, `website`, `githubUrl`, `twitterUrl` — optional public profile fields.
- `Project` — existing showcase model. `upvotes` is a denormalized counter used for sorting.
- `ProjectUpvote` — one row per `(projectId, userId)`. The counter and the row move in the same
  transaction; the unique constraint makes double-clicks harmless.
- `Comment` — polymorphic by `targetType` (`lesson` | `project`) + `targetId`. Replies are one
  level deep (`parentId` points at a top-level comment). Deleting a parent cascades to replies.

Target ids are validated on write: lesson ids must exist in `src/lib/curriculum.ts`, project ids
must exist in the database. This keeps orphaned discussions out of the table.

## API

All routes live under `src/app/api/community/`. Auth is the NextAuth session (`auth()`); the
database is Prisma.

| Method | Path | Auth | Behavior |
| --- | --- | --- | --- |
| `GET` | `/api/community/projects` | public | Cursor pagination; `track`, `q`, `sort=newest\|popular`, `limit` (max 48). Includes comment counts and viewer upvote state. |
| `POST` | `/api/community/projects` | required | Zod validated; max 5 projects per user per 24h. |
| `GET` | `/api/community/projects/[id]` | public | Detail + `isOwner` + viewer upvote state. |
| `PATCH` | `/api/community/projects/[id]` | owner | Partial update. |
| `DELETE` | `/api/community/projects/[id]` | owner | Deletes project comments, then the project (upvotes cascade). |
| `POST` | `/api/community/projects/[id]/upvote` | required | Toggle; returns `{ upvoted, upvotes }`. |
| `GET` | `/api/community/comments` | public | `targetType` + `targetId`; newest 200 top-level comments with up to 50 replies each, nested. |
| `POST` | `/api/community/comments` | required | One-level replies; max 12 comments per user per 10 minutes. |
| `DELETE` | `/api/community/comments/[id]` | author | Replies cascade. |
| `GET` | `/api/community/profile` | required | Own profile + preferences (includes email; never public). |
| `PATCH` | `/api/community/profile` | required | Profile fields and `showProgress` / `emailUpdates`. |
| `GET` | `/api/community/people/[id]` | public | Public profile. Progress is hidden unless `showProgress` is true or the viewer is the owner. |
| `GET` | `/api/community/stats` | public | Real counts used on the community hub — no invented numbers. |

Every route starts with `communityEnabled()` and returns
`503 COMMUNITY_UNAVAILABLE` when `DATABASE_URL` is missing.

## Rules and safety

- Ownership: only a project owner can edit or delete it; only a comment author can delete it.
  There is no admin/moderator role yet.
- Privacy: email is never returned by public routes. `showProgress = false` hides XP, completed
  lessons, streaks, and badges from other learners.
- URLs: project and profile links must be valid `http(s)` URLs. User text is rendered as text
  (React escapes it), and newlines are preserved with `whitespace-pre-wrap`.
- Rate limits use row counts over a sliding window, so they need no extra infrastructure.
- Profiles with no name, bio, or image are not published (the owner can still open their own).

## UI components

- `src/components/community/showcase-client.tsx` — search, track filter, sort, pagination,
  empty/loading/error states.
- `src/components/community/project-card.tsx`, `upvote-button.tsx`, `share-project-dialog.tsx`.
- `src/components/community/comment-thread.tsx` — shared by lessons and project pages.
- `src/components/community/profile-client.tsx`, `community-stats.tsx`.
- `src/components/settings/settings-client.tsx`.

`CommunityStats` fetches real aggregate counts after mount; the server-rendered shell shows
dashes, so the page stays fast and degrades cleanly if the API is unavailable.

## Verification

```bash
npx tsc --noEmit
npm run lint
npm run build
```

The API can be exercised without an OAuth round-trip by inserting a temporary `Session` row for
a test user and sending its token as the `authjs.session-token` cookie. The end-to-end pass
covered: profile update, project create/list/detail/upvote toggle/delete, lesson comment + reply,
project comment, public profile, stats, validation failures, auth failures, ownership deletes,
and the progress-privacy toggle.

## Not built yet

- No report/flag queue or moderator tools.
- No image uploads (screenshot URLs only).
- No comment editing; authors delete and repost.
- Comments are capped at 200 top-level per target in the response.
- The showcase is intentionally empty until someone shares the first project.
