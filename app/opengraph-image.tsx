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
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#050b16',
          color: '#e8edf5',
          padding: 72,
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.12) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, letterSpacing: 4, color: '#22d3ee' }}>
            GUITAR.SOLUTIONS
          </div>
          <div style={{ fontSize: 18, letterSpacing: 3, color: '#94a3b8' }}>
            THE SIGNAL CHAIN
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 880 }}>
          <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 0.95 }}>
            Guitar Signal Chains, Engineered.
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.25, color: '#94a3b8' }}>
            A technical reference by Jason Colapietro for impedance, gain staging,
            effects topology, power, and tone.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: '#9f101a' }} />
          <div style={{ fontSize: 20, letterSpacing: 3, color: '#64748b' }}>
            SUEDE LABS AI · JASON COLAPIETRO
          </div>
        </div>
      </div>
    ),
    size,
  );
}
