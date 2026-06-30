'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Heading, GuideRecord } from '@/lib/mdx';

interface GuideSidebarProps {
  headings: Heading[];
  relatedGuides: Pick<GuideRecord, 'frontmatter'>[];
}

const CATEGORY_DOT_COLORS: Record<string, string> = {
  'Signal Chain': 'var(--color-cyan)',
  Electronics: 'var(--color-gold)',
  'Gain & Dynamics': 'var(--color-gold)',
  Power: '#e84545',
};

function getCategoryDotColor(category: string): string {
  return CATEGORY_DOT_COLORS[category] ?? 'var(--color-paper-mute)';
}

export function GuideSidebar({ headings, relatedGuides }: GuideSidebarProps) {
  const [activeId, setActiveId] = useState('');
  const [progress, setProgress] = useState(0);

  // Reading progress
  useEffect(() => {
    function handleScroll() {
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active heading via IntersectionObserver
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

  function scrollToHeading(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  return (
    <>
      {/* Fixed reading progress bar at the very top of the viewport */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          zIndex: 50,
          background: 'var(--color-ink-2)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--color-gold), var(--color-cyan))',
            transition: 'width 0.1s ease',
          }}
        />
      </div>

      {/* Sidebar content */}
      <div className="flex flex-col gap-8">
        {headings.length > 0 && (
          <nav aria-label="Guide contents">
            {/* CONTENTS label with gold underline accent */}
            <p
              className="mono-label mb-4"
              style={{
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--color-gold)',
                display: 'inline-block',
                opacity: 0.9,
              }}
            >
              CONTENTS
            </p>
            <ul className="space-y-0.5 mt-1">
              {headings.map(({ id, text, level }) => {
                const isActive = activeId === id;
                return (
                  <li key={id} style={{ paddingLeft: level === 3 ? '0.75rem' : '0' }}>
                    <a
                      href={`#${id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToHeading(id);
                      }}
                      style={{
                        display: 'block',
                        padding: '0.3rem 0 0.3rem 0.75rem',
                        fontSize: '0.72rem',
                        lineHeight: 1.45,
                        borderLeft: isActive
                          ? '2px solid var(--color-gold)'
                          : '2px solid transparent',
                        color: isActive ? 'var(--color-paper)' : 'var(--color-paper-mute)',
                        transition: 'color 0.15s ease, border-color 0.15s ease',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLAnchorElement).style.color =
                            'var(--color-paper)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          (e.currentTarget as HTMLAnchorElement).style.color =
                            'var(--color-paper-mute)';
                        }
                      }}
                    >
                      {text}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {relatedGuides.length > 0 && (
          <div className="hairline-t pt-6">
            <p
              className="mono-label mb-4"
              style={{
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--color-gold)',
                display: 'inline-block',
                opacity: 0.9,
              }}
            >
              RELATED
            </p>
            <ul className="space-y-3 mt-1">
              {relatedGuides.map((guide) => {
                const dotColor = getCategoryDotColor(guide.frontmatter.category);
                return (
                  <li key={guide.frontmatter.slug}>
                    <Link
                      href={`/guides/${guide.frontmatter.slug}`}
                      className="group"
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        textDecoration: 'none',
                      }}
                    >
                      {/* Category dot */}
                      <span
                        aria-hidden
                        style={{
                          display: 'inline-block',
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: dotColor,
                          marginTop: '0.35rem',
                          flexShrink: 0,
                          opacity: 0.8,
                        }}
                      />
                      <span
                        style={{
                          fontSize: '0.72rem',
                          lineHeight: 1.45,
                          color: 'var(--color-paper-mute)',
                          transition: 'color 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLSpanElement).style.color =
                            'var(--color-cyan)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLSpanElement).style.color =
                            'var(--color-paper-mute)';
                        }}
                      >
                        {guide.frontmatter.title}{' '}
                        <span
                          style={{
                            display: 'inline-block',
                            transition: 'transform 0.15s var(--ease-out-expo)',
                          }}
                          className="group-hover:[transform:translateX(3px)]"
                        >
                          →
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Back to top */}
        <div className="hairline-t pt-4">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mono-label text-paper-mute hover:text-paper transition-colors"
            style={{ fontSize: '0.6rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            ↑ BACK TO TOP
          </button>
        </div>
      </div>
    </>
  );
}
