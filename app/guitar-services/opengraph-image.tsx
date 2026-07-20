import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Guitar Services: Books, Guides, and Tools by Jason Colapietro';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#050b16',
          color: '#f5f2eb',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          fontFamily: 'Arial, Helvetica, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#22d3ee',
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          <span>guitar.services</span>
          <span>Suede Labs AI</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              width: 104,
              height: 8,
              background: '#9f101a',
            }}
          />
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.02,
              fontWeight: 800,
              maxWidth: 980,
              letterSpacing: 0,
            }}
          >
            Everything the guitar taught one builder, in one place.
          </div>
          <div
            style={{
              color: '#c7d0dc',
              fontSize: 32,
              lineHeight: 1.25,
              maxWidth: 940,
            }}
          >
            Two books, a signal chain reference, chord libraries, and AI practice tools.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: '#8ea0b6',
            fontSize: 24,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          <span>Books</span>
          <span>Guides</span>
          <span>Chords &amp; Scales</span>
          <span>AI Coach</span>
        </div>
      </div>
    ),
    size,
  );
}
