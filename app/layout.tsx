import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://guitar-solutions.vercel.app'),
  title: {
    default: 'guitar.solutions — Technical Reference for Guitar Signal Chains',
    template: '%s — guitar.solutions',
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
    'Suede Labs guitar',
  ],
  authors: [{ name: 'Jason Colapietro', url: 'https://github.com/JasonColapietro' }],
  creator: 'Jason Colapietro',
  publisher: 'Suede Labs AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://guitar-solutions.vercel.app',
    title: 'guitar.solutions — Technical Reference for Guitar Signal Chains',
    description:
      'Engineering-grade reference for guitar signal chains — pickup output through speaker excursion. Signal topology, impedance, gain staging, and gear pairing by Suede Labs.',
    siteName: 'guitar.solutions',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'guitar.solutions — Engineering Reference for Guitar Signal Chains by Suede Labs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'guitar.solutions — Technical Reference for Guitar Signal Chains',
    description:
      'Engineering-grade reference for guitar signal chains — pickup output through speaker excursion. Signal topology, impedance, and gain staging by Suede Labs.',
    creator: '@suedeai',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: 'https://guitar-solutions.vercel.app',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'guitar.solutions',
              url: 'https://guitar-solutions.vercel.app',
              description:
                'Engineering-grade reference for guitar signal chains — pickup output through speaker excursion. Signal topology, impedance, gain staging, and gear pairing by Suede Labs.',
              publisher: {
                '@type': 'Organization',
                name: 'Suede Labs AI',
                url: 'https://suedeai.ai',
              },
              sameAs: [
                'https://twitter.com/suedeai',
                'https://github.com/Suede-AI',
              ],
            }),
          }}
        />
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
