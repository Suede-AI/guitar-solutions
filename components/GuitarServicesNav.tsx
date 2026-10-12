import { GUITAR_SERVICES_PAGES } from '@/lib/guitar-services-pages';

// Site nav for guitar.services. Rendered at the top of every indexable page on
// the host, so each page links every other one with a plain followed link.
export function GuitarServicesNav({ current }: { current: string }) {
  return (
    <nav aria-label="guitar.services" className="mb-12 border-b border-current/10 pb-4">
      <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-widest">
        {GUITAR_SERVICES_PAGES.map((page) => (
          <li key={page.path}>
            <a
              href={page.path}
              aria-current={page.path === current ? 'page' : undefined}
              className={
                page.path === current
                  ? 'underline underline-offset-4'
                  : 'opacity-60 transition-opacity hover:opacity-100'
              }
            >
              {page.navLabel}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
