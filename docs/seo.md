# SEO and metadata

Most SEO behavior is centralized in `src/lib/seo.ts`.

## Canonical origin

The public origin is resolved in this order:

1. `NEXT_PUBLIC_SITE_URL`
2. `VERCEL_PROJECT_PRODUCTION_URL` (Vercel's stable production hostname)
3. `http://localhost:3000`

Set `NEXT_PUBLIC_SITE_URL` to the final public origin when a custom domain is
added. It must not have a trailing slash. Canonical tags, Open Graph URLs, the
sitemap, and JSON-LD all use this value.

## Page metadata

Public pages call `pageMetadata()` with a title, description, and path. It adds:

- a self-referencing canonical URL
- Open Graph and Twitter card fields
- the shared 1200×630 image at `/og-image.png`
- optional `noindex` for private pages

Private or thin pages (`/dashboard`, `/settings`, `/auth/*`, public profile and
project detail shells) are `noindex`. They are also excluded from the sitemap and
most are disallowed in `robots.txt`.

## Shared module canonicalization

The beginner and developer tracks share four core modules: `node-express`,
`mongodb`, `react`, and `fullstack`. Those pages render the same lessons at two
URLs. `canonicalLearnPath()` points both copies at the developer-track URL, and
the sitemap only lists the canonical copy.

Unique beginner modules such as `foundations` remain canonical on the beginner
track.

## Sitemap and robots

- `/sitemap.xml` is generated from `src/app/sitemap.ts`.
- `/robots.txt` is generated from `src/app/robots.ts`.
- Both are static routes and are regenerated on deploy.
- The sitemap contains 82 canonical URLs: public static pages, both tracks, and
  every unique module and lesson.

## Structured data

`src/components/structured-data.tsx` renders escaped JSON-LD.

- Every page: `Organization` and `WebSite`.
- Track pages: `Course` and `BreadcrumbList`.
- Module pages: `BreadcrumbList`.
- Lesson pages: `LearningResource` and `BreadcrumbList`.

Validate changes with the [Schema Markup Validator](https://validator.schema.org/)
and Google's [Rich Results Test](https://search.google.com/test/rich-results).

## After a domain change

1. Set `NEXT_PUBLIC_SITE_URL` in the hosting environment.
2. Redeploy.
3. Verify canonical tags, `robots.txt`, and `sitemap.xml` use the new origin.
4. Add the domain to Google Search Console and submit `/sitemap.xml`.
