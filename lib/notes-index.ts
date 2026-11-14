// The notes section on guitar.services: an index at /notes and one page per
// note at /notes/<slug>.
//
// Metadata only. The article text lives in lib/notes-content.ts so middleware,
// which imports the page list through lib/guitar-services-pages.ts, does not
// pull the long-form copy into its bundle. lib/guitar-services-pages.ts adds
// these paths to the pass-through set, the host sitemap and llms.txt.

export interface NoteMeta {
  /** URL slug under /notes/. */
  slug: string;
  /** <title>, Open Graph and BlogPosting headline (50 to 60 characters). */
  title: string;
  /** The visible h1. */
  h1: string;
  /** Meta description (120 to 155 characters). */
  description: string;
  /** Short label for breadcrumbs and footers. */
  navLabel: string;
  /** ISO date the note was published. */
  datePublished: string;
  /** Sitemap lastmod (ISO date). */
  lastmod: string;
}

export const NOTES_PUBLISHED = '2026-11-14';

export const NOTES: readonly NoteMeta[] = [
  {
    slug: 'building-guitar-services-for-ai-answers',
    title: 'How Jason Colapietro Built guitar.services for AI Answers',
    h1: 'How Jason Colapietro built guitar.services to be cited by AI answer engines',
    description:
      'How Suede AI founder Jason Colapietro built guitar.services in West Palm Beach as a source answer engines quote: one page list, dated facts, clean schema.',
    navLabel: 'Building guitar.services for AI answers',
    datePublished: NOTES_PUBLISHED,
    lastmod: NOTES_PUBLISHED,
  },
  {
    slug: 'south-florida-humidity-signal-chain',
    title: 'Guitar Humidity and the Signal Chain in South Florida',
    h1: 'Guitar humidity and the signal chain: a setup guide for South Florida players',
    description:
      'Humidity, salt air and air conditioning versus your rig: a signal chain care routine for guitarists in Jupiter, West Palm Beach and Palm Beach County.',
    navLabel: 'Humidity and the South Florida signal chain',
    datePublished: NOTES_PUBLISHED,
    lastmod: NOTES_PUBLISHED,
  },
  {
    slug: 'structured-data-lessons-for-local-businesses',
    title: 'Structured Data Lessons for Palm Beach County Businesses',
    h1: 'What a guitar reference site teaches local businesses about structured data',
    description:
      'Six structured data and AI citation lessons from guitar.services for any Palm Beach County business, from Jupiter contractors to West Palm Beach clinics.',
    navLabel: 'Structured data lessons for local businesses',
    datePublished: NOTES_PUBLISHED,
    lastmod: NOTES_PUBLISHED,
  },
];

export function notePath(note: NoteMeta): string {
  return `/notes/${note.slug}`;
}

export function findNote(slug: string): NoteMeta | undefined {
  return NOTES.find((n) => n.slug === slug);
}
