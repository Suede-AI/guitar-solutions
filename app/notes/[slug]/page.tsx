import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GuitarServicesNav } from '@/components/GuitarServicesNav';
import { NoteBody } from '@/components/NoteBody';
import { ReferencePageFooter } from '@/components/ReferencePageFooter';
import { NOTES_PAGE, canonicalUrl } from '@/lib/guitar-services-pages';
import { keywordsFor } from '@/lib/keywords';
import { NOTE_BODIES } from '@/lib/notes-content';
import { NOTES, findNote, notePath } from '@/lib/notes-index';
import { noteSchema, notePage as pageFor } from '@/lib/notes-schema';
import { GUITAR_SERVICES_OG_IMAGE, GUITAR_SERVICES_TWITTER_IMAGES } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return NOTES.map((note) => ({ slug: note.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = findNote((await params).slug);
  if (!note) return {};
  const url = canonicalUrl(pageFor(note));
  return {
    title: { absolute: note.title },
    description: note.description,
    keywords: keywordsFor('notes'),
    authors: [{ name: 'Jason Colapietro', url: 'https://suedeai.ai/founder' }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: note.title,
      description: note.description,
      url,
      siteName: 'Guitar Services',
      type: 'article',
      publishedTime: note.datePublished,
      modifiedTime: note.lastmod,
      authors: ['https://suedeai.ai/founder'],
      images: [GUITAR_SERVICES_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: note.title,
      description: note.description,
      images: GUITAR_SERVICES_TWITTER_IMAGES,
    },
  };
}

export default async function NotePage({ params }: Props) {
  const note = findNote((await params).slug);
  if (!note) notFound();
  const blocks = NOTE_BODIES[note.slug] ?? [];
  const others = NOTES.filter((n) => n.slug !== note.slug);

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(noteSchema(note)) }} />
      <GuitarServicesNav current={NOTES_PAGE.path} />

      <article className="max-w-3xl">
        <header className="mb-10">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest opacity-60">
            <a href={NOTES_PAGE.path} className="underline">
              Notes
            </a>{' '}
            · <time dateTime={note.datePublished}>{note.datePublished}</time> · West Palm Beach, Florida
          </p>
          <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">{note.h1}</h1>
          <p className="text-lg leading-relaxed opacity-80">{note.description}</p>
        </header>

        <NoteBody blocks={blocks} />

        <aside aria-label="About the author" className="mt-12 rounded-lg border border-current/15 p-5 text-sm">
          <p className="mb-1 font-mono text-[11px] uppercase tracking-widest opacity-60">Author</p>
          <p className="mb-2 font-semibold">
            <a href="https://suedeai.ai/founder" className="underline">
              Jason Colapietro
            </a>
            , Founder and CEO, Suede AI, West Palm Beach, Florida
          </p>
          <p className="leading-relaxed opacity-80">
            Engineer, self-taught guitarist and author of The Signal Chain. More at{' '}
            <a href="https://jasoncolapietro.com/" className="underline">
              jasoncolapietro.com
            </a>{' '}
            and the{' '}
            <a href="https://seo.suedeai.ai/evidence" className="underline">
              Suede AI evidence page
            </a>
            .
          </p>
        </aside>
      </article>

      <section aria-labelledby="more-notes" className="mt-14 max-w-3xl">
        <h2 id="more-notes" className="mb-4 text-xl font-semibold">
          More notes
        </h2>
        <ul className="space-y-2">
          {others.map((n) => (
            <li key={n.slug}>
              <a href={notePath(n)} className="underline">
                {n.h1}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <ReferencePageFooter current={notePath(note)} />
    </div>
  );
}
