import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { GUITAR_SERVICES_PAGES, HOME_PAGE } from '../guitar-services-pages';

/**
 * Search snippets on 2026-10-30: two titles ran past 60 characters and four of
 * the six h1s were slogans that named no topic ("Everything the guitar taught
 * one builder, in one place.", "Inside The Signal Chain"). Each page now leads
 * its title with the query and its h1 with the topic.
 */

type PageModule = {
  default: ComponentType;
  metadata: {
    title: { absolute: string };
    openGraph: { title: string };
    twitter: { title: string };
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

const H1_TOPIC: Record<string, RegExp> = {
  '/': /^Guitar books, guides and practice tools/,
  '/about': /^About Guitar Services/,
  '/the-signal-chain': /^The Signal Chain book: contents/,
  '/signal-chain-guides': /guitar signal chain/,
  '/chords-and-scales': /^Guitar chord and scale library: \d+ chords and \d+ scales$/,
  '/practice-tools': /^AI guitar practice tools/,
};

function h1s(html: string): string[] {
  return [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, '').replace(/&#x27;|&rsquo;|’/g, "'").replace(/\s+/g, ' ').trim(),
  );
}

describe('guitar.services titles and h1s', () => {
  it.each(GUITAR_SERVICES_PAGES.map((p) => [p.path, p]))('%s keeps title and description in SERP limits', (_p, page) => {
    expect(page.title.length).toBeLessThanOrEqual(60);
    expect(page.description.length).toBeLessThanOrEqual(155);
    expect(page.title).not.toMatch(/—/);
  });

  it('serves the home title from the shared page list, mirrored to social cards', async () => {
    const { metadata } = await PAGE_MODULES['/']();
    expect(metadata.title.absolute).toBe(HOME_PAGE.title);
    expect(metadata.openGraph.title).toBe(HOME_PAGE.title);
    expect(metadata.twitter.title).toBe(HOME_PAGE.title);
  });

  it.each(GUITAR_SERVICES_PAGES.map((p) => [p.path, p]))('%s renders one h1 that names the topic', async (_p, page) => {
    const mod = await PAGE_MODULES[page.path]();
    const headings = h1s(renderToStaticMarkup(createElement(mod.default)));
    expect(headings).toHaveLength(1);
    expect(headings[0]).toMatch(H1_TOPIC[page.path]);
  });
});
