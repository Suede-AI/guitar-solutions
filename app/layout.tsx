import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Link from 'next/link';
import { headers } from 'next/headers';
import './globals.css';
import { SITE_OG_IMAGE, SITE_TWITTER_IMAGES, SITE_URL } from '@/lib/seo';
import { resolveSiteIdentity } from '@/lib/site-identity';

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

// Guides-site chrome. Rendered only on the guides fallback host — never on
// guitar.services, whose pages carry their own header and footer.
function GuidesChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="hairline-b">
        <div className="mx-auto max-w-[1280px] px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="guides.guitar.solutions home">
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
              <li>
                <Link href="/about" className="hover:text-cyan transition-colors">
                  ABOUT
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
            <p className="mono-label text-paper">guides.guitar.solutions</p>
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
              . <Link
                href="/about"
                className="underline underline-offset-2 hover:text-paper transition-colors"
              >
                About this site
              </Link>
              .
            </p>
          </div>
          <p className="mono-label text-paper-dim">
            SUEDE/LABS · ENGINEERING REFERENCE · v0
          </p>
        </div>
      </footer>
    </>
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const host = (await headers()).get('host');
  const identity = resolveSiteIdentity(host);

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        {identity.jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(identity.jsonLd) }}
          />
        )}
        {identity.chrome === 'guides' ? (
          <GuidesChrome>{children}</GuidesChrome>
        ) : (
          <main>{children}</main>
        )}
      </body>
    </html>
  );
}
