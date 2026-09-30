// Central meta keywords map. Every indexable page on this project reads its
// `keywords` from here. Next.js replaces (does not merge) a parent's keywords
// when a child page sets its own, so each list below is complete on its own.
//
// Terms come from the 2026-09-08 estate keyword research (guitar and
// musician_tools groups, plus brand) and from what each page actually lists.

export const BRAND_KEYWORDS = ['Suede AI', 'Suede Labs AI', 'Jason Colapietro'] as const;

const PAGE_KEYWORDS = {
  // Root layout default. Only the guides fallback host inherits it, and that
  // host redirects every published URL to Strumly, so it rarely renders.
  default: [
    'guitar signal chain',
    'guitar signal chain guide',
    'guitar impedance',
    'gain staging',
    'pedalboard order',
    'true bypass vs buffered',
    'guitar effects loop',
    'guitar cable capacitance',
  ],
  // guitar.services home: the directory of books, references, and tools.
  'guitar-services': [
    'guitar services',
    'guitar books',
    'guitar signal chain',
    'guitar chords',
    'guitar chords for beginners',
    'learn guitar online',
    'guitar lessons',
    'ai guitar coach',
    'guitar tuner app',
    'guitar care app',
    'apps for musicians',
    'ai for musicians',
    'self-taught guitarist',
    'Strumly',
    'GuitarHub',
    'FretPulse',
  ],
  // guitar.services/about: what the directory is and where the guides moved.
  about: [
    'about guitar services',
    'guitar services',
    'guitar signal chain guides',
    'guitar books',
    'guitar chords',
    'guitar lessons',
    'ai guitar coach',
    'Strumly guides',
  ],
} as const satisfies Record<string, readonly string[]>;

export type KeywordPage = keyof typeof PAGE_KEYWORDS;

/** Page terms first, brand terms appended, case-insensitive dedupe. */
export function keywordsFor(page: KeywordPage): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const term of [...PAGE_KEYWORDS[page], ...BRAND_KEYWORDS]) {
    const key = term.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(term);
  }
  return out;
}

export const KEYWORD_PAGES = Object.keys(PAGE_KEYWORDS) as KeywordPage[];
