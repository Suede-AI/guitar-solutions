import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// Use the image processor installed by Next; no additional dependency needed.
const requireHere = createRequire(import.meta.url);
const sharp = createRequire(requireHere.resolve('next/package.json'))('sharp');
const svg = await readFile(new URL('../public/guitar-services-social-card.svg', import.meta.url));
const digest = createHash('sha256').update(svg).digest('hex');

// Embed source provenance so CI can detect an SVG edit without a WebP rebuild,
// without relying on platform-specific font rasterization being identical.
const xmp = `<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about="" xmlns:gs="https://guitar.services/ns/" gs:sourceSha256="${digest}" />
  </rdf:RDF>
</x:xmpmeta>`;

await sharp(svg)
  .webp({ quality: 90 })
  .withXmp(xmp)
  .toFile(fileURLToPath(new URL('../public/guitar-services-social-card.webp', import.meta.url)));
