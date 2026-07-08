import type { MetadataRoute } from 'next';
import { getAllGuides } from '@/lib/mdx';

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
