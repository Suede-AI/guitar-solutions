import Link from 'next/link';
import type { GuideRecord } from '@/lib/mdx';
import { STUDY_PATH } from '@/lib/categories';
import { GuideIndexTabs, type GuideSummary } from '@/components/GuideIndexTabs';

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
  const totalReadingTime = guides.reduce((total, guide) => total + guide.readingTime, 0);
  const categoryCount = new Set(guides.map((guide) => guide.frontmatter.category)).size;
  const guideSummaries: GuideSummary[] = guides.map((guide) => ({
    frontmatter: guide.frontmatter,
    readingTime: guide.readingTime,
  }));

  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-10 py-14 hairline-b">
        <div className="lg:col-span-8">
          <p className="mono-label">GUITAR.SOLUTIONS FIELD INDEX</p>
          <h1
            className="font-display text-paper mt-6"
            style={{
              fontSize: 'var(--text-hero)',
              lineHeight: 0.95,
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            The Signal Chain.
          </h1>
          <p className="text-paper-mute mt-6 max-w-[66ch] text-lg leading-relaxed">
            Guitar rigs fail in predictable places: pickup loading, level into the amp,
            board noise, loop routing, and speaker behavior. This reference turns those
            failure modes into practical guides you can act on.
          </p>
        </div>

        <div className="lg:col-span-4 hairline-t lg:border-t-0 lg:border-l border-rule lg:pl-8 py-6 lg:py-0">
          <p className="mono-label mb-5">REFERENCE STATUS</p>
          <dl className="grid grid-cols-3 lg:grid-cols-1 gap-px bg-rule">
            <div className="bg-ink-0 p-4">
              <dt className="mono-label text-paper-dim">GUIDES</dt>
              <dd className="font-display text-paper text-2xl mt-1">{guides.length}</dd>
            </div>
            <div className="bg-ink-0 p-4">
              <dt className="mono-label text-paper-dim">LANES</dt>
              <dd className="font-display text-paper text-2xl mt-1">{categoryCount}</dd>
            </div>
            <div className="bg-ink-0 p-4">
              <dt className="mono-label text-paper-dim">READ TIME</dt>
              <dd className="font-display text-paper text-2xl mt-1">{totalReadingTime}m</dd>
            </div>
          </dl>
        </div>
      </section>

      <div
        className="grid gap-px bg-rule hairline-b featured-grid-responsive mt-10"
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

      <GuideIndexTabs guides={guideSummaries} />

      <section className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-8">
          <div className="lg:col-span-4">
            <p className="mono-label mb-3">RECOMMENDED ROUTE</p>
            <h2 className="font-display text-paper text-3xl leading-tight">
              Read from source to speaker.
            </h2>
            <p className="text-paper-mute mt-4 leading-relaxed">
              This path gives a guitarist or builder the fastest technical map:
              topology first, source integrity second, level control third, and
              loop routing fourth.
            </p>
          </div>
          <ol className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-rule hairline-t">
            {STUDY_PATH.map((item) => (
              <li key={item.slug} className="bg-ink-0 p-6 min-h-[210px] flex flex-col">
                <p className="mono-label text-cyan">{item.step} / {item.label}</p>
                <h3 className="font-display text-paper text-xl leading-tight mt-4">
                  <Link href={`/guides/${item.slug}`} className="hover:text-cyan transition-colors">
                    {item.title}
                  </Link>
                </h3>
                <p className="text-paper-mute text-sm leading-relaxed mt-3">{item.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="py-16">
        <p className="mono-label mb-8">ALL GUIDES / {guides.length} TOTAL</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-rule hairline-t">
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
