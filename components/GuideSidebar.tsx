'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Heading, GuideRecord } from '@/lib/mdx';

interface GuideSidebarProps {
  headings: Heading[];
  relatedGuides: Pick<GuideRecord, 'frontmatter'>[];
}

export function GuideSidebar({ headings, relatedGuides }: GuideSidebarProps) {
  const [activeId, setActiveId] = useState('');

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
      {headings.length > 0 && (
        <nav aria-label="Guide contents">
          <p className="mono-label mb-3">CONTENTS</p>
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

      {relatedGuides.length > 0 && (
        <div className="hairline-t pt-6">
          <p className="mono-label mb-3">RELATED</p>
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
    </div>
  );
}
