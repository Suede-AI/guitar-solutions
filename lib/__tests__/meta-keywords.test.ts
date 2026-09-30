import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BRAND_KEYWORDS, KEYWORD_PAGES, keywordsFor } from '../keywords';

// The indexable pages guitar.services serves (middleware.ts lets only these
// through; everything else on that host is a noindex 404, and every other host
// redirects to Strumly). Each must emit <meta name="keywords">. The root layout
// carries the default so nothing that renders ships without one.
const INDEXABLE = [
  ['app/guitar-services/page.tsx', 'guitar-services'],
  ['app/about/page.tsx', 'about'],
  ['app/layout.tsx', 'default'],
] as const;

describe('meta keywords', () => {
  it.each(INDEXABLE)('%s sets keywords from the central map', (path, page) => {
    const source = readFileSync(resolve(process.cwd(), path), 'utf8');
    expect(source).toContain(`keywords: keywordsFor('${page}')`);
  });

  it.each(KEYWORD_PAGES)('%s list is non-empty, brand-tagged, and deduped', (page) => {
    const list = keywordsFor(page);
    expect(list.length).toBeGreaterThan(BRAND_KEYWORDS.length);
    for (const brand of BRAND_KEYWORDS) expect(list).toContain(brand);
    const lower = list.map((k) => k.toLowerCase());
    expect(new Set(lower).size).toBe(lower.length);
    for (const k of list) expect(k.trim()).toBe(k);
  });
});
