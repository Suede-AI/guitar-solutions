'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { getCategoryDetails } from '@/lib/categories';
import type { GuideFrontmatter } from '@/lib/mdx';

export type GuideSummary = {
  frontmatter: GuideFrontmatter;
  readingTime: number;
};

interface GuideIndexTabsProps {
  guides: GuideSummary[];
}

function formatDate(iso: string): string {
  return new Date(iso)
    .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })
    .toUpperCase();
}

export function GuideIndexTabs({ guides }: GuideIndexTabsProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const guide of guides) {
      const category = guide.frontmatter.category;
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }

    return [
      { name: 'All', count: guides.length },
      ...Array.from(counts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    ];
  }, [guides]);

  const filteredGuides =
    activeCategory === 'All'
      ? guides
      : guides.filter((guide) => guide.frontmatter.category === activeCategory);

  const categoryDetails =
    activeCategory === 'All'
      ? {
          summary:
            'Every guide is filed by the part of the rig it explains, so you can start from the symptom and move upstream.',
          useWhen:
            'Use the full index when you are building a board, auditing a rig, or learning the signal chain from source to speaker.',
        }
      : getCategoryDetails(activeCategory);

  return (
    <section className="py-16 hairline-b">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-8">
        <div>
          <p className="mono-label mb-3">BROWSE BY ENGINEERING LANE</p>
          <h2 className="font-display text-paper text-3xl leading-tight">Find the failure point.</h2>
          <p className="text-paper-mute mt-3 max-w-[64ch] leading-relaxed">
            Start with the part of the rig causing the symptom: source loading,
            gain, power, or loop routing. Each lane keeps the diagnosis tied to
            one physical section of the chain.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Guide categories"
          className="flex flex-wrap gap-2 lg:justify-end"
        >
          {categories.map((category) => {
            const selected = activeCategory === category.name;
            return (
              <button
                key={category.name}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="guide-panel"
                onClick={() => setActiveCategory(category.name)}
                className={`min-h-10 border px-3 py-2 mono-label transition-colors ${
                  selected
                    ? 'border-cyan text-cyan bg-ink-1'
                    : 'border-rule text-paper-dim hover:text-paper hover:border-paper-dim'
                }`}
              >
                {category.name} ({category.count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-rule hairline-t" id="guide-panel">
        <aside className="bg-ink-0 p-6 lg:col-span-4">
          <p className="mono-label text-cyan mb-4">{activeCategory}</p>
          <p className="text-paper text-lg leading-snug">{categoryDetails.summary}</p>
          <p className="text-paper-mute mt-5 text-sm leading-relaxed">{categoryDetails.useWhen}</p>
        </aside>
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-rule">
          {filteredGuides.map((guide) => (
            <article
              key={guide.frontmatter.slug}
              className="bg-ink-0 p-6 flex flex-col gap-3 min-h-[240px]"
            >
              <div className="flex items-center justify-between gap-3 mono-label">
                <span>{guide.frontmatter.category.toUpperCase()}</span>
                <span className="text-paper-dim">{guide.readingTime} MIN</span>
              </div>
              <h3 className="font-display text-paper text-xl leading-tight">
                <Link
                  href={`/guides/${guide.frontmatter.slug}`}
                  className="hover:text-cyan transition-colors"
                >
                  {guide.frontmatter.title}
                </Link>
              </h3>
              <p className="text-paper-mute text-sm leading-relaxed">
                {guide.frontmatter.description}
              </p>
              <p className="mono-label text-paper-dim mt-auto">
                FILED {formatDate(guide.frontmatter.published)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
