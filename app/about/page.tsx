import type { Metadata } from 'next';

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
  },
};

const FAQ = [
  {
    q: 'Is guitar.services free?',
    a: 'The signal chain guides, the chord and scale references, and Strumly’s practice toolkit (tuner, metronome, ear training) are all free to use. The two books are separate paid publications, sold through their own retail listings — this directory just points to them.',
  },
  {
    q: 'Who writes the guides?',
    a: 'Jason Colapietro, founder of Suede Labs AI. He is a self-taught guitarist and the author of both books linked from this page; the guides are his writing, not aggregated or crowdsourced.',
  },
  {
    q: 'How is this directory curated?',
    a: 'By hand. The list of surfaces on the home page is maintained directly by Jason as new guitar work ships — there is no submission form, no ads, and no third-party listings.',
  },
  {
    q: 'Where did the engineering-grade signal chain guides go?',
    a: 'They used to live at guides.guitar.solutions. They have since moved into Strumly’s guide library at strumly.suedeai.ai/guides, alongside practice-methodology and rights & IP guides, so all of the long-form guitar writing lives in one place. guitar.solutions and guides.guitar.solutions now redirect there.',
  },
  {
    q: 'What is the difference between guitar.solutions and guitar.services?',
    a: 'guitar.solutions is the home of The Signal Chain, the book — the domain now points at its Strumly listing. guitar.services is this directory: a single page linking every surface Jason has published, books included.',
  },
  {
    q: 'Is guitar.services affiliated with Suede Labs AI?',
    a: 'Yes. guitar.services is Jason Colapietro’s personal guitar directory, and Suede Labs AI is the company he founded that builds Strumly, Suede Studio Guitar, and Suede Social.',
  },
  {
    q: 'Do I need an account to read the guides?',
    a: 'No. The guides are plain reference pages — no login required. Strumly’s interactive tools (streaks, saved rigs) do use an account, but reading the guides does not.',
  },
];

const JASON_PERSON_ID = 'https://suedeai.ai/founder#person';
const SUEDE_ORG_ID = 'https://suedeai.ai/#organization';

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://guitar.services/about#webpage',
      url: 'https://guitar.services/about',
      name: 'About guitar.services',
      description:
        'What guitar.services is, how it is put together, and where the engineering-grade signal chain guides live now.',
      about: { '@id': JASON_PERSON_ID },
      isPartOf: { '@id': 'https://guitar.services/#webpage' },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://guitar.services/about#faq',
      mainEntity: FAQ.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
