# guitar.services — Editorial Redesign

**Date:** 2026-06-16  
**Repo:** Suede-AI/guitar-solutions  
**Domain:** guitar.services  
**Status:** Approved, pending implementation

---

## Purpose

A content-first, authoritative reference site for guitar signal-chain knowledge. Earns backlinks and search traffic through high-quality technical guides. Subtle "by Suede Labs" footer attribution — no product CTAs, no funnels.

---

## Architecture

### Stack (unchanged)
- Next.js 15 + React 19
- MDX via `@next/mdx` + `gray-matter`
- Tailwind CSS 4 beta
- Geist fonts (already a dependency)

### Key changes
- **Theming via CSS custom properties.** Replace scattered Tailwind color classes with a `styles/tokens.css` file. All colors defined as CSS vars at `:root`; a `@media (prefers-color-scheme: dark)` block swaps them. No `dark:` class churn.
- **`<GuideSidebar>` component.** Sticky left rail (hidden on mobile, visible ≥ 1024px). Contains:
  - Live scrollspy TOC built from MDX `##` headings
  - Related guides list (same category, max 3, pulled from `getAllGuides()`)
- **`readingTime` utility.** Added to `lib/mdx.ts`. Estimates minutes from word count (200 wpm). Added to guide frontmatter type and displayed in guide header.
- **`FeaturedStack` component.** Homepage asymmetric grid: newest guide in large left cell (title, category, excerpt, read time), two secondary guides in right column, full alphabetical index below with read time and category chip.

### File structure additions
```
app/
  page.tsx                  ← rewritten (FeaturedStack)
  guides/[slug]/page.tsx    ← rewritten (sidebar layout)
components/
  FeaturedStack.tsx         ← new
  GuideSidebar.tsx          ← new
styles/
  tokens.css                ← new (replaces hardcoded palette)
lib/
  mdx.ts                    ← add readingTime to schema + utility
```

---

## Visual Design

### Themes (system-preference driven)

**Light — Paper Editorial**  
Background: `#f5f0e8` (warm off-white)  
Text: `#0d0d0d` (deep ink)  
Accent: `#9f101a` (Rights Red)  
Surface: `#ece7de`  
Border: `#d4cfc6`

**Dark — Deep Ink**  
Background: `#0d0d0d`  
Text: `#e8e0d4` (warm off-white)  
Accent: `#9f101a` (Rights Red)  
Surface: `#161616`  
Border: `#2a2a2a`

### Typography
- **Display/headings:** Geist Sans at `font-weight: 700–800`, `letter-spacing: -0.03em` — achieves tight grotesque display feel without adding a font dependency
- **Body/prose:** Georgia (web-safe serif) for guide body copy — readable, authoritative, no extra font load
- **Labels/metadata/chips:** Geist Mono (already loaded) for category slugs, read times, section markers

### Component treatments
- Pull-quotes: `border-left: 3px solid var(--accent)`, `font-style: italic`, surface background
- Code / spec callouts: monospaced surface boxes, no syntax highlighting needed
- Category chips: dark pill (light mode) / off-white pill (dark mode), monospaced text, uppercase
- Red accent rule: 1–2px horizontal line under site wordmark in header

---

## Content Plan

### 3 existing guides (carry over)
| Slug | Category |
|---|---|
| `signal-chain-topology` | Signal Chain |
| `gain-staging-across-the-chain` | Gain & Dynamics |
| `impedance-and-the-first-three-feet` | Electronics |

### 5 new guides to write
| Slug | Category | Angle |
|---|---|---|
| `true-bypass-vs-buffered` | Electronics | What each pedal type physically does to the signal; when buffering helps vs. hurts |
| `power-supply-and-noise-floor` | Power | Ground loops, daisy-chain noise, isolated vs. non-isolated supplies, specs that matter |
| `effects-loop-serial-vs-parallel` | Gain & Dynamics | Why the loop exists, serial vs. parallel topologies, 4-cable method |
| `cable-capacitance-and-frequency-response` | Electronics | How capacitance rolls off highs, the spec that matters, buffer as the fix |
| `pedalboard-order-methodology` | Signal Chain | Practical ordering decisions by pedal type, why the canonical map has exceptions |

### Categories (4 total)
- Signal Chain
- Electronics
- Gain & Dynamics
- Power

---

## Homepage Layout

**Magazine stack** — asymmetric editorial grid:

```
┌─────────────────────────────────────┬──────────────┐
│                                     │  Guide 2     │
│  FEATURED GUIDE (newest)            ├──────────────┤
│  Title · Category · Read time       │  Guide 3     │
│  Excerpt (2–3 sentences)            │              │
└─────────────────────────────────────┴──────────────┘
─────────────────────────────────────────────────────
ALL GUIDES
┌────────────────┬────────────────┬────────────────┐
│ Guide card     │ Guide card     │ Guide card     │
└────────────────┴────────────────┴────────────────┘
```

Featured guide = newest by `published` date. Secondary two = next newest. Below the grid: full guide index, 3-column card layout, sorted by date descending.

---

## Guide Page Layout

**Sticky sidebar + prose column:**

```
┌─────────────────┬──────────────────────────────────┐
│ Contents        │  Category · Read time            │
│ ─────────────   │  ──────────────────────────────  │
│ → Section 1     │  H1 Title                        │
│   Section 2     │  ████ (red rule)                 │
│   Section 3     │                                  │
│   Section 4     │  Body prose (Georgia, ~65ch)     │
│                 │                                  │
│ ─────────────   │  > Pull-quote treatment          │
│ Related         │                                  │
│ Guide A →       │  Body continues...               │
│ Guide B →       │                                  │
└─────────────────┴──────────────────────────────────┘
```

- Sidebar: 220px fixed, hidden below 1024px
- TOC: scrollspy highlights active heading as user reads
- Prose: max-width `65ch`, Georgia, generous line-height (1.75)
- Mobile: TOC collapses to an inline anchor list at top of article

---

## Deployment

1. Create Vercel project `guitar-solutions` linked to `Suede-AI/guitar-solutions` main branch
2. Add `guitar.services` domain in Vercel project settings (apex + www)
3. Update GoDaddy DNS for `guitar.services`:
   - Remove existing 301 forward
   - Apex A record → `76.76.21.21`
   - `www` CNAME → `cname.vercel-dns.com`
4. Auto-deploys on push to main

---

## Footer Attribution

Single line, muted color: `A Suede Labs reference — suedeai.ai`  
No product links, no CTAs, no app store badges.

---

## Out of Scope

- Search (no JS search at launch — guide count too low to justify)
- Newsletter / email capture
- Comments
- Authentication
- Analytics beyond Vercel's built-in
