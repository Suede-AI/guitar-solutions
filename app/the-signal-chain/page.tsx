import type { Metadata } from 'next';
import { GuitarServicesNav } from '@/components/GuitarServicesNav';
import { ReferencePageFooter } from '@/components/ReferencePageFooter';
import {
  BOOK_PAGE,
  CHORDS_PAGE,
  GUIDES_PAGE,
  TOOLS_PAGE,
  canonicalUrl,
  referencePageSchema,
} from '@/lib/guitar-services-pages';
import { keywordsFor } from '@/lib/keywords';
import { GUITAR_SERVICES_OG_IMAGE, GUITAR_SERVICES_TWITTER_IMAGES } from '@/lib/seo';
import {
  BOOK_CATALOG_URL,
  BOOK_ENTITY_ID,
  BOOK_FACTS,
  BOOK_LISTING_URL,
  BOOK_ORIGINAL_HOME_URL,
  BOOK_PARTS,
  BUILDING_YOUR_RIG_CHAPTERS,
  EXPANDED_WORKBOOK,
  FREE_LESSONS_URL,
  PRINT_THE_QUIET,
  SAMPLE_LESSONS,
} from '@/lib/signal-chain-book';

const PAGE_URL = canonicalUrl(BOOK_PAGE);

export const metadata: Metadata = {
  title: { absolute: BOOK_PAGE.title },
  description: BOOK_PAGE.description,
  keywords: keywordsFor('the-signal-chain'),
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: BOOK_PAGE.title,
    description: BOOK_PAGE.description,
    url: PAGE_URL,
    siteName: 'Guitar Services',
    type: 'website',
    images: [GUITAR_SERVICES_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: BOOK_PAGE.title,
    description: BOOK_PAGE.description,
    images: GUITAR_SERVICES_TWITTER_IMAGES,
  },
};

const schema = referencePageSchema(BOOK_PAGE, { about: { '@id': BOOK_ENTITY_ID } });

// A summary of the book's contents as its Strumly listing sets them out, not a
// product page: lib/signal-chain-book.ts says what the listing does and does
// not state.
export default function SignalChainContentsPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <GuitarServicesNav current={BOOK_PAGE.path} />

      <header className="mb-14 max-w-2xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest opacity-60">
          guitar.services · contents summary
        </p>
        <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
          The Signal Chain book: contents and four free sample lessons
        </h1>
        <p className="mb-4 text-lg leading-relaxed opacity-80">
          What is in Jason Colapietro&rsquo;s book, part by part, summarized from its listing on
          Strumly.
        </p>
        <p className="text-lg leading-relaxed opacity-80">
          The listing calls it an illustrated history of electric guitar tone: the amplifiers, the
          pedals, and the players who bent electricity into a voice, told alongside a self-taught
          player&rsquo;s field notes. Jason wrote it as Johnny Suede, and every idea in it lands in
          tablature you can play: {BOOK_FACTS.chapters} chapters and {BOOK_FACTS.workshops} song
          workshops.
        </p>
        <p className="mt-6">
          <a href={BOOK_LISTING_URL} className="underline">
            Open the full listing on Strumly
          </a>
        </p>
      </header>

      <section aria-labelledby="facts-heading" className="mb-14">
        <h2 id="facts-heading" className="mb-4 text-2xl font-semibold">
          From the listing
        </h2>
        <ul className="grid grid-cols-1 gap-3 text-base leading-relaxed md:grid-cols-2">
          <li className="rounded-lg border border-current/15 p-4">
            <span className="block font-mono text-[11px] uppercase tracking-widest opacity-60">Author</span>
            {BOOK_FACTS.author}
          </li>
          <li className="rounded-lg border border-current/15 p-4">
            <span className="block font-mono text-[11px] uppercase tracking-widest opacity-60">Imprint</span>
            {BOOK_FACTS.imprint}. Jason wrote, illustrated, and hand-typeset every page.
          </li>
          <li className="rounded-lg border border-current/15 p-4">
            <span className="block font-mono text-[11px] uppercase tracking-widest opacity-60">Contents</span>
            {BOOK_FACTS.chapters} chapters and {BOOK_FACTS.workshops} workshops, each workshop with
            full tablature. The listing calls this {BOOK_FACTS.edition.toLowerCase()}.
          </li>
          <li className="rounded-lg border border-current/15 p-4">
            <span className="block font-mono text-[11px] uppercase tracking-widest opacity-60">Price</span>
            {BOOK_FACTS.price} for the complete edition, as listed on Strumly.
          </li>
          <li className="rounded-lg border border-current/15 p-4">
            <span className="block font-mono text-[11px] uppercase tracking-widest opacity-60">Free to read</span>
            {BOOK_FACTS.freeSampleLessons} sample lessons from the book and {BOOK_FACTS.freeEssays}{' '}
            essays on tone, listed below.
          </li>
          <li className="rounded-lg border border-current/15 p-4">
            <span className="block font-mono text-[11px] uppercase tracking-widest opacity-60">Listing</span>
            <a href={BOOK_LISTING_URL} className="underline">
              strumly.suedeai.ai/book
            </a>
            . The book started at{' '}
            <a href={BOOK_ORIGINAL_HOME_URL} className="underline">
              guitar.solutions
            </a>
            .
          </li>
        </ul>
      </section>

      <section aria-labelledby="arc-heading" className="mb-14 max-w-3xl">
        <h2 id="arc-heading" className="mb-4 text-2xl font-semibold">
          What it covers
        </h2>
        <div className="space-y-4 text-base leading-relaxed opacity-80">
          <p>
            The history runs from the Rickenbacker Frying Pan and Leo Fender&rsquo;s tweed to
            fuzz, the wah, the Big Muff, high gain, and digital modeling, with deep dives on
            Hendrix, Clapton, Page, Gilmour, Van Halen, SRV, and The Edge.
          </p>
          <p>
            Every workshop follows the same format: the real rig, a tone recipe, the theory
            underneath, and the tab. The songs run from Charlie Christian&rsquo;s Solo Flight to
            Purple Haze, Comfortably Numb, Pride and Joy, and Smells Like Teen Spirit.
          </p>
        </div>
      </section>

      <section aria-labelledby="contents-heading" className="mb-14">
        <h2 id="contents-heading" className="mb-4 text-2xl font-semibold">
          How the contents are organized
        </h2>
        <p className="mb-6 max-w-3xl text-base leading-relaxed opacity-80">
          The listing groups the {BOOK_FACTS.chapters} chapters and {BOOK_FACTS.workshops} workshops
          into these sections. Parts I through VII trace the history and the players, Part VIII
          turns to building a rig, and the Expanded Workbook collects songs that had no natural
          home in the original chapters, organized by era.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-current/20">
                <th scope="col" className="py-2 pr-4 font-semibold">Section</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Chapters</th>
                <th scope="col" className="py-2 font-semibold">Workshops</th>
              </tr>
            </thead>
            <tbody>
              {BOOK_PARTS.map((part) => (
                <tr key={part.name} className="border-b border-current/10">
                  <th scope="row" className="py-2 pr-4 font-normal">{part.name}</th>
                  <td className="py-2 pr-4">{part.chapters || '–'}</td>
                  <td className="py-2">{part.workshops || '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed opacity-70">
          The Expanded Workbook&rsquo;s {EXPANDED_WORKBOOK.reduce((n, s) => n + s.workshops, 0)}{' '}
          workshops break down as{' '}
          {EXPANDED_WORKBOOK.map((s) => `${s.name} (${s.workshops})`).join(', ')}.
        </p>
      </section>

      <section aria-labelledby="rig-heading" className="mb-14 max-w-3xl">
        <h2 id="rig-heading" className="mb-4 text-2xl font-semibold">
          Part VIII and the signal chain guides
        </h2>
        <p className="mb-4 text-base leading-relaxed opacity-80">
          Part VIII, Building Your Rig, is the practical end of the book:
        </p>
        <ul className="mb-4 list-disc space-y-1 pl-6 text-base leading-relaxed opacity-80">
          {BUILDING_YOUR_RIG_CHAPTERS.map((c) => (
            <li key={c.number}>
              Chapter {c.number}: {c.title}
            </li>
          ))}
        </ul>
        <p className="text-base leading-relaxed opacity-80">
          The free{' '}
          <a href={GUIDES_PAGE.path} className="underline">
            signal chain guides
          </a>{' '}
          cover the same ground in shorter form: pedal order, gain staging, buffers, and power.
          Read a guide for the rule, and the book for the history and the songs behind it.
        </p>
      </section>

      <section aria-labelledby="samples-heading" className="mb-14">
        <h2 id="samples-heading" className="mb-4 text-2xl font-semibold">
          Free to read on Strumly
        </h2>
        <p className="mb-6 max-w-3xl text-base leading-relaxed opacity-80">
          Four workshops from the complete edition are free to read on Strumly, in the same format
          as every workshop in the book.{' '}
          <a href={FREE_LESSONS_URL} className="underline">
            All four free lessons
          </a>
          .
        </p>
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {SAMPLE_LESSONS.map((lesson) => (
            <li key={lesson.url} className="rounded-lg border border-current/15 p-5">
              <p className="mb-1 font-mono text-[11px] uppercase tracking-widest opacity-60">
                Workshop {lesson.number} · {lesson.artist}
              </p>
              <h3 className="mb-2 text-lg font-semibold">
                <a href={lesson.url} className="underline">
                  {lesson.song}
                </a>
              </h3>
              <p className="text-sm leading-relaxed opacity-70">{lesson.description}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 max-w-3xl rounded-lg border border-current/15 p-5">
          <h3 className="mb-2 text-lg font-semibold">
            <a href={PRINT_THE_QUIET.url} className="underline">
              {PRINT_THE_QUIET.title}
            </a>
          </h3>
          <p className="mb-3 text-sm leading-relaxed opacity-70">{PRINT_THE_QUIET.description}</p>
          <p className="text-sm leading-relaxed opacity-70">
            The first four: {PRINT_THE_QUIET.firstEssays.join('; ')}.
          </p>
        </div>
      </section>

      <section aria-labelledby="lineage-heading" className="mb-14 max-w-3xl">
        <h2 id="lineage-heading" className="mb-4 text-2xl font-semibold">
          The Guitar Without a Number
        </h2>
        <p className="text-base leading-relaxed opacity-80">
          The Signal Chain grew out of an earlier self-taught instruction thread, once published as
          The Guitar Without a Number, which now lives inside it. Jason&rsquo;s{' '}
          <a href={BOOK_CATALOG_URL} className="underline">
            full catalog on Strumly
          </a>{' '}
          lists his other books, essays, and apps.
        </p>
      </section>

      <section aria-labelledby="next-heading" className="max-w-3xl">
        <h2 id="next-heading" className="mb-4 text-2xl font-semibold">
          Play it, not just read it
        </h2>
        <p className="text-base leading-relaxed opacity-80">
          The workshops are songs, so they need chord shapes, scales, and a way to practice.
          The{' '}
          <a href={CHORDS_PAGE.path} className="underline">
            chord and scale library
          </a>{' '}
          has the shapes and the{' '}
          <a href={TOOLS_PAGE.path} className="underline">
            practice tools page
          </a>{' '}
          lists the tuners, metronomes, and AI coach to practice them with.
        </p>
      </section>

      <ReferencePageFooter current={BOOK_PAGE.path} />
    </div>
  );
}
