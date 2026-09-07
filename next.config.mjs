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
        // Skipped for guitar.services: middleware rewrites that host's
        // /llms.txt to /guitar-services-llms.txt, which speaks for this host
        // instead of handing an answer engine Strumly's identity.
        source: '/llms.txt',
        destination: 'https://strumly.suedeai.ai/llms.txt',
        permanent: true,
        missing: [guitarServicesHost],
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
      {
        // /about is not in app/sitemap.ts, but the guides layout linked it from
        // the nav and the footer of every page, so it was published and
        // crawled. It is the one migrated URL whose equivalent is not on
        // Strumly: app/about/page.tsx declares https://guitar.services/about as
        // its canonical, and that page is live.
        //
        // Skipped for guitar.services, which serves this route itself. Config
        // redirects run ahead of middleware, so without the condition this
        // entry would bounce that host's own /about off to itself.
        source: '/about',
        destination: 'https://guitar.services/about',
        permanent: true,
        missing: [guitarServicesHost],
      },
      // There is deliberately no catch-all here. The URLs this site published
      // each have an explicit permanent entry above: the root, /categories, and
      // the eight /guides/:slug pages, which is the inventory app/sitemap.ts
      // declares. A path matching none of them was not part of the site, so it
      // falls through to middleware.ts, which returns a noindex 404 for it.
      //
      // What used to be here was a `/:path*` rule that flattened unmatched
      // paths onto https://strumly.suedeai.ai/guides with a 307. Redirecting
      // unknown URLs onto an unrelated index is the soft-404 pattern search
      // engines are asked to discount, and it also hid the difference between
      // a migrated guide and a URL that had no equivalent. The 2026-09-07
      // estate audit read that 307 as a missing 308; the response code was not
      // the defect, the redirect itself was.
      //
      // The old rule carried a negative lookahead for /icon and
      // *opengraph-image. Redirects run ahead of the filesystem, so without it
      // the rule swallowed Next's own file-convention routes.
      //
      // The middleware matcher covers the root-level ones. It skips
      // _next/static, _next/image, favicon.ico, icon, and opengraph-image,
      // anchored to the start of the path, so it is narrower than the lookahead
      // it replaces: a nested route such as /guitar-services/opengraph-image
      // reaches middleware and 404s on this host. Nothing references that one.
      // The guitar.services page sets openGraph.images to its social card, and
      // requests on that host take the middleware branch for it.
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
