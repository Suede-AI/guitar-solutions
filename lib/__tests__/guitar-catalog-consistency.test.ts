import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Home, { metadata } from '../../app/guitar-services/page';
import About from '../../app/about/page';
import BookContents from '../../app/the-signal-chain/page';
import { GET as llms } from '../../app/guitar-services-llms.txt/route';
import { GET as llmsFull } from '../../app/guitar-services-llms-full.txt/route';
import { FAQ, aboutSchema } from '../about-content';
import { SURFACES, guitarServicesSchema } from '../guitar-services-content';
import { HOME_PAGE } from '../guitar-services-pages';
import { resolveSiteIdentity } from '../site-identity';

// Regression: reverting any surface to the old two-current-guitar-books model
// must fail on the actual human-readable or machine-readable output.
const obsoleteClaim = /(?:two|2)\s+(?:published\s+)?(?:guitar\s+)?(?:books|volumes)|both books|separate paid publications/i;
const listing = 'https://strumly.suedeai.ai/book';
const catalog = `${listing}/catalog`;
const currentBooks = 'https://suedeai.ai/founder#books';
const lineage = /The Guitar Without a Number[^.]*incorporated into The Signal Chain/i;
const textOf = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');

describe('current guitar book and incorporated publication history', () => {
  it('links the current book directly to its listing', () => {
    expect(SURFACES.filter((s) => s.kind === 'Book').map((s) => [s.name, s.url])).toEqual([
      ['The Signal Chain', listing],
    ]);
  });

  it('retains the earlier title as publication history with a catalog link', () => {
    const earlier = SURFACES.find((s) => s.name === 'The Guitar Without a Number');
    expect(earlier?.kind).toBe('Publication history');
    expect(earlier?.url).toBe(catalog);
    expect(earlier?.desc).toMatch(/incorporated into The Signal Chain/i);
  });

  it('preserves the other directory products and references', () => {
    for (const name of ['Signal Chain Guides', 'Guitar Chords', 'GuitarHub', 'Strumly', 'Suede Guitar Tuner & Studio', 'Suede Social']) {
      expect(SURFACES.some((s) => s.name === name)).toBe(true);
    }
  });

  it.each([['home', Home], ['about', About]])('%s no longer claims two current guitar books', (_name, Page) => {
    const html = renderToStaticMarkup(createElement(Page));
    expect(textOf(html)).not.toMatch(obsoleteClaim);
    expect(textOf(html)).toMatch(/The Signal Chain/);
    expect(textOf(html)).toMatch(lineage);
  });

  it('places the seven-book bibliography in the broader founder catalog', () => {
    const html = renderToStaticMarkup(createElement(About));
    expect(textOf(html)).toMatch(/seven current books/i);
    expect(html).toContain(`href="${currentBooks}"`);
  });

  it('keeps metadata and home schema consistent with the current book', () => {
    for (const description of [metadata.description, metadata.openGraph?.description, metadata.twitter?.description, HOME_PAGE.description]) {
      expect(description).not.toMatch(obsoleteClaim);
      expect(description).toContain('The Signal Chain');
    }
    expect(metadata.description).toBe(HOME_PAGE.description);
    expect(JSON.stringify(guitarServicesSchema)).not.toMatch(obsoleteClaim);
  });

  it('publishes the same corrected lineage in visible FAQ and FAQPage schema', () => {
    const answer = FAQ.find((item) => /Without a Number/.test(item.q))?.a;
    expect(typeof answer).toBe('string');
    expect(answer).toMatch(lineage);
    expect(answer).toContain(catalog);
    expect(FAQ.map((item) => item.a).join(' ')).not.toMatch(obsoleteClaim);
    const schema = aboutSchema['@graph'].find((node) => node['@type'] === 'FAQPage');
    expect(JSON.stringify(schema)).toContain(answer);
    expect(JSON.stringify(schema)).not.toMatch(obsoleteClaim);
  });

  it.each([['llms.txt', llms], ['llms-full.txt', llmsFull]])('%s agrees with the pages and separates the wider bibliography', async (_name, get) => {
    const body = await (await get()).text();
    expect(body.replace(/\n>\s*/g, ' ').replace(/\s+/g, ' ')).not.toMatch(obsoleteClaim);
    expect(body).toMatch(lineage);
    expect(body).toContain(listing);
    expect(body).toContain(catalog);
    expect(body).toContain(currentBooks);
    expect(body).toMatch(/seven current books/i);
  });

  it('keeps the contents summary explicit about the incorporated work', () => {
    expect(textOf(renderToStaticMarkup(createElement(BookContents)))).toMatch(lineage);
  });

  it('uses the current book listing in fallback structured data and llms', () => {
    const graph = resolveSiteIdentity('guides.guitar.solutions').jsonLd?.['@graph'] as Record<string, unknown>[];
    expect(graph.find((node) => node['@type'] === 'Book')?.url).toBe(listing);
    expect(readFileSync('public/llms.txt', 'utf8')).toContain(`The Signal Chain: ${listing}`);
  });
});

describe('share card catalog wording', () => {
  it.each(['public/guitar-services-social-card.svg', 'app/guitar-services/opengraph-image.tsx'])('%s names the current guitar book without the obsolete count', (file) => {
    const source = readFileSync(file, 'utf8');
    expect(source).not.toMatch(obsoleteClaim);
    expect(source).toContain('The Signal Chain');
  });

  it('serves a 1200 by 630 WebP generated from the current SVG', async () => {
    // Next already installs Sharp for image processing. Check a source digest
    // embedded by build:social-card so changing only the SVG leaves this red.
    const requireHere = createRequire(import.meta.url);
    const requireFromNext = createRequire(requireHere.resolve('next/package.json'));
    const sharp = requireFromNext('sharp');
    const svg = readFileSync('public/guitar-services-social-card.svg');
    const digest = createHash('sha256').update(svg).digest('hex');
    const image = await sharp('public/guitar-services-social-card.webp').metadata();
    expect(image).toMatchObject({ format: 'webp', width: 1200, height: 630 });
    expect(image.xmp?.toString() ?? '').toContain(digest);
  });
});
