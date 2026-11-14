import type { Metadata } from 'next';
import { GuitarServicesNav } from '@/components/GuitarServicesNav';
import { ReferencePageFooter } from '@/components/ReferencePageFooter';
import { GUITAR_SERVICES_ORIGIN, NOTES_PAGE, WEBSITE_ID, canonicalUrl } from '@/lib/guitar-services-pages';
import { keywordsFor } from '@/lib/keywords';
import { NOTES, notePath } from '@/lib/notes-index';
import { GUITAR_SERVICES_OG_IMAGE, GUITAR_SERVICES_TWITTER_IMAGES } from '@/lib/seo';
import { JASON_PERSON_ID, SUEDE_ORG_ID } from '@/lib/site-identity';

const PAGE_URL = canonicalUrl(NOTES_PAGE);

export const metadata: Metadata = {
  title: { absolute: NOTES_PAGE.title },
  description: NOTES_PAGE.description,
  keywords: keywordsFor('notes'),
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: NOTES_PAGE.title,
    description: NOTES_PAGE.description,
    url: PAGE_URL,
    siteName: 'Guitar Services',
    type: 'website',
    images: [GUITAR_SERVICES_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: NOTES_PAGE.title,
    description: NOTES_PAGE.description,
    images: GUITAR_SERVICES_TWITTER_IMAGES,
  },
};

// Blog listing JSON-LD. Author and publisher are the canonical Person and
// Organization @ids defined on suedeai.ai; nothing here defines either.
const notesIndexSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['CollectionPage', 'Blog'],
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: NOTES_PAGE.title,
      description: NOTES_PAGE.description,
      isPartOf: { '@id': WEBSITE_ID },
      inLanguage: 'en',
      author: { '@id': JASON_PERSON_ID },
      publisher: { '@id': SUEDE_ORG_ID },
      blogPost: NOTES.map((note) => ({ '@id': `${GUITAR_SERVICES_ORIGIN}${notePath(note)}#article` })),
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Guitar Services', item: GUITAR_SERVICES_ORIGIN },
        { '@type': 'ListItem', position: 2, name: NOTES_PAGE.navLabel, item: PAGE_URL },
      ],
    },
  ],
};

export default function NotesPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(notesIndexSchema) }} />
      <GuitarServicesNav current={NOTES_PAGE.path} />

      <header className="mb-14 max-w-2xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest opacity-60">
          guitar.services · notes · West Palm Beach, Florida
        </p>
        <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
          Guitar and AI search notes from West Palm Beach
        </h1>
        <p className="text-lg leading-relaxed opacity-80">
          Long-form notes by Jason Colapietro and the Suede AI team: how this reference site is built
          for answer engines, how to keep a signal chain healthy in South Florida&rsquo;s humidity, and
          what a guitar site can teach a Palm Beach County business about structured data.
        </p>
      </header>

      <section aria-labelledby="notes-heading" className="mb-14">
        <h2 id="notes-heading" className="mb-6 text-2xl font-semibold">
          All notes
        </h2>
        <ul className="grid grid-cols-1 gap-5">
          {NOTES.map((note) => (
            <li key={note.slug} className="rounded-lg border border-current/15 p-5">
              <p className="mb-1 font-mono text-[11px] uppercase tracking-widest opacity-60">
                <time dateTime={note.datePublished}>{note.datePublished}</time> · Jason Colapietro
              </p>
              <h3 className="mb-2 text-lg font-semibold">
                <a href={notePath(note)} className="underline">
                  {note.h1}
                </a>
              </h3>
              <p className="text-sm leading-relaxed opacity-80">{note.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <ReferencePageFooter current={NOTES_PAGE.path} />
    </div>
  );
}
