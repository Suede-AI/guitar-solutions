# guitar.services Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing guitar-solutions Next.js site into a live, dual-themed editorial reference at guitar.services — dual light/dark CSS theme, FeaturedStack homepage, scrollspy sidebar TOC on guide pages, 5 new guides, Vercel deploy.

**Architecture:** Extend the existing Tailwind v4 `@theme` design system with a light-mode override (Paper Editorial) under `@media (prefers-color-scheme: light)`. Add `readingTime` and `headings` to `GuideRecord` at parse time. New `FeaturedStack` (homepage) and `GuideSidebar` (guide pages) components use the existing CSS token classes. No new design system — build within what exists.

**Tech Stack:** Next.js 15, React 19, MDX, Tailwind CSS 4 beta (`@theme`), Geist fonts, gray-matter, Vitest (new), Vercel CLI

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Modify | `.gitignore` | Add `.superpowers/` |
| Create | `vitest.config.ts` | Test runner config |
| Modify | `package.json` | Add vitest dep + test scripts |
| Create | `lib/__tests__/mdx.test.ts` | Unit tests for pure utilities |
| Modify | `lib/mdx.ts` | Add `Heading` type, `readingTime()`, `extractHeadings()`, update `GuideRecord` + `readGuideFile` |
| Modify | `app/globals.css` | Light-mode token overrides under `prefers-color-scheme: light` |
| Modify | `app/layout.tsx` | Update `metadataBase` to `guitar.services` |
| Modify | `mdx-components.tsx` | Add `id` attributes to `h2` and `h3` for scrollspy anchors |
| Create | `components/FeaturedStack.tsx` | Magazine-stack homepage grid |
| Create | `components/GuideSidebar.tsx` | Client component: scrollspy TOC + related guides |
| Modify | `app/page.tsx` | Replace hero/list layout with FeaturedStack |
| Modify | `app/guides/[slug]/page.tsx` | Replace bare category sidebar with GuideSidebar; add `readingTime` to header |
| Create | `content/guides/true-bypass-vs-buffered.mdx` | New guide |
| Create | `content/guides/power-supply-and-noise-floor.mdx` | New guide |
| Create | `content/guides/effects-loop-serial-vs-parallel.mdx` | New guide |
| Create | `content/guides/cable-capacitance-and-frequency-response.mdx` | New guide |
| Create | `content/guides/pedalboard-order-methodology.mdx` | New guide |

---

## Task 1: Setup — .gitignore and Vitest

**Files:** `.gitignore`, `vitest.config.ts`, `package.json`

- [ ] **Step 1: Add .superpowers to .gitignore**

Open `.gitignore` and append:

```
.superpowers/
```

- [ ] **Step 2: Install Vitest**

```bash
cd /Users/jason/code/guitar-solutions
pnpm add -D vitest@^2.0.0
```

- [ ] **Step 3: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Add test scripts to package.json**

In `package.json`, inside the `"scripts"` block, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify Vitest runs**

```bash
pnpm test
```

Expected output: `No test files found` or exit code 0. If it errors on the config, check that `vitest` was installed under `devDependencies`.

- [ ] **Step 6: Commit**

```bash
git add .gitignore vitest.config.ts package.json pnpm-lock.yaml
git commit -m "chore: add vitest, ignore .superpowers"
```

---

## Task 2: Utility functions — readingTime + extractHeadings (TDD)

**Files:** `lib/__tests__/mdx.test.ts`, `lib/mdx.ts`

- [ ] **Step 1: Write failing tests**

Create `lib/__tests__/mdx.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { readingTime, extractHeadings } from '../mdx';

describe('readingTime', () => {
  it('returns 1 for very short content', () => {
    expect(readingTime('hello world')).toBe(1);
  });

  it('estimates at 200 wpm rounded up', () => {
    const words = Array.from({ length: 400 }, (_, i) => `word${i}`).join(' ');
    expect(readingTime(words)).toBe(2);
  });

  it('rounds up partial minutes', () => {
    const words = Array.from({ length: 201 }, (_, i) => `word${i}`).join(' ');
    expect(readingTime(words)).toBe(2);
  });

  it('returns 1 for empty string', () => {
    expect(readingTime('')).toBe(1);
  });
});

describe('extractHeadings', () => {
  it('extracts h2 headings with correct id, text, level', () => {
    const content = `## First Section\n\nSome content\n\n## Second Section\n\nMore`;
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(2);
    expect(headings[0]).toEqual({ id: 'first-section', text: 'First Section', level: 2 });
    expect(headings[1]).toEqual({ id: 'second-section', text: 'Second Section', level: 2 });
  });

  it('extracts h3 headings with level 3', () => {
    const content = `## Main\n\n### Sub-heading`;
    const headings = extractHeadings(content);
    expect(headings[1]).toMatchObject({ text: 'Sub-heading', level: 3 });
  });

  it('ignores h1 lines', () => {
    const content = `# Title\n\n## Section`;
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(1);
    expect(headings[0].level).toBe(2);
  });

  it('slugifies heading text', () => {
    const content = `## True Bypass vs. Buffered`;
    const [h] = extractHeadings(content);
    expect(h.id).toBe('true-bypass-vs-buffered');
  });

  it('returns empty array when no headings', () => {
    expect(extractHeadings('just paragraph text')).toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm test
```

Expected: FAIL — `readingTime is not a function` or similar import error.

- [ ] **Step 3: Add Heading type + readingTime + extractHeadings to lib/mdx.ts**

Add the following to the **top** of `lib/mdx.ts` (after the existing imports):

```typescript
export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function extractHeadings(content: string): Heading[] {
  return content
    .split('\n')
    .filter((line) => /^#{2,3} /.test(line))
    .map((line) => {
      const match = line.match(/^(#{2,3}) (.+)$/);
      if (!match) return null;
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      return { id, text, level };
    })
    .filter((h): h is Heading => h !== null);
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
pnpm test
```

Expected: All 9 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/mdx.ts lib/__tests__/mdx.test.ts
git commit -m "feat: add readingTime and extractHeadings utilities"
```

---

## Task 3: Add readingTime and headings to GuideRecord

**Files:** `lib/mdx.ts`

- [ ] **Step 1: Update GuideRecord type**

In `lib/mdx.ts`, find:

```typescript
export type GuideRecord = {
  frontmatter: GuideFrontmatter;
  filePath: string;
};
```

Replace with:

```typescript
export type GuideRecord = {
  frontmatter: GuideFrontmatter;
  filePath: string;
  readingTime: number;
  headings: Heading[];
};
```

- [ ] **Step 2: Update readGuideFile to compute readingTime and headings**

Find the `return` statement inside `readGuideFile`. It currently reads:

```typescript
  return {
    frontmatter: {
      title: fm.title,
      slug: fm.slug,
      category: fm.category,
      published: fm.published,
      description: fm.description,
      authors: fm.authors ?? ['Suede Labs'],
    },
    filePath,
  };
```

Replace with:

```typescript
  const content = parsed.content;
  return {
    frontmatter: {
      title: fm.title,
      slug: fm.slug,
      category: fm.category,
      published: fm.published,
      description: fm.description,
      authors: fm.authors ?? ['Suede Labs'],
    },
    filePath,
    readingTime: readingTime(content),
    headings: extractHeadings(content),
  };
```

- [ ] **Step 3: Add integration tests for GuideRecord**

Append to `lib/__tests__/mdx.test.ts`:

```typescript
import { getAllGuides, getGuideBySlug } from '../mdx';

describe('getAllGuides', () => {
  it('returns guides with readingTime >= 1', () => {
    const guides = getAllGuides();
    expect(guides.length).toBeGreaterThan(0);
    for (const g of guides) {
      expect(g.readingTime).toBeGreaterThanOrEqual(1);
    }
  });

  it('returns guides sorted newest first', () => {
    const guides = getAllGuides();
    for (let i = 1; i < guides.length; i++) {
      expect(new Date(guides[i - 1].frontmatter.published).getTime()).toBeGreaterThanOrEqual(
        new Date(guides[i].frontmatter.published).getTime(),
      );
    }
  });
});

describe('getGuideBySlug', () => {
  it('returns headings for signal-chain-topology', () => {
    const guide = getGuideBySlug('signal-chain-topology');
    expect(guide).toBeDefined();
    expect(guide!.headings.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 4: Run full test suite**

```bash
pnpm test
```

Expected: All tests PASS (includes new integration tests).

- [ ] **Step 5: Run TypeScript check**

```bash
pnpm typecheck
```

Expected: No errors. If errors on `readingTime` property missing — verify Step 2 was applied correctly.

- [ ] **Step 6: Commit**

```bash
git add lib/mdx.ts lib/__tests__/mdx.test.ts
git commit -m "feat: add readingTime and headings to GuideRecord"
```

---

## Task 4: Add light-mode theme to globals.css

**Files:** `app/globals.css`

The existing system is deep-ink dark only. Add a Paper Editorial light theme triggered by `prefers-color-scheme: light`.

- [ ] **Step 1: Change color-scheme and add light-mode overrides**

In `app/globals.css`, find the `@layer base` block:

```css
@layer base {
  :root {
    color-scheme: dark;
  }
  ...
}
```

Replace just the `:root { color-scheme: dark; }` line with:

```css
  :root {
    color-scheme: light dark;
  }

  @media (prefers-color-scheme: light) {
    :root {
      /* Paper Editorial — warm off-white on deep ink */
      --color-ink-0: #f5f0e8;
      --color-ink-1: #ece7de;
      --color-ink-2: #e3ddd4;
      --color-rule: #d4cfc6;
      --color-paper: #0d0d0d;
      --color-paper-mute: #5a5a5a;
      --color-paper-dim: #8a8480;
      /* accent colors unchanged — red and cyan work on both backgrounds */
    }
  }
```

Leave every other rule in `@layer base` unchanged.

- [ ] **Step 2: Update html background to use the token**

Find:

```css
  html {
    background: var(--color-ink-0);
  }
```

Verify it already uses `var(--color-ink-0)`. It does — no change needed. The override in Step 1 is sufficient.

- [ ] **Step 3: Verify both modes in dev**

```bash
pnpm dev
```

Open http://localhost:3000 in Chrome. Check:
- **System in dark mode:** Deep ink background, off-white text. Matches existing.
- **System in light mode:** Warm off-white background, dark ink text. All Tailwind utilities (`bg-ink-0`, `text-paper`, `border-rule`, etc.) auto-switch because they reference the CSS vars.

To test without changing system preference in Chrome: open DevTools → Rendering tab → "Emulate CSS media feature prefers-color-scheme" → set to `light`.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat: dual-mode CSS theme — Paper Editorial light, Deep Ink dark"
```

---

## Task 5: Update metadataBase URLs to guitar.services

**Files:** `app/layout.tsx`, `app/page.tsx`, `app/categories/page.tsx`, `app/guides/[slug]/page.tsx`

- [ ] **Step 1: Update metadataBase in layout.tsx**

In `app/layout.tsx`, find all occurrences of `guitar-solutions.vercel.app` and replace with `guitar.services`. There are three:

```typescript
metadataBase: new URL('https://guitar.services'),
```

```typescript
url: 'https://guitar.services',
```

```typescript
alternates: { canonical: 'https://guitar.services' },
```

Also update the JSON-LD `url` field:
```typescript
url: 'https://guitar.services',
```

- [ ] **Step 2: Update canonical in page.tsx**

In `app/page.tsx`, find:

```typescript
alternates: {
  canonical: 'https://guitar-solutions.vercel.app',
},
```

Replace with:

```typescript
alternates: {
  canonical: 'https://guitar.services',
},
```

- [ ] **Step 3: Update canonical in categories/page.tsx**

In `app/categories/page.tsx`, find:

```typescript
alternates: {
  canonical: 'https://guitar-solutions.vercel.app/categories',
},
```

Replace with:

```typescript
alternates: {
  canonical: 'https://guitar.services/categories',
},
```

- [ ] **Step 4: Update canonical in guides/[slug]/page.tsx**

In `app/guides/[slug]/page.tsx`, find the `generateMetadata` function where it constructs the URL:

```typescript
const url = `https://guitar-solutions.vercel.app/guides/${slug}`;
```

Replace with:

```typescript
const url = `https://guitar.services/guides/${slug}`;
```

Also find:
```typescript
url: 'https://guitar-solutions.vercel.app',
```
inside `generateMetadata` and update to:
```typescript
url: 'https://guitar.services',
```

- [ ] **Step 5: Run typecheck**

```bash
pnpm typecheck
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/page.tsx app/categories/page.tsx app/guides/
git commit -m "chore: update canonical URLs to guitar.services"
```

---

## Task 6: Add id attributes to MDX headings

**Files:** `mdx-components.tsx`

The GuideSidebar scrollspy uses `document.getElementById(id)` where `id` matches the slugified heading text. The MDX headings need matching `id` attributes on the rendered DOM elements.

- [ ] **Step 1: Add slugify helpers and update h2/h3 in mdx-components.tsx**

Replace the entire contents of `mdx-components.tsx` with:

```tsx
import type { MDXComponents } from 'mdx/types';

function getTextContent(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join('');
  if (node !== null && typeof node === 'object' && 'props' in (node as object)) {
    return getTextContent((node as React.ReactElement).props.children);
  }
  return '';
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="font-display text-4xl md:text-5xl tracking-tight text-paper mt-12 mb-6">
        {children}
      </h1>
    ),
    h2: ({ children }) => {
      const id = slugify(getTextContent(children));
      return (
        <h2
          id={id}
          className="font-display text-2xl md:text-3xl tracking-tight text-paper mt-12 mb-4 border-t border-rule pt-8"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = slugify(getTextContent(children));
      return (
        <h3 id={id} className="font-display text-xl text-paper mt-8 mb-3">
          {children}
        </h3>
      );
    },
    p: ({ children }) => (
      <p className="text-paper-mute leading-[1.7] mb-5 max-w-[68ch]">{children}</p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-cyan underline decoration-cyan/40 underline-offset-[3px] hover:decoration-cyan transition-colors"
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="list-none pl-0 mb-6 space-y-2 text-paper-mute max-w-[68ch]">{children}</ul>
    ),
    li: ({ children }) => (
      <li className="pl-5 relative before:content-['—'] before:absolute before:left-0 before:text-red">
        {children}
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-red pl-5 my-6 text-paper italic font-display max-w-[60ch]">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="font-mono text-[0.9em] bg-ink-2 text-cyan px-1.5 py-0.5 rounded-sm">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="font-mono text-sm bg-ink-2 border border-rule p-4 rounded-sm overflow-x-auto mb-6 max-w-full">
        {children}
      </pre>
    ),
    hr: () => <hr className="border-rule my-12" />,
    ...components,
  };
}
```

- [ ] **Step 2: Verify headings render with IDs**

```bash
pnpm dev
```

Open http://localhost:3000/guides/signal-chain-topology. Open DevTools → Elements. Find an `<h2>` tag — it should have an `id` attribute (e.g., `id="source-the-guitar"`). If no `id`, check the `slugify` / `getTextContent` functions.

- [ ] **Step 3: Commit**

```bash
git add mdx-components.tsx
git commit -m "feat: add scrollspy anchor ids to MDX h2 and h3 headings"
```

---

## Task 7: Create GuideSidebar + update guide page

**Files:** `components/GuideSidebar.tsx`, `app/guides/[slug]/page.tsx`

- [ ] **Step 1: Create components directory and GuideSidebar.tsx**

```bash
mkdir -p /Users/jason/code/guitar-solutions/components
```

Create `components/GuideSidebar.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Heading, GuideRecord } from '@/lib/mdx';

interface GuideSidebarProps {
  headings: Heading[];
  relatedGuides: Pick<GuideRecord, 'frontmatter'>[];
}

export function GuideSidebar({ headings, relatedGuides }: GuideSidebarProps) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries.find((e) => e.isIntersecting);
        if (first) setActiveId(first.target.id);
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <div className="flex flex-col gap-8">
      {headings.length > 0 && (
        <nav aria-label="Guide contents">
          <p className="mono-label mb-3">CONTENTS</p>
          <ul className="space-y-1">
            {headings.map(({ id, text, level }) => (
              <li key={id} style={{ paddingLeft: level === 3 ? '0.75rem' : '0' }}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`block py-0.5 text-[0.75rem] leading-snug transition-colors ${
                    activeId === id ? 'text-cyan' : 'text-paper-dim hover:text-paper'
                  }`}
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {relatedGuides.length > 0 && (
        <div className="hairline-t pt-6">
          <p className="mono-label mb-3">RELATED</p>
          <ul className="space-y-2">
            {relatedGuides.map((guide) => (
              <li key={guide.frontmatter.slug}>
                <Link
                  href={`/guides/${guide.frontmatter.slug}`}
                  className="text-[0.75rem] text-paper-dim hover:text-cyan transition-colors block leading-snug"
                >
                  {guide.frontmatter.title} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Update app/guides/[slug]/page.tsx**

Replace the entire file with:

```tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllGuides, getGuideBySlug } from '@/lib/mdx';
import { GuideSidebar } from '@/components/GuideSidebar';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllGuides().map((g) => ({ slug: g.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: 'Guide not found' };
  const { title, description } = guide.frontmatter;
  const url = `https://guitar.services/guides/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: 'guitar.services',
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const allGuides = getAllGuides();
  const related = allGuides
    .filter(
      (g) =>
        g.frontmatter.category === guide.frontmatter.category &&
        g.frontmatter.slug !== slug,
    )
    .slice(0, 3);

  let MDXContent: React.ComponentType;
  try {
    const mod = await import(`@/content/guides/${slug}.mdx`);
    MDXContent = mod.default;
  } catch {
    notFound();
  }

  const { frontmatter } = guide;

  return (
    <article className="mx-auto max-w-[1280px] px-6">
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 py-20 hairline-b">
        <div className="lg:col-span-3 mb-6 lg:mb-0">
          <Link href="/" className="mono-label text-paper-dim hover:text-cyan transition-colors">
            ← BACK
          </Link>
        </div>
        <div className="lg:col-span-9">
          <p className="mono-label">
            <span className="text-red">●</span> {frontmatter.category.toUpperCase()} · FILED{' '}
            {formatDate(frontmatter.published)} · {guide.readingTime} MIN READ
          </p>
          <h1
            className="font-display text-paper mt-6"
            style={{
              fontSize: 'var(--text-headline)',
              lineHeight: 1.02,
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            {frontmatter.title}
          </h1>
          <p className="text-paper-mute mt-6 max-w-[60ch] text-lg leading-relaxed">
            {frontmatter.description}
          </p>
          <p className="mono-label text-paper-dim mt-8">
            BY {(frontmatter.authors ?? ['SUEDE LABS']).join(' · ').toUpperCase()}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 py-16">
        <div className="lg:col-span-3 lg:sticky lg:top-8 self-start mb-12 lg:mb-0">
          <GuideSidebar headings={guide.headings} relatedGuides={related} />
        </div>
        <div className="lg:col-span-9">
          <div className="prose-suede">
            <MDXContent />
          </div>
        </div>
      </div>
    </article>
  );
}

function formatDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
    .toUpperCase();
}
```

- [ ] **Step 3: Verify guide page with sidebar**

```bash
pnpm dev
```

Navigate to http://localhost:3000/guides/signal-chain-topology. Check:
- Left sidebar shows "CONTENTS" list with guide's h2 headings
- Scrolling through the guide highlights the active section in the TOC
- "RELATED" section shows other guides in same category
- Sidebar collapses on mobile (below 1024px wide)
- `readingTime` appears in the header metadata line

- [ ] **Step 4: Commit**

```bash
git add components/GuideSidebar.tsx app/guides/
git commit -m "feat: GuideSidebar with scrollspy TOC and related guides"
```

---

## Task 8: Create FeaturedStack + rewrite homepage

**Files:** `components/FeaturedStack.tsx`, `app/page.tsx`

- [ ] **Step 1: Create components/FeaturedStack.tsx**

```tsx
import Link from 'next/link';
import type { GuideRecord } from '@/lib/mdx';

interface FeaturedStackProps {
  guides: GuideRecord[];
}

function formatDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
    .toUpperCase();
}

export function FeaturedStack({ guides }: FeaturedStackProps) {
  if (guides.length === 0) return null;

  const [featured, ...rest] = guides;
  const secondary = rest.slice(0, 2);

  return (
    <>
      {/* Magazine grid — featured left, two secondary right */}
      <div
        className="grid gap-px bg-rule hairline-b"
        style={{ gridTemplateColumns: '2fr 1fr' }}
      >
        <article className="bg-ink-0 p-8 lg:p-12 flex flex-col gap-4">
          <div className="flex items-center gap-4 mono-label">
            <span className="text-red">●</span>
            <span>{featured.frontmatter.category.toUpperCase()}</span>
            <span className="text-paper-dim">{featured.readingTime} MIN READ</span>
          </div>
          <h2
            className="font-display text-paper"
            style={{
              fontSize: 'clamp(1.75rem, 1.2rem + 2.5vw, 3.25rem)',
              lineHeight: 1.05,
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            <Link
              href={`/guides/${featured.frontmatter.slug}`}
              className="hover:text-cyan transition-colors"
            >
              {featured.frontmatter.title}
            </Link>
          </h2>
          <p className="text-paper-mute leading-relaxed max-w-[55ch]">
            {featured.frontmatter.description}
          </p>
          <p className="mono-label text-paper-dim mt-auto">
            {formatDate(featured.frontmatter.published)}
          </p>
        </article>

        <div className="flex flex-col gap-px bg-rule">
          {secondary.map((guide) => (
            <article
              key={guide.frontmatter.slug}
              className="bg-ink-0 p-8 flex flex-col gap-3 flex-1"
            >
              <div className="flex items-center gap-3 mono-label">
                <span className="text-paper-dim">{guide.frontmatter.category.toUpperCase()}</span>
                <span className="text-paper-dim">·</span>
                <span className="text-paper-dim">{guide.readingTime} MIN</span>
              </div>
              <h3
                className="font-display text-paper leading-snug"
                style={{ fontSize: 'clamp(1rem, 0.85rem + 0.8vw, 1.35rem)' }}
              >
                <Link
                  href={`/guides/${guide.frontmatter.slug}`}
                  className="hover:text-cyan transition-colors"
                >
                  {guide.frontmatter.title}
                </Link>
              </h3>
            </article>
          ))}
        </div>
      </div>

      {/* All guides — 3-column card grid */}
      <div className="py-16">
        <p className="mono-label mb-8">ALL GUIDES — {guides.length} TOTAL</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule hairline-t">
          {guides.map((guide) => (
            <article
              key={guide.frontmatter.slug}
              className="bg-ink-0 p-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3 mono-label">
                <span className="text-red">●</span>
                <span>{guide.frontmatter.category.toUpperCase()}</span>
              </div>
              <h3 className="font-display text-paper text-lg leading-tight">
                <Link
                  href={`/guides/${guide.frontmatter.slug}`}
                  className="hover:text-cyan transition-colors"
                >
                  {guide.frontmatter.title}
                </Link>
              </h3>
              <p className="text-paper-mute text-sm leading-relaxed line-clamp-2">
                {guide.frontmatter.description}
              </p>
              <p className="mono-label text-paper-dim mt-auto">{guide.readingTime} MIN READ</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Rewrite app/page.tsx**

Replace the entire file with:

```tsx
import type { Metadata } from 'next';
import { getAllGuides } from '@/lib/mdx';
import { FeaturedStack } from '@/components/FeaturedStack';

export const metadata: Metadata = {
  title: 'guitar.services — Signal Chain Reference',
  description:
    'Authoritative technical guides on guitar signal chains — impedance, gain staging, power supplies, and effects topology by Suede Labs.',
  alternates: {
    canonical: 'https://guitar.services',
  },
};

export default function HomePage() {
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-[1280px] px-6 pt-8">
      <FeaturedStack guides={guides} />
    </div>
  );
}
```

- [ ] **Step 3: Verify homepage**

```bash
pnpm dev
```

Navigate to http://localhost:3000. Check:
- Large featured guide (newest) on the left
- Two secondary guides stacked on the right
- 3-column card grid of all guides below
- Responsive: on mobile the featured grid should stack (the `style={{ gridTemplateColumns: '2fr 1fr' }}` only applies to the grid — add responsive override if it breaks on narrow screens — see Note below)

**Note on mobile:** If the two-column featured grid looks broken at narrow widths, add this to `app/globals.css` inside `@layer utilities`:

```css
.featured-mobile-stack {
  grid-template-columns: 1fr !important;
}

@media (max-width: 768px) {
  .featured-grid-responsive {
    grid-template-columns: 1fr !important;
  }
}
```

And add `className="featured-grid-responsive"` to the outer `<div>` of the magazine grid in `FeaturedStack.tsx`. Only do this if the mobile layout actually breaks — inline style grids often collapse gracefully.

- [ ] **Step 4: Commit**

```bash
git add components/FeaturedStack.tsx app/page.tsx
git commit -m "feat: FeaturedStack magazine-stack homepage"
```

---

## Task 9: Write 5 new MDX guides

**Files:** `content/guides/*.mdx` (5 new files)

Each file uses the same frontmatter schema: `title`, `slug`, `category`, `published`, `description`, `authors`.

- [ ] **Step 1: Create content/guides/true-bypass-vs-buffered.mdx**

```mdx
---
title: "True Bypass vs. Buffered: What Your Pedal Actually Does"
slug: "true-bypass-vs-buffered"
category: "Electronics"
published: "2026-05-15"
description: "What true bypass and buffered bypass mean at the circuit level — when each preserves your tone and when each hurts it."
authors: ["Jason Colapietro"]
---

Every guitar pedal makes a decision when it's switched off: does it put your signal straight through a wire, or does it keep running it through a circuit? That choice — true bypass vs. buffered bypass — is one of the most argued and most misunderstood topics in guitar gear. The argument is mostly settled. Here is why.

## What the switch actually does

In a true bypass pedal, the footswitch routes your signal through a mechanical relay or switch connecting input directly to output. The pedal's circuit is completely removed from the path when bypassed. Step on it — the relay clicks, the effect engages. Step off — the wire is the entire pedal.

In a buffered bypass pedal, the pedal's input buffer stays active even when the effect is switched off. Your signal enters the circuit, gets buffered (impedance-converted), and exits — the wet effect is bypassed, but the buffer is always in the path.

## The case for true bypass

True bypass advocates have a real point: the only component a bypassed signal should touch is wire. No capacitors, no op-amps, nothing that can color the tone. A quality true bypass pedal adds nothing to your signal when bypassed.

This matters especially for pedals with noisy or reactive input stages. A mediocre buffer is worse than no buffer at all. True bypass eliminates that variable entirely.

## The problem with true bypass at scale

Cable is a capacitor. Guitar cable has a capacitance rating — typically 25–100 pF per foot — and when that cable sits between your high-impedance pickup (8–15 kΩ output) and the next thing in your chain, it forms a passive low-pass filter. The longer the cable run, the more high frequencies attenuate.

Ten feet of cable is barely noticeable. Fifteen feet to your first pedal, plus patch cables between six true-bypass boxes, plus another fifteen feet to your amp — you're running 30–40 feet of capacitance against a 10 kΩ source impedance. Your highs are measurably rolling off before the signal enters any effect.

True bypass does not help this. It removes the buffer that would fix it.

## The case for buffering

A buffer — a unity-gain circuit with very low output impedance — solves the cable problem completely. It accepts your pickup's 10 kΩ signal and outputs the same signal at 100–300 Ω. From that point, cable capacitance is acoustically irrelevant because the source impedance is negligible.

This is why Boss has used buffered bypass for decades and why serious rigs use a dedicated buffer at chain start. A well-designed buffer is inaudible. A chain of true-bypass pedals plus long cable runs is not.

## The germanium fuzz exception

Vintage germanium fuzz pedals — Fuzz Face, Tone Bender originals, their modern derivatives — expect to see the raw impedance of your guitar's pickups. Their input circuit uses your pickup's inductance and the cable capacitance as part of the tone-shaping network. Put a buffer before a germanium fuzz and it sounds wrong: thinner, stiffer, less organic.

> Buffer before a wah = tone suck eliminated. Buffer before a germanium fuzz = dynamics killed.

**Rule:** If you use a germanium fuzz, it goes first in your chain with nothing buffered before it. Silicon fuzz pedals are less sensitive and more flexible.

## Practical guidance

- **Long total cable runs (>20 ft):** Buffer early. A clean, transparent buffer at chain start — or your first buffered-bypass pedal — solves this permanently.
- **Short runs (<15 ft) with few pedals:** True bypass is fine. Capacitance loading is low enough not to matter.
- **Germanium fuzz in the chain:** First pedal, before any buffer, always.
- **Stacking many true-bypass pedals:** The capacitance accumulates. Six true-bypass boxes plus cables between them adds up. One buffer at chain start fixes this.
- **Boss-heavy rig:** Boss's JFET buffers are well-designed and largely transparent. An all-Boss chain is correctly buffered by default.

The debate is not bypass type vs. bypass type. It is about whether you have a good buffer and where it sits. A great buffer is inaudible. An absent one with 30 feet of cable is not.
```

- [ ] **Step 2: Create content/guides/power-supply-and-noise-floor.mdx**

```mdx
---
title: "Power Supply and Noise Floor: The Hidden Variable in Your Tone"
slug: "power-supply-and-noise-floor"
category: "Power"
published: "2026-04-20"
description: "How your power supply affects your noise floor — ground loops, daisy chains, isolated outputs, and the specs that matter."
authors: ["Jason Colapietro"]
---

Your power supply is the least discussed piece of gear on a pedalboard and the one most likely to degrade your tone in ways that don't respond to EQ. A mediocre supply does not change your frequency response or your dynamics. It puts noise under everything — all the time — until you fix it or stop noticing it.

## What noise sounds like

Understanding what you're hearing narrows the diagnosis:

- **60 Hz hum** (low, buzzy drone): classic ground loop. AC mains frequency finding a path through your signal chain.
- **120 Hz buzz** (slightly higher, more "electrical"): AC rectification artifacts — common with unregulated or cheaply filtered supplies and daisy chains.
- **High-frequency whine or clicking**: switching power supply noise bleeding into the audio path. Almost always originates from digital pedals — delays, loopers, reverbs with microprocessors.

## Ground loops: the primary culprit

A ground loop forms when two or more pieces of equipment share a ground at different electrical potentials. Current flows between them to equalize those potentials, and that current couples into the audio signal as audible hum.

Classic setup: your amp plugged into one outlet, your pedalboard power supply into another on a different circuit. A signal cable connects them. If those two circuits have different ground references — which happens constantly in older buildings, rented venues, or with long cable runs — current circulates through your cable's shield and adds hum.

Isolated power supplies reduce inter-pedal ground loops by keeping each pedal's power path completely separate. They don't fix a ground loop between your amp and the wall, but they solve everything happening on the board itself.

## Daisy chaining: shared rail, shared noise

A daisy-chain cable splits one supply output across multiple pedals. Every pedal on the chain shares the same power rail and the same ground reference. If any one pedal generates noise on that rail — switching noise from a digital circuit, poor internal filtering, a failing capacitor — that noise appears on the shared rail and leaks into every other pedal connected to it.

Digital pedals are the worst offenders. Delays, reverbs, and loopers running microprocessors generate high-frequency switching noise that bleeds through a shared daisy chain into analog pedals sitting next to them.

> The minimum fix: separate digital pedals from analog pedals onto different supply outputs. Ideally, stop daisy chaining entirely.

## Isolated outputs: what they actually mean

A truly isolated power supply contains separate transformer windings or individual DC-DC converter modules for each output. Each pedal draws from its own independent source with its own ground reference. There is no shared rail for noise to travel between pedals.

This eliminates inter-pedal ground loops completely and prevents digital switching noise from contaminating analog supply rails. It is the correct solution for any board mixing digital and analog pedals.

All professional-tier supplies use isolation: Strymon Zuma, Cioks DC7, Eventide PowerMax, Voodoo Lab Pedal Power 2+. The affordable single-transformer designs with multiple tapped outputs are not isolated — they share a rail.

## The specs that matter

**Current (mA):** Every pedal specifies a current draw. Your supply must provide at least that much per output. Running at or near the rated limit causes voltage sag and increased noise. Budget 20–30% headroom above each pedal's rated draw.

**Voltage:** Most pedals require 9V DC. Some use 12V or 18V. Some designs benefit audibly from higher voltage — increased headroom, less compression at the power stage. Always verify the pedal's specifications before using a non-9V output.

**Polarity:** Nearly all modern pedals use center-negative, 2.1mm barrel jacks. Center-negative means the tip of the barrel connector is negative and the sleeve is positive. Reversing polarity can damage a pedal immediately. Vintage gear may differ — verify before connecting.

**Regulated vs. unregulated:** Regulated supplies maintain constant output voltage regardless of load variation. Unregulated supplies sag under load, which some vintage-voiced pedals are designed around but most modern pedals are not. Default to regulated.

## Practical recommendations by rig scale

**1–4 analog pedals, short chain:** A quality single-brick supply (One Spot Pro CS6 or similar) with one pedal per output is adequate if no digital pedals are present. Avoid daisy chains.

**5–8 pedals, mixed analog and digital:** Isolated supply required. Voodoo Lab Pedal Power 2+ is the minimum. Route digital pedals (delay, reverb, looper) to their own isolated outputs, separated from your drives and filters.

**Full board (8+ pedals):** High-current isolated supply with multiple voltage options. Cioks, Strymon Zuma, Eventide PowerMax. Plan outputs before purchasing — high-current isolated outputs are the limiting resource.

A clean power supply resolves an entire category of problems permanently. It costs less than most of the pedals it powers.
```

- [ ] **Step 3: Create content/guides/effects-loop-serial-vs-parallel.mdx**

```mdx
---
title: "The Effects Loop: Serial, Parallel, and the Four-Cable Method"
slug: "effects-loop-serial-vs-parallel"
category: "Gain & Dynamics"
published: "2026-03-10"
description: "Why your amp has an effects loop, what happens inside it, and when to use the four-cable method."
authors: ["Jason Colapietro"]
---

The effects loop is one of the most useful and most ignored features on a tube amp. Guitarists run their delay into the input, wonder why it sounds indistinct and washy, and conclude they prefer a dry amp. Often the loop is the missing piece.

## What the effects loop is

Inside a tube amp, there are two major stages: the preamp and the power amp. The preamp receives your guitar's signal, applies your EQ and gain, and shapes the tone character. The power amp receives the preamp's output and delivers enough current to move a speaker.

The effects loop sits between them. The Send jack taps the signal after the preamp has done its work. The Return jack injects signal back in directly before the power amp.

A pedal placed in the loop processes the sound of your preamp, not the raw guitar. The tone shape, the gain character, the amp EQ — all of that enters the loop pedal's input. The loop pedal's output feeds the power amp directly.

## Why this matters for time-based effects

Delay and reverb produce repeats and reflections that sound most natural when they're applied to an already-formed tone. If you run delay into the front of a driven amp, the amp's preamp processes both the original note and every one of its repeats — each repeat is re-driven, re-compressed, re-shaped. The delays become thick and indistinct.

In the effects loop, delay receives the preamp's shaped output. Its repeats go directly to the power amp, bypassing the gain stage entirely. Each repeat is a clean copy of the processed note, not a re-driven version. The delays decay naturally with clear pitch definition.

The same logic applies to reverb, chorus, and flanger. Applied after the gain stage, they create movement on top of a defined tone. Applied before, they feed into the gain stage and lose coherence.

## Serial vs. parallel effects loops

A **serial loop** — the most common type — places your pedal completely in the signal path. The amp's signal goes entirely into the pedal's input, and the pedal's output returns entirely to the power amp. The pedal's wet/dry mix control determines the blend.

A **parallel loop** — less common, found on some boutique and high-end amps — splits the signal into two paths: one through the loop pedal, one bypassing it. The amp blends them before the power amp stage using a Mix control. At 100% wet, you hear only the loop pedal. At 0%, you hear the dry amp path. Between them, you get both.

The parallel loop is useful for reverb and delay — you preserve the amp's completely dry signal on one path while adding depth on the other. Some engineers prefer this because the dry path never touches a converter or a buffer.

The tradeoff: the parallel loop's Mix control behaves unintuively with drive pedals. You can't blend a processed and an unprocessed signal cleanly when the processed signal contains heavy harmonic content.

## The four-cable method

The four-cable method (4CM) routes a multi-effects unit or switcher so that some effects sit before the amp's preamp and others sit in the effects loop — using the physical amp as the gain stage in the middle.

The routing:

1. Guitar → Multi-FX Input
2. Multi-FX Send → Amp Input
3. Amp Send → Multi-FX Return
4. Multi-FX Output → Amp Return

With this wiring, effects assigned to the "front-of-amp" path in the multi-FX hit the preamp input. Effects assigned to the "loop" path process the preamp's output. Your physical amp's preamp stays in the signal path as the primary gain stage.

This works with Fractal FM3, Line 6 Helix, Boss GT units, or a dedicated loop switcher. It gives you the real amp's preamp character while routing delay and reverb where they belong.

## Level matching

Some effects loops operate at instrument level (-10 dBV). Others operate at line level (+4 dBu). A rack reverb designed for +4 dBu connected to an instrument-level loop will be quiet, noisy, or both. Check your amp's manual and your rack unit's specifications. Most tube amp effects loops are instrument level. Professional rack units often expect line level. A passive attenuator or a dedicated level converter resolves the mismatch.

## Practical placement guide

- **Delay, reverb, chorus, flanger, phaser:** In the effects loop. Nearly always correct.
- **Compressor, wah, overdrive, fuzz, distortion:** In front of the amp. These shape the signal entering the preamp.
- **Volume pedal for dynamics and cleaning up drive:** In front. Controls input level and preamp response.
- **Volume pedal for master level control:** In the loop. Controls output without changing preamp saturation.
- **Pitch shifters:** In front for tracking accuracy. The cleaner the input, the more accurate the pitch detection.

The effects loop is a routing decision with audible consequences. Running reverb in the front is not wrong — it is a different sound. Understanding the difference is what makes the choice deliberate.
```

- [ ] **Step 4: Create content/guides/cable-capacitance-and-frequency-response.mdx**

```mdx
---
title: "Cable Capacitance and Frequency Response: The Spec That Actually Matters"
slug: "cable-capacitance-and-frequency-response"
category: "Electronics"
published: "2026-02-01"
description: "How cable capacitance rolls off your high frequencies, which spec to check, and why a buffer is the complete fix."
authors: ["Jason Colapietro"]
---

Most guitarists select cables by brand or by a recommendation. The one spec that directly determines how a cable affects your tone — capacitance — is printed on most cable boxes and almost universally ignored.

## What cable capacitance is

A cable is two conductors separated by an insulating material (the dielectric). Two conductors separated by an insulator is the physical definition of a capacitor. Every guitar cable is a capacitor running along its length.

Cable capacitance is measured in picofarads per foot (pF/ft) or per meter (pF/m). Common instrument cables measure 30–80 pF/ft. Premium low-capacitance cables measure 12–25 pF/ft. High-capacitance cables can exceed 100 pF/ft.

## How it forms a low-pass filter

Your guitar's pickup has a source impedance — typically 8–15 kΩ for a passive single-coil or humbucker. When the pickup connects to a cable, the pickup's source impedance (a resistance) and the cable's capacitance combine to form a passive low-pass filter.

The cutoff frequency of this filter:

```
f = 1 / (2π × R × C)
```

Where R is the source impedance in ohms, C is the total capacitance in farads.

Example: single-coil pickup at 10 kΩ, 20-foot cable at 50 pF/ft:

- Total C = 20 × 50 pF = 1000 pF = 0.000000001 F
- f = 1 / (2π × 10,000 × 0.000000001) ≈ 15,900 Hz

A –3 dB rolloff starting near 16 kHz. Barely audible. Now add a 15-foot run to your first pedal, plus three patch cables between true-bypass boxes, plus another 10 feet to the amp:

- Total C ≈ (25 × 50) + (3 × 2 × 50) + (10 × 50) pF = 1250 + 300 + 500 = 2050 pF
- f = 1 / (2π × 10,000 × 0.00000000205) ≈ 7,800 Hz

Your highs are rolling off below 8 kHz — audible, measurable, and commonly attributed to the "warm" character of long cable runs. It is frequency loss, not warmth.

## The buffer eliminates this

A buffer is an active circuit with near-unity voltage gain and very low output impedance — typically 50–300 Ω, compared to your pickup's 10 kΩ. When the signal is buffered, the source impedance driving the cable drops by a factor of 30–200.

Same cable run, 100 Ω output impedance:

- f = 1 / (2π × 100 × 0.00000000205) ≈ 776,000 Hz

The rolloff is now at 776 kHz — well above the range of any speaker or human hearing. The cable's capacitance is acoustically irrelevant.

This is why active instruments, active DI boxes, and buffer pedals at chain start solve the cable problem completely rather than managing it downstream.

## The spec to look for

When purchasing cable, look for the capacitance per foot figure on the spec sheet or packaging:

- **Below 25 pF/ft:** Excellent. Canare GS-6 (29 pF/ft), Mogami 2524 (27 pF/ft), Grimm TPR (18 pF/ft) are benchmarks.
- **25–50 pF/ft:** Good. Adequate for most rigs.
- **50–80 pF/ft:** Acceptable for short runs. Noticeable on longer chains.
- **Above 80 pF/ft:** Avoid for any run beyond 10 feet.

For patch cables between pedals, low capacitance matters more than for the main guitar-to-board run, because each patch adds to the cumulative total.

## When this matters most

**Passive instruments with high-impedance pickups:** Single-coils, vintage humbuckers. High source impedance means the RC filter cutoff frequency is lowest — most affected.

**Long total cable runs:** Every additional foot adds pF. Every true-bypass pedal's internal wiring adds some. It accumulates.

**Multiple true-bypass pedals in series:** The effective cable length between the guitar and the first buffer includes all the internal wiring of every true-bypass pedal in between.

**Less affected:** Active instruments (onboard preamp buffers the signal at the guitar), instruments with lower output impedance, rigs with a buffer early in the chain, short cable runs under 15 feet total.

## Practical decisions

1. **Short runs, simple chain:** Use quality cable (25–50 pF/ft) and don't think about it.
2. **Medium runs (15–30 ft) or multiple true-bypass pedals:** Low-capacitance cable plus a good buffer at chain start.
3. **Long runs or complex boards:** Buffer first, low-capacitance patch cables throughout, low-capacitance main cable.
4. **Active guitar or wireless system:** Buffered at the source. Use any cable you like — the RC filter is defeated before the signal leaves the instrument.

A mediocre cable driven from a 100 Ω source sounds better than a premium cable driven from a 10 kΩ pickup over the same distance. Fix the source impedance; then choose your cable.
```

- [ ] **Step 5: Create content/guides/pedalboard-order-methodology.mdx**

```mdx
---
title: "Pedalboard Order: A Practical Methodology"
slug: "pedalboard-order-methodology"
category: "Signal Chain"
published: "2026-01-15"
description: "A practical methodology for deciding where each pedal type belongs in your signal chain — and when the canonical order has justified exceptions."
authors: ["Jason Colapietro"]
---

The canonical signal chain map — dynamics, drive, modulation, time, amp — is a starting point, not a law. Understanding why the order exists is what tells you when to follow it exactly and when to break it with intention.

## Why the order exists

Each stage in a signal chain expects a certain kind of signal. A compressor works best on the unprocessed dynamics of your picking hand. A fuzz circuit reacts to high source impedance from your guitar's pickups in ways it doesn't react to the low-impedance output of a buffer. A delay repeating a saturated preamp tone sounds different from a delay processing a clean guitar signal before the amp.

The canonical order describes what sounds best to most players most of the time. It is a description of observed results, not a specification handed down. The reason to learn it is that understanding the cause lets you deviate with purpose.

## Dynamics first: compressor and wah

**Compressor:** Before drive, the compressor works on your actual picking dynamics. Heavy attack gets clamped; light playing gets lifted. The drive stage then receives a more consistent level, which affects how it responds — tighter, more controlled. A compressor placed after drive compresses an already-saturated signal. This is useful for peak control (taming spikes going into a power amp or PA), but it does not shape playing feel the way front-of-amp compression does.

**Wah:** Before drive produces the classic rock and funk wah sound. The filter sweeps an unprocessed guitar signal, then the drive colors the swept signal. After drive, the wah sweeps an already-saturated signal — the resonant peak is smoother, less sharp, more modern. Both positions produce working sounds. Know which one you want.

## Drive in the middle

Overdrive, distortion, and fuzz belong after initial dynamics shaping and before time-based effects. This positioning is almost universally correct. The exception is placing a drive pedal in an amp's effects loop — covered separately in the effects loop guide.

**Germanium fuzz:** Before everything, with no buffer before it. The fuzz input circuit uses your pickup's impedance as part of its tone network. Buffering before a germanium fuzz changes the sound substantially and almost always for the worse.

**Silicon fuzz and modern distortion:** Less impedance-sensitive. More flexible positioning.

**Stacking drives:** The first drive in the chain sets the character the second drive amplifies and reacts to. A mild overdrive feeding a distortion sounds different from the same distortion feeding the same overdrive. There is no rule for stacking order — experiment specifically.

## Modulation after drive

Chorus, phaser, flanger, tremolo, and vibrato belong after your drive pedals. You want modulation applied to the shaped, driven tone — not to the raw signal that will then be driven.

Chorus before drive: the modulated pitch variations get amplified and saturated alongside the fundamental. The result is thick and indistinct. Chorus after drive: the modulation moves on top of the already-formed tone. It's audible as a separate effect rather than embedded in the saturation.

**Tremolo exception:** Tremolo before drive can produce a more aggressive, stuttering interaction — the amp or gain pedal responds differently to volume drops than to a sustained note. This is a legitimate creative choice. It is not the default.

## Time-based effects last

Delay and reverb belong at the end of the chain, or in the amp's effects loop. You want the delay to repeat the complete, shaped tone — not to feed repeated notes back into your gain stage where they accumulate and saturate.

**Delay before reverb vs. reverb before delay:** Delay into reverb: each delayed repeat receives its own reverb tail. The result can become a wash quickly. Reverb into delay: one ambient space, with discrete repeats emerging from it — cleaner, more controlled. Most players prefer delay before reverb. Both work. Know what each sounds like.

## Pitch and octave: the positioning exception

Pitch shifters and octave pedals track your fundamental frequency. Their accuracy depends on receiving a clear, unambiguous signal.

**Before drive:** The shifter tracks a clean guitar signal. Pitch detection is accurate. Both the original pitch and the shifted pitch then go through your drive together.

**After drive:** The shifter attempts to track a harmonically complex, saturated signal. Tracking degrades — more tracking errors, less pitch accuracy, worse on chords.

**Rule:** Pitch shifters go before drive, with the narrow exception of effects specifically designed to be driven (Octavia, vintage Boss OC-2, certain fuzz-octave circuits built around intentional instability).

## Volume pedal placement

**Before drives:** Controls the level entering your gain stage. Backing off cleans up the drive — the pedal or amp responds to a lower input level with less saturation. This mimics rolling back your guitar's volume knob.

**After drives, before time effects:** Controls the output of the drive section feeding your delays. Volume swells emerge into a full saturated tone with trailing delay. Common for ambient and post-rock applications.

**In the effects loop:** Controls master output volume without affecting preamp saturation. Useful for controlling stage volume while leaving your amp's gain character intact.

## Building a specific board

**Start with three pedals.** Compressor, drive, delay — or the three you actually use most. Learn exactly how they interact at this scale before adding anything.

**Add one pedal at a time.** When a new pedal enters the chain, you're changing one variable. Test it in the canonical position first. Then test it elsewhere. Understand what changes.

**Default to the canonical order. Break it with a reason.** Putting tremolo before your fuzz because you heard it on a recording is a reason. Putting it there without knowing why produces sounds you can't predict or reproduce.

The canonical order is a sensible default for a reason. What you build on top of it is your chain, for your sounds. The methodology is: understand the default, understand the cause, deviate deliberately.
```

- [ ] **Step 6: Verify all 5 guides render**

```bash
pnpm dev
```

Check each guide page. Verify:
- Frontmatter parses without error (no 404s)
- TOC populates correctly in the sidebar (headings are visible)
- `readingTime` appears in the header metadata
- Related guides appear for guides in the same category

URLs to check:
- http://localhost:3000/guides/true-bypass-vs-buffered
- http://localhost:3000/guides/power-supply-and-noise-floor
- http://localhost:3000/guides/effects-loop-serial-vs-parallel
- http://localhost:3000/guides/cable-capacitance-and-frequency-response
- http://localhost:3000/guides/pedalboard-order-methodology

Also check http://localhost:3000 — the homepage should now show 8 guides. The featured guide will be whichever has the most recent `published` date.

- [ ] **Step 7: Commit all 5 guides**

```bash
git add content/guides/
git commit -m "feat: add 5 new signal-chain reference guides"
```

---

## Task 10: Build verification + push

**Files:** None (verification only)

- [ ] **Step 1: Run full test suite**

```bash
pnpm test
```

Expected: All tests PASS.

- [ ] **Step 2: Run TypeScript check**

```bash
pnpm typecheck
```

Expected: No errors. If type errors appear on `GuideRecord` (missing `readingTime` or `headings`): verify Task 3 Steps 1–2 were applied to `lib/mdx.ts`.

- [ ] **Step 3: Run production build**

```bash
pnpm build
```

Expected: Build succeeds. All 8 guide static pages generated. Check the build output — it lists pages like `/guides/signal-chain-topology`, `/guides/true-bypass-vs-buffered`, etc.

If the build fails with a missing module error on any `.mdx` file: check the frontmatter of that guide matches the schema (all required fields: title, slug, category, published, description).

- [ ] **Step 4: Spot-check production preview**

```bash
pnpm start
```

Navigate to http://localhost:3000. Verify:
- Homepage shows FeaturedStack with 8 guides
- Guide page shows sidebar TOC with scrollspy
- Switching OS to light mode shows Paper Editorial theme (warm off-white background)
- Mobile layout: featured grid stacks, guide sidebar collapses inline

- [ ] **Step 5: Push to remote**

```bash
git push origin main
```

---

## Task 11: Deploy to Vercel + DNS

**No code files. CLI and dashboard steps.**

- [ ] **Step 1: Ensure Vercel CLI is installed**

```bash
vercel --version
```

If missing:
```bash
pnpm add -g vercel
```

- [ ] **Step 2: Deploy to Vercel from repo root**

```bash
cd /Users/jason/code/guitar-solutions
vercel
```

When prompted:
- **Set up and deploy:** Yes
- **Scope:** Suede-AI team
- **Link to existing project:** No
- **Project name:** `guitar-solutions`
- **Directory:** `./`
- **Override settings:** No

Note the preview URL from the output.

- [ ] **Step 3: Promote to production**

```bash
vercel --prod
```

Note the production URL (likely `guitar-solutions.vercel.app`). Verify the site loads correctly at this URL before changing DNS.

- [ ] **Step 4: Add guitar.services domain in Vercel dashboard**

In Vercel: guitar-solutions project → Settings → Domains → Add domain:
- `guitar.services`
- `www.guitar.services`

Vercel will display the required DNS records:
- Apex A record → `76.76.21.21`
- `www` CNAME → `cname.vercel-dns.com`

- [ ] **Step 5: Update GoDaddy DNS**

Log into GoDaddy → DNS Management for `guitar.services`.

Current state: a GoDaddy 301 forwarding rule pointing to `suedeai.ai`. **Delete this forwarding rule.**

Add:
- Type: **A** | Name: **@** | Value: **76.76.21.21** | TTL: 600
- Type: **CNAME** | Name: **www** | Value: **cname.vercel-dns.com** | TTL: 600

- [ ] **Step 6: Verify DNS propagation**

```bash
dig guitar.services A +short
```

Expected: `76.76.21.21`

Propagation takes 5–60 minutes. Once the dig returns correctly, visit https://guitar.services. Verify:
- HTTPS certificate is issued (Vercel provisions automatically once DNS resolves)
- Site loads with correct content
- Both light and dark themes respond to system preference

---

*Plan complete. 8 guides live at guitar.services on deploy.*
