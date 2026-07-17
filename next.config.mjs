import createMDX from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';

function stripFrontmatter() {
  return (tree) => {
    if (!Array.isArray(tree.children)) return;
    tree.children = tree.children.filter(
      (node) => node.type !== 'yaml' && node.type !== 'toml',
    );
  };
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    mdxRs: false,
  },
  // guides.guitar.solutions' content (content/guides/*.mdx) was migrated
  // into Strumly at strumly.suedeai.ai/guides as part of the guitar.solutions
  // domain consolidation (guitar.solutions itself now points at Strumly's
  // Vercel deployment). These are 1:1 slug-preserving redirects rather than
  // a flat redirect-to-homepage, since the URL shape (/guides/[slug]) is
  // identical on the new host.
  async redirects() {
    return [
      // SEO files get explicit, permanent (308), path-preserving redirects so
      // crawlers land on the Strumly equivalent of the file they asked for
      // instead of the catch-all's /guides page. These MUST stay above the
      // /:path* catch-all — Next.js applies the first matching redirect.
      {
        source: '/llms.txt',
        destination: 'https://strumly.suedeai.ai/llms.txt',
        permanent: true,
      },
      {
        source: '/robots.txt',
        destination: 'https://strumly.suedeai.ai/robots.txt',
        permanent: true,
      },
      {
        source: '/sitemap.xml',
        destination: 'https://strumly.suedeai.ai/sitemap.xml',
        permanent: true,
      },
      {
        source: '/catalog.html',
        destination: 'https://strumly.suedeai.ai/book/catalog',
        permanent: true,
      },
      {
        source: '/guides/:slug',
        destination: 'https://strumly.suedeai.ai/guides/:slug',
        permanent: true,
      },
      {
        source: '/categories',
        destination: 'https://strumly.suedeai.ai/guides',
        permanent: true,
      },
      {
        source: '/guitar-services',
        destination: 'https://strumly.suedeai.ai/guides',
        permanent: true,
      },
      {
        source: '/',
        destination: 'https://strumly.suedeai.ai/guides',
        permanent: true,
      },
      // The catch-all stays 307 (temporary) on purpose: it flattens unknown
      // paths to a single /guides page, and a 308 here would let crawlers
      // cache that flattening forever — which would fight any future
      // repurposing of the guitar.solutions domains. Every URL we actually
      // migrated has an explicit permanent entry above.
      {
        source: '/:path*',
        destination: 'https://strumly.suedeai.ai/guides',
        permanent: false,
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkFrontmatter, stripFrontmatter],
  },
});

export default withMDX(nextConfig);
