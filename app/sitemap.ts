import type { MetadataRoute } from 'next';
import { getAllGuides } from '@/lib/mdx';

const BASE = 'https://guitar.solutions';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date('2026-06-01'), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/categories`, lastModified: new Date('2026-06-01'), changeFrequency: 'monthly', priority: 0.8 },
  ];

  const guides = getAllGuides().map((g) => ({
    url: `${BASE}/guides/${g.frontmatter.slug}`,
    lastModified: new Date(g.frontmatter.published),
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...guides];
}
