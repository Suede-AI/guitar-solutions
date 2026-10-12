import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';

import { readFileSync } from 'node:fs';

import { GET as notFoundResponse } from '../../app/guitar-services-not-found/route';
import { GET as robotsResponse } from '../../app/guitar-services-robots.txt/route';
import { INDEXNOW_KEY, middleware } from '../../middleware';

describe('guitar.services unknown routes', () => {
  it('rewrites an unknown path to the dedicated 404 handler', () => {
    const request = new NextRequest('https://guitar.services/not-a-real-page', {
      headers: { host: 'guitar.services' },
    });

    const response = middleware(request);

    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://guitar.services/guitar-services-not-found',
    );
  });

  it('returns an explicit noindex 404 response', async () => {
    const response = notFoundResponse();

    expect(response.status).toBe(404);
    expect(response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
    expect(await response.text()).toContain('<h1>Page not found</h1>');
  });
});

describe('guitar.services SEO files', () => {
  it('rewrites /llms-full.txt to the host-specific route', () => {
    const request = new NextRequest('https://guitar.services/llms-full.txt', {
      headers: { host: 'guitar.services' },
    });
    expect(middleware(request).headers.get('x-middleware-rewrite')).toBe(
      'https://guitar.services/guitar-services-llms-full.txt',
    );
  });

  it('serves the IndexNow key file instead of the 404 rewrite', () => {
    const request = new NextRequest(`https://guitar.services/${INDEXNOW_KEY}.txt`, {
      headers: { host: 'guitar.services' },
    });
    const response = middleware(request);
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
    expect(response.headers.get('x-middleware-next')).toBe('1');
    const body = readFileSync(new URL(`../../public/${INDEXNOW_KEY}.txt`, import.meta.url), 'utf8');
    expect(body.trim()).toBe(INDEXNOW_KEY);
  });

  it('names the search and answer-engine crawlers in robots.txt', async () => {
    const body = await robotsResponse().then((r) => r.text());
    for (const agent of ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'DuckAssistBot', 'CCBot']) {
      expect(body).toContain(`User-agent: ${agent}`);
    }
    expect(body).not.toMatch(/Disallow: \/\s*$/m);
    expect(body).toContain('Sitemap: https://guitar.services/sitemap.xml');
  });
});
