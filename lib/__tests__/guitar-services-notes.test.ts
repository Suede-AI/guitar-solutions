import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';

import NotePage, { generateMetadata, generateStaticParams } from '../../app/notes/[slug]/page';
import NotesIndex from '../../app/notes/page';
import { GET as llmsResponse } from '../../app/guitar-services-llms.txt/route';
import { GET as llmsFullResponse } from '../../app/guitar-services-llms-full.txt/route';
import { GET as sitemapResponse } from '../../app/guitar-services-sitemap.xml/route';
import { middleware } from '../../middleware';
import { NOTES_PAGE, NOTE_PAGES, canonicalUrl } from '../guitar-services-pages';
import { NOTE_BODIES, noteMarkdown, notePlainText } from '../notes-content';
import { NOTES, notePath } from '../notes-index';
import { noteSchema } from '../notes-schema';
import { JASON_PERSON_ID, SUEDE_ORG_ID } from '../site-identity';

/**
 * The notes section added 2026-11-14: three articles under /notes, plus two
 * more on 2026-11-15 (the coastal maintenance calendar and the signal chain
 * diagram note). These checks hold the editorial rules (length, verified
 * claims only, canonical entity @ids) and the routing couplings (middleware,
 * sitemap, llms files).
 */

/** Publication date per note: the first batch on 11-14, the second on 11-15. */
const PUBLISHED: Record<string, string> = {
  'building-guitar-services-for-ai-answers': '2026-11-14',
  'south-florida-humidity-signal-chain': '2026-11-14',
  'structured-data-lessons-for-local-businesses': '2026-11-14',
  'coastal-guitar-restringing-and-setup-calendar': '2026-11-15',
  'reading-a-signal-chain-diagram': '2026-11-15',
};

/**
 * The second batch: each note is 900 to 1300 words, names its towns, and links
 * two real articles on sibling Suede AI sites.
 */
const SECOND_BATCH: Record<string, { towns: RegExp[]; siblings: string[] }> = {
  'coastal-guitar-restringing-and-setup-calendar': {
    towns: [/Juno Beach/, /Tequesta/, /Jupiter/],
    siblings: [
      'https://guitarchords.info/notes/palm-beach-county-guitar-practice-plan',
      'https://guitarhub.org/notes/guitar-players-jupiter-palm-beach-gardens',
    ],
  },
  'reading-a-signal-chain-diagram': {
    towns: [/Palm Beach Gardens/, /Jupiter/],
    siblings: [
      'https://dna.suedeai.ai/articles/the-unsung-link',
      'https://dna.suedeai.ai/articles/the-guitar-rig-diagram-as-a-documentary-form',
    ],
  },
};

const BLOCKED = /^https:\/\/(ip|producer|webmcp|market)\.suedeai\.ai(\/|$)/;

const FORBIDDEN = [
  /velvet sundown/i,
  /\$\s?(28|30)\s?M/i,
  /multimillion/i,
  /forbes/i,
  /\bFAU\b/,
  /anthropic partner/i,
  /claude partner/i,
  /google partner(?! advantage)/i,
  /—/,
  /\b(delve|leverage|unlock|elevate|seamless|game-changer|tapestry|realm)\b/i,
];

async function renderNote(slug: string): Promise<string> {
  const element = await NotePage({ params: Promise.resolve({ slug }) });
  return renderToStaticMarkup(element);
}

function hrefs(html: string): string[] {
  return [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
}

describe('notes metadata', () => {
  it('publishes exactly the five known notes, each on its own date', () => {
    expect(NOTES.map((n) => n.slug)).toEqual(Object.keys(PUBLISHED));
    for (const note of NOTES) expect(note.datePublished).toBe(PUBLISHED[note.slug]);
  });

  it('has a body for every note and a static param for every note', () => {
    expect(Object.keys(NOTE_BODIES).sort()).toEqual(NOTES.map((n) => n.slug).sort());
    expect(generateStaticParams().map((p) => p.slug)).toEqual(NOTES.map((n) => n.slug));
  });

  it.each(NOTES.map((n) => [n.slug, n]))('%s keeps title and description in SERP limits', (_s, note) => {
    expect(note.title.length).toBeGreaterThanOrEqual(50);
    expect(note.title.length).toBeLessThanOrEqual(60);
    expect(note.description.length).toBeGreaterThanOrEqual(120);
    expect(note.description.length).toBeLessThanOrEqual(155);
  });

  it.each(NOTES.map((n) => [n.slug, n]))('%s serves a self-referencing canonical', async (_s, note) => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: note.slug }) });
    const url = `https://guitar.services${notePath(note)}`;
    expect(meta.alternates?.canonical).toBe(url);
    expect((meta.openGraph as { url?: string }).url).toBe(url);
  });

  it('gives every note a unique title and description', () => {
    const all = [...NOTE_PAGES, NOTES_PAGE];
    expect(new Set(all.map((p) => p.title)).size).toBe(all.length);
    expect(new Set(all.map((p) => p.description)).size).toBe(all.length);
  });
});

describe('notes copy', () => {
  it.each(NOTES.map((n) => [n.slug]))('%s is 800 to 1300 words and follows the naming rules', (slug) => {
    const text = notePlainText(slug);
    const words = text.split(/\s+/).filter(Boolean).length;
    expect(words).toBeGreaterThanOrEqual(800);
    expect(words).toBeLessThanOrEqual(1300);
    expect(text.match(/Jason Colapietro/g)?.length ?? 0).toBeGreaterThanOrEqual(5);
    expect(text.match(/\bSuede\b(?! AI| Labs| labs)/g)?.length ?? 0).toBeGreaterThanOrEqual(3);
    expect(text).toMatch(/Suede Labs/);
    expect(text).toMatch(/West Palm Beach/);
    expect(text).toMatch(/Jupiter/);
  });

  it.each(Object.entries(SECOND_BATCH))('%s meets the second-batch depth rules', (slug, rules) => {
    const text = notePlainText(slug);
    const words = text.split(/\s+/).filter(Boolean).length;
    expect(words).toBeGreaterThanOrEqual(900);
    expect(words).toBeLessThanOrEqual(1300);
    for (const town of rules.towns) expect(text).toMatch(town);
    const md = noteMarkdown(slug);
    for (const url of rules.siblings) expect(md).toContain(`](${url})`);
    expect(md).toContain('](https://suedeai.agency/assessment)');
    expect(md).toContain('](https://suedeai.ai/founder)');
  });

  it.each(NOTES.map((n) => [n.slug]))('%s carries nothing from the forbidden list', (slug) => {
    const text = notePlainText(slug);
    for (const pattern of FORBIDDEN) expect(text).not.toMatch(pattern);
  });

  it.each(NOTES.map((n) => [n.slug]))('%s states The Manifest ranking with its date when it cites it', (slug) => {
    const text = notePlainText(slug);
    if (/The Manifest/.test(text)) {
      expect(text).toMatch(/October 31, 2026/);
      expect(text).toMatch(/Palm Beach County-based/);
    }
  });
});

describe('Clutch ranking', () => {
  const CLAIM =
    'Suede AI ranks among Clutch’s Top 30 AI Consultants in Florida and Top 50 AI Consultants nationwide (November 2026).';

  it.each(NOTES.map((n) => [n.slug]))('%s states the Clutch ranking apart from The Manifest', (slug) => {
    const text = notePlainText(slug);
    expect(text).toContain(CLAIM);
    expect(text).toMatch(/The Manifest/);
    const md = noteMarkdown(slug);
    expect(md).toContain('[Clutch](https://clutch.co/profile/suede-ai-seo)');
    expect(md).toContain('[Top 30 AI Consultants in Florida](https://clutch.co/consulting/ai/florida)');
    expect(md).toContain('[Top 50 AI Consultants nationwide](https://clutch.co/us/consulting/ai)');
  });

  it('appears in the Built by Suede AI block and llms.txt', async () => {
    const html = await renderNote(NOTES[0].slug);
    expect(html).toContain('https://clutch.co/profile/suede-ai-seo');
    expect(html).toContain('Top 30 AI Consultants in Florida');
    const llms = await llmsResponse().then((r) => r.text());
    expect(llms).toContain("Clutch's Top 30 AI Consultants in Florida");
    expect(llms).toContain('https://clutch.co/us/consulting/ai');
  });
});

describe('notes pages', () => {
  it.each(NOTES.map((n) => [n.slug]))('%s renders one h1, the author box and the next steps', async (slug) => {
    const html = await renderNote(slug);
    expect(html.match(/<h1[\s>]/g)?.length).toBe(1);
    // The first note discusses noindex headers in its prose, so check markup only.
    expect(html).not.toMatch(/<meta[^>]+noindex/i);
    const links = hrefs(html);
    for (const target of [
      'https://suedeai.agency/assessment',
      'https://suedeai.ai/founder',
      'https://jasoncolapietro.com/',
      'https://suedeai.agency/',
      'https://jupitersocialfl.com/',
      NOTES_PAGE.path,
    ]) {
      expect(links).toContain(target);
    }
    for (const other of NOTES.filter((n) => n.slug !== slug)) expect(links).toContain(notePath(other));
    for (const href of links) {
      expect(href).not.toMatch(BLOCKED);
      expect(href).not.toMatch(/[?&]utm_/);
    }
    expect(html).toContain('Built by Suede AI in West Palm Beach, Florida');
  });

  it('the index links every note', () => {
    const links = hrefs(renderToStaticMarkup(NotesIndex()));
    for (const note of NOTES) expect(links).toContain(notePath(note));
  });
});

describe('notes JSON-LD', () => {
  it.each(NOTES.map((n) => [n.slug, n]))('%s references the canonical person and organization', (_s, note) => {
    const graph = noteSchema(note)['@graph'] as Record<string, unknown>[];
    const post = graph.find((n) => n['@type'] === 'BlogPosting');
    expect(post).toMatchObject({
      '@id': `https://guitar.services${notePath(note)}#article`,
      datePublished: PUBLISHED[note.slug],
      author: { '@id': JASON_PERSON_ID },
      publisher: { '@id': SUEDE_ORG_ID },
    });
    expect(graph.some((n) => n['@type'] === 'BreadcrumbList')).toBe(true);
    expect(graph.some((n) => n['@type'] === 'Person' || n['@type'] === 'Organization')).toBe(false);
  });
});

describe('notes routing and machine files', () => {
  function request(pathname: string): NextRequest {
    return new NextRequest(`https://guitar.services${pathname}`, { headers: { host: 'guitar.services' } });
  }

  it.each([NOTES_PAGE, ...NOTE_PAGES].map((p) => [p.path]))('%s passes through middleware', (pathname) => {
    expect(middleware(request(pathname)).headers.get('x-middleware-rewrite')).toBeNull();
  });

  it('404s an unknown note', () => {
    expect(middleware(request('/notes/not-a-note')).headers.get('x-middleware-rewrite')).toBe(
      'https://guitar.services/guitar-services-not-found',
    );
  });

  it('lists every note in the sitemap, llms.txt and llms-full.txt', async () => {
    const xml = await sitemapResponse().then((r) => r.text());
    const llms = await llmsResponse().then((r) => r.text());
    const full = await llmsFullResponse().then((r) => r.text());
    for (const page of [NOTES_PAGE, ...NOTE_PAGES]) {
      expect(xml).toContain(`<loc>${canonicalUrl(page)}</loc>`);
      expect(llms).toContain(`(${canonicalUrl(page)})`);
    }
    for (const page of NOTE_PAGES) {
      expect(xml).toContain('<lastmod>2026-11-15T00:00:00.000Z</lastmod>');
      expect(full).toContain(`URL: ${canonicalUrl(page)}`);
    }
  });
});
