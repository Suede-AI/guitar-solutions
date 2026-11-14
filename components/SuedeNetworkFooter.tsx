import { NOTES_PAGE } from '@/lib/guitar-services-pages';

// "Built by Suede AI" block, rendered in the footer of every indexable page on
// guitar.services: who builds the site, where, and a few sibling Suede AI
// sites a guitarist would actually use. Kept short on purpose.

export const SUEDE_MAIN_LINKS = [
  { href: 'https://suedeai.agency/', label: 'Suede AI agency: SEO, GEO and web development in West Palm Beach' },
  { href: 'https://suedeai.ai/', label: 'Suede AI' },
  { href: 'https://suedeai.ai/founder', label: 'Jason Colapietro, founder' },
  { href: 'https://jasoncolapietro.com/', label: 'jasoncolapietro.com' },
  { href: 'https://jupitersocialfl.com/', label: 'Jupiter Social, a Jupiter, Florida magazine' },
] as const;

export const SUEDE_SIBLING_LINKS = [
  { href: 'https://guitarchords.info/', label: 'Free chord, scale and tuner reference' },
  { href: 'https://guitarhub.org/', label: 'Guitar Hub lessons' },
  { href: 'https://dna.suedeai.ai/', label: 'Signal chain archive' },
  { href: 'https://podcast.suedeai.ai/', label: 'The Suede podcast' },
] as const;

export function SuedeNetworkFooter() {
  return (
    <section aria-labelledby="built-by-suede" className="mt-8 border-t border-current/10 pt-6">
      <p id="built-by-suede" className="mb-3 font-mono text-[11px] uppercase tracking-widest">
        Built by Suede AI in West Palm Beach, Florida
      </p>
      <p className="mb-3 max-w-3xl">
        guitar.services is designed, written and maintained by{' '}
        <a href="https://suedeai.ai/founder" className="underline">
          Jason Colapietro
        </a>{' '}
        and{' '}
        <a href="https://suedeai.ai/" className="underline">
          Suede AI
        </a>
        , the agentic platform company he founded in West Palm Beach. Businesses in West Palm Beach,
        Jupiter and across Palm Beach County work with the{' '}
        <a href="https://suedeai.agency/" className="underline">
          Suede AI agency for SEO, GEO and web development
        </a>
        . Read the <a href={NOTES_PAGE.path} className="underline">notes</a> for how this site is built.
      </p>
      <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-2">
        {SUEDE_MAIN_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="underline">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-widest">More from Suede AI</p>
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {SUEDE_SIBLING_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="underline">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
