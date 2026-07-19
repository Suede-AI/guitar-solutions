import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * guitar.services gets its own landing page instead of mirroring the guides
 * site. `/` rewrites to the dedicated page, `/about` passes through to its
 * own real route, and every other path 308s to the canonical guides host so
 * no duplicate content indexes under this domain.
 *
 * Coupling: next.config.mjs redirects run BEFORE this middleware. The `/`,
 * `/sitemap.xml`, and `/:path*` entries there carry a
 * `missing: [guitarServicesHost]` condition so requests on this host fall
 * through to the rewrites below. Removing those conditions silently turns
 * this file back into dead code.
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
    if (request.nextUrl.pathname === '/about') {
      // Real local route (app/about/page.tsx) — let it through instead of
      // falling into the catch-all redirect below.
      return NextResponse.next();
    }
    return NextResponse.redirect(
      new URL(request.nextUrl.pathname + request.nextUrl.search, 'https://guides.guitar.solutions'),
      { status: 308 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon|opengraph-image).*)'],
};
