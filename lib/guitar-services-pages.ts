// The indexable pages guitar.services serves, in one list.
//
// middleware.ts lets exactly these paths through on the guitar.services host
// (everything else there is a noindex 404), the host sitemap and llms.txt are
// generated from it, and the shared page nav renders it. One list means a page
// cannot be added to the nav without also reaching the sitemap, or be routed
// without being linked.

export const GUITAR_SERVICES_ORIGIN = 'https://guitar.services';

export interface GuitarServicesPage {
  /** Path on guitar.services. '/' is the home page. */
  path: string;
  /** Short label for the shared nav. */
  navLabel: string;
  /** Page title, used for the <title>, Open Graph, and JSON-LD name. */
  title: string;
  /** Meta description, also used in llms.txt. */
  description: string;
  /** Sitemap lastmod (ISO date). */
  lastmod: string;
  /** Sitemap priority. */
  priority: number;
}

export const HOME_PAGE: GuitarServicesPage = {
  path: '/',
  navLabel: 'Home',
  title: 'Guitar Services: Books, Guides, and Tools by Jason Colapietro',
  description:
    'The guitar work of Jason Colapietro, founder of Suede AI: two published books, a signal chain reference, chord and scale libraries, and AI practice tools.',
  lastmod: '2026-10-11',
  priority: 1.0,
};

export const ABOUT_PAGE: GuitarServicesPage = {
  path: '/about',
  navLabel: 'About',
  title: 'About guitar.services',
  description:
    'What guitar.services is, how it is put together, and where the engineering-grade signal chain guides live now.',
  lastmod: '2026-10-11',
  priority: 0.6,
};

export const BOOK_PAGE: GuitarServicesPage = {
  path: '/the-signal-chain',
  navLabel: 'The Signal Chain contents',
  title: 'The Signal Chain Contents, Summarized: 66 Chapters, 111 Workshops',
  description:
    'The contents of Jason Colapietro’s The Signal Chain, summarized from its Strumly listing: chapters and song workshops by part, and four free sample lessons.',
  lastmod: '2026-10-11',
  priority: 0.8,
};

export const GUIDES_PAGE: GuitarServicesPage = {
  path: '/signal-chain-guides',
  navLabel: 'Signal chain guides',
  title: 'Guitar Signal Chain Guides: Eight References, Summarized',
  description:
    'Eight guitar signal chain guides, summarized: topology, impedance, cable capacitance, true bypass, pedal order, gain staging, effects loops, and power.',
  lastmod: '2026-10-11',
  priority: 0.8,
};

export const CHORDS_PAGE: GuitarServicesPage = {
  path: '/chords-and-scales',
  navLabel: 'Chords and scales',
  title: 'Guitar Chord and Scale Library: 39 Chords and 12 Scales',
  description:
    'Every chord and scale on guitarchords.info in one index: 39 chord shapes with chord tones and formulas, and 12 scales and modes with their step patterns.',
  lastmod: '2026-10-11',
  priority: 0.8,
};

export const TOOLS_PAGE: GuitarServicesPage = {
  path: '/practice-tools',
  navLabel: 'Practice tools',
  title: 'AI Guitar Practice Tools: Coach, Tuners, Trainers, and Lessons',
  description:
    'Guitar practice tools from Suede AI: the Strumly AI coach and its browser toolkit, Suede Guitar Tuner & Studio, GuitarHub lessons, and Suede Sing for voice.',
  lastmod: '2026-10-11',
  priority: 0.8,
};

/** The four reference pages that go one level deeper than the home page. */
export const REFERENCE_PAGES: readonly GuitarServicesPage[] = [
  BOOK_PAGE,
  GUIDES_PAGE,
  CHORDS_PAGE,
  TOOLS_PAGE,
];

/** Every indexable page, in nav and sitemap order. */
export const GUITAR_SERVICES_PAGES: readonly GuitarServicesPage[] = [
  HOME_PAGE,
  ...REFERENCE_PAGES,
  ABOUT_PAGE,
];

/** Paths that are real local routes (everything except '/', which middleware rewrites). */
export const PASS_THROUGH_PATHS: ReadonlySet<string> = new Set(
  GUITAR_SERVICES_PAGES.filter((p) => p.path !== '/').map((p) => p.path),
);

/** Canonical URL in the form the site serves it: no trailing slash, bare origin for home. */
export function canonicalUrl(page: GuitarServicesPage): string {
  return page.path === '/' ? GUITAR_SERVICES_ORIGIN : `${GUITAR_SERVICES_ORIGIN}${page.path}`;
}

/**
 * JSON-LD for a reference page: one WebPage keyed to guitar.services, part of
 * the home page's WebPage, plus a breadcrumb back to home. It defines no
 * Person or Organization; the home page owns those.
 */
export function referencePageSchema(
  page: GuitarServicesPage,
  extra: Record<string, unknown> = {},
): Record<string, unknown> {
  const url = canonicalUrl(page);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        isPartOf: { '@id': `${GUITAR_SERVICES_ORIGIN}/#webpage` },
        ...extra,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Guitar Services', item: GUITAR_SERVICES_ORIGIN },
          { '@type': 'ListItem', position: 2, name: page.navLabel, item: url },
        ],
      },
    ],
  };
}
