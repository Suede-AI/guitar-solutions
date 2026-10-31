import type { Metadata } from 'next';
import { GuitarServicesNav } from '@/components/GuitarServicesNav';
import { ReferencePageFooter } from '@/components/ReferencePageFooter';
import {
  BOOK_PAGE,
  CHORDS_PAGE,
  TOOLS_PAGE,
  canonicalUrl,
  referencePageSchema,
} from '@/lib/guitar-services-pages';
import {
  CHORD_FAMILIES,
  GUITARCHORDS_ORIGIN,
  LIBRARY_CHORDS,
  LIBRARY_SCALES,
  LIBRARY_SECTIONS,
  chordsInFamily,
} from '@/lib/chord-scale-library';
import { keywordsFor } from '@/lib/keywords';
import { GUITAR_SERVICES_OG_IMAGE, GUITAR_SERVICES_TWITTER_IMAGES } from '@/lib/seo';

const PAGE_URL = canonicalUrl(CHORDS_PAGE);

export const metadata: Metadata = {
  title: { absolute: CHORDS_PAGE.title },
  description: CHORDS_PAGE.description,
  keywords: keywordsFor('chords-and-scales'),
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: CHORDS_PAGE.title,
    description: CHORDS_PAGE.description,
    url: PAGE_URL,
    siteName: 'Guitar Services',
    type: 'website',
    images: [GUITAR_SERVICES_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: CHORDS_PAGE.title,
    description: CHORDS_PAGE.description,
    images: GUITAR_SERVICES_TWITTER_IMAGES,
  },
};

const schema = referencePageSchema(CHORDS_PAGE);

const [HOME_SECTION, CHORDS_SECTION, SCALES_SECTION, ...UTILITY_SECTIONS] = LIBRARY_SECTIONS;

export default function ChordsAndScalesPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <GuitarServicesNav current={CHORDS_PAGE.path} />

      <header className="mb-14 max-w-2xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest opacity-60">
          guitar.services · chord and scale library
        </p>
        <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
          Guitar chord and scale library: {LIBRARY_CHORDS.length} chords and{' '}
          {LIBRARY_SCALES.length} scales
        </h1>
        <p className="text-lg leading-relaxed opacity-80">
          This is the index to the free chord and scale reference at{' '}
          <a href={HOME_SECTION.url} className="underline">
            guitarchords.info
          </a>
          , which Suede AI publishes with no accounts and no paywall. Each row gives the shape, the notes, and the formula,
          so you can find the chord you need at a glance. Every name links to its full page, with a
          fingering diagram, string-by-string fingering chart, intervals, and related chords.
        </p>
      </header>

      <section aria-labelledby="read-heading" className="mb-14 max-w-3xl">
        <h2 id="read-heading" className="mb-4 text-2xl font-semibold">
          How to read the tables
        </h2>
        <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed opacity-80">
          <li>
            <strong>Shape</strong> reads from the low E string to the high E string in standard
            tuning (EADGBE). <code>x</code> is a muted string, <code>0</code> an open string, and
            any other digit the fret to press. C major, <code>x32010</code>, mutes the low E and
            plays the A string at the 3rd fret.
          </li>
          <li>
            <strong>Formula</strong> names each note by its degree above the root: 1 is the root,
            3 a major 3rd, b3 a minor 3rd, 5 a perfect 5th, and b7 a minor 7th.
          </li>
          <li>
            <strong>Steps</strong> are the gaps between neighbouring scale notes: W is a whole
            step, H a half step, and W+H three semitones.
          </li>
        </ul>
      </section>

      <section aria-labelledby="chords-heading" className="mb-14">
        <h2 id="chords-heading" className="mb-2 text-2xl font-semibold">
          Chords
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-relaxed opacity-70">
          {LIBRARY_CHORDS.length} shapes in seven families, all in standard tuning. The full chart
          is at{' '}
          <a href={CHORDS_SECTION.url} className="underline">
            {CHORDS_SECTION.title}
          </a>
          .
        </p>
        {CHORD_FAMILIES.map(({ family, heading, formula }) => {
          const chords = chordsInFamily(family);
          return (
            <div key={family} className="mb-10">
              <h3 className="mb-1 text-lg font-semibold">{heading}</h3>
              <p className="mb-3 text-sm opacity-60">
                Formula {formula} · {chords.length} shapes
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-current/20">
                      <th scope="col" className="py-2 pr-4 font-semibold">Chord</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Symbol</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Shape</th>
                      <th scope="col" className="py-2 pr-4 font-semibold">Notes</th>
                      <th scope="col" className="py-2 font-semibold">Formula</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chords.map((chord) => (
                      <tr key={chord.slug} className="border-b border-current/10">
                        <th scope="row" className="py-2 pr-4 font-normal">
                          <a href={chord.url} className="underline">
                            {chord.name}
                          </a>
                        </th>
                        <td className="py-2 pr-4">{chord.symbol}</td>
                        <td className="py-2 pr-4 font-mono">{chord.shape}</td>
                        <td className="py-2 pr-4">{chord.tones}</td>
                        <td className="py-2">{chord.formula}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </section>

      <section aria-labelledby="scales-heading" className="mb-14">
        <h2 id="scales-heading" className="mb-2 text-2xl font-semibold">
          Scales and modes
        </h2>
        <p className="mb-6 max-w-3xl text-base leading-relaxed opacity-70">
          Each scale page lists its notes in all 12 keys, the root frets on the 6th and 5th
          strings, and the fretboard pattern from the open strings to fret 15. The overview is at{' '}
          <a href={SCALES_SECTION.url} className="underline">
            {SCALES_SECTION.title}
          </a>
          .
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-current/20">
                <th scope="col" className="py-2 pr-4 font-semibold">Scale</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Formula</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Steps</th>
                <th scope="col" className="py-2 font-semibold">Sound and use</th>
              </tr>
            </thead>
            <tbody>
              {LIBRARY_SCALES.map((scale) => (
                <tr key={scale.slug} className="border-b border-current/10">
                  <th scope="row" className="py-2 pr-4 font-normal">
                    <a href={scale.url} className="underline">
                      {scale.name}
                    </a>
                  </th>
                  <td className="py-2 pr-4">{scale.formula}</td>
                  <td className="py-2 pr-4 font-mono">{scale.steps}</td>
                  <td className="py-2">{scale.character}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="tools-heading" className="mb-14">
        <h2 id="tools-heading" className="mb-4 text-2xl font-semibold">
          Tune up and keep time
        </h2>
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {UTILITY_SECTIONS.map((section) => (
            <li key={section.url} className="rounded-lg border border-current/15 p-5">
              <h3 className="mb-2 text-lg font-semibold">
                <a href={section.url} className="underline">
                  {section.title}
                </a>
              </h3>
              <p className="text-sm leading-relaxed opacity-70">{section.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="next-heading" className="max-w-3xl">
        <h2 id="next-heading" className="mb-4 text-2xl font-semibold">
          Put the shapes to work
        </h2>
        <p className="text-base leading-relaxed opacity-80">
          The{' '}
          <a href={TOOLS_PAGE.path} className="underline">
            practice tools page
          </a>{' '}
          lists Strumly&rsquo;s strumming trainer, chord identifier, chords-by-key reference, and
          the AI coach that scores your chord changes as you play. For songs to play them in, the
          workshops in{' '}
          <a href={BOOK_PAGE.path} className="underline">
            The Signal Chain
          </a>{' '}
          pair each rig and tone recipe with the tab.
        </p>
        <p className="mt-4 text-sm opacity-60">
          Library contents as published on {GUITARCHORDS_ORIGIN.replace('https://', '')} on 11
          October 2026.
        </p>
      </section>

      <ReferencePageFooter current={CHORDS_PAGE.path} />
    </div>
  );
}
