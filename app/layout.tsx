import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Link from 'next/link';
import './globals.css';
import { SITE_OG_IMAGE, SITE_TWITTER_IMAGES, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'guides.guitar.solutions — Technical Reference for Guitar Signal Chains',
    template: '%s | guides.guitar.solutions',
  },
  description:
    'Engineering-grade reference for guitar signal chains — pickup output through speaker excursion. Signal topology, impedance, gain staging, and gear pairing by Suede Labs.',
  keywords: [
    'guitar signal chain',
    'guitar electronics',
    'guitar impedance',
    'gain staging guitar',
    'guitar tone topology',
    'guitar pickup output',
    'guitar engineering reference',
    'signal chain topology',
    'guitar gear pairing',
    'guitar amp signal flow',
    'guitar effects order',
    'guitar technical reference',
    'Jason Colapietro',
    'Suede Labs guitar',
  ],
  authors: [{ name: 'Jason Colapietro', url: 'https://suedeai.ai/founder' }],
  creator: 'Jason Colapietro',
  publisher: 'Suede Labs AI',
  openGraph: {
    title: 'guides.guitar.solutions — Technical Reference for Guitar Signal Chains',
    description:
      'Engineering-grade reference for guitar signal chains — pickup output through speaker excursion. Signal topology, impedance, gain staging, and gear pairing by Suede Labs.',
    url: 'https://guides.guitar.solutions',
    siteName: 'guides.guitar.solutions',
    type: 'website',
    locale: 'en_US',
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@AISUEDE',
    creator: '@johnnysuede',
    title: 'guides.guitar.solutions — Technical Reference for Guitar Signal Chains',
    description:
      'Engineering-grade reference for guitar signal chains — pickup output through speaker excursion. Signal topology, impedance, gain staging, and gear pairing by Suede Labs.',
    images: SITE_TWITTER_IMAGES,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  verification: { google: 'AOoIfw-VogekFSkj1jmBG2vGHqlzpyG2Xk2w69s6a7U' },
};

const SITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://guides.guitar.solutions/#website',
      url: 'https://guides.guitar.solutions',
      name: 'guides.guitar.solutions',
      description:
        'Engineering-grade writeups on signal chains, gear pairing, and tone topology.',
      publisher: { '@id': 'https://guides.guitar.solutions/#organization' },
      inLanguage: 'en-US',
    },
    {
      '@type': 'Organization',
      '@id': 'https://guides.guitar.solutions/#organization',
      name: 'Suede Labs',
      url: 'https://suedeai.ai',
      sameAs: ['https://suedeai.ai', 'https://suedeai.org', 'https://x.com/AISUEDE'],
    },
    {
      '@type': 'Person',
      '@id': 'https://suedeai.ai/founder#person',
      name: 'Jason Colapietro',
      url: 'https://suedeai.ai/founder',
      image: {
        '@type': 'ImageObject',
        url: 'https://suedeai.org/assets/img/founder-jason.png',
        caption: 'Jason Colapietro, Founder of Suede Labs',
      },
      jobTitle: 'Founder',
      worksFor: { '@type': 'Organization', name: 'Suede Labs AI', url: 'https://suedeai.ai' },
      sameAs: [
        'https://x.com/johnnysuede',
        'https://suedeai.ai/founder',
        'https://suedeai.org/jason-colapietro/',
        'https://jasoncolapietro.substack.com',
      ],
    },
    {
      '@type': 'Book',
      name: 'The Signal Chain',
      author: { '@id': 'https://suedeai.ai/founder#person' },
      description:
        'A footnoted, engineering-grade reference for guitar signal chains — from pickup output through speaker excursion.',
      url: 'https://guitar.solutions',
      publisher: { '@type': 'Organization', name: 'Suede Labs AI', url: 'https://suedeai.ai' },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD) }}
        />
        <header className="hairline-b">
          <div className="mx-auto max-w-[1280px] px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" aria-label="guitar.solutions home">
              <span className="mono-label text-paper">GUITAR.SOLUTIONS</span>
              <span className="mono-label text-paper-dim hidden sm:inline">
                ENGINEERING REFERENCE
              </span>
            </Link>
            <nav aria-label="Primary">
              <ul className="flex items-center gap-6 mono-label">
                <li>
                  <Link href="/guides/signal-chain-topology" className="hover:text-cyan transition-colors">
                    GUIDES
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-cyan transition-colors">
                    CATEGORIES
                  </Link>
                </li>
                <li>
                  <a
                    href="https://guitar.solutions"
                    className="hover:text-cyan transition-colors"
                  >
                    THE BOOK
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="hairline-t mt-32">
          <div className="mx-auto max-w-[1280px] px-6 py-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="mono-label text-paper">guitar.solutions</p>
              <p className="text-paper-dim text-sm mt-2 max-w-md">
                Compiled by{' '}
                <a
                  href="https://suedeai.ai"
                  className="underline underline-offset-2 hover:text-paper transition-colors"
                >
                  Suede Labs AI
                </a>
                {' '}· Jason Colapietro — corrections welcome. Citations are footnoted. Reach the maintainer at{' '}
                <a
                  href="mailto:info@suedeai.org"
                  className="underline underline-offset-2 hover:text-paper transition-colors"
                >
                  info@suedeai.org
                </a>
                .
              </p>
            </div>
            <p className="mono-label text-paper-dim">
              SUEDE/LABS · ENGINEERING REFERENCE · v0
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
