import type { Metadata } from 'next';
import { GuitarServicesNav } from '@/components/GuitarServicesNav';
import { ReferencePageFooter } from '@/components/ReferencePageFooter';
import {
  BOOK_PAGE,
  GUIDES_PAGE,
  TOOLS_PAGE,
  canonicalUrl,
  referencePageSchema,
} from '@/lib/guitar-services-pages';
import { keywordsFor } from '@/lib/keywords';
import { GUITAR_SERVICES_OG_IMAGE, GUITAR_SERVICES_TWITTER_IMAGES } from '@/lib/seo';
import {
  GUIDE_GROUPS,
  GUIDE_SUMMARIES,
  STRUMLY_GUIDES_URL,
  strumlyGuideUrl,
  type GuideSummary,
} from '@/lib/signal-chain-guides';

const PAGE_URL = canonicalUrl(GUIDES_PAGE);

export const metadata: Metadata = {
  title: { absolute: GUIDES_PAGE.title },
  description: GUIDES_PAGE.description,
  keywords: keywordsFor('signal-chain-guides'),
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: GUIDES_PAGE.title,
    description: GUIDES_PAGE.description,
    url: PAGE_URL,
    siteName: 'Guitar Services',
    type: 'website',
    images: [GUITAR_SERVICES_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: GUIDES_PAGE.title,
    description: GUIDES_PAGE.description,
    images: GUITAR_SERVICES_TWITTER_IMAGES,
  },
};

const schema = referencePageSchema(GUIDES_PAGE);

const BY_SLUG = new Map(GUIDE_SUMMARIES.map((g) => [g.slug, g]));

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function GuideCard({ guide }: { guide: GuideSummary }) {
  return (
    <li className="rounded-lg border border-current/15 p-5">
      <p className="mb-1 font-mono text-[11px] uppercase tracking-widest opacity-60">
        {guide.category} · published {formatDate(guide.published)}
      </p>
      <h3 className="mb-3 text-lg font-semibold">{guide.title}</h3>
      <p className="mb-4 text-sm leading-relaxed opacity-80">{guide.summary}</p>
      <p className="text-sm">
        Read the full guide on Strumly:{' '}
        <a href={strumlyGuideUrl(guide.slug)} className="underline">
          {guide.liveTitle}
        </a>
      </p>
    </li>
  );
}

export default function SignalChainGuidesPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <GuitarServicesNav current={GUIDES_PAGE.path} />

      <header className="mb-14 max-w-2xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest opacity-60">
          guitar.services · signal chain reference
        </p>
        <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
          Eight guides to the guitar signal chain, pickup to power supply.
        </h1>
        <p className="text-lg leading-relaxed opacity-80">
          Jason Colapietro wrote these as an engineering reference for players: why pedals go in
          the order they do, what a cable does to your treble, where a buffer belongs, and how to
          get the hum out of a board. Each summary below gives the main point and the numbers
          behind it, then links to the full guide in{' '}
          <a href={STRUMLY_GUIDES_URL} className="underline">
            Strumly&rsquo;s guide library
          </a>
          , where they live now.
        </p>
      </header>

      {GUIDE_GROUPS.map((group) => (
        <section key={group.heading} aria-label={group.heading} className="mb-12">
          <h2 className="mb-2 text-2xl font-semibold">{group.heading}</h2>
          <p className="mb-5 max-w-3xl text-base leading-relaxed opacity-70">{group.intro}</p>
          <ul className="grid grid-cols-1 gap-5">
            {group.slugs.map((slug) => {
              const guide = BY_SLUG.get(slug);
              return guide ? <GuideCard key={slug} guide={guide} /> : null;
            })}
          </ul>
        </section>
      ))}

      <section aria-labelledby="apply-heading" className="max-w-3xl">
        <h2 id="apply-heading" className="mb-4 text-2xl font-semibold">
          Put it on a board
        </h2>
        <div className="space-y-4 text-base leading-relaxed opacity-80">
          <p>
            Strumly&rsquo;s{' '}
            <a href="https://strumly.suedeai.ai/rig" className="underline">
              Rig signal chain builder
            </a>{' '}
            lets you lay out a pedalboard and watch power draw, noise risk, and gain-stack stats
            update as you go. More tools like it are on the{' '}
            <a href={TOOLS_PAGE.path} className="underline">
              practice tools page
            </a>
            .
          </p>
          <p>
            For the long version, Part VIII of{' '}
            <a href={BOOK_PAGE.path} className="underline">
              The Signal Chain
            </a>{' '}
            covers signal chain order, gain staging, and building the pedalboard, alongside the
            history of the amps and pedals the guides are about.
          </p>
        </div>
      </section>

      <ReferencePageFooter current={GUIDES_PAGE.path} />
    </div>
  );
}
