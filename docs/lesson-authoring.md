# Writing lessons

Lessons are written **on the site**, not outsourced to links. Each lesson lives in its own MDX file:

```
src/content/lessons/<lesson-id>.mdx
```

The lesson ID comes from `src/lib/curriculum.ts`. The external resources attached to a lesson are **supplementary** — the MDX file is the primary material.

## Required structure

1. **Opening hook** (2 short paragraphs): why this topic matters and what the reader will be able to do by the end.
2. **3–7 `##` sections**, each teaching one idea. Use `###` only for sub-points.
3. **At least two code examples** in fenced blocks with a language tag.
4. **At least one `<Callout>`** for a tip, warning, or common mistake.
5. **At least one `<TryIt>`** with a small runnable example.
6. **1–2 `<Quiz>` questions** near the end.
7. **One `<Exercise>`** with concrete, checkable tasks.
8. **`## Summary`** with 4–6 bullets, then one sentence bridging to the next lesson.

Target **1,000–1,800 words**. Depth over padding: every paragraph should teach, warn, or demonstrate something.

## Components

### Callout

```mdx
<Callout type="tip" title="Optional title">
  One or two sentences. Types: `info`, `tip`, `warning`, `danger`, `success`.
</Callout>
```

### Key idea

```mdx
<KeyPoint>
  The one sentence a reader should remember if they forget everything else.
</KeyPoint>
```

### Try it

````mdx
<TryIt title="Try it yourself">
```html
<h1>Hello</h1>
```
</TryIt>
````

### Exercise

```mdx
<Exercise title="Build a profile card" difficulty="medium">
  1. First task
  2. Second task
</Exercise>
```

Difficulty is `easy`, `medium`, or `hard`.

### Quiz

```mdx
<Quiz
  question="What does HTTP stand for?"
  options={["HyperText Transfer Protocol", "High Transfer Text Process", "Hyperlink Text Protocol"]}
  answer={0}
  explanation="HTTP moves hypertext between clients and servers."
/>
```

`answer` is the **zero-based index** of the correct option. Write plausible distractors, not jokes.

## Voice and style

- Direct, second person: “You send a request”, not “the developer sends a request”.
- Short paragraphs. One idea per paragraph.
- Define a term the first time it appears, in plain language.
- Prefer concrete examples over abstractions: a real URL, a real JSON body, a real error.
- No emojis. No hype (“simply”, “just”, “obviously”).
- Explain *why*, not only *what*.
- When showing a command, say where to run it and what the expected output looks like.
- End sections with the consequence: what breaks if you get this wrong?

## Accuracy rules

- Target **Node.js 20+**, **Express 4** (code should also run on Express 5), **Mongoose 8**, **React 19**, and **React Router v6/v7**.
- Use `async/await` for asynchronous code.
- Use ESM (`import` / `export`) in new examples, and show `"type": "module"` in `package.json` when it matters.
- Never commit real secrets. Use `.env` and `process.env`.
- Do not teach deprecated APIs (`componentWillMount`, `findByIdAndRemove`, callback-style Mongoose, etc.).
- Validate code by running it or by checking the API docs. If something is version-sensitive, say so.
- Prefer web-standard APIs over library-specific shortcuts.

## MDX gotchas

- **Do not start with an H1.** The page renders the lesson title from the curriculum. Begin with prose, then `##`.
- Escape `<` and `{` in prose. For HTML tags, use inline code: `` `<div>` ``.
- Every table needs a header row and separator.
- Fenced code blocks need a language: `js`, `ts`, `jsx`, `html`, `css`, `bash`, `http`, `json`, `text`.
- No frontmatter. Metadata lives in `src/lib/curriculum.ts`.
- JSX components must be separated from Markdown blocks by blank lines.
- External links are normal Markdown; they open in a new tab automatically.
- Images use normal Markdown syntax; always include alt text. Prefer a `text` code-fence diagram when the point is structural.

## Review checklist

- [ ] Reads correctly at 360px wide and on desktop.
- [ ] Code blocks are copyable and correct.
- [ ] Quiz answer index is right.
- [ ] Exercise is doable with only what the lesson taught.
- [ ] No dead links in the lesson body.
- [ ] `npx tsc --noEmit`, `npx eslint src`, and `npm run build` pass.
- [ ] The lesson page renders content (not the “coming soon” fallback).
