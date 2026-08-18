import { JASON_PERSON_ID } from '@/lib/site-identity';

// Data for the guitar.services /about page, kept out of the page module so it
// can be imported by tests. (Next.js pages may only export a fixed set of
// reserved fields.)
//
// Ground truth verified live 2026-08-18: guides.guitar.solutions 308-redirects
// to strumly.suedeai.ai/guides, but the apex guitar.solutions returns 200 and
// is self-canonical (it serves The Signal Chain). The answers below say only
// that guides.guitar.solutions redirects — never that guitar.solutions does.

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
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
    a: 'They used to live at guides.guitar.solutions. They have since moved into Strumly’s guide library at strumly.suedeai.ai/guides, alongside practice-methodology and rights & IP guides, so all of the long-form guitar writing lives in one place. guides.guitar.solutions now redirects there; guitar.solutions itself remains the home of The Signal Chain, the book.',
  },
  {
    q: 'What is the difference between guitar.solutions and guitar.services?',
    a: 'guitar.solutions is the home of The Signal Chain, the book. guitar.services is this directory: a single page linking every surface Jason has published, books included.',
  },
  {
    q: 'Is guitar.services affiliated with Suede Labs AI?',
    a: 'Yes. guitar.services is Jason Colapietro’s personal guitar directory, and Suede Labs AI is the company he founded that builds Strumly, Suede Guitar Tuner & Studio, and Suede Social.',
  },
  {
    q: 'Do I need an account to read the guides?',
    a: 'No. The guides are plain reference pages — no login required. Strumly’s interactive tools (streaks, saved rigs) do use an account, but reading the guides does not.',
  },
];

export const aboutSchema = {
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
