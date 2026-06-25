import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllGuides, getCategories } from '@/lib/mdx';

export const metadata: Metadata = {
  title: 'Subject Index',
  description: 'All guitar.solutions guides, grouped by engineering category.',
  alternates: { canonical: 'https://guitar.solutions/categories' },
};

export default function CategoriesPage() {
  const categories = getCategories();
  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-[1280px] px-6">
      <header className="py-24 hairline-b">
        <p className="mono-label">SUBJECT INDEX</p>
        <h1
          className="font-display text-paper mt-6"
          style={{
            fontSize: 'var(--text-headline)',
            letterSpacing: 'var(--tracking-tight)',
            lineHeight: 1.02,
          }}
        >
          Engineering categories.
        </h1>
        <p className="text-paper-mute mt-6 max-w-[60ch] text-lg leading-relaxed">
          Every guide belongs to one category. Categories map to a section of the signal chain or a
          discrete engineering concern — not to a marketing theme.
        </p>
      </header>

      <section className="py-20 space-y-20">
        {categories.length === 0 && (
          <p className="text-paper-mute">No categories yet — add a guide with frontmatter to see it appear here.</p>
        )}
        {categories.map((c) => {
          const id = slugifyCategory(c.name);
          const inCategory = guides.filter((g) => g.frontmatter.category === c.name);
          return (
            <section
              key={c.name}
              id={id}
              aria-labelledby={`${id}-heading`}
              className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 scroll-mt-20"
            >
              <div className="lg:col-span-4">
                <p className="mono-label text-paper-dim">
                  {String(c.count).padStart(2, '0')} {c.count === 1 ? 'GUIDE' : 'GUIDES'}
                </p>
                <h2
                  id={`${id}-heading`}
                  className="font-display text-paper mt-3"
                  style={{
                    fontSize: 'clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)',
                    letterSpacing: 'var(--tracking-tight)',
                    lineHeight: 1.05,
                  }}
                >
                  {c.name}
                </h2>
              </div>
              <ol className="lg:col-span-8 hairline-t">
                {inCategory.map((g, i) => (
                  <li
                    key={g.frontmatter.slug}
                    className="hairline-b grid grid-cols-12 gap-x-4 py-6"
                  >
                    <span className="col-span-2 md:col-span-1 mono-label text-paper-dim self-center">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <Link
                      href={`/guides/${g.frontmatter.slug}`}
                      className="col-span-10 md:col-span-8 font-display text-paper hover:text-cyan transition-colors text-xl leading-tight self-center"
                    >
                      {g.frontmatter.title}
                    </Link>
                    <span className="col-span-12 md:col-span-3 mono-label text-paper-dim md:text-right self-center">
                      {formatDate(g.frontmatter.published)}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
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
