import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://guitar.solutions/sitemap.xml',
    host: 'https://guitar.solutions',
  };
}
