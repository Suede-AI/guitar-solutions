import { MetadataRoute } from 'next';
import { getAllGuides } from '@/lib/mdx';

const BASE = 'https://guitar-solutions.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const guides = getAllGuides();

  const guideEntries: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${BASE}/guides/${g.frontmatter.slug}`,
    lastModified: g.frontmatter.published,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    {
      url: BASE,
      lastModified: '2026-06-11',
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE}/categories`,
      lastModified: '2026-06-11',
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...guideEntries,
  ];
}
