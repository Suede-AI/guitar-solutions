import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllGuides, getGuideBySlug } from '@/lib/mdx';
import { GuideSidebar } from '@/components/GuideSidebar';

type Params = { slug: string };

const CATEGORY_IMAGES: Record<string, string> = {
  'Signal Chain':
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1600&q=80',
  Electronics:
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1600&q=80',
  'Gain & Dynamics':
    'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=1600&q=80',
  Power:
    'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=1600&q=80',
};
const DEFAULT_CATEGORY_IMAGE =
  'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1600&q=80';

function getCategoryImage(category: string): string {
  return CATEGORY_IMAGES[category] ?? DEFAULT_CATEGORY_IMAGE;
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Signal Chain': 'var(--color-cyan)',
    Electronics: 'var(--color-gold)',
    'Gain & Dynamics': 'var(--color-gold)',
    Power: '#e84545',
  };
  return colors[category] ?? 'var(--color-paper-mute)';
}

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
  const categoryColor = getCategoryColor(frontmatter.category);
  const categoryImage = getCategoryImage(frontmatter.category);

  return (
    <article>
      {/* Dramatic full-bleed hero header */}
      <header
        className="relative overflow-hidden"
        style={{
          background: 'var(--color-ink-1)',
          borderBottom: '1px solid var(--color-rule)',
        }}
      >
        {/* Background image with dark overlay */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(to bottom, rgba(5,11,22,0.55) 0%, rgba(5,11,22,0.82) 55%, rgba(5,11,22,1) 100%),
              url('${categoryImage}')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />

        <div
          style={{ position: 'relative', zIndex: 1 }}
          className="mx-auto max-w-[1280px] px-6"
        >
          {/* Back nav */}
          <div className="pt-8 pb-10">
            <Link
              href="/"
              className="mono-label text-paper-mute hover:text-gold transition-colors inline-flex items-center gap-2"
            >
              <span style={{ fontSize: '0.9em' }}>←</span> ALL GUIDES
            </Link>
          </div>

          {/* Category badge + meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-7">
            <span
              className="mono-label"
              style={{
                background: categoryColor,
                color: 'var(--color-ink-0)',
                padding: '0.22em 0.8em',
                borderRadius: '2px',
                letterSpacing: '0.08em',
              }}
            >
              {frontmatter.category.toUpperCase()}
            </span>
            <span className="mono-label text-paper-mute">{guide.readingTime} MIN READ</span>
            <span
              className="mono-label text-paper-mute"
              style={{ opacity: 0.6 }}
            >
              {formatDate(frontmatter.published)}
            </span>
          </div>

          {/* Title in Playfair Display */}
          <h1
            className="font-playfair text-paper"
            style={{
              fontSize: 'clamp(2.25rem, 1.5rem + 4vw, 4.5rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              maxWidth: '22ch',
              marginBottom: '1.5rem',
            }}
          >
            {frontmatter.title}
          </h1>

          {/* Description */}
          <p
            className="text-paper-mute"
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.65,
              maxWidth: '62ch',
              marginBottom: '2.5rem',
            }}
          >
            {frontmatter.description}
          </p>

          {/* Author line */}
          <p className="mono-label text-paper-mute pb-14" style={{ opacity: 0.7 }}>
            BY {(frontmatter.authors ?? ['SUEDE LABS']).join(' · ').toUpperCase()}
          </p>
        </div>
      </header>

      {/* Body: sidebar + content */}
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 py-16">
          {/* Sticky sidebar */}
          <div className="lg:col-span-3 lg:sticky lg:top-8 self-start mb-12 lg:mb-0">
            <GuideSidebar headings={guide.headings} relatedGuides={related} />
          </div>

          {/* Article content */}
          <div
            className="lg:col-span-9 lg:pl-8"
            style={{ borderLeft: '1px solid var(--color-rule)' }}
          >
            <div className="prose-suede">
              <MDXContent />
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
