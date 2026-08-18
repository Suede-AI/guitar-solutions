import type { Metadata } from 'next';
import { GUITAR_SERVICES_OG_IMAGE, GUITAR_SERVICES_TWITTER_IMAGES } from '@/lib/seo';
import { SURFACES, guitarServicesSchema } from '@/lib/guitar-services-content';

export const metadata: Metadata = {
  title: { absolute: 'Guitar Services: Books, Guides, and Tools by Jason Colapietro' },
  description:
    'The guitar work of Jason Colapietro, founder of Suede Labs AI: two published guitar books, an engineering-grade signal chain reference, chord and scale libraries, and AI practice tools.',
  alternates: {
    canonical: 'https://guitar.services',
  },
  openGraph: {
    title: 'Guitar Services: Books, Guides, and Tools by Jason Colapietro',
    description:
      'Two guitar books, a signal chain reference, chord libraries, and AI practice tools, all by one guitarist who builds.',
    url: 'https://guitar.services',
    siteName: 'Guitar Services',
    type: 'website',
    images: [GUITAR_SERVICES_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guitar Services: Books, Guides, and Tools by Jason Colapietro',
    description:
      'Two guitar books, a signal chain reference, chord libraries, and AI practice tools, all by one guitarist who builds.',
    images: GUITAR_SERVICES_TWITTER_IMAGES,
  },
};

export default function GuitarServicesPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guitarServicesSchema) }}
      />
      <header className="mb-14 max-w-2xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest opacity-60">
          guitar.services · a Suede Labs AI surface
        </p>
        <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
          Everything the guitar taught one builder, in one place.
        </h1>
        <p className="text-lg leading-relaxed opacity-80">
          Jason Colapietro, founder of Suede Labs AI, is a self-taught guitarist who wrote the
          books, built the references, and shipped the tools. Two published guitar volumes, an
          engineering-grade signal chain reference, chord libraries, an AI practice coach, and a
          network for musicians. All of it live, all of it by one person.
        </p>
      </header>

      <section aria-label="Guitar books, guides, and tools">
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {SURFACES.map((s) => (
            <li key={s.name}>
              <a
                href={s.url}
                className="block h-full rounded-lg border border-current/15 p-5 transition-opacity hover:opacity-80"
              >
                <p className="mb-1 font-mono text-[11px] uppercase tracking-widest opacity-50">
                  {s.kind}
                </p>
                <h2 className="mb-2 text-lg font-semibold">{s.name}</h2>
                <p className="text-sm leading-relaxed opacity-70">{s.desc}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-14 border-t border-current/10 pt-8 text-sm opacity-70">
        <p>
          The founder story is at{' '}
          <a href="https://suedeai.ai/founder" className="underline">
            suedeai.ai/founder
          </a>
          . The company is{' '}
          <a href="https://suedeai.ai" className="underline">
            Suede Labs AI
          </a>
          . The code ships in public at{' '}
          <a href="https://github.com/JasonColapietro" className="underline">
            github.com/JasonColapietro
          </a>
          . Curious how this directory works?{' '}
          <a href="/about" className="underline">
            Read the about page
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
