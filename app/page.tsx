import type { Metadata } from 'next';
import { getAllGuides } from '@/lib/mdx';
import { FeaturedStack } from '@/components/FeaturedStack';
import { SignalChainDiagram } from '@/components/SignalChainDiagram';

export const metadata: Metadata = {
  title: 'guitar.services — Signal Chain Reference',
  description:
    'Authoritative technical guides on guitar signal chains — impedance, gain staging, power supplies, and effects topology by Suede Labs.',
  alternates: {
    canonical: 'https://guitar.services',
  },
};

export default function HomePage() {
  const guides = getAllGuides();

  return (
    <>
      {/* ── HERO ── full-bleed, no max-width */}
      <section
        className="grain-overlay relative flex flex-col justify-end"
        style={{
          minHeight: '85vh',
          background:
            "linear-gradient(to bottom, rgba(5,11,22,0.2) 0%, rgba(5,11,22,0.7) 55%, rgba(5,11,22,1) 100%), url('https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat",
        }}
      >
        <div className="mx-auto w-full max-w-[1280px] px-6 pb-20 pt-32">
          {/* Mono label */}
          <p className="mono-label text-gold animate-fade-up-1 mb-6 tracking-widest">
            GUITAR.SERVICES · TECHNICAL REFERENCE
          </p>

          {/* Headline */}
          <h1
            className="font-playfair-italic text-paper animate-fade-up-2 mb-8 max-w-[18ch]"
            style={{
              fontSize: 'clamp(3.5rem, 2rem + 6vw, 8rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
            }}
          >
            Signal Chain Engineering.
          </h1>

          {/* Body */}
          <p
            className="text-paper-mute animate-fade-up-3 mb-10 max-w-[52ch] leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 0.9rem + 0.4vw, 1.2rem)' }}
          >
            Authoritative guides on guitar electronics — from pickup output to speaker excursion.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up-3 flex flex-wrap items-center gap-6">
            <a
              href="#featured"
              className="mono-label text-gold border-gold border-b pb-0.5 transition-opacity hover:opacity-70"
            >
              READ GUIDES ↓
            </a>
            <a
              href="/categories"
              className="mono-label text-paper-mute border-paper-mute border-b pb-0.5 transition-opacity hover:opacity-70"
            >
              BROWSE CATEGORIES →
            </a>
          </div>
        </div>
      </section>

      {/* ── SIGNAL CHAIN DIAGRAM ── */}
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <SignalChainDiagram />
      </div>

      {/* ── FEATURED ARTICLES ── */}
      <div id="featured" className="mx-auto max-w-[1280px] px-6 pt-4">
        <FeaturedStack guides={guides} />
      </div>
    </>
  );
}
