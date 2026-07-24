const NOT_FOUND_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Page not found | guitar.services</title>
  </head>
  <body>
    <main>
      <h1>Page not found</h1>
      <p>This URL is not part of the guitar.services directory.</p>
      <p><a href="https://guitar.services/">Return to guitar.services</a></p>
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
