export const runtime = 'edge';

// Host-specific robots.txt for guitar.services. next.config.mjs's /robots.txt
// entry had no host exemption (unlike /sitemap.xml, /, and the catch-all),
// so this host's robots.txt used to 308 straight to strumly.suedeai.ai's,
// pointing crawlers at a domain with no mention of guitar.services or its
// own sitemap. This one stays local and points at guitar-services-sitemap.xml.
//
// The wildcard group already admits every crawler. Search and answer-engine
// crawlers are also named, because several operators read a named allow as the
// signal to fetch, and the rest of the Suede AI estate publishes the same list.
const NAMED_CRAWLERS = [
  'Googlebot',
  'Bingbot',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Amazonbot',
  'DuckAssistBot',
  'meta-externalagent',
  'MistralAI-User',
  'CCBot',
];

export async function GET() {
  const body = `User-agent: *
Allow: /

${NAMED_CRAWLERS.map((agent) => `User-agent: ${agent}`).join('\n')}
Allow: /

Sitemap: https://guitar.services/sitemap.xml
Sitemap: https://guitar.services/ai-instructions-sitemap.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
