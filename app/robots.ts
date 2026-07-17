import type { MetadataRoute } from 'next';

// Shadowed in production: next.config.mjs 308s /robots.txt to
// https://strumly.suedeai.ai/robots.txt on every host (including
// guitar.services — the entry carries no host condition). Kept only as a
// fallback should that redirect ever be removed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://guides.guitar.solutions/sitemap.xml',
  };
}
