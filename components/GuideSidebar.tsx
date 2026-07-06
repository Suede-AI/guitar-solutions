'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Heading, GuideRecord } from '@/lib/mdx';

interface GuideSidebarProps {
  headings: Heading[];
  relatedGuides: Pick<GuideRecord, 'frontmatter'>[];
  facts: {
    category: string;
    published: string;
    readingTime: number;
    sectionCount: number;
    relatedCount: number;
  };
}

export function GuideSidebar({ headings, relatedGuides, facts }: GuideSidebarProps) {
  const [activeId, setActiveId] = useState('');
  const [activePanel, setActivePanel] = useState<'contents' | 'related' | 'facts'>('contents');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries.find((e) => e.isIntersecting);
        if (first) setActiveId(first.target.id);
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Guide sidebar sections">
        {(['contents', 'related', 'facts'] as const).map((panel) => (
          <button
            key={panel}
            type="button"
            role="tab"
            aria-selected={activePanel === panel}
            onClick={() => setActivePanel(panel)}
            className={`border px-3 py-2 mono-label transition-colors ${
              activePanel === panel
                ? 'border-cyan text-cyan bg-ink-1'
                : 'border-rule text-paper-dim hover:text-paper hover:border-paper-dim'
            }`}
          >
            {panel}
          </button>
        ))}
      </div>

      {activePanel === 'contents' && headings.length > 0 && (
        <nav aria-label="Guide contents">
          <ul className="space-y-1">
            {headings.map(({ id, text, level }) => (
              <li key={id} style={{ paddingLeft: level === 3 ? '0.75rem' : '0' }}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`block py-0.5 text-[0.75rem] leading-snug transition-colors ${
                    activeId === id ? 'text-cyan' : 'text-paper-dim hover:text-paper'
                  }`}
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {activePanel === 'related' && relatedGuides.length > 0 && (
        <div>
          <ul className="space-y-2">
            {relatedGuides.map((guide) => (
              <li key={guide.frontmatter.slug}>
                <Link
                  href={`/guides/${guide.frontmatter.slug}`}
                  className="text-[0.75rem] text-paper-dim hover:text-cyan transition-colors block leading-snug"
                >
                  {guide.frontmatter.title} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activePanel === 'facts' && (
        <dl className="grid grid-cols-2 gap-px bg-rule hairline-t">
          <div className="bg-ink-0 p-3">
            <dt className="mono-label text-paper-dim">Category</dt>
            <dd className="text-paper text-sm mt-1">{facts.category}</dd>
          </div>
          <div className="bg-ink-0 p-3">
            <dt className="mono-label text-paper-dim">Read</dt>
            <dd className="text-paper text-sm mt-1">{facts.readingTime} min</dd>
          </div>
          <div className="bg-ink-0 p-3">
            <dt className="mono-label text-paper-dim">Sections</dt>
            <dd className="text-paper text-sm mt-1">{facts.sectionCount}</dd>
          </div>
          <div className="bg-ink-0 p-3">
            <dt className="mono-label text-paper-dim">Related</dt>
            <dd className="text-paper text-sm mt-1">{facts.relatedCount}</dd>
          </div>
          <div className="bg-ink-0 p-3 col-span-2">
            <dt className="mono-label text-paper-dim">Filed</dt>
            <dd className="text-paper text-sm mt-1">{facts.published}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
