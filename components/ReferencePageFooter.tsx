import { GUITAR_SERVICES_PAGES } from '@/lib/guitar-services-pages';

// Footer for the guitar.services reference pages: the rest of the site, then
// who is behind it.
export function ReferencePageFooter({ current }: { current: string }) {
  const others = GUITAR_SERVICES_PAGES.filter((p) => p.path !== current);
  return (
    <footer className="mt-16 border-t border-current/10 pt-8 text-sm opacity-70">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-widest">More on guitar.services</p>
      <ul className="mb-6 flex flex-wrap gap-x-5 gap-y-2">
        {others.map((page) => (
          <li key={page.path}>
            <a href={page.path} className="underline">
              {page.navLabel === 'Home' ? 'All guitar work' : page.navLabel}
            </a>
          </li>
        ))}
      </ul>
      <p>
        guitar.services is the guitar directory of{' '}
        <a href="https://suedeai.ai/founder" className="underline">
          Jason Colapietro
        </a>
        , founder of{' '}
        <a href="https://suedeai.ai" className="underline">
          Suede AI
        </a>
        .{' '}
        <a href="https://suedeai.ai/contact" className="underline">
          Contact Suede AI
        </a>{' '}
        with questions about any of it.
      </p>
    </footer>
  );
}
