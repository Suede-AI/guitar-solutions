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
import { PRODUCTS, STRUMLY_TOOL_GROUPS } from '@/lib/practice-tools';
import { GUITAR_SERVICES_OG_IMAGE, GUITAR_SERVICES_TWITTER_IMAGES } from '@/lib/seo';

const PAGE_URL = canonicalUrl(TOOLS_PAGE);

export const metadata: Metadata = {
  title: { absolute: TOOLS_PAGE.title },
  description: TOOLS_PAGE.description,
  keywords: keywordsFor('practice-tools'),
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: TOOLS_PAGE.title,
    description: TOOLS_PAGE.description,
    url: PAGE_URL,
    siteName: 'Guitar Services',
    type: 'website',
    images: [GUITAR_SERVICES_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: TOOLS_PAGE.title,
    description: TOOLS_PAGE.description,
    images: GUITAR_SERVICES_TWITTER_IMAGES,
  },
};

const schema = referencePageSchema(TOOLS_PAGE);

const toolCount = STRUMLY_TOOL_GROUPS.reduce((n, g) => n + g.tools.length, 0);

export default function PracticeToolsPage() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <GuitarServicesNav current={TOOLS_PAGE.path} />

      <header className="mb-14 max-w-2xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest opacity-60">
          guitar.services · practice tools
        </p>
        <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
          An AI coach, a tuner, and a practice plan, all free to start.
        </h1>
        <p className="text-lg leading-relaxed opacity-80">
          Suede AI builds guitar practice tools at three levels: a coach that listens and
          remembers, browser tools that need no account, and lessons with a plan attached. Below
          are the five sites, then the {toolCount} Strumly tools, each with what its own page says
          it does.
        </p>
      </header>

      <section aria-labelledby="products-heading" className="mb-14">
        <h2 id="products-heading" className="mb-6 text-2xl font-semibold">
          Five sites to practice with
        </h2>
        <ul className="grid grid-cols-1 gap-5">
          {PRODUCTS.map((product) => (
            <li key={product.url} className="rounded-lg border border-current/15 p-5">
              <p className="mb-1 font-mono text-[11px] uppercase tracking-widest opacity-60">
                {product.url.replace('https://', '')}
              </p>
              <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
              <p className="mb-3 text-sm leading-relaxed opacity-80">{product.does}</p>
              <p className="text-sm leading-relaxed">
                <a href={product.url} className="underline">
                  {product.title}
                </a>
                <span className="opacity-60">: {product.description}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="strumly-heading" className="mb-14">
        <h2 id="strumly-heading" className="mb-2 text-2xl font-semibold">
          Strumly&rsquo;s free toolkit
        </h2>
        <p className="mb-8 max-w-3xl text-base leading-relaxed opacity-70">
          Each of these runs in the browser. Most need no sign-up; the tuner is free for good, and
          the rest are free while Strumly is in early access.
        </p>
        {STRUMLY_TOOL_GROUPS.map((group) => (
          <div key={group.heading} className="mb-10">
            <h3 className="mb-1 text-lg font-semibold">{group.heading}</h3>
            <p className="mb-4 text-sm opacity-60">{group.intro}</p>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {group.tools.map((tool) => (
                <li key={tool.url} className="rounded-lg border border-current/15 p-4">
                  <a href={tool.url} className="font-semibold underline">
                    {tool.title}
                  </a>
                  <p className="mt-2 text-sm leading-relaxed opacity-70">{tool.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section aria-labelledby="pair-heading" className="max-w-3xl">
        <h2 id="pair-heading" className="mb-4 text-2xl font-semibold">
          What to practice with them
        </h2>
        <div className="space-y-4 text-base leading-relaxed opacity-80">
          <p>
            Shapes and scales are indexed in the{' '}
            <a href={CHORDS_PAGE.path} className="underline">
              chord and scale library
            </a>
            , with the notes and formula for each. Songs with a rig and a tone recipe attached are
            in{' '}
            <a href={BOOK_PAGE.path} className="underline">
              The Signal Chain
            </a>
            , whose four sample lessons are free.
          </p>
          <p>
            Building a board rather than a technique? Start with the{' '}
            <a href={GUIDES_PAGE.path} className="underline">
              signal chain guides
            </a>
            , then lay the board out in the Rig builder above.
          </p>
        </div>
      </section>

      <ReferencePageFooter current={TOOLS_PAGE.path} />
    </div>
  );
}
