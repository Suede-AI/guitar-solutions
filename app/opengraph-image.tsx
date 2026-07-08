import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'guides.guitar.solutions - Technical Reference for Guitar Signal Chains';
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
          <span>guides.guitar.solutions</span>
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
              fontSize: 86,
              lineHeight: 0.96,
              fontWeight: 800,
              maxWidth: 920,
              letterSpacing: 0,
            }}
          >
            Guitar Signal Chains, Engineered.
          </div>
          <div
            style={{
              color: '#c7d0dc',
              fontSize: 34,
              lineHeight: 1.25,
              maxWidth: 940,
            }}
          >
            Technical guitar guides from pickup output through speaker excursion.
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
          <span>Impedance</span>
          <span>Gain Staging</span>
          <span>Effects Loops</span>
          <span>Power</span>
        </div>
      </div>
    ),
    size,
  );
}
