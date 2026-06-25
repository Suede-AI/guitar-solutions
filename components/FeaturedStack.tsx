import Link from 'next/link';
import type { GuideRecord } from '@/lib/mdx';

interface FeaturedStackProps {
  guides: GuideRecord[];
}

function formatDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
    .toUpperCase();
}

export function FeaturedStack({ guides }: FeaturedStackProps) {
  if (guides.length === 0) return null;

  const [featured, ...rest] = guides;
  const secondary = rest.slice(0, 2);

  return (
    <>
      {/* Magazine grid — featured left, two secondary right */}
      <div
        className="grid gap-px bg-rule hairline-b featured-grid-responsive"
        style={{ gridTemplateColumns: '2fr 1fr' }}
      >
        <article className="bg-ink-0 p-8 lg:p-12 flex flex-col gap-4">
          <div className="flex items-center gap-4 mono-label">
            <span className="text-red">●</span>
            <span>{featured.frontmatter.category.toUpperCase()}</span>
            <span className="text-paper-dim">{featured.readingTime} MIN READ</span>
          </div>
          <h2
            className="font-display text-paper"
            style={{
              fontSize: 'clamp(1.75rem, 1.2rem + 2.5vw, 3.25rem)',
              lineHeight: 1.05,
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            <Link
              href={`/guides/${featured.frontmatter.slug}`}
              className="hover:text-cyan transition-colors"
            >
              {featured.frontmatter.title}
            </Link>
          </h2>
          <p className="text-paper-mute leading-relaxed max-w-[55ch]">
            {featured.frontmatter.description}
          </p>
          <p className="mono-label text-paper-dim mt-auto">
            {formatDate(featured.frontmatter.published)}
          </p>
        </article>

        <div className="flex flex-col gap-px bg-rule">
          {secondary.map((guide) => (
            <article
              key={guide.frontmatter.slug}
              className="bg-ink-0 p-8 flex flex-col gap-3 flex-1"
            >
              <div className="flex items-center gap-3 mono-label">
                <span className="text-paper-dim">{guide.frontmatter.category.toUpperCase()}</span>
                <span className="text-paper-dim">·</span>
                <span className="text-paper-dim">{guide.readingTime} MIN</span>
              </div>
              <h3
                className="font-display text-paper leading-snug"
                style={{ fontSize: 'clamp(1rem, 0.85rem + 0.8vw, 1.35rem)' }}
              >
                <Link
                  href={`/guides/${guide.frontmatter.slug}`}
                  className="hover:text-cyan transition-colors"
                >
                  {guide.frontmatter.title}
                </Link>
              </h3>
            </article>
          ))}
        </div>
      </div>

      {/* All guides — 3-column card grid */}
      <div className="py-16">
        <p className="mono-label mb-8">ALL GUIDES — {guides.length} TOTAL</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule hairline-t">
          {guides.map((guide) => (
            <article
              key={guide.frontmatter.slug}
              className="bg-ink-0 p-6 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3 mono-label">
                <span className="text-red">●</span>
                <span>{guide.frontmatter.category.toUpperCase()}</span>
              </div>
              <h3 className="font-display text-paper text-lg leading-tight">
                <Link
                  href={`/guides/${guide.frontmatter.slug}`}
                  className="hover:text-cyan transition-colors"
                >
                  {guide.frontmatter.title}
                </Link>
              </h3>
              <p className="text-paper-mute text-sm leading-relaxed line-clamp-2">
                {guide.frontmatter.description}
              </p>
              <p className="mono-label text-paper-dim mt-auto">{guide.readingTime} MIN READ</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
