import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Playfair_Display } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-var',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://guitar.services'),
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
    url: 'https://guitar.services',
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
    canonical: 'https://guitar.services',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} ${playfairDisplay.variable}`}>
      <body>
        <header className="relative hairline-b bg-ink-0" style={{ backdropFilter: 'blur(12px)' }}>
          <div className="mx-auto max-w-[1280px] px-6 h-16 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3" aria-label="guitar.services home">
              <span className="flex items-baseline gap-0.5">
                <span
                  className="font-playfair-italic text-paper group-hover:text-gold transition-colors"
                  style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.03em' }}
                >
                  guitar
                </span>
                <span className="mono-label text-gold" style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                  .SERVICES
                </span>
              </span>
              <span className="mono-label text-paper-dim hidden lg:inline" style={{ fontSize: '0.58rem' }}>
                ENGINEERING REFERENCE
              </span>
            </Link>
            <nav aria-label="Primary">
              <ul className="flex items-center gap-8 mono-label" style={{ fontSize: '0.65rem' }}>
                <li>
                  <Link
                    href="/guides/signal-chain-topology"
                    className="text-paper-dim hover:text-paper transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all hover:after:w-full"
                  >
                    GUIDES
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="text-paper-dim hover:text-paper transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all hover:after:w-full"
                  >
                    CATEGORIES
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          {/* Ultra-thin gradient accent line at very bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, var(--color-gold) 40%, var(--color-cyan) 60%, transparent)' }}
          />
        </header>
        <main>{children}</main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'guitar.solutions',
              url: 'https://guitar.services',
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
        <footer className="mt-32" style={{ borderTop: '1px solid var(--color-rule)' }}>
          {/* Top bar — gold-to-cyan gradient accent */}
          <div
            className="h-[2px]"
            style={{ background: 'linear-gradient(90deg, var(--color-gold), var(--color-cyan) 50%, var(--color-gold))' }}
          />

          <div className="mx-auto max-w-[1280px] px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 pb-16 hairline-b">
              {/* Brand */}
              <div>
                <p className="font-playfair-italic text-paper" style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
                  guitar
                  <span
                    className="text-gold not-italic"
                    style={{ fontFamily: 'var(--font-mono)', fontStyle: 'normal', fontSize: '0.8rem', letterSpacing: '0.1em' }}
                  >
                    .services
                  </span>
                </p>
                <p className="text-paper-dim text-sm mt-3 leading-relaxed max-w-[32ch]">
                  Engineering-grade reference for guitar signal chains — pickup through speaker excursion.
                </p>
              </div>

              {/* Navigation */}
              <div>
                <p className="mono-label mb-4">REFERENCE</p>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-paper-dim hover:text-paper text-sm transition-colors">Home</Link></li>
                  <li><Link href="/categories" className="text-paper-dim hover:text-paper text-sm transition-colors">Subject Index</Link></li>
                  <li><Link href="/guides/signal-chain-topology" className="text-paper-dim hover:text-paper text-sm transition-colors">Signal Chain Topology</Link></li>
                </ul>
              </div>

              {/* Meta */}
              <div>
                <p className="mono-label mb-4">BY</p>
                <p className="text-sm text-paper-dim leading-relaxed">
                  Compiled and maintained by{' '}
                  <a href="https://suedeai.ai" className="text-paper hover:text-gold transition-colors underline underline-offset-2">
                    Suede Labs
                  </a>
                  {' '}· Jason Colapietro.
                </p>
                <p className="mono-label mt-6 text-paper-dim" style={{ fontSize: '0.6rem' }}>
                  SUEDE/LABS · ENGINEERING REFERENCE · v0
                </p>
              </div>
            </div>

            <p className="mono-label text-paper-dim" style={{ fontSize: '0.6rem' }}>
              © 2026 SUEDE LABS AI · CITATIONS FOOTNOTED · CORRECTIONS WELCOME
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
