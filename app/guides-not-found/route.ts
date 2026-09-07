// The 404 served on guides.guitar.solutions and the deployment aliases.
//
// next.config.mjs redirects the URLs this host actually published to their
// Strumly equivalents, permanently and path-preserving. A request that gets
// this far asked for something the site did not have, so it gets a real 404
// with a pointer to where the guides live now.
const NOT_FOUND_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Page not found | guides.guitar.solutions</title>
  </head>
  <body>
    <main>
      <h1>Page not found</h1>
      <p>This URL was not part of the guides site.</p>
      <p>The guides published here have moved to Strumly.</p>
      <p><a href="https://strumly.suedeai.ai/guides">Read the guides on Strumly</a></p>
    </main>
  </body>
</html>`;

export function GET() {
  return new Response(NOT_FOUND_HTML, {
    status: 404,
    headers: {
      'cache-control': 'public, max-age=0, must-revalidate',
      'content-type': 'text/html; charset=utf-8',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

export const HEAD = GET;
