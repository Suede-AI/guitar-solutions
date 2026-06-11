import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllGuides, getCategories } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'guitar.solutions — Technical Reference for Guitar Signal Chains',
  description:
    'Engineering-grade reference for guitar signal chains — pickup output through speaker excursion. Signal topology, impedance, gain staging, and gear pairing by Suede Labs.',
  alternates: {
    canonical: 'https://guitar-solutions.vercel.app',
  },
};

export default function HomePage() {
  const guides = getAllGuides();
  const categories = getCategories();
  const latest = guides.slice(0, 6);

  return (
    <div className="mx-auto max-w-[1280px] px-6">
      {/* Hero — editorial, not a card grid */}
      <section
        className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-12 pt-24 pb-32 lg:pt-32 hairline-b"
        aria-labelledby="hero-heading"
      >
        <div className="lg:col-span-8">
          <p className="mono-label">
            <span className="text-red">●</span> ISSUE 001 · {new Date().getFullYear()} · ENGINEERING REFERENCE
          </p>
          <h1
            id="hero-heading"
            className="font-display text-paper mt-6"
            style={{
              fontSize: 'var(--text-hero)',
              lineHeight: 0.92,
              letterSpacing: 'var(--tracking-tight)',
            }}
          >
            The technical reference
            <br />
            <span className="text-red">your tone</span> needs.
          </h1>
          <p className="text-paper-mute mt-10 max-w-[60ch] leading-relaxed text-lg">
            guitar.solutions is a footnoted, engineering-grade reference for guitar signal chains
            — pickup output through speaker excursion. No gear-of-the-month roundups. No affiliate
            funnels. Just the topology that decides whether your rig holds together at volume.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 mono-label">
            <span>{guides.length} GUIDES</span>
            <span className="text-paper-dim">·</span>
            <span>{categories.length} CATEGORIES</span>
            <span className="text-paper-dim">·</span>
            <span className="text-paper-dim">EDITED BY SUEDE LABS</span>
          </div>
        </div>

        {/* Right rail — categories index */}
        <aside className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-10">
          <p className="mono-label mb-6">SUBJECT INDEX</p>
          <ul className="space-y-3">
            {categories.length === 0 && (
              <li className="text-paper-dim text-sm">No categories yet.</li>
            )}
            {categories.map((c) => (
              <li key={c.name} className="flex items-baseline justify-between gap-4">
                <Link
                  href={`/categories#${slugifyCategory(c.name)}`}
                  className="text-paper hover:text-cyan transition-colors font-display"
                >
                  {c.name}
                </Link>
                <span className="mono-label text-paper-dim shrink-0">
                  {String(c.count).padStart(2, '0')}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/categories"
            className="mono-label inline-flex items-center gap-2 text-cyan hover:text-paper transition-colors mt-8"
          >
            FULL INDEX →
          </Link>
        </aside>
      </section>

      {/* Recently published — editorial list, not a card grid */}
      <section className="py-24" aria-labelledby="recent-heading">
        <div className="flex items-end justify-between mb-12">
          <h2
            id="recent-heading"
            className="font-display text-paper"
            style={{ fontSize: 'var(--text-headline)', letterSpacing: 'var(--tracking-tight)' }}
          >
            Recently filed
          </h2>
          <p className="mono-label hidden md:block">FILED → DATE · CATEGORY · AUTHOR</p>
        </div>

        {latest.length === 0 ? (
          <p className="text-paper-mute">No guides published yet.</p>
        ) : (
          <ol className="hairline-t">
            {latest.map((g, i) => (
              <li
                key={g.frontmatter.slug}
                className="hairline-b grid grid-cols-12 gap-x-6 gap-y-2 py-8 group"
              >
                <span className="col-span-12 md:col-span-1 mono-label text-paper-dim">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="col-span-12 md:col-span-7">
                  <Link
                    href={`/guides/${g.frontmatter.slug}`}
                    className="font-display text-paper text-2xl md:text-3xl hover:text-cyan transition-colors block leading-tight"
                  >
                    {g.frontmatter.title}
                  </Link>
                  <p className="text-paper-mute mt-3 max-w-[55ch] leading-relaxed">
                    {g.frontmatter.description}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-4 md:text-right space-y-1">
                  <p className="mono-label text-paper">
                    {formatDate(g.frontmatter.published)}
                  </p>
                  <p className="mono-label text-paper-dim">{g.frontmatter.category}</p>
                  <p className="mono-label text-paper-dim">
                    {(g.frontmatter.authors ?? ['SUEDE LABS']).join(' · ').toUpperCase()}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Editorial note */}
      <section className="py-24 grid grid-cols-1 md:grid-cols-12 gap-x-10 hairline-t">
        <div className="md:col-span-3">
          <p className="mono-label">EDITORIAL NOTE</p>
        </div>
        <div className="md:col-span-9 max-w-[60ch]">
          <p className="font-display text-paper text-xl md:text-2xl leading-snug">
            Most guitar writing online sells gear. This one explains it. Every claim is sourced;
            every signal-flow diagram is verifiable on a bench. If we get a measurement wrong, we
            correct it in place and footnote the change.
          </p>
          <p className="text-paper-mute mt-6">
            — Suede Labs, Engineering Reference desk
          </p>
        </div>
      </section>
    </div>
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
