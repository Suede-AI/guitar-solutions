import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllGuides, getGuideBySlug } from '@/lib/mdx';
import { GuideSidebar } from '@/components/GuideSidebar';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllGuides().map((g) => ({ slug: g.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: 'Guide not found' };
  const url = `https://guitar.solutions/guides/${slug}`;
  return {
    title: guide.frontmatter.title,
    description: guide.frontmatter.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: guide.frontmatter.title,
      description: guide.frontmatter.description,
      url,
      siteName: 'guitar.solutions',
      publishedTime: guide.frontmatter.published,
      authors: guide.frontmatter.authors ?? ['Jason Colapietro'],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@AISUEDE',
      creator: '@johnnysuede',
      title: guide.frontmatter.title,
      description: guide.frontmatter.description,
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const allGuides = getAllGuides();
  const related = allGuides
    .filter(
      (g) =>
        g.frontmatter.category === guide.frontmatter.category &&
        g.frontmatter.slug !== slug,
    )
    .slice(0, 3);

  let MDXContent: React.ComponentType;
  try {
    const mod = await import(`@/content/guides/${slug}.mdx`);
    MDXContent = mod.default;
  } catch {
    notFound();
  }

  const { frontmatter } = guide;
  const url = `https://guitar.solutions/guides/${slug}`;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.published,
    dateModified: frontmatter.updated ?? frontmatter.published,
    author: (frontmatter.authors ?? ['Jason Colapietro']).map((name) => ({
      '@type': 'Person',
      name,
    })),
    publisher: {
      '@type': 'Organization',
      name: 'Suede Labs',
      url: 'https://suedeai.ai',
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: frontmatter.category,
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://guitar.solutions' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://guitar.solutions/categories' },
      { '@type': 'ListItem', position: 3, name: frontmatter.title, item: url },
    ],
  };

  return (
    <article className="mx-auto max-w-[1280px] px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 py-20 hairline-b">
        <div className="lg:col-span-3 mb-6 lg:mb-0">
          <Link href="/" className="mono-label text-paper-dim hover:text-cyan transition-colors">
            ← BACK
          </Link>
        </div>
        <div className="lg:col-span-9">
          <p className="mono-label">
            <span className="text-red">●</span> {frontmatter.category.toUpperCase()} · FILED{' '}
            {formatDate(frontmatter.published)} · {guide.readingTime} MIN READ
          </p>
          <h1
            className="font-display text-paper mt-6"
            style={{
              fontSize: 'var(--text-headline)',
              lineHeight: 1.02,
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            {frontmatter.title}
          </h1>
          <p className="text-paper-mute mt-6 max-w-[60ch] text-lg leading-relaxed">
            {frontmatter.description}
          </p>
          <p className="mono-label text-paper-dim mt-8">
            BY {(frontmatter.authors ?? ['Jason Colapietro']).join(' · ').toUpperCase()}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 py-16">
        <div className="lg:col-span-3 lg:sticky lg:top-8 self-start mb-12 lg:mb-0">
          <GuideSidebar headings={guide.headings} relatedGuides={related} />
        </div>
        <div className="lg:col-span-9">
          <div className="prose-suede">
            <MDXContent />
          </div>

          <div className="mt-16 border-t border-paper-dim/20 pt-8">
            <p className="mono-label text-cyan mb-4">ABOUT THE AUTHOR</p>
            <p className="text-paper-dim text-sm leading-relaxed max-w-2xl mb-4">
              <span className="text-paper font-semibold">Jason Colapietro</span> (Johnny Suede) is the founder and CEO of Suede Labs AI and the author of <em>The Signal Chain</em>. He built the creator-ownership layer for the AI media era: proof of creation, programmable IP, on-chain royalty routing, and agent-accessible licensing. Patent pending USPTO&nbsp;63/947,120.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-paper-dim">
              <a href="https://guitar.solutions" className="hover:text-cyan transition-colors">The Signal Chain</a>
              <a href="https://www.amazon.com/dp/B0GRG8LGQQ" target="_blank" rel="noopener" className="hover:text-cyan transition-colors">Stake Your Claim</a>
              <a href="https://www.amazon.com/dp/B0GMB2VLXQ" target="_blank" rel="noopener" className="hover:text-cyan transition-colors">Proof as Infrastructure</a>
              <a href="https://www.amazon.com/dp/B0GD5FX6N6" target="_blank" rel="noopener" className="hover:text-cyan transition-colors">The Guitar Without a Number</a>
              <a href="https://www.amazon.com/dp/B0GMBBWHMQ" target="_blank" rel="noopener" className="hover:text-cyan transition-colors">The Human Authenticity Layer</a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function formatDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
    .toUpperCase();
}
