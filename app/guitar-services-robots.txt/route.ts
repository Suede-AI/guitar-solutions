export const runtime = 'edge';

// Host-specific robots.txt for guitar.services. next.config.mjs's /robots.txt
// entry had no host exemption (unlike /sitemap.xml, /, and the catch-all),
// so this host's robots.txt used to 308 straight to strumly.suedeai.ai's —
// pointing crawlers at a domain with no mention of guitar.services or its
// own sitemap. This one stays local and points at guitar-services-sitemap.xml.
export async function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: https://guitar.services/sitemap.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
