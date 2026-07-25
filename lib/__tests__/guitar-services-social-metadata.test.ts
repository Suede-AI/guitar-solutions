import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  GUITAR_SERVICES_OG_IMAGE,
  GUITAR_SERVICES_TWITTER_IMAGES,
} from '../seo';

const METADATA_PAGES = [
  'app/guitar-services/page.tsx',
  'app/about/page.tsx',
] as const;

describe('guitar.services social metadata', () => {
  it('defines one absolute 1200 by 630 card', () => {
    expect(GUITAR_SERVICES_OG_IMAGE).toMatchObject({
      url: 'https://guitar.services/guitar-services-social-card.webp',
      width: 1200,
      height: 630,
    });
    expect(GUITAR_SERVICES_TWITTER_IMAGES).toEqual([
      GUITAR_SERVICES_OG_IMAGE.url,
    ]);
  });

  it.each(METADATA_PAGES)('%s keeps the local card in both metadata objects', (path) => {
    const source = readFileSync(resolve(process.cwd(), path), 'utf8');

    expect(source).toContain('images: [GUITAR_SERVICES_OG_IMAGE]');
    expect(source).toContain("card: 'summary_large_image'");
    expect(source).toContain('images: GUITAR_SERVICES_TWITTER_IMAGES');
  });

  it('lets the public card bypass the guitar.services 404 rewrite', () => {
    const middleware = readFileSync(resolve(process.cwd(), 'middleware.ts'), 'utf8');

    expect(middleware).toContain(
      "request.nextUrl.pathname === '/guitar-services-social-card.webp'",
    );
  });
});
