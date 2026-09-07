import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * guitar.services gets its own landing page instead of mirroring the guides
 * site. `/` rewrites to the dedicated page; `/sitemap.xml`, `/robots.txt` and
 * `/llms.txt` rewrite to versions that speak for this host instead of
 * strumly.suedeai.ai's; `/about` passes through to its own real route; and
 * every other path rewrites to a dedicated 404 response so stale or mistyped
 * URLs cannot be mistaken for a migrated guide.
 *
 * The other hosts on this project (guides.guitar.solutions, plus the Vercel
 * deployment aliases) form a retired redirect shell. The URLs that site actually
 * published are listed in next.config.mjs and redirect to their Strumly
 * equivalents, permanently and path-preserving. A request that reaches this
 * file asked for something the site did not have, so it gets a real 404
 * instead of a redirect flattening it onto the guides index, which search
 * engines read as a soft 404.
 *
 * Coupling: next.config.mjs redirects run BEFORE this middleware. The `/`,
 * `/sitemap.xml`, `/robots.txt`, and `/llms.txt` entries there carry a
 * `missing: [guitarServicesHost]` condition so requests on that host fall
 * through to the rewrites below. Removing those conditions silently turns
 * the guitar.services half of this file back into dead code.
 */
export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') ?? '')
    .replace(/^www\./, '')
    .split(':')[0]
    .toLowerCase();

  if (host === 'guitar.services') {
    if (request.nextUrl.pathname === '/') {
      return NextResponse.rewrite(new URL('/guitar-services', request.url));
    }
    if (request.nextUrl.pathname === '/sitemap.xml') {
      return NextResponse.rewrite(new URL('/guitar-services-sitemap.xml', request.url));
    }
    if (request.nextUrl.pathname === '/robots.txt') {
      return NextResponse.rewrite(new URL('/guitar-services-robots.txt', request.url));
    }
    if (request.nextUrl.pathname === '/llms.txt') {
      return NextResponse.rewrite(new URL('/guitar-services-llms.txt', request.url));
    }
    if (request.nextUrl.pathname === '/guitar-services-social-card.webp') {
      return NextResponse.next();
    }
    if (request.nextUrl.pathname === '/about') {
      // Real local route (app/about/page.tsx) — let it through instead of
      // falling into the catch-all 404 below.
      return NextResponse.next();
    }
    if (request.nextUrl.pathname === '/guitar-services-not-found') {
      return NextResponse.next();
    }
    return NextResponse.rewrite(new URL('/guitar-services-not-found', request.url));
  }

  if (request.nextUrl.pathname === '/guides-not-found') {
    return NextResponse.next();
  }
  return NextResponse.rewrite(new URL('/guides-not-found', request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon|opengraph-image).*)'],
};
