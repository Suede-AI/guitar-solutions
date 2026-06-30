'use client';

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

const CATEGORY_IMAGES: Record<string, string> = {
  'Signal Chain':
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
  Electronics:
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
  'Gain & Dynamics':
    'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?auto=format&fit=crop&w=800&q=80',
  Power:
    'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?auto=format&fit=crop&w=800&q=80',
};

const DEFAULT_IMG =
  'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80';

function categoryImage(category: string): string {
  return CATEGORY_IMAGES[category] ?? DEFAULT_IMG;
}

/** Alternate gold / cyan chips for visual rhythm */
function categoryChipClass(index: number): string {
  return index % 2 === 0
    ? 'bg-gold text-ink-0 mono-label px-2 py-0.5'
    : 'bg-cyan text-ink-0 mono-label px-2 py-0.5';
}

export function FeaturedStack({ guides }: FeaturedStackProps) {
  if (guides.length === 0) return null;

  const [featured, ...rest] = guides;
  const secondary = rest.slice(0, 2);

  return (
    <>
      {/* ── MAGAZINE GRID — featured 2/3 left, secondary 1/3 right ── */}
      <div
        className="grid gap-px bg-rule hairline-b"
        style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)' }}
      >
        {/* Featured article */}
        <article className="bg-ink-0 flex flex-col">
          {/* Cover image */}
          <div style={{ overflow: 'hidden', background: 'var(--color-ink-2)' }}>
            <img
              src={categoryImage(featured.frontmatter.category)}
              alt={`Cover image for ${featured.frontmatter.title}`}
              width={800}
              height={240}
              loading="eager"
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                width: '100%',
                height: '240px',
              }}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-5 p-8 lg:p-12 flex-1">
            <div className="flex items-center gap-4">
              <span className="mono-label text-gold">
                <span className="text-red mr-1">●</span>
                {featured.frontmatter.category.toUpperCase()}
              </span>
              <span className="mono-label text-paper-dim">{featured.readingTime} MIN READ</span>
            </div>

            <h2
              className="font-playfair text-paper"
              style={{
                fontSize: 'clamp(2rem, 1.4rem + 3vw, 3.5rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
              }}
            >
              <Link
                href={`/guides/${featured.frontmatter.slug}`}
                className="hover:text-gold transition-colors"
                style={{ transition: 'color 0.2s var(--ease-out-expo)' }}
              >
                {featured.frontmatter.title}
              </Link>
            </h2>

            <p className="text-paper-mute leading-relaxed max-w-[55ch]">
              {featured.frontmatter.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 hairline-t">
              <p className="mono-label text-paper-dim">{formatDate(featured.frontmatter.published)}</p>
              <Link
                href={`/guides/${featured.frontmatter.slug}`}
                className="mono-label text-gold hover:opacity-70 transition-opacity"
              >
                READ →
              </Link>
            </div>
          </div>
        </article>

        {/* Secondary articles */}
        <div className="flex flex-col gap-px bg-rule">
          {secondary.map((guide) => (
            <article
              key={guide.frontmatter.slug}
              className="bg-ink-0 flex flex-col gap-0 flex-1 group"
              style={{ transition: 'transform 0.2s var(--ease-out-expo)' }}
            >
              {/* Small image */}
              <div style={{ overflow: 'hidden', background: 'var(--color-ink-2)' }}>
                <img
                  src={categoryImage(guide.frontmatter.category)}
                  alt={`Cover image for ${guide.frontmatter.title}`}
                  width={400}
                  height={120}
                  loading="lazy"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    width: '100%',
                    height: '120px',
                    transition: 'transform 0.3s var(--ease-out-expo)',
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-3 p-6 flex-1">
                <div className="flex items-center gap-3 mono-label">
                  <span className="text-paper-dim">{guide.frontmatter.category.toUpperCase()}</span>
                  <span className="text-paper-dim">·</span>
                  <span className="text-paper-dim">{guide.readingTime} MIN</span>
                </div>

                <h3
                  className="font-playfair text-paper leading-snug"
                  style={{ fontSize: 'clamp(1rem, 0.85rem + 0.8vw, 1.35rem)' }}
                >
                  <Link
                    href={`/guides/${guide.frontmatter.slug}`}
                    className="hover:text-gold transition-colors"
                    style={{ transition: 'color 0.2s var(--ease-out-expo)' }}
                  >
                    {guide.frontmatter.title}
                  </Link>
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ── ALL GUIDES — 3-column card grid ── */}
      <div className="py-20">
        {/* Section header */}
        <div className="flex items-center justify-between mb-10">
          <p className="mono-label text-paper">ALL GUIDES</p>
          <span
            className="mono-label text-ink-0 bg-gold px-3 py-1"
            style={{ fontSize: '0.65rem' }}
          >
            {guides.length} TOTAL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule hairline-t">
          {guides.map((guide, index) => {
            const delay = `animate-fade-up-${(index % 3) + 1}` as const;
            return (
              <article
                key={guide.frontmatter.slug}
                className={`bg-ink-1 flex flex-col gap-0 ${delay}`}
                style={{
                  transition: 'transform 0.2s var(--ease-out-expo), border-color 0.2s var(--ease-out-expo)',
                  borderTop: '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.borderTopColor = 'var(--color-gold)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.borderTopColor = 'transparent';
                }}
              >
                {/* Card image */}
                <div style={{ overflow: 'hidden', background: 'var(--color-ink-2)', position: 'relative' }}>
                  <img
                    src={categoryImage(guide.frontmatter.category)}
                    alt={`Cover image for ${guide.frontmatter.title}`}
                    width={400}
                    height={160}
                    loading="lazy"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      width: '100%',
                      height: '160px',
                    }}
                  />
                </div>

                {/* Card content */}
                <div className="flex flex-col gap-3 p-6 flex-1">
                  {/* Category chip */}
                  <div>
                    <span className={categoryChipClass(index)}>
                      {guide.frontmatter.category.toUpperCase()}
                    </span>
                  </div>

                  <h3
                    className="font-playfair text-paper leading-tight"
                    style={{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.25rem)' }}
                  >
                    <Link
                      href={`/guides/${guide.frontmatter.slug}`}
                      className="hover:text-gold transition-colors"
                      style={{ transition: 'color 0.2s var(--ease-out-expo)' }}
                    >
                      {guide.frontmatter.title}
                    </Link>
                  </h3>

                  <p className="text-paper-mute text-sm leading-relaxed line-clamp-2">
                    {guide.frontmatter.description}
                  </p>

                  <p className="mono-label text-paper-dim mt-auto pt-3 hairline-t">
                    {guide.readingTime} MIN READ
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
