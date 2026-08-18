// Host-aware site identity for this multi-tenant deployment.
//
// One Next.js app serves two very different properties from the same code:
//
//   - guitar.services — the LIVE host. A hand-curated directory of Jason
//       Colapietro's guitar work. Its pages (app/guitar-services and app/about)
//       render their own header, footer, and complete, self-referential JSON-LD,
//       so the shared layout must NOT inject a competing brand or schema here.
//   - guides.guitar.solutions (and the raw Vercel domain) — a FALLBACK. Every
//       path on these hosts 308-redirects to strumly.suedeai.ai/guides (see
//       next.config.mjs), so the guides pages under app/ only ever render if
//       those redirects are removed. They keep the guides chrome + guides-site
//       JSON-LD.
//
// The 2026-08-18 audit found the shared layout asserting the guides identity
// (WebSite @id https://guides.guitar.solutions/#website, an Organization named
// "Suede Labs", and a "GUITAR.SOLUTIONS" wordmark) on guitar.services — a
// foreign identity on the only live host, and two conflicting org names on one
// page. Resolving identity by host fixes both defects at the source.

export const GUITAR_SERVICES_HOST = 'guitar.services';

// Canonical Suede Labs AI organization node, shared estate-wide. Referenced by
// @id so every surface points at one organization entity rather than minting a
// second, differently-named anonymous org.
export const SUEDE_ORG_ID = 'https://suedeai.ai/#organization';
export const SUEDE_ORG_NAME = 'Suede Labs AI';
export const JASON_PERSON_ID = 'https://suedeai.ai/founder#person';

export type SiteChrome = 'none' | 'guides';

export interface SiteIdentity {
  /** Normalized host this identity represents. */
  host: string;
  /** Which chrome the shared layout renders. 'none' = the page owns it. */
  chrome: SiteChrome;
  /** Global JSON-LD graph for this host, or null when the pages own their schema. */
  jsonLd: Record<string, unknown> | null;
}

export function normalizeHost(host: string | null | undefined): string {
  return (host ?? '')
    .replace(/^www\./, '')
    .split(':')[0]
    .toLowerCase();
}

// Guides-site JSON-LD graph. Only emitted on the guides fallback host. The
// Organization is the canonical "Suede Labs AI" node referenced by @id — there
// is no second org named "Suede Labs".
const GUIDES_JSON_LD: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://guides.guitar.solutions/#website',
      url: 'https://guides.guitar.solutions',
      name: 'guides.guitar.solutions',
      description:
        'Engineering-grade writeups on signal chains, gear pairing, and tone topology.',
      publisher: { '@id': SUEDE_ORG_ID },
      inLanguage: 'en-US',
    },
    {
      '@type': 'Organization',
      '@id': SUEDE_ORG_ID,
      name: SUEDE_ORG_NAME,
      url: 'https://suedeai.ai',
      sameAs: ['https://suedeai.ai', 'https://suedeai.org', 'https://x.com/AISUEDE'],
    },
    {
      '@type': 'Person',
      '@id': JASON_PERSON_ID,
      name: 'Jason Colapietro',
      alternateName: 'Johnny Suede',
      url: 'https://suedeai.ai/founder',
      image: {
        '@type': 'ImageObject',
        url: 'https://suedeai.org/assets/img/founder-jason.png',
        caption: 'Jason Colapietro, Founder of Suede Labs AI',
      },
      jobTitle: 'Founder',
      worksFor: { '@id': SUEDE_ORG_ID },
      sameAs: [
        'https://x.com/johnnysuede',
        'https://suedeai.ai/founder',
        'https://suedeai.org/jason-colapietro/',
        'https://jasoncolapietro.substack.com',
      ],
    },
    {
      '@type': 'Book',
      name: 'The Signal Chain',
      author: { '@id': JASON_PERSON_ID },
      description:
        'A footnoted, engineering-grade reference for guitar signal chains — from pickup output through speaker excursion.',
      url: 'https://guitar.solutions',
      publisher: { '@id': SUEDE_ORG_ID },
      mentions: { '@id': 'https://strumly.suedeai.ai/#software' },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://strumly.suedeai.ai/#software',
      name: 'Strumly',
      url: 'https://strumly.suedeai.ai',
      applicationCategory: 'EducationApplication',
      operatingSystem: 'Web',
      description:
        'Strumly is a 24/7 conversational AI guitar coach — a companion practice app for the signal-chain concepts covered in these guides.',
      creator: { '@id': JASON_PERSON_ID },
    },
  ],
};

export function resolveSiteIdentity(host: string | null | undefined): SiteIdentity {
  const normalized = normalizeHost(host);
  if (normalized === GUITAR_SERVICES_HOST) {
    // The live host. Its pages own their chrome and schema; the shared layout
    // stays out of the way so it never asserts a foreign brand or WebSite id.
    return { host: normalized, chrome: 'none', jsonLd: null };
  }
  // Fallback: the guides site (or the raw Vercel domain). Everything here
  // 308-redirects to strumly.suedeai.ai/guides in production.
  return {
    host: normalized || 'guides.guitar.solutions',
    chrome: 'guides',
    jsonLd: GUIDES_JSON_LD,
  };
}
