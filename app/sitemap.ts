import type { MetadataRoute } from 'next';
import { getAllGuides } from '@/lib/mdx';

// Shadowed in production: next.config.mjs 308s /sitemap.xml to
// https://strumly.suedeai.ai/sitemap.xml on every host except
// guitar.services, where middleware rewrites it to the single-URL
// app/guitar-services-sitemap.xml route. The URLs below all redirect now;
// kept only as a fallback should the redirects ever be removed.
const BASE = 'https://guides.guitar.solutions';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date('2026-06-11'), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/categories`, lastModified: new Date('2026-06-11'), changeFrequency: 'weekly', priority: 0.9 },
  ];

  const guides = getAllGuides().map((g) => ({
    url: `${BASE}/guides/${g.frontmatter.slug}`,
    lastModified: new Date(g.frontmatter.published),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...guides];
}
