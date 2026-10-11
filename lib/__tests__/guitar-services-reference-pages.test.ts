import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';
import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';

import { GET as llmsResponse } from '../../app/guitar-services-llms.txt/route';
import { GET as sitemapResponse } from '../../app/guitar-services-sitemap.xml/route';
import { middleware } from '../../middleware';
import nextConfig from '../../next.config.mjs';
import { BOOK_FACTS, BOOK_PARTS, EXPANDED_WORKBOOK } from '../signal-chain-book';
import { CHORD_FAMILIES, LIBRARY_CHORDS, LIBRARY_SCALES, LIBRARY_SECTIONS } from '../chord-scale-library';
import {
  GUITAR_SERVICES_ORIGIN,
  GUITAR_SERVICES_PAGES,
  REFERENCE_PAGES,
  canonicalUrl,
  referencePageSchema,
  type GuitarServicesPage,
} from '../guitar-services-pages';
import { GUIDE_GROUPS, GUIDE_SUMMARIES, strumlyGuideUrl } from '../signal-chain-guides';
import { PRODUCTS, allPracticeToolUrls } from '../practice-tools';
import { SURFACES } from '../guitar-services-content';

/**
 * guitar.services grew from two indexable pages to six on 2026-10-11. Three
 * things have to agree for a page to be real: middleware has to route it, the
 * host sitemap has to list it, and a normal link has to reach it. All three are
 * generated from lib/guitar-services-pages.ts, and this file checks the
 * generated output rather than the list itself.
 */

type PageModule = {
  default: ComponentType;
  metadata: {
    title: { absolute: string };
    description: string;
    alternates: { canonical: string };
    openGraph: { url: string; title: string; description: string };
  };
};

const PAGE_MODULES: Record<string, () => Promise<PageModule>> = {
  '/': () => import('../../app/guitar-services/page') as Promise<PageModule>,
  '/about': () => import('../../app/about/page') as Promise<PageModule>,
  '/the-signal-chain': () => import('../../app/the-signal-chain/page') as Promise<PageModule>,
  '/signal-chain-guides': () => import('../../app/signal-chain-guides/page') as Promise<PageModule>,
  '/chords-and-scales': () => import('../../app/chords-and-scales/page') as Promise<PageModule>,
  '/practice-tools': () => import('../../app/practice-tools/page') as Promise<PageModule>,
};

function guitarServicesRequest(pathname: string): NextRequest {
  return new NextRequest(`https://guitar.services${pathname}`, {
    headers: { host: 'guitar.services' },
  });
}

async function renderPage(page: GuitarServicesPage): Promise<string> {
  const mod = await PAGE_MODULES[page.path]();
  return renderToStaticMarkup(createElement(mod.default));
}

function hrefs(html: string): string[] {
  return [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
}

describe('every guitar.services page has a module', () => {
  it('maps each listed page to a page module', () => {
    expect(Object.keys(PAGE_MODULES).sort()).toEqual(GUITAR_SERVICES_PAGES.map((p) => p.path).sort());
  });
});

describe('routing on guitar.services', () => {
  it.each(REFERENCE_PAGES.map((p) => [p.path]))('%s passes through to its own route', (pathname) => {
    expect(middleware(guitarServicesRequest(pathname)).headers.get('x-middleware-rewrite')).toBeNull();
  });

  it.each(REFERENCE_PAGES.map((p) => [`${p.path}/not-a-page`]))('%s is a 404', (pathname) => {
    expect(middleware(guitarServicesRequest(pathname)).headers.get('x-middleware-rewrite')).toBe(
      'https://guitar.services/guitar-services-not-found',
    );
  });

  it('still 404s a near-miss of a real path', () => {
    expect(middleware(guitarServicesRequest('/the-signal-chain-book')).headers.get('x-middleware-rewrite')).toBe(
      'https://guitar.services/guitar-services-not-found',
    );
    expect(middleware(guitarServicesRequest('/Chords-And-Scales')).headers.get('x-middleware-rewrite')).toBe(
      'https://guitar.services/guitar-services-not-found',
    );
  });

  it('keeps the reference pages off the retired guides host', () => {
    for (const page of REFERENCE_PAGES) {
      const request = new NextRequest(`https://guides.guitar.solutions${page.path}`, {
        headers: { host: 'guides.guitar.solutions' },
      });
      expect(middleware(request).headers.get('x-middleware-rewrite')).toBe(
        'https://guides.guitar.solutions/guides-not-found',
      );
    }
  });

  it('has no config redirect that would shadow a reference page', async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    const sources = redirects.map((r) => r.source);
    for (const page of REFERENCE_PAGES) {
      expect(sources).not.toContain(page.path);
    }
  });
});

describe('page metadata', () => {
  it.each(GUITAR_SERVICES_PAGES.map((p) => [p.path, p]))(
    '%s serves the listed title, description, and a self-referencing canonical',
    async (_path, page) => {
      const { metadata } = await PAGE_MODULES[page.path]();
      expect(metadata.title.absolute).toBe(page.title);
      expect(metadata.description).toBe(page.description);
      expect(metadata.alternates.canonical).toBe(canonicalUrl(page));
      expect(metadata.openGraph.url).toBe(canonicalUrl(page));
    },
  );

  it('gives every page a unique title and description', () => {
    const titles = GUITAR_SERVICES_PAGES.map((p) => p.title);
    const descriptions = GUITAR_SERVICES_PAGES.map((p) => p.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it('writes canonicals in the served form: bare origin for home, no trailing slash elsewhere', () => {
    for (const page of GUITAR_SERVICES_PAGES) {
      const url = canonicalUrl(page);
      expect(url.startsWith(GUITAR_SERVICES_ORIGIN)).toBe(true);
      expect(url.endsWith('/')).toBe(false);
    }
  });
});

describe('internal links', () => {
  it.each(GUITAR_SERVICES_PAGES.map((p) => [p.path, p]))(
    '%s links every other guitar.services page',
    async (_path, page) => {
      const links = hrefs(await renderPage(page));
      for (const other of GUITAR_SERVICES_PAGES) {
        if (other.path === page.path) continue;
        expect(links, `${page.path} should link ${other.path}`).toContain(other.path);
      }
    },
  );

  it.each(REFERENCE_PAGES.map((p) => [p.path, p]))('%s carries one h1 and no noindex', async (_path, page) => {
    const html = await renderPage(page);
    expect(html.match(/<h1[\s>]/g)?.length).toBe(1);
    expect(html).not.toMatch(/noindex/i);
  });
});

describe('host sitemap and llms.txt', () => {
  it('lists every page exactly once, and nothing else', async () => {
    const xml = await sitemapResponse().then((r) => r.text());
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toEqual(GUITAR_SERVICES_PAGES.map(canonicalUrl));
  });

  it('names every page in llms.txt', async () => {
    const body = await llmsResponse().then((r) => r.text());
    for (const page of GUITAR_SERVICES_PAGES) {
      expect(body).toContain(`(${canonicalUrl(page)})`);
    }
  });
});

describe('reference page JSON-LD', () => {
  it.each(REFERENCE_PAGES.map((p) => [p.path, p]))(
    '%s is keyed to guitar.services and defines no person or organization',
    (_path, page) => {
      const graph = referencePageSchema(page)['@graph'] as Record<string, unknown>[];
      const webPage = graph.find((n) => n['@type'] === 'WebPage');
      expect(webPage?.['@id']).toBe(`${canonicalUrl(page)}#webpage`);
      expect(graph.some((n) => n['@type'] === 'Organization' || n['@type'] === 'Person')).toBe(false);
    },
  );
});

describe('signal chain guide summaries', () => {
  const dir = path.join(process.cwd(), 'content', 'guides');
  const frontmatter = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => matter(fs.readFileSync(path.join(dir, f), 'utf8')).data as Record<string, string>);

  it('summarizes every guide in content/guides, once', () => {
    expect(GUIDE_SUMMARIES.map((g) => g.slug).sort()).toEqual(frontmatter.map((f) => f.slug).sort());
  });

  it('matches each guide’s title, category, and published date', () => {
    for (const fm of frontmatter) {
      const summary = GUIDE_SUMMARIES.find((g) => g.slug === fm.slug);
      expect(summary).toMatchObject({ title: fm.title, category: fm.category, published: fm.published });
    }
  });

  it('places every guide in exactly one reading group', () => {
    const grouped = GUIDE_GROUPS.flatMap((g) => g.slugs);
    expect([...grouped].sort()).toEqual(GUIDE_SUMMARIES.map((g) => g.slug).sort());
  });

  it('links each guide to its canonical Strumly URL', () => {
    for (const g of GUIDE_SUMMARIES) {
      expect(strumlyGuideUrl(g.slug)).toBe(`https://strumly.suedeai.ai/guides/${g.slug}`);
    }
  });
});

describe('book facts', () => {
  it('adds up to the totals the listing states', () => {
    expect(BOOK_PARTS.reduce((n, p) => n + p.chapters, 0)).toBe(BOOK_FACTS.chapters);
    expect(BOOK_PARTS.reduce((n, p) => n + p.workshops, 0)).toBe(BOOK_FACTS.workshops);
    const workbook = BOOK_PARTS.find((p) => p.name.startsWith('The Expanded Workbook'));
    expect(EXPANDED_WORKBOOK.reduce((n, s) => n + s.workshops, 0)).toBe(workbook?.workshops);
  });
});

describe('chord and scale library', () => {
  const FAMILY_FORMULAS: Record<string, string[]> = {
    major: ['1 3 5'],
    minor: ['1 b3 5'],
    'dominant-seventh': ['1 3 5 b7'],
    'major-seventh': ['1 3 5 7'],
    'minor-seventh': ['1 b3 5 b7'],
    suspended: ['1 2 5', '1 4 5'],
    power: ['1 5'],
  };

  it('indexes 39 chords and 12 scales, each with a unique guitarchords.info page', () => {
    expect(LIBRARY_CHORDS).toHaveLength(39);
    expect(LIBRARY_SCALES).toHaveLength(12);
    const urls = [...LIBRARY_CHORDS, ...LIBRARY_SCALES].map((x) => x.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) expect(url).toMatch(/^https:\/\/guitarchords\.info\/(chords|scales)\/[a-z0-9-]+$/);
  });

  it('files every chord under the family its formula belongs to', () => {
    expect(CHORD_FAMILIES.map((f) => f.family).sort()).toEqual(Object.keys(FAMILY_FORMULAS).sort());
    for (const chord of LIBRARY_CHORDS) {
      expect(FAMILY_FORMULAS[chord.family]).toContain(chord.formula);
      expect(chord.shape).toMatch(/^[x0-9]{6}$/);
    }
  });
});

describe('outbound links', () => {
  // Hosts the estate audit marked as not linkable: noindex, gated, or down.
  const BLOCKED = /^https:\/\/(ip|producer|webmcp|market)\.suedeai\.ai(\/|$)/;

  const outbound = [
    ...SURFACES.map((s) => s.url),
    ...allPracticeToolUrls(),
    ...LIBRARY_SECTIONS.map((s) => s.url),
    ...LIBRARY_CHORDS.map((c) => c.url),
    ...LIBRARY_SCALES.map((s) => s.url),
    ...GUIDE_SUMMARIES.map((g) => strumlyGuideUrl(g.slug)),
  ];

  it('uses https, carries no tracking parameters, and avoids blocked hosts', () => {
    for (const url of outbound) {
      expect(url.startsWith('https://')).toBe(true);
      expect(url).not.toMatch(/[?&]utm_/);
      expect(url).not.toMatch(BLOCKED);
    }
  });

  it('lists each practice product once', () => {
    const urls = PRODUCTS.map((p) => p.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it.each(GUITAR_SERVICES_PAGES.map((p) => [p.path, p]))(
    '%s renders no blocked host and no tracking parameter',
    async (_path, page) => {
      for (const href of hrefs(await renderPage(page))) {
        expect(href).not.toMatch(BLOCKED);
        expect(href).not.toMatch(/[?&]utm_/);
      }
    },
  );
});
