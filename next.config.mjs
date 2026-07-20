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

// Host condition for guitar.services (optional www. prefix and :port for
// local `next start` testing). Redirect entries that would shadow the
// guitar.services middleware rewrites carry this in `missing`, so they skip
// that host and fall through to middleware.ts — config redirects run BEFORE
// middleware, so without this the catch-all swallows the whole domain.
const guitarServicesHost = {
  type: 'header',
  key: 'host',
  value: '(?:www\\.)?guitar\\.services(?::\\d+)?',
};

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
        // Skipped for guitar.services: middleware rewrites that host's
        // /robots.txt to the single-URL /guitar-services-robots.txt that
        // points at its own sitemap instead of strumly.suedeai.ai's.
        source: '/robots.txt',
        destination: 'https://strumly.suedeai.ai/robots.txt',
        permanent: true,
        missing: [guitarServicesHost],
      },
      {
        // Skipped for guitar.services: middleware rewrites that host's
        // /sitemap.xml to the single-URL /guitar-services-sitemap.xml that
        // its Search Console property expects.
        source: '/sitemap.xml',
        destination: 'https://strumly.suedeai.ai/sitemap.xml',
        permanent: true,
        missing: [guitarServicesHost],
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
        // Skipped for guitar.services: middleware rewrites that host's root
        // to the curated /guitar-services landing page.
        source: '/',
        destination: 'https://strumly.suedeai.ai/guides',
        permanent: true,
        missing: [guitarServicesHost],
      },
      // The catch-all stays 307 (temporary) on purpose: it flattens unknown
      // paths to a single /guides page, and a 308 here would let crawlers
      // cache that flattening forever — which would fight any future
      // repurposing of the guitar.solutions domains. Every URL we actually
      // migrated has an explicit permanent entry above. Skipped for
      // guitar.services so middleware can 308 that host's stray paths to
      // guides.guitar.solutions instead.
      //
      // Also excludes /icon and any *opengraph-image path (negative
      // lookahead): those are Next.js's own file-convention favicon/OG-image
      // routes, not "unknown" paths, and used to get swallowed by this same
      // rule — breaking the favicon and every social-share preview image on
      // this host. Path-to-regexp's custom-regex groups match across
      // slashes, so ".*opengraph-image$" also excludes nested ones like
      // /guitar-services/opengraph-image.
      {
        source: '/:path((?!icon$|.*opengraph-image$).+)',
        destination: 'https://strumly.suedeai.ai/guides',
        permanent: false,
        missing: [guitarServicesHost],
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
