# Lesson Content Guidelines

This document outlines the standards for lesson content in Nyxora Sync.

## Core Principles

### Free Means Free
- No trial, paywall, upsell, or locked capstone
- The whole curriculum is readable without an account
- External links are optional depth, never a requirement

### Written First
- Lessons are complete on the page
- External links are extra depth, never required reading
- A slow connection should not block learning

### Accuracy Over Volume
- Versions and APIs checked against current docs
- When something breaks, the lesson gets fixed, not buried
- Include version numbers for tools and frameworks

### Local-First Progress
- Progress and notes live in the browser
- Sign in only for syncing, discussions, or showcase
- No dark patterns, no fake urgency

## Lesson Structure

### Required Sections
1. **Introduction** — What you'll learn and why it matters
2. **Core Concepts** — The main explanation with runnable examples
3. **Hands-On Practice** — Exercises or playground interactions
4. **Summary** — Key takeaways
5. **What's Next** — Link to the next lesson

### Optional Sections
- **Common Mistakes** — Callouts with `type="warning"`
- **Go Deeper** — Callouts with `type="info"` for advanced topics
- **Security Notes** — Callouts with `type="danger"` for security-critical topics
- **Pro Tips** — Callouts with `type="tip"` for best practices

## Code Examples

### Requirements
- Every example must be runnable
- Show both input and expected output
- Include comments for non-obvious parts
- Use realistic variable names (not `foo`, `bar`)

### Formats
```javascript
// Inline for single concepts
const greeting = `Hello, ${name}!`;

// Code blocks for complete examples
function createUser(name, email) {
  return {
    id: crypto.randomUUID(),
    name,
    email,
    createdAt: new Date().toISOString(),
  };
}

// Terminal output
// $ node create-user.js
// Created user: { id: '...', name: 'Ada', email: 'ada@example.com' }
```

## Resources

### Curated Resources
Each lesson may include 3-5 curated free resources:

```yaml
resources:
  - title: 'MDN: Array.prototype.map'
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map'
    description: 'Official documentation with interactive examples'
    type: 'docs'
  - title: 'JavaScript Array Methods Visualized'
    url: 'https://example.com/array-methods'
    description: 'Visual explanation of map, filter, reduce'
    type: 'article'
```

### Resource Criteria
- **Free forever** — No trials, no paywalls, no required signup
- **Permanently accessible** — Prefer stable domains (MDN, official docs, established educational sites)
- **High quality** — Accurate, well-written, up-to-date
- **Relevant** — Directly supports the lesson's learning objectives

### Resource Types
- `docs` — Official documentation
- `video` — Video tutorials (YouTube, freeCodeCamp, etc.)
- `article` — Written tutorials and deep dives
- `interactive` — Interactive playgrounds, visualizations
- `reference` — Specifications, RFCs, cheat sheets

## Accessibility

### Writing
- Use clear, simple language
- Define jargon on first use
- Avoid cultural references that may not translate
- Use inclusive language

### Structure
- Proper heading hierarchy (h1 → h2 → h3)
- Descriptive link text (not "click here")
- Alt text for all images
- Sufficient color contrast in diagrams

### Code
- Meaningful variable names
- Comments for complex logic
- Avoid color-only indicators in output

## SEO Considerations

### Metadata
- **Title**: Clear, descriptive, includes key term
- **Description**: 150-160 chars, compelling, includes key term
- **Keywords**: 3-5 relevant terms

### Content
- Key term in first paragraph
- Key term in at least one h2
- Natural keyword usage (no stuffing)
- Internal links to related lessons

## Quality Checklist

Before publishing, verify:

### Content
- [ ] Concept explained completely on the page
- [ ] All code examples tested and working
- [ ] No required external dependencies
- [ ] Progressive complexity
- [ ] Accurate version information

### Formatting
- [ ] Frontmatter complete and valid
- [ ] Heading hierarchy correct
- [ ] Code blocks have language specified
- [ ] Callouts used appropriately
- [ ] Links work and are stable

### Accessibility
- [ ] Images have alt text
- [ ] Link text is descriptive
- [ ] Jargon defined on first use
- [ ] Color not sole information carrier

### SEO
- [ ] Title and description optimized
- [ ] Key terms naturally included
- [ ] Internal links to related content
- [ ] Structured data included

## Updating Lessons

When frameworks/APIs change:
1. Update the lesson content
2. Update version references
3. Test all code examples
4. Update `estimatedMinutes` if scope changed
5. Add to changelog if significant

## Translations

- Keep English as source of truth
- Translate frontmatter `title` and `description`
- Translate content, keep code examples in English
- Use consistent terminology across translations