# SEO Strategy

## Overview

Nyxora Sync follows a content-first SEO approach. Since the curriculum itself is the product, SEO focuses on making lessons discoverable for learners searching for specific topics.

## Principles

### Content-Driven
- Every lesson is a landing page for its topic
- Quality content ranks better than technical tricks
- Written-first means search engines can index everything

### User-First
- No keyword stuffing
- No cloaking or hidden content
- Fast, accessible, mobile-friendly

### Technical Excellence
- Server-side rendering for all lesson pages
- Proper semantic HTML
- Structured data (Schema.org)
- Fast Core Web Vitals

## On-Page SEO

### Per Lesson
Each lesson page includes:

```html
<title>{{lesson.title}} | Nyxora Sync</title>
<meta name="description" content="{{lesson.description}}" />
<meta name="keywords" content="{{lesson.tags.join(', ')}}" />

<!-- Open Graph -->
<meta property="og:title" content="{{lesson.title}} | Nyxora Sync" />
<meta property="og:description" content="{{lesson.description}}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="{{canonicalUrl}}" />
<meta property="og:image" content="{{ogImageUrl}}" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{{lesson.title}} | Nyxora Sync" />
<meta name="twitter:description" content="{{lesson.description}}" />
<meta name="twitter:image" content="{{ogImageUrl}}" />

<!-- Schema.org TechArticle -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "{{lesson.title}}",
  "description": "{{lesson.description}}",
  "keywords": "{{lesson.tags.join(', ')}}",
  "articleSection": "{{lesson.module}}",
  "inLanguage": "en-US",
  "author": {
    "@type": "Organization",
    "name": "Nyxora Sync"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Nyxora Sync",
    "logo": {
      "@type": "ImageObject",
      "url": "https://nyxora-sync.tech/site-logo.jpg"
    }
  }
}
</script>
```

### Breadcrumb Navigation
```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/learn">Learn</a></li>
    <li><a href="/learn/{{track}}">{{trackName}}</a></li>
    <li><a href="/learn/{{track}}/{{module}}">{{moduleName}}</a></li>
    <li aria-current="page">{{lesson.title}}</li>
  </ol>
</nav>
```

### Heading Hierarchy
- `h1` — Lesson title (once per page)
- `h2` — Major sections
- `h3` — Subsections
- No skipped levels

## Site Structure

### URL Patterns
```
/                           → Home
/learn                      → All tracks overview
/learn/:track               → Track overview
/learn/:track/:module       → Module overview
/learn/:track/:module/:lesson  → Lesson page
/categories                 → All categories
/categories/:category       → Category page
/roadmap                    → Full curriculum roadmap
/planned                    → Planned/future tracks
/community                  → Community hub
/community/showcase         → Project showcase
/community/showcase/:id     → Project detail
/community/people/:id       → Public profile
/about                      → About page
/contribute                 → Contribution guide
/newsletter                 → Newsletter signup
/contact                    → Contact form
/privacy                    → Privacy policy
/terms                      → Terms of service
/code-of-conduct            → Code of conduct
/faq                        → Frequently asked questions
/resources                  → Curated resources
/badges                     → Badge system
/certificates               → Certificate verification
```

### Sitemap
- Auto-generated via `next-sitemap`
- Includes all lesson pages, track pages, module pages
- Updated on each deploy
- Submitted to Google Search Console

### Robots.txt
```
User-agent: *
Allow: /

Sitemap: https://nyxora-sync.tech/sitemap.xml
```

## Structured Data Types

### TechArticle (Lessons)
For every lesson page.

### Course (Tracks)
```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Beginner Web Development Track",
  "description": "Start from zero: HTML, CSS, JavaScript, Git, and a portfolio project",
  "provider": {
    "@type": "Organization",
    "name": "Nyxora Sync",
    "sameAs": "https://github.com/Nyxora-Sync/nyxora"
  },
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "courseWorkload": "PT40H",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  }
}
```

### ItemList (Module Lessons)
For module overview pages showing all lessons.

### BreadcrumbList
On all pages except home.

### WebSite (Home)
With SearchAction for site search.

## Performance

### Core Web Vitals Targets
- **LCP** < 2.5s — Server-rendered content, optimized images
- **INP** < 200ms — Minimal client-side JS, progressive enhancement
- **CLS** < 0.1 — Reserved space for images, fonts loaded properly

### Optimization Techniques
- Next.js App Router with RSC
- Static generation for lesson content
- Image optimization (WebP/AVIF, responsive sizes)
- Font optimization (self-hosted, preload, `font-display: swap`)
- Minimal JS bundles (code splitting by route)
- Edge caching for static assets

## Content Strategy

### Target Keywords
Primary (per lesson):
- Specific technical terms: "JavaScript async await", "React useEffect cleanup"

Secondary (per track/module):
- Learning paths: "free web development course", "learn C programming"

Long-tail (per lesson):
- Questions: "how to handle errors in Express", "what is useMemo in React"

### Content Clusters
Each track forms a topic cluster:
- Pillar page: Track overview (`/learn/beginner`)
- Cluster pages: Module pages (`/learn/beginner/web-foundations`)
- Leaf pages: Individual lessons

Internal linking connects all pages in a cluster.

## Monitoring

### Tools
- Google Search Console (indexing, queries, CTR)
- Vercel Analytics (Core Web Vitals, real-user metrics)
- Ahrefs/Semrush (ranking tracking, competitive analysis)

### Key Metrics
- Organic traffic to lesson pages
- Lesson completion rates (proxy for content quality)
- Search position for target keywords
- Index coverage (no crawl errors)

## Internationalization (Future)

When translations are added:
- Separate URLs per language: `/es/learn/...`, `/pt/learn/...`
- `hreflang` tags on all pages
- Localized sitemaps
- Localized structured data

## Checklist for New Pages

- [ ] Unique, descriptive `<title>` (50-60 chars)
- [ ] Compelling meta description (150-160 chars)
- [ ] Proper heading hierarchy
- [ ] Structured data (JSON-LD)
- [ ] Open Graph + Twitter cards
- [ ] Breadcrumb navigation
- [ ] Internal links to related content
- [ ] Canonical URL set
- [ ] Images optimized with alt text
- [ ] Fast loading (check LCP)
- [ ] Mobile-friendly
- [ ] Accessible (WCAG AA)
- [ ] Added to sitemap