import type { Metadata } from 'next';
import { keywordsFor } from '@/lib/keywords';
import { GUITAR_SERVICES_OG_IMAGE, GUITAR_SERVICES_TWITTER_IMAGES } from '@/lib/seo';
import { FAQ, aboutSchema } from '@/lib/about-content';
import {
  ABOUT_PAGE,
  BOOK_PAGE,
  CHORDS_PAGE,
  GUIDES_PAGE,
  TOOLS_PAGE,
} from '@/lib/guitar-services-pages';
import { GuitarServicesNav } from '@/components/GuitarServicesNav';

export const metadata: Metadata = {
  title: { absolute: ABOUT_PAGE.title },
  description: ABOUT_PAGE.description,
  keywords: keywordsFor('about'),
  alternates: {
    canonical: 'https://guitar.services/about',
  },
  openGraph: {
    title: ABOUT_PAGE.title,
    description: ABOUT_PAGE.description,
    url: 'https://guitar.services/about',
    siteName: 'Guitar Services',
    type: 'website',
    images: [GUITAR_SERVICES_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: ABOUT_PAGE.title,
    description: ABOUT_PAGE.description,
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
      <GuitarServicesNav current={ABOUT_PAGE.path} />
      <header className="mb-14 max-w-2xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest opacity-60">
          guitar.services · about this directory
        </p>
        <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
          One guitarist&rsquo;s work, indexed in one place.
        </h1>
        <p className="text-lg leading-relaxed opacity-80">
          guitar.services is a directory, not a publication. It links to everything Jason
          Colapietro has published about guitar: two books, an engineering-grade signal chain
          reference, chord and scale libraries, and the tools built on top of them. There is one
          address to remember instead of six.
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
            references, Strumly, and the iOS app. Each entry links straight to that surface.
            This domain does not duplicate the content itself.
          </p>
          <p>
            Four reference pages go one level deeper, summarizing rather than copying:{' '}
            <a href={BOOK_PAGE.path} className="underline">
              The Signal Chain contents
            </a>{' '}
            page summarizes the book part by part from its Strumly listing, the{' '}
            <a href={GUIDES_PAGE.path} className="underline">
              signal chain guides
            </a>{' '}
            page sums up each guide and links its full text, the{' '}
            <a href={CHORDS_PAGE.path} className="underline">
              chord and scale library
            </a>{' '}
            indexes every chord and scale on guitarchords.info, and the{' '}
            <a href={TOOLS_PAGE.path} className="underline">
              practice tools
            </a>{' '}
            page lists the coach, tuners, trainers, and lessons.
          </p>
          <p>
            The long-form technical writing (signal topology, gain staging, cable capacitance,
            pedalboard order, impedance, power and noise) now lives in{' '}
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
          FAQ about guitar.services
        </h2>
        <div className="space-y-6">
          {FAQ.map((item) => (
            <div key={item.q} className="rounded-lg border border-current/15 p-5">
              <h3 className="mb-2 font-semibold">{item.q}</h3>
              <p className="text-sm leading-relaxed opacity-80">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-14 border-t border-current/10 pt-8 text-sm opacity-70">
        <p>
          Questions this page didn&rsquo;t answer go to{' '}
          <a href="mailto:info@suedeai.ai" className="underline">
            info@suedeai.ai
          </a>
          . Back to the{' '}
          <a href="/" className="underline">
            directory
          </a>
          .
        </p>
        <p className="mt-4">
          <a href="https://suedeai.ai/privacy" className="underline">
            Privacy
          </a>{' '}
          &middot;{' '}
          <a href="https://suedeai.ai/contact" className="underline">
            Contact
          </a>
        </p>
      </footer>
    </div>
  );
}
