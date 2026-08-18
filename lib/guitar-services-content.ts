import { JASON_PERSON_ID, SUEDE_ORG_ID, SUEDE_ORG_NAME } from '@/lib/site-identity';

// Data for the guitar.services landing page, kept out of the page module so it
// can be imported by tests. (Next.js pages may only export a fixed set of
// reserved fields — arbitrary named exports fail the build's type check.)

export interface Surface {
  name: string;
  kind: string;
  url: string;
  desc: string;
}

export const SURFACES: Surface[] = [
  {
    name: 'The Signal Chain',
    kind: 'Book',
    url: 'https://guitar.solutions',
    desc: 'A life in six strings. Guitar tone, memoir, and method, built around the electric guitar signal chain.',
  },
  {
    name: 'The Guitar Without a Number',
    kind: 'Book',
    url: 'https://guitar.solutions/catalog.html',
    desc: 'Memoir-driven instruction for the self-taught guitarist, with theory, tone, artist songbooks, and a chapter on owning the rights to your music.',
  },
  {
    name: 'Signal Chain Guides',
    kind: 'Reference',
    url: 'https://guides.guitar.solutions',
    desc: 'Engineering-grade reference for guitar signal chains: impedance, gain staging, power, and effects topology.',
  },
  {
    name: 'Guitar Chords',
    kind: 'Reference',
    url: 'https://guitarchords.info',
    desc: 'Chord voicings, scale patterns, and technique pages you can read on any device.',
  },
  {
    name: 'Strumly',
    kind: 'AI Coach',
    url: 'https://strumly.suedeai.ai',
    desc: 'A conversational guitar coach with a free toolkit: tuner, metronome, chord and scale libraries, ear training.',
  },
  {
    name: 'Suede Guitar Tuner & Studio',
    kind: 'iOS App',
    url: 'https://fretpulse.suedeai.ai',
    desc: 'Holistic guitar care on iOS: tuner, chords, and instrument health in one app.',
  },
  {
    name: 'Suede Social',
    kind: 'Community',
    url: 'https://social.suedeai.ai',
    desc: 'A network for musicians: clips, rig profiles with real tone data, practice threads, and uploads that can register as IP assets.',
  },
];

// One WebPage, one Person, one Organization — the Organization is the canonical
// "Suede Labs AI" node (SUEDE_ORG_ID), so this page never asserts a second org
// name or a foreign WebSite @id.
export const guitarServicesSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://guitar.services/#webpage',
      url: 'https://guitar.services',
      name: 'Guitar Services: Books, Guides, and Tools by Jason Colapietro',
      description:
        'The guitar work of Jason Colapietro, founder of Suede Labs AI: books, references, and AI practice tools.',
      about: { '@id': JASON_PERSON_ID },
    },
    {
      '@type': 'Person',
      '@id': JASON_PERSON_ID,
      name: 'Jason Colapietro',
      alternateName: 'Johnny Suede',
      url: 'https://suedeai.ai/founder',
      worksFor: { '@id': SUEDE_ORG_ID },
      sameAs: ['https://guitar.services', 'https://github.com/JasonColapietro', 'https://x.com/johnnysuede'],
    },
    {
      '@type': 'Organization',
      '@id': SUEDE_ORG_ID,
      name: SUEDE_ORG_NAME,
      url: 'https://suedeai.ai',
      founder: { '@id': JASON_PERSON_ID },
    },
  ],
};
