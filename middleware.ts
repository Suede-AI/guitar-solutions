import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * guitar.services gets its own landing page instead of mirroring the guides
 * site. `/` rewrites to the dedicated page; every other path 308s to the
 * canonical guides host so no duplicate content indexes under this domain.
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
