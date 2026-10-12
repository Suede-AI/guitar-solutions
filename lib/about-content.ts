import { ABOUT_PAGE, GUITAR_SERVICES_ORIGIN, WEBSITE_ID } from '@/lib/guitar-services-pages';
import { JASON_PERSON_ID } from '@/lib/site-identity';
import { BOOK_LINEAGE } from '@/lib/guitar-catalog';
import { BOOK_CATALOG_URL, BOOK_LISTING_URL } from '@/lib/signal-chain-book';

// Data for the guitar.services /about page, kept out of the page module so it
// can be imported by tests. (Next.js pages may only export a fixed set of
// reserved fields.)
//
// Ground truth verified live 2026-08-18: guides.guitar.solutions 308-redirects
// to strumly.suedeai.ai/guides, but the apex guitar.solutions returns 200 and
// is self-canonical (it serves The Signal Chain). The answers below say only
// that guides.guitar.solutions redirects — never that guitar.solutions does.
//
// Re-checked live 2026-10-11: the apex is still 200 and self-canonical. Its
// page says the reference and the book's field notes "now live inside
// Strumly", and the book's listing is https://strumly.suedeai.ai/book. Strumly's
// /streak is "tracked on this device, no sign-up required" and /rig "saves in
// your browser, no sign-up". guitar.services serves the pages listed in
// lib/guitar-services-pages.ts.

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
  {
    q: 'Is guitar.services free?',
    a: `The signal chain guides, the chord and scale references, and Strumly’s practice toolkit (tuner, metronome, ear training) are free to use. The Signal Chain’s complete edition is a paid book; its listing is at ${BOOK_LISTING_URL}. The four sample lessons and Print the Quiet essays are free to read.`,
  },
  {
    q: 'How does The Guitar Without a Number relate to The Signal Chain?',
    a: `${BOOK_LINEAGE} The publication history is at ${BOOK_CATALOG_URL}.`,
  },
  {
    q: 'Who writes the guides?',
    a: 'Jason Colapietro, founder of Suede AI. He is a self-taught guitarist and the author of The Signal Chain; the guides are his writing, not aggregated or crowdsourced.',
  },
  {
    q: 'How is this directory curated?',
    a: 'By hand. The list of surfaces on the home page is maintained directly by Jason as new guitar work ships. There is no submission form, no ads, and no third-party listings.',
  },
  {
    q: 'Where did the engineering-grade signal chain guides go?',
    a: 'They used to live at guides.guitar.solutions. They have since moved into Strumly’s guide library at strumly.suedeai.ai/guides, alongside practice-methodology and rights & IP guides, so the long-form guitar writing lives in one place. guides.guitar.solutions now redirects there. The Signal Chain, the book, also started at guitar.solutions; its listing is now at strumly.suedeai.ai/book.',
  },
  {
    q: 'What is the difference between guitar.solutions and guitar.services?',
    a: 'guitar.solutions is where The Signal Chain and the engineering-grade reference started; both now live inside Strumly, and the book’s listing is at strumly.suedeai.ai/book. guitar.services is this directory: a home page linking every surface Jason has published, four reference pages that summarize the book’s contents, the signal chain guides, the chord and scale library, and the practice tools, and this about page.',
  },
  {
    q: 'Is guitar.services affiliated with Suede AI?',
    a: 'Yes. guitar.services is Jason Colapietro’s personal guitar directory, and Suede AI is the company he founded that builds Strumly, Suede Guitar Tuner & Studio, and Suede Social.',
  },
  {
    q: 'Do I need an account to read the guides?',
    a: 'No. The guides are plain reference pages, with no login required. Strumly’s practice streak and rig builder need no sign-up either: the streak is tracked on your device, and the rig saves in your browser.',
  },
];

export const aboutSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': 'https://guitar.services/about#webpage',
      url: 'https://guitar.services/about',
      name: ABOUT_PAGE.title,
      description: ABOUT_PAGE.description,
      about: { '@id': JASON_PERSON_ID },
      isPartOf: { '@id': WEBSITE_ID },
      inLanguage: 'en',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://guitar.services/about#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Guitar Services', item: GUITAR_SERVICES_ORIGIN },
        { '@type': 'ListItem', position: 2, name: ABOUT_PAGE.navLabel, item: 'https://guitar.services/about' },
      ],
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
