import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';

import { GET as guidesNotFound } from '../../app/guides-not-found/route';
import { middleware } from '../../middleware';
import nextConfig from '../../next.config.mjs';
import { getAllGuides } from '../mdx';

/**
 * guides.guitar.solutions is a retired redirect shell. Its content moved to
 * strumly.suedeai.ai/guides, and the URLs it published redirect there
 * permanently, path-preserving.
 *
 * What it must not do is redirect unknown URLs onto the guides index. That
 * flattening is the soft-404 pattern search engines discount, and it hid the
 * difference between a migrated guide and a URL the site never served. The
 * 2026-09-07 estate audit read the old 307 as a missing 308; the response code
 * was not the defect.
 */
describe('guides.guitar.solutions unknown routes', () => {
  it('rewrites an unknown path to the dedicated 404 handler', () => {
    const request = new NextRequest('https://guides.guitar.solutions/not-a-real-page', {
      headers: { host: 'guides.guitar.solutions' },
    });

    const response = middleware(request);

    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://guides.guitar.solutions/guides-not-found',
    );
  });

  it('leaves the 404 handler itself alone so the rewrite cannot loop', () => {
    const request = new NextRequest('https://guides.guitar.solutions/guides-not-found', {
      headers: { host: 'guides.guitar.solutions' },
    });

    expect(middleware(request).headers.get('x-middleware-rewrite')).toBeNull();
  });

  it('returns an explicit noindex 404 response', async () => {
    const response = guidesNotFound();

    expect(response.status).toBe(404);
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
    expect(await response.text()).toContain('<h1>Page not found</h1>');
  });

  it('keeps guitar.services on its own 404 handler', () => {
    const request = new NextRequest('https://guitar.services/not-a-real-page', {
      headers: { host: 'guitar.services' },
    });

    expect(middleware(request).headers.get('x-middleware-rewrite')).toBe(
      'https://guitar.services/guitar-services-not-found',
    );
  });
});

describe('migrated URLs keep an explicit permanent redirect', () => {
  it('carries no catch-all that would flatten unmatched paths', async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];

    const flattening = redirects.filter(
      (r) => r.source.startsWith('/:path') && r.destination === 'https://strumly.suedeai.ai/guides',
    );

    expect(flattening).toEqual([]);
  });

  it('sends every published URL to its Strumly equivalent, permanently', async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    const find = (source: string) => redirects.find((r) => r.source === source);

    // The inventory app/sitemap.ts declares: the root, /categories, and the
    // guide pages. Removing the catch-all leaves these as the only thing
    // standing between a live inbound link and a 404.
    expect(find('/')).toMatchObject({
      destination: 'https://strumly.suedeai.ai/guides',
      permanent: true,
    });
    expect(find('/categories')).toMatchObject({
      destination: 'https://strumly.suedeai.ai/guides',
      permanent: true,
    });
    expect(find('/guides/:slug')).toMatchObject({
      destination: 'https://strumly.suedeai.ai/guides/:slug',
      permanent: true,
    });
  });

  it('redirects /about to its canonical, and leaves guitar.services to serve it', async () => {
    // /about is absent from app/sitemap.ts and was still published: the guides
    // layout linked it from the nav and the footer. Taking the inventory from
    // the sitemap alone dropped it, and removing the catch-all turned it into a
    // 404 for one deploy. Its canonical is on guitar.services, not Strumly.
    const redirects = (await nextConfig.redirects?.()) ?? [];
    const about = redirects.find((r) => r.source === '/about');

    expect(about).toMatchObject({
      destination: 'https://guitar.services/about',
      permanent: true,
    });

    // Config redirects run ahead of middleware. Without this condition the
    // entry would catch guitar.services' own /about and bounce it off to
    // itself, so the guard is part of the contract rather than a detail.
    expect(about?.missing).toEqual([
      expect.objectContaining({ type: 'header', key: 'host' }),
    ]);

    const request = new NextRequest('https://guitar.services/about', {
      headers: { host: 'guitar.services' },
    });
    expect(middleware(request).headers.get('x-middleware-rewrite')).toBeNull();
  });

  it('has a guide slug for the path-preserving rule to carry', () => {
    const slugs = getAllGuides().map((g) => g.frontmatter.slug);

    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      expect(slug).not.toContain('/');
    }
  });
});
