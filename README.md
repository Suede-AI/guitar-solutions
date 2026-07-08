# guides.guitar.solutions

> **By [Jason Colapietro](https://suedeai.ai/founder) / [Suede Labs AI](https://suedeai.ai) · Live at [guides.guitar.solutions](https://guides.guitar.solutions)**

The technical reference your tone needs. An engineering-grade, footnoted
catalog of guitar signal-chain knowledge — pickup output through speaker
excursion. Compiled and maintained by Suede Labs.

This is a static Next.js site. No backend, no DB, no auth. Long-form guides
are authored as MDX in `content/guides/`.

## Stack

- Next.js 16-ready (currently on `next@^15.0.3`, App Router)
- TypeScript (strict)
- Tailwind CSS v4 (beta)
- `@next/mdx` for guide rendering
- `gray-matter` for frontmatter parsing
- Geist Sans / Geist Mono
- pnpm

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck    # tsc --noEmit
pnpm build        # production build
```

## Project structure

```
app/
  layout.tsx              Root layout, Suede IP Terminal palette
  page.tsx                Landing — editorial, recently-filed index, subject rail
  globals.css             Tailwind v4 + design tokens
  guides/[slug]/page.tsx  Dynamic guide page, dynamic-imports MDX module
  categories/page.tsx     Subject index (grouped by category)
content/
  guides/                 Long-form MDX guides (one file per slug)
lib/
  mdx.ts                  Frontmatter loader + index helpers
mdx-components.tsx        Per-element MDX styling map
next.config.mjs           withMDX config
tailwind.config.ts        Tailwind v4 content scan
postcss.config.mjs        @tailwindcss/postcss
```

## Adding a new guide

1. Create `content/guides/<slug>.mdx`. The filename slug must match the
   `slug` field in frontmatter.

2. Required frontmatter:

   ```yaml
   ---
   title: "Title in title case"
   slug: "kebab-case-slug"
   category: "Signal Chain | Electronics | Amplification | Speaker & Cab | Recording"
   published: "YYYY-MM-DD"
   description: "One sentence, ~150 chars, used in landing index and meta description."
   authors:
     - "Suede Labs"
   ---
   ```

3. Write content. The MDX renderer styles `h1`, `h2`, `h3`, `p`, `a`, `ul`,
   `li`, `blockquote`, `code`, `pre`, `hr` per the Suede IP Terminal
   typography scale. Use footnotes (`[^1]`) for citations.

4. The guide appears automatically on `/` (newest-first), `/categories`
   (grouped), and at `/guides/<slug>`.

## Design language

This site uses the **Suede Institutional IP Terminal** palette:

- Rights Red `#9f101a` — accent, current state, route emphasis
- Registry Cyan `#22d3ee` — interactive elements, links, focus rings
- Deep Ink `#050b16` — page background

Editorial layout: hairline rules, mono labels in uppercase tracked-out caps,
a single accent color carrying the system. Avoid card grids; prefer ruled
ordered lists. This site follows the broader Suede design vocabulary and the
anti-template policy it is built against.

## What's intentionally *not* here

- No analytics
- No marketing CTAs
- No gear-of-the-month roundups
- No affiliate links
- No DB, no auth, no API routes (yet)

## Provenance

The taxonomic decisions (signal-chain categories, decade range, archival tone)
draw on patterns from the Suede DNA project — a separate rig manifest site
at `dna.suedeai.ai`. guides.guitar.solutions is the *engineering reference* sibling
to DNA's *archival catalog* of rigs.
