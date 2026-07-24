import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';

import { GET as notFoundResponse } from '../../app/guitar-services-not-found/route';
import { middleware } from '../../middleware';

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
