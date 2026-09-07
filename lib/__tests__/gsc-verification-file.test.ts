import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { config } from '../../middleware';

/**
 * Search Console verifies an HTML file token by fetching it, so the file has to
 * answer 200 on the hosts whose ownership it proves.
 *
 * This one stopped answering on 2026-07-24 and went unnoticed for six weeks.
 * The 2026-07-14 catch-all redirected it away, the 2026-07-17 host scoping gave
 * it back to guitar.services, and the unmatched-path 404 added to that host on
 * 2026-07-24 closed it again. guides.guitar.solutions has no fallback: its paths
 * redirect or reach the 404 route handler, which returns a raw Response, so the
 * root layout's verification meta tags never render there.
 *
 * The file and the matcher entry only work as a pair, so both are asserted here.
 */
const TOKEN_FILE = 'google4b0bcf0a4950299c.html';

describe('Search Console HTML file token', () => {
  it('is present and carries the body Google expects', () => {
    const body = readFileSync(resolve(process.cwd(), 'public', TOKEN_FILE), 'utf8');

    expect(body.trim()).toBe(`google-site-verification: ${TOKEN_FILE}`);
  });

  it('is excluded from the middleware matcher, so it is served rather than rewritten', () => {
    const [matcher] = config.matcher;
    const matched = new RegExp(`^${matcher}$`);

    expect(matched.test(`/${TOKEN_FILE}`)).toBe(false);

    // The exclusion has to stay narrow. An unknown path still reaches
    // middleware and gets the noindex 404.
    expect(matched.test('/not-a-real-page')).toBe(true);
    expect(matched.test('/about')).toBe(true);
  });

  it('excludes that exact path and nothing built out of it', () => {
    // The alternative is anchored with `$` and its dots are escaped. Without
    // either, the entry reads as a prefix: anything starting with the token
    // would skip middleware and land on Next's own 404 rather than the noindex
    // one, which is the opposite of what this file is here to do.
    const [matcher] = config.matcher;
    const matched = new RegExp(`^${matcher}$`);

    expect(matched.test(`/${TOKEN_FILE}/extra`)).toBe(true);
    expect(matched.test('/google4b0bcf0a4950299cXhtml')).toBe(true);
    expect(matched.test(`/${TOKEN_FILE}-and-more`)).toBe(true);
  });
});
