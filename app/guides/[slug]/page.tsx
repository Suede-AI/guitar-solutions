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
  const { title, description } = guide.frontmatter;
  const url = `https://guitar.services/guides/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: 'guitar.services',
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

  return (
    <article className="mx-auto max-w-[1280px] px-6">
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
            BY {(frontmatter.authors ?? ['SUEDE LABS']).join(' · ').toUpperCase()}
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
