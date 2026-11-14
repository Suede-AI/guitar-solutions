import {
  GUITAR_SERVICES_ORIGIN,
  NOTES_PAGE,
  NOTE_PAGES,
  WEBSITE_ID,
  canonicalUrl,
  type GuitarServicesPage,
} from './guitar-services-pages';
import { notePath, type NoteMeta } from './notes-index';
import { GUITAR_SERVICES_OG_IMAGE } from './seo';
import { JASON_PERSON_ID, SUEDE_ORG_ID } from './site-identity';

export function notePage(note: NoteMeta): GuitarServicesPage {
  return NOTE_PAGES.find((p) => p.path === notePath(note)) as GuitarServicesPage;
}

/** Palm Beach County places the notes are written from and for. */
const SPATIAL_COVERAGE = ['West Palm Beach', 'Jupiter', 'Palm Beach Gardens', 'Juno Beach', 'Tequesta'].map(
  (name) => ({
    '@type': 'Place',
    name: `${name}, Florida`,
    containedInPlace: { '@type': 'AdministrativeArea', name: 'Palm Beach County, Florida' },
  }),
);

/**
 * BlogPosting + WebPage + BreadcrumbList for one note. Author and publisher
 * reference the canonical Person and Organization @ids; no Person or
 * Organization node is defined here.
 */
export function noteSchema(note: NoteMeta): Record<string, unknown> {
  const url = canonicalUrl(notePage(note));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: note.title,
        description: note.description,
        isPartOf: { '@id': WEBSITE_ID },
        inLanguage: 'en',
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: note.title,
        description: note.description,
        url,
        datePublished: note.datePublished,
        dateModified: note.lastmod,
        inLanguage: 'en',
        author: { '@id': JASON_PERSON_ID },
        publisher: { '@id': SUEDE_ORG_ID },
        mainEntityOfPage: { '@id': `${url}#webpage` },
        isPartOf: { '@id': `${canonicalUrl(NOTES_PAGE)}#webpage` },
        image: GUITAR_SERVICES_OG_IMAGE.url,
        spatialCoverage: SPATIAL_COVERAGE,
        about: [{ '@type': 'Place', name: 'West Palm Beach, Florida' }, { '@type': 'Place', name: 'Jupiter, Florida' }],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Guitar Services', item: GUITAR_SERVICES_ORIGIN },
          { '@type': 'ListItem', position: 2, name: NOTES_PAGE.navLabel, item: canonicalUrl(NOTES_PAGE) },
          { '@type': 'ListItem', position: 3, name: note.navLabel, item: url },
        ],
      },
    ],
  };
}

