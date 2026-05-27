import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://guitar.solutions'),
  title: {
    default: 'guitar.solutions — Technical Reference for Guitar Signal Chains',
    template: '%s — guitar.solutions',
  },
  description:
    'The technical reference your tone needs. Engineering-grade writeups on signal chains, gear pairing, and tone topology — by Suede Labs.',
  alternates: { canonical: 'https://guitar.solutions' },
  openGraph: {
    title: 'guitar.solutions — Technical Reference for Guitar Signal Chains',
    description:
      'Engineering-grade writeups on signal chains, gear pairing, and tone topology.',
    url: 'https://guitar.solutions',
    siteName: 'guitar.solutions',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@AISUEDE',
    creator: '@johnnysuede',
    title: 'guitar.solutions',
    description:
      'Engineering-grade writeups on signal chains, gear pairing, and tone topology.',
  },
  robots: { index: true, follow: true },
};

const SITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://guitar.solutions/#website',
      url: 'https://guitar.solutions',
      name: 'guitar.solutions',
      description:
        'Engineering-grade writeups on signal chains, gear pairing, and tone topology.',
      publisher: { '@id': 'https://guitar.solutions/#organization' },
      inLanguage: 'en-US',
    },
    {
      '@type': 'Organization',
      '@id': 'https://guitar.solutions/#organization',
      name: 'Suede Labs',
      url: 'https://suedeai.ai',
      sameAs: [
        'https://suedeai.ai',
        'https://suedeai.org',
        'https://x.com/AISUEDE',
      ],
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
                A technical reference compiled and maintained by Suede Labs. Citations are
                footnoted; corrections are welcome.
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
