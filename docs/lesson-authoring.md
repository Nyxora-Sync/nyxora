# Lesson Authoring Guide

This guide explains how to write lessons for Nyxora Sync. Lessons are written in **MDX** (Markdown with JSX components) and live in `src/content/lessons/`.

## File Structure

```
src/content/lessons/
├── lesson-slug.mdx
├── another-lesson.mdx
└── ...
```

Each lesson file corresponds to a single lesson in a module.

## Frontmatter

Every lesson must start with YAML frontmatter:

```yaml
---
title: 'Lesson Title'
description: 'One-sentence summary shown in module listings and search'
order: 1                    # Position within the module (1-based)
module: 'module-key'        # Module key from curriculum.ts
track: 'track-key'          # Track key from curriculum.ts
difficulty: 'beginner'      # 'beginner' | 'intermediate' | 'advanced'
estimatedMinutes: 30        # Rough reading + practice time
tags: ['html', 'css']       # For search and related lessons
prerequisites: ['previous-lesson-slug']  # Optional: lesson IDs that should be completed first
resources:                  # Optional curated free resources
  - title: 'Resource Title'
    url: 'https://example.com'
    description: 'Why this resource is useful'
    type: 'docs'            # 'docs' | 'video' | 'article' | 'interactive' | 'reference'
---
```

## Content Guidelines

### 1. Written First
Every concept must be fully explained on the page. External links are **optional depth**, never required reading. A learner should understand the concept without clicking any link.

### 2. Runnable Examples
All code examples must work when copied. Test your examples before submitting.

```jsx
// ✅ Good: Complete, runnable example
function greet(name) {
  return `Hello, ${name}!`;
}
console.log(greet('World')); // "Hello, World!"
```

```jsx
// ❌ Bad: Incomplete snippet
function greet(name) {
  // ...
}
```

### 3. Progressive Disclosure
Start simple, then layer complexity. Use callouts for "go deeper" content.

### 4. Accuracy Over Volume
Verify against current documentation. Include version numbers where relevant.

## MDX Components

### Callouts
```mdx
<Callout type="info" title="Did you know?">
  Additional context that's helpful but not required.
</Callout>

<Callout type="warning" title="Common mistake">
  Warn about pitfalls.
</Callout>

<Callout type="tip" title="Pro tip">
  Best practices and shortcuts.
</Callout>

<Callout type="danger" title="Security note">
  Critical security warnings.
</Callout>
```

### Code Blocks with Playground
```mdx
<CodeBlock 
  language="javascript" 
  filename="example.js"
  playground 
  editable
>
{`console.log("Edit me!");`}
</CodeBlock>
```

### Quizzes
```mdx
<Quiz>
  <QuizQuestion question="What does HTML stand for?">
    <QuizOption value="a" correct>HyperText Markup Language</QuizOption>
    <QuizOption value="b">High Tech Modern Language</QuizOption>
    <QuizOption value="c">Home Tool Markup Language</QuizOption>
  </QuizQuestion>
</Quiz>
```

### Exercises
```mdx
<Exercise 
  title="Build a Counter" 
  difficulty="easy"
  estimatedMinutes={15}
>
  Create a button that increments a counter on click.
  
  <ExerciseHint>
    Use the `useState` hook.
  </ExerciseHint>
  
  <ExerciseSolution>
    {`import { useState } from 'react';
    
    function Counter() {
      const [count, setCount] = useState(0);
      return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
    }`}
  </ExerciseSolution>
</Exercise>
```

### Structured Data (for SEO)
```mdx
<StructuredData 
  type="TechArticle"
  headline="Lesson Title"
  description="Lesson description"
  keywords={['tag1', 'tag2']}
/>
```

## Writing Style

### Tone
- **Conversational but precise**: Write like you're pair programming
- **No fluff**: Every sentence should teach something
- **Second person**: "You'll learn..." not "We'll learn..."
- **Active voice**: "The browser parses HTML" not "HTML is parsed by the browser"

### Formatting
- **Headings**: Use `##` for main sections, `###` for subsections
- **Bold** for key terms on first use
- **Inline code** for: variable names, function names, file paths, CLI commands
- **Code blocks** for: multi-line examples, configurations, terminal output

### Length
- Target 15-45 minutes reading + practice time
- If a lesson exceeds 60 minutes, consider splitting it
- If under 10 minutes, consider merging with adjacent lesson

## Curriculum Integration

Lessons are connected to tracks and modules via the frontmatter `track` and `module` fields. These must match keys in:

- `src/lib/curriculum.ts` (web development tracks)
- `src/lib/language-curriculum.ts` (language tracks)

Run `npm run typecheck` to validate frontmatter references.

## Submitting a Lesson

1. Fork the repository
2. Create your lesson file in `src/content/lessons/`
3. Add the lesson to the appropriate module in the curriculum file
4. Run `npm run lint:ci && npm run typecheck`
5. Submit a PR with a clear description

## Review Checklist

Before submitting, verify:

- [ ] Frontmatter is complete and valid
- [ ] All code examples run without errors
- [ ] No external links are required for understanding
- [ ] Concepts build progressively
- [ ] Spelling and grammar are correct
- [ ] Accessibility: images have alt text, headings are hierarchical
- [ ] SEO: description is compelling, keywords are relevant
- [ ] Links work and point to stable URLs