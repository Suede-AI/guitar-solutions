import { FAQ } from '@/lib/about-content';
import { AUTHOR_BOOKS_CONTEXT, AUTHOR_BOOKS_URL, BOOK_LINEAGE } from '@/lib/guitar-catalog';
import {
  CHORD_FAMILIES,
  GUITARCHORDS_ORIGIN,
  LIBRARY_SCALES,
  LIBRARY_SECTIONS,
  chordsInFamily,
} from '@/lib/chord-scale-library';
import { SURFACES } from '@/lib/guitar-services-content';
import {
  BOOK_PAGE,
  CHORDS_PAGE,
  GUIDES_PAGE,
  GUITAR_SERVICES_PAGES,
  HOME_PAGE,
  TOOLS_PAGE,
  canonicalUrl,
} from '@/lib/guitar-services-pages';
import { PRODUCTS, STRUMLY_TOOL_GROUPS } from '@/lib/practice-tools';
import {
  BOOK_CATALOG_URL,
  BOOK_FACTS,
  BOOK_LISTING_URL,
  BOOK_PARTS,
  BUILDING_YOUR_RIG_CHAPTERS,
  EXPANDED_WORKBOOK,
  FREE_LESSONS_URL,
  PRINT_THE_QUIET,
  SAMPLE_LESSONS,
} from '@/lib/signal-chain-book';
import { GUIDE_GROUPS, GUIDE_SUMMARIES, strumlyGuideUrl } from '@/lib/signal-chain-guides';

export const runtime = 'edge';

// /llms-full.txt for guitar.services, rewritten here by middleware.ts.
//
// The full text of the six pages this host serves, generated from the same
// data modules the pages render (the surface list, the book contents, the
// guide summaries, the chord and scale index, the practice tools and the
// FAQ), so the file an answer engine reads cannot drift from the pages.

function section(title: string, url: string, description: string, body: string): string {
  return `## ${title}\n\nURL: ${url}\n\n${description}\n\n${body.trim()}`;
}

function homeSection(): string {
  const surfaces = SURFACES.map((s) => `- **${s.name}** (${s.kind}, ${s.url}): ${s.desc}`).join('\n');
  return section(
    HOME_PAGE.title,
    canonicalUrl(HOME_PAGE),
    HOME_PAGE.description,
    `Jason Colapietro, founder of Suede AI, is a self-taught guitarist who wrote the books, built the references, and shipped the tools. guitar.services lists that work in one place, and each entry links straight to the site that hosts it.\n\n${surfaces}`,
  );
}

function bookSection(): string {
  const parts = BOOK_PARTS.map(
    (p) => `| ${p.name} | ${p.chapters} | ${p.workshops} |`,
  ).join('\n');
  const rig = BUILDING_YOUR_RIG_CHAPTERS.map((c) => `- Chapter ${c.number}: ${c.title}`).join('\n');
  const lessons = SAMPLE_LESSONS.map(
    (l) => `- Workshop ${l.number}, ${l.song} (${l.artist}): ${l.description} ${l.url}`,
  ).join('\n');
  const workbook = EXPANDED_WORKBOOK.map((s) => `${s.name} (${s.workshops})`).join(', ');
  return section(
    BOOK_PAGE.title,
    canonicalUrl(BOOK_PAGE),
    BOOK_PAGE.description,
    `The Signal Chain is an illustrated history of electric guitar tone: the amplifiers, the pedals, and the players, told alongside a self-taught player's field notes. Each idea lands in tablature.

- Title: ${BOOK_FACTS.title}
- Author: ${BOOK_FACTS.author}
- Imprint: ${BOOK_FACTS.imprint}
- Edition: ${BOOK_FACTS.edition}
- Contents: ${BOOK_FACTS.chapters} chapters and ${BOOK_FACTS.workshops} song workshops, each workshop with full tablature
- Price: ${BOOK_FACTS.price} for the complete edition, as listed on Strumly
- Listing: ${BOOK_LISTING_URL}
- Free to read: ${BOOK_FACTS.freeSampleLessons} sample lessons (${FREE_LESSONS_URL}) and ${BOOK_FACTS.freeEssays} essays (${PRINT_THE_QUIET.url})

### How the contents are organized

| Section | Chapters | Workshops |
| --- | --- | --- |
${parts}

The Expanded Workbook breaks down as ${workbook}.

### Part VIII: Building Your Rig

${rig}

### Free sample lessons

${lessons}

### ${PRINT_THE_QUIET.title}

${PRINT_THE_QUIET.description} The first four: ${PRINT_THE_QUIET.firstEssays.join('; ')}.

### The Guitar Without a Number

${BOOK_LINEAGE} Jason's Strumly catalog: ${BOOK_CATALOG_URL}`,
  );
}

function guidesSection(): string {
  const bySlug = new Map(GUIDE_SUMMARIES.map((g) => [g.slug, g]));
  const groups = GUIDE_GROUPS.map((group) => {
    const guides = group.slugs
      .map((slug) => bySlug.get(slug))
      .filter((g): g is NonNullable<typeof g> => Boolean(g))
      .map(
        (g) =>
          `#### ${g.title}\n\n${strumlyGuideUrl(g.slug)} (${g.category}, published ${g.published})\n\n${g.summary}`,
      )
      .join('\n\n');
    return `### ${group.heading}\n\n${group.intro}\n\n${guides}`;
  }).join('\n\n');
  return section(GUIDES_PAGE.title, canonicalUrl(GUIDES_PAGE), GUIDES_PAGE.description, groups);
}

function chordsSection(): string {
  const families = CHORD_FAMILIES.map(({ family, heading, formula }) => {
    const rows = chordsInFamily(family)
      .map((c) => `| ${c.name} (${c.symbol}) | ${c.shape} | ${c.tones} | ${c.url} |`)
      .join('\n');
    return `### ${heading} (formula ${formula})\n\n| Chord | Shape | Notes | Page |\n| --- | --- | --- | --- |\n${rows}`;
  }).join('\n\n');
  const scales = LIBRARY_SCALES.map(
    (s) => `| ${s.name} | ${s.formula} | ${s.steps} | ${s.character} | ${s.url} |`,
  ).join('\n');
  const tools = LIBRARY_SECTIONS.map((s) => `- ${s.title} (${s.url}): ${s.description}`).join('\n');
  return section(
    CHORDS_PAGE.title,
    canonicalUrl(CHORDS_PAGE),
    CHORDS_PAGE.description,
    `An index to the free chord and scale reference at ${GUITARCHORDS_ORIGIN}, which Suede AI publishes with no accounts and no paywall. Shapes read from the low E string to the high E string in standard tuning (EADGBE); x is a muted string and 0 an open one. Scale steps use W for a whole step, H for a half step, and W+H for three semitones.

${families}

### Scales and modes

| Scale | Formula | Steps | Character | Page |
| --- | --- | --- | --- | --- |
${scales}

### guitarchords.info sections

${tools}`,
  );
}

function toolsSection(): string {
  const products = PRODUCTS.map((p) => `- **${p.name}** (${p.url}): ${p.does}`).join('\n');
  const groups = STRUMLY_TOOL_GROUPS.map(
    (g) =>
      `### ${g.heading}\n\n${g.intro}\n\n${g.tools.map((t) => `- ${t.title} (${t.url}): ${t.description}`).join('\n')}`,
  ).join('\n\n');
  return section(
    TOOLS_PAGE.title,
    canonicalUrl(TOOLS_PAGE),
    TOOLS_PAGE.description,
    `${products}\n\n## Strumly's browser toolkit\n\n${groups}`,
  );
}

function aboutSection(): string {
  const about = GUITAR_SERVICES_PAGES.find((p) => p.path === '/about');
  if (!about) return '';
  const faq = FAQ.map((item) => `### ${item.q}\n\n${item.a}`).join('\n\n');
  return section(
    about.title,
    canonicalUrl(about),
    about.description,
    `guitar.services is a directory, not a publication. It links to what Jason Colapietro has published about guitar: The Signal Chain, its publication history, an engineering-grade signal chain reference, chord and scale libraries, and the tools built on top of them. The long-form signal chain guides live in Strumly's guide index at https://strumly.suedeai.ai/guides.\n\n${AUTHOR_BOOKS_CONTEXT} Current book catalog: ${AUTHOR_BOOKS_URL}\n\n${faq}`,
  );
}

export async function GET() {
  const body = `# guitar.services: full text

> guitar.services is the directory of the guitar work of Jason Colapietro (also known as Johnny Suede), founder of Suede AI: The Signal Chain and its publication history, an engineering-grade signal chain reference, chord and scale libraries, an AI practice coach, an iOS tuner, and a network for musicians. It is a directory, not a repair, setup or lutherie business.

This file carries the full text of the pages this host serves. The shorter index is https://guitar.services/llms.txt, and the source and citation guide is https://guitar.services/ai-instructions.

- Author and builder: Jason Colapietro (https://suedeai.ai/founder)
- Company: Suede AI (https://suedeai.ai), also known as Suede Labs
- Book listing: ${BOOK_LISTING_URL}
- Publication history: ${BOOK_LINEAGE}
- Broader bibliography: ${AUTHOR_BOOKS_CONTEXT} Current book catalog: ${AUTHOR_BOOKS_URL}
- Chord and scale reference: ${GUITARCHORDS_ORIGIN}
- AI guitar coach: https://strumly.suedeai.ai

${homeSection()}

${bookSection()}

${guidesSection()}

${chordsSection()}

${toolsSection()}

${aboutSection()}
`;

  // Some quoted titles and descriptions in the data modules use a dash as a
  // separator. The file reads as plain prose, so it uses a comma instead.
  const text = body.replace(/\s*\u2014\s*/g, ', ');

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
