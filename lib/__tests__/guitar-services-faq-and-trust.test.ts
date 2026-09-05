import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FAQ, aboutSchema } from '../about-content';

// Two SEO defect classes this file holds shut on the guitar.services host:
//
//   1. Retrievability. /about ships a FAQPage whose mainEntity mirrors FAQ[].
//      A definition list is not a heading, so when the questions were <dt>
//      elements the visible prose carried zero headings matching the seven
//      declared questions and the schema had nothing to back it. Each question
//      must render as a real <h3> with its answer as prose.
//
//   2. Trust. guitar.services publishes no policy of its own; it links to the
//      estate policy pages instead. Both templates rendered on this host must
//      keep those footer links.

const GUITAR_SERVICES_PAGES = [
  'app/guitar-services/page.tsx',
  'app/about/page.tsx',
] as const;

function read(path: string): string {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

describe('/about FAQ prose carries the headings the FAQPage declares', () => {
  const source = read('app/about/page.tsx');

  it('declares every FAQ entry in the FAQPage schema', () => {
    const faqPage = aboutSchema['@graph'].find(
      (node) => node['@type'] === 'FAQPage',
    ) as { mainEntity: { name: string }[] } | undefined;

    expect(faqPage).toBeDefined();
    expect(faqPage?.mainEntity.map((q) => q.name)).toEqual(FAQ.map((item) => item.q));
  });

  it('renders each question as a heading and each answer as prose', () => {
    expect(source).toContain('<h3 className="mb-2 font-semibold">{item.q}</h3>');
    expect(source).toContain(
      '<p className="text-sm leading-relaxed opacity-80">{item.a}</p>',
    );
  });

  it('uses no definition list for the FAQ', () => {
    expect(source).not.toMatch(/<d[ltd][\s>]/);
  });
});

describe('guitar.services footers link the estate policy pages', () => {
  it.each(GUITAR_SERVICES_PAGES)('%s links privacy and contact', (path) => {
    const source = read(path);

    expect(source).toContain('href="https://suedeai.ai/privacy"');
    expect(source).toContain('href="https://suedeai.ai/contact"');
  });
});
