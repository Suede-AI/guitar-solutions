import type { Metadata } from 'next';
import { GUITAR_SERVICES_OG_IMAGE, GUITAR_SERVICES_TWITTER_IMAGES } from '@/lib/seo';
import { FAQ, aboutSchema } from '@/lib/about-content';

export const metadata: Metadata = {
  title: { absolute: 'About guitar.services' },
  description:
    'What guitar.services is, how it is put together, and where the engineering-grade signal chain guides live now.',
  alternates: {
    canonical: 'https://guitar.services/about',
  },
  openGraph: {
    title: 'About guitar.services',
    description:
      'What guitar.services is, how it is put together, and where the engineering-grade signal chain guides live now.',
    url: 'https://guitar.services/about',
    siteName: 'Guitar Services',
    type: 'website',
    images: [GUITAR_SERVICES_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About guitar.services',
    description:
      'What guitar.services is, how it is put together, and where the engineering-grade signal chain guides live now.',
    images: GUITAR_SERVICES_TWITTER_IMAGES,
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <header className="mb-14 max-w-2xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest opacity-60">
          guitar.services · about this directory
        </p>
        <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
          One guitarist&rsquo;s work, indexed in one place.
        </h1>
        <p className="text-lg leading-relaxed opacity-80">
          guitar.services is a directory, not a publication. It links to everything Jason
          Colapietro has published about guitar &mdash; two books, an engineering-grade signal
          chain reference, chord and scale libraries, and the tools built on top of them &mdash;
          so there is one address to remember instead of six.
        </p>
      </header>

      <section aria-labelledby="whats-here-heading" className="mb-14">
        <h2 id="whats-here-heading" className="mb-4 text-2xl font-semibold">
          What&rsquo;s here
        </h2>
        <div className="space-y-4 text-base leading-relaxed opacity-80">
          <p>
            The{' '}
            <a href="/" className="underline">
              home page
            </a>{' '}
            lists every surface: the two books, the guide library, the chord and scale
            references, Strumly, and the iOS app. Each entry links straight to that surface
            &mdash; nothing on this domain duplicates the content itself.
          </p>
          <p>
            The long-form technical writing &mdash; signal topology, gain staging, cable
            capacitance, pedalboard order, impedance, power and noise &mdash; now lives in{' '}
            <a href="https://strumly.suedeai.ai/guides" className="underline">
              Strumly&rsquo;s guide index
            </a>
            , grouped alongside practice-methodology guides and rights &amp; IP guides for
            working musicians. That index is the closest thing to a &ldquo;categories&rdquo;
            page: guides are grouped by topic (Practice, Engineering, Rights &amp; IP) rather
            than split across separate pages.
          </p>
        </div>
      </section>

      <section aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="mb-6 text-2xl font-semibold">
          FAQ
        </h2>
        <dl className="space-y-6">
          {FAQ.map((item) => (
            <div key={item.q} className="rounded-lg border border-current/15 p-5">
              <dt className="mb-2 font-semibold">{item.q}</dt>
              <dd className="text-sm leading-relaxed opacity-80">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="mt-14 border-t border-current/10 pt-8 text-sm opacity-70">
        <p>
          Questions this page didn&rsquo;t answer go to{' '}
          <a href="mailto:info@suedeai.org" className="underline">
            info@suedeai.org
          </a>
          . Back to the{' '}
          <a href="/" className="underline">
            directory
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
