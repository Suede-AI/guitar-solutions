import { GUITAR_SERVICES_PAGES, canonicalUrl } from '@/lib/guitar-services-pages';

export const runtime = 'edge';

// Host-specific sitemap for guitar.services. The main app/sitemap.ts covers
// guides.guitar.solutions; GSC ignores cross-host URLs, so the guitar.services
// property needs its own sitemap. Built from the same page list the middleware
// routes and the nav renders, so a page cannot be served without being listed.
export async function GET() {
  const urls = GUITAR_SERVICES_PAGES.map(
    (page) => `  <url>
    <loc>${canonicalUrl(page)}</loc>
    <lastmod>${page.lastmod}T00:00:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`,
  ).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
