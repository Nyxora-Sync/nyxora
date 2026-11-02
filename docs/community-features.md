# Community Features

Nyxora Sync includes built-in community features to help learners connect, share, and learn together.

## Overview

The community system includes:

1. **Lesson Discussions** — Threaded comments on every lesson
2. **Project Showcase** — Share and discover real projects
3. **Public Profiles** — Learner profiles with progress and badges
4. **Follow System** — Follow other learners
5. **Notifications** — Real-time updates for replies, follows, upvotes
6. **Moderation** — Reporting and admin review tools

## Lesson Discussions

Every lesson page includes a discussion thread where learners can:
- Ask questions about the lesson content
- Share insights and alternative approaches
- Report errors or outdated examples
- Help other learners

### Features
- Threaded replies (up to 3 levels deep)
- Code blocks with syntax highlighting
- Upvote/downvote on comments
- Edit/delete own comments (15 min window)
- Pin important answers (maintainers only)

## Project Showcase

Learners can submit projects they've built to the showcase:

### Submission Requirements
- Project title and description
- Live demo URL (required)
- Source code URL (GitHub, GitLab, etc.)
- Track/module the project relates to
- Optional: screenshot, tech stack tags

### Discovery
- Filter by track, tech stack, difficulty
- Sort by newest, most upvoted, most viewed
- Search by keyword
- Featured projects highlighted by maintainers

## Public Profiles

Profiles show:
- Display name and bio
- Pinned badges (up to 3)
- Completed tracks and modules
- Public projects in showcase
- Followers/following counts
- Join date

### Privacy Controls
- Profile visibility: Public / Private
- Progress visibility: Public / Private
- Email visibility: Never shown publicly
- Option to delete account

## Follow System

- Follow other learners to see their activity
- Get notified when they post projects or comments
- Mutual follows enable direct messaging (future)

## Notifications

Real-time notifications for:
- Replies to your comments
- Upvotes on your comments/projects
- New followers
- Mentions
- Admin messages

Delivery: In-app + optional email digest

## Moderation

### Reporting
Users can report:
- Comments (spam, harassment, incorrect info)
- Projects (plagiarism, inappropriate content, broken links)
- Profiles (impersonation, harassment, spam)

### Admin Review
Maintainers review reports at `/admin/reports`:
- View reported content with context
- Take action: dismiss, warn, hide, ban
- Audit trail of all moderation actions

### Community Guidelines
See [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)

## Technical Details

### Data Model
- `Comment` — Lesson discussions, project comments
- `Project` — Showcase submissions
- `Profile` — Public learner profiles
- `Follow` — Follow relationships
- `Notification` — In-app notifications
- `Report` — Moderation reports

### API Endpoints
- `GET/POST /api/community/comments` — Lesson/project comments
- `GET/POST /api/community/projects` — Showcase projects
- `GET/PUT /api/community/profile` — Current user's profile
- `GET /api/community/people/[id]` — Public profiles
- `POST /api/community/people/[id]/follow` — Follow/unfollow
- `GET /api/community/notifications` — User notifications
- `POST /api/community/reports` — Submit report

### Real-time
- Powered by Server-Sent Events (SSE)
- Falls back to polling if SSE unavailable
- Connection managed via `/api/realtime`

## Contributing to Community Features

The community features are part of the private development repository. To contribute:

1. Report issues in this public repository
2. Suggest features via GitHub Issues
3. For code contributions, contact maintainers for access to the development repo

## Future Enhancements

- Direct messaging between mutual follows
- Study groups / cohorts
- Mentor matching
- Weekly challenges
- Leaderboards (opt-in)
- Rich text editor for comments
- Project collections / portfolios