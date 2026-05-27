import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllGuides, getGuideBySlug } from '@/lib/mdx';

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
      authors: guide.frontmatter.authors ?? ['Suede Labs'],
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

  // Dynamic import — Next.js MDX loader compiles each file as a module.
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
    author: (frontmatter.authors ?? ['Suede Labs']).map((name) => ({
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
        <div className="lg:col-span-2 mb-6 lg:mb-0">
          <Link href="/" className="mono-label text-paper-dim hover:text-cyan transition-colors">
            ← BACK
          </Link>
        </div>
        <div className="lg:col-span-10">
          <p className="mono-label">
            <span className="text-red">●</span> {frontmatter.category.toUpperCase()} · FILED{' '}
            {formatDate(frontmatter.published)}
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
            BY {(frontmatter.authors ?? ['SUEDE LABS']).join(' · ').toUpperCase()}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 py-16">
        <div className="lg:col-span-2 lg:sticky lg:top-8 self-start mb-12 lg:mb-0">
          <p className="mono-label mb-3">SECTION</p>
          <Link
            href={`/categories#${slugifyCategory(frontmatter.category)}`}
            className="font-display text-paper hover:text-cyan transition-colors block"
          >
            {frontmatter.category}
          </Link>
        </div>
        <div className="lg:col-span-10">
          <div className="prose-suede">
            <MDXContent />
          </div>
        </div>
      </div>
    </article>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d
    .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
    .toUpperCase();
}

function slugifyCategory(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
