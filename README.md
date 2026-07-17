# guitar-solutions

> **By [Jason Colapietro](https://suedeai.ai/founder) / [Suede Labs AI](https://suedeai.ai)**

Redirect shell for the guitar.solutions domains, plus the guitar.services
landing page. The eight signal-chain guides that lived at
guides.guitar.solutions were migrated into Strumly at
[strumly.suedeai.ai/guides](https://strumly.suedeai.ai/guides); this app's job
is to keep every old URL pointing at its new home without dropping a single
slug, and to serve one curated page on guitar.services.

## What this deployment actually does

Two jobs, and the order between them matters.

**1. Redirects for guides.guitar.solutions** — defined in
`next.config.mjs`, applied to every host except guitar.services:

| Source | Destination | Status |
| --- | --- | --- |
| `/llms.txt`, `/robots.txt`, `/sitemap.xml` | same file on `strumly.suedeai.ai` | 308 |
| `/catalog.html` | `strumly.suedeai.ai/book/catalog` | 308 |
| `/guides/:slug` | `strumly.suedeai.ai/guides/:slug` (slug-preserving) | 308 |
| `/categories`, `/guitar-services`, `/` | `strumly.suedeai.ai/guides` | 308 |
| `/:path*` catch-all | `strumly.suedeai.ai/guides` | 307 |

The catch-all is temporary (307) on purpose: unknown paths flatten to one
page, and a permanent flattening would fight any future repurposing of the
domain. Everything that actually migrated gets an explicit 308 above it.

**2. The guitar.services landing page** — `middleware.ts` rewrites that
host's `/` to `app/guitar-services/page.tsx` (Person/Organization JSON-LD,
cross-links to the two books, the Strumly guides, and the chord tools) and
its `/sitemap.xml` to a single-URL host sitemap; every other path on that
host 308s to guides.guitar.solutions, which forwards to Strumly.

Config redirects run **before** middleware. The `/`, `/sitemap.xml`, and
`/:path*` redirect entries carry a `missing` host condition so they skip
guitar.services; remove those conditions and the middleware silently becomes
dead code again. `app/robots.ts` and `app/sitemap.ts` are shadowed by the
redirects and kept only as fallbacks.

## Guide source (archived, still building)

`content/guides/*.mdx` is the source-of-record for the migrated guides. The
pages still compile and render (`app/guides/[slug]/page.tsx`) so the content
stays verifiable, but every guide route redirects in production — the live
copies are on Strumly.

Frontmatter shape (parsed by `lib/mdx.ts`; `category` is a free-form string,
grouped by `getCategories()`):

```yaml
---
title: "Title in title case"
slug: "kebab-case-slug"            # must match the filename
category: "Signal Chain"           # in use: Signal Chain, Electronics, Gain & Dynamics, Power
published: "YYYY-MM-DD"
description: "One sentence, ~150 chars."
authors:
  - "Suede Labs"
---
```

## Stack

- Next.js App Router (`next@^15.0.3`), TypeScript strict
- `@next/mdx` + `gray-matter` for the archived guides
- Tailwind CSS v4 (beta), Geist Sans / Geist Mono
- Vitest (`lib/__tests__`)
- pnpm

## Quick start

```bash
pnpm install
pnpm dev          # http://localhost:3000 — redirects apply in dev too
pnpm typecheck    # tsc --noEmit
pnpm test         # vitest run
pnpm build        # production build
```

To exercise the host routing locally, run `pnpm build && pnpm start -p 3111`
and curl with a `Host` header:

```bash
curl -si -H "Host: guitar.services" http://127.0.0.1:3111/ | head -1            # 200 landing page
curl -si -H "Host: guides.guitar.solutions" http://127.0.0.1:3111/llms.txt | head -1  # 308 to Strumly
```

## Project structure

```
next.config.mjs             The redirect map — the load-bearing file
middleware.ts               guitar.services host rewrites + 308s
app/
  guitar-services/          Curated guitar.services landing page (JSON-LD)
  guitar-services-sitemap.xml/  Single-URL sitemap for that host
  guides/[slug]/page.tsx    Archived guide renderer
  robots.ts, sitemap.ts     Shadowed by redirects; fallback only
content/guides/             Migrated MDX guides (source-of-record)
lib/mdx.ts                  Frontmatter loader + index helpers
public/llms.txt             Shadowed by the /llms.txt 308; fallback only
```

## Design language

The archived pages and the guitar.services landing page use the **Suede
Institutional IP Terminal** palette: Rights Red `#9f101a`, Registry Cyan
`#22d3ee`, Deep Ink `#050b16`. Hairline rules, mono labels in tracked-out
caps, one accent color carrying the system.

## Provenance

The taxonomy and archival tone draw on the Suede DNA project at
`dna.suedeai.ai`. The guides now live inside Strumly, the Suede Labs AI
guitar coach, at [strumly.suedeai.ai](https://strumly.suedeai.ai).
