import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';

import { GET as llmsResponse } from '../../app/guitar-services-llms.txt/route';
import { SURFACES } from '../guitar-services-content';
import { middleware } from '../../middleware';

/**
 * guitar.services used to hand answer engines a foreign identity through
 * llms.txt. #9 fixed the page, robots.txt and sitemap.xml; /llms.txt was the
 * one file it missed, because it was the only one of the three whose
 * next.config.mjs redirect carried no `missing: [guitarServicesHost]`. The
 * result: https://guitar.services/llms.txt 308'd to strumly.suedeai.ai's, so a
 * model asking this host who it is was told it was Strumly.
 *
 * Three couplings have to hold together or the defect returns silently, so all
 * three are asserted here rather than trusting the route alone.
 */
describe('guitar.services llms.txt', () => {
  it('rewrites /llms.txt to the host-specific route', () => {
    const request = new NextRequest('https://guitar.services/llms.txt', {
      headers: { host: 'guitar.services' },
    });

    expect(middleware(request).headers.get('x-middleware-rewrite')).toBe(
      'https://guitar.services/guitar-services-llms.txt',
    );
  });

  it('exempts guitar.services from the redirect that would shadow it', () => {
    // Config redirects run BEFORE middleware, so without this exemption the
    // rewrite above is dead code and the 308 wins.
    const config = readFileSync(
      new URL('../../next.config.mjs', import.meta.url),
      'utf8',
    );
    const entry = config.slice(config.indexOf("source: '/llms.txt'"));
    const block = entry.slice(0, entry.indexOf('},'));
    expect(block).toContain('missing: [guitarServicesHost]');
  });

  it('speaks for this host and never claims to be Strumly', async () => {
    const body = await llmsResponse().then((r) => r.text());

    expect(body.startsWith('# guitar.services')).toBe(true);
    expect(body).toContain('https://guitar.services');
    // Strumly may be *listed* as one of the products, but must never be the
    // identity this file asserts.
    expect(body).not.toMatch(/^#\s*Strumly/m);
    expect(body).toMatch(/Do not describe guitar\.services as Strumly/);
  });

  it('lists every surface the visible page lists', async () => {
    const body = await llmsResponse().then((r) => r.text());

    // Generated from SURFACES, so a product added to the landing page cannot
    // go missing from the file answer engines read.
    for (const surface of SURFACES) {
      expect(body).toContain(surface.name);
      expect(body).toContain(surface.url);
    }
  });

  it('corrects the reading the domain name invites', async () => {
    const body = await llmsResponse().then((r) => r.text());

    // "guitar.services" reads as a repair/setup business; it is a directory.
    expect(body).toMatch(/does not sell guitar repair, setup, or lutherie/);
  });
});
