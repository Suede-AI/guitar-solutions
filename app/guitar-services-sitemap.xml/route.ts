export const runtime = 'edge';

// Host-specific sitemap for the guitar.services landing page. The main
// app/sitemap.ts covers guides.guitar.solutions; GSC ignores cross-host URLs,
// so the guitar.services property needs its own single-URL sitemap.
export async function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://guitar.services/</loc>
    <lastmod>2026-07-10T00:00:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://guitar.services/about</loc>
    <lastmod>2026-07-18T00:00:00.000Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
