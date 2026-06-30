'use client';

import { useState } from 'react';

interface ChainBlock {
  id: string;
  label: string;
  sublabel: string;
  color: 'cyan' | 'gold' | 'paper' | 'red';
  details: {
    impedance: string;
    signal: string;
    notes: string;
  };
}

const CHAIN_BLOCKS: ChainBlock[] = [
  {
    id: 'guitar',
    label: 'Guitar',
    sublabel: 'Passive source',
    color: 'paper',
    details: {
      impedance: '~10–250kΩ output',
      signal: '−20 to −10 dBV',
      notes:
        'Passive pickups are high-impedance, low-output sources. Every subsequent stage interacts with this impedance — starting here.',
    },
  },
  {
    id: 'buffer',
    label: 'Buffer / Tuner',
    sublabel: 'First in chain',
    color: 'cyan',
    details: {
      impedance: '~1 MΩ input / 100Ω output',
      signal: 'Unity gain',
      notes:
        'A good buffer drops output impedance from ~100kΩ to ~100Ω. Cable capacitance becomes acoustically irrelevant. Everything after it sees clean drive.',
    },
  },
  {
    id: 'drive',
    label: 'Drive Zone',
    sublabel: 'OD · Fuzz · Distortion',
    color: 'gold',
    details: {
      impedance: '10–500kΩ input (varies)',
      signal: 'Gain: +3 to +30 dB',
      notes:
        'Fuzz is famously input-impedance-sensitive — it prefers to see the guitar directly, before any buffer. OD pedals stack best guitar→lowest gain→highest gain.',
    },
  },
  {
    id: 'amp',
    label: 'Amp Input',
    sublabel: 'Pre-amp stage',
    color: 'cyan',
    details: {
      impedance: '470kΩ – 1 MΩ input',
      signal: 'First gain stage',
      notes:
        'The preamp shapes fundamental tone. Input impedance sets how much treble the pickup circuit rolls off into it. Most amps work best with low-Z sources here.',
    },
  },
  {
    id: 'fxloop',
    label: 'FX Loop',
    sublabel: 'Mod · Delay · Reverb',
    color: 'gold',
    details: {
      impedance: 'Line level (~10 kΩ)',
      signal: '−10 dBV to +4 dBu',
      notes:
        "After the preamp, before the power amp. Time-based effects placed here process shaped, amplified signal — reverb sounds natural rather than driving into the amp's gain.",
    },
  },
  {
    id: 'speaker',
    label: 'Cabinet',
    sublabel: 'Speaker + air',
    color: 'paper',
    details: {
      impedance: '4, 8, or 16 Ω',
      signal: 'Acoustic output',
      notes:
        'The final filter: speaker + cabinet cuts above ~5 kHz, adds natural compression at volume. Mic placement becomes tonal — another gain stage in the acoustic domain.',
    },
  },
];

const ACCENT_COLORS: Record<ChainBlock['color'], string> = {
  cyan: 'var(--color-cyan)',
  gold: 'var(--color-gold)',
  paper: 'var(--color-paper-mute)',
  red: 'var(--color-red)',
};

const ACCENT_SHADOWS: Record<ChainBlock['color'], string> = {
  cyan: '0 0 20px rgba(34, 211, 238, 0.18)',
  gold: '0 0 20px rgba(200, 146, 42, 0.2)',
  paper: '0 0 20px rgba(148, 163, 184, 0.15)',
  red: '0 0 20px rgba(159, 16, 26, 0.2)',
};

function ArrowConnector() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        width: '2rem',
      }}
    >
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'var(--color-rule)',
        }}
      />
      <span
        style={{
          color: 'var(--color-paper-dim)',
          fontSize: '0.7rem',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        ›
      </span>
    </div>
  );
}

interface BlockButtonProps {
  block: ChainBlock;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

function BlockButton({ block, index, isActive, onClick }: BlockButtonProps) {
  const accent = ACCENT_COLORS[block.color];
  const shadow = ACCENT_SHADOWS[block.color];

  return (
    <button
      onClick={onClick}
      aria-label={`${block.label} — explore signal details`}
      aria-expanded={isActive}
      style={{
        position: 'relative',
        width: '120px',
        minHeight: '80px',
        background: isActive ? 'var(--color-ink-1)' : 'var(--color-ink-2)',
        border: isActive ? `1px solid ${accent}` : '1px solid var(--color-rule)',
        borderRadius: '2px',
        padding: '0.625rem 0.75rem 0.625rem',
        paddingTop: '0.875rem',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        boxShadow: isActive ? shadow : 'none',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: accent,
        }}
      />

      {/* Block number */}
      <div
        className="mono-label"
        style={{
          position: 'absolute',
          top: '0.45rem',
          right: '0.5rem',
          fontSize: '0.6rem',
          color: isActive ? accent : 'var(--color-paper-dim)',
          transition: 'color 0.2s ease',
          letterSpacing: '0.1em',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 700,
          fontSize: '0.8rem',
          color: isActive ? 'var(--color-paper)' : 'var(--color-paper-mute)',
          lineHeight: 1.2,
          marginBottom: '0.3rem',
          transition: 'color 0.2s ease',
          letterSpacing: '-0.01em',
        }}
      >
        {block.label}
      </div>

      {/* Sublabel */}
      <div
        className="mono-label"
        style={{
          fontSize: '0.58rem',
          color: isActive ? 'var(--color-paper-dim)' : 'var(--color-rule)',
          letterSpacing: '0.12em',
          transition: 'color 0.2s ease',
          lineHeight: 1.3,
        }}
      >
        {block.sublabel}
      </div>
    </button>
  );
}

interface DetailPanelProps {
  block: ChainBlock;
  visible: boolean;
}

function DetailPanel({ block, visible }: DetailPanelProps) {
  const accent = ACCENT_COLORS[block.color];

  return (
    <div
      role="complementary"
      aria-label={`Signal details for ${block.label}`}
      style={{
        marginTop: '1rem',
        background: 'var(--color-ink-1)',
        border: '1px solid var(--color-rule)',
        borderLeft: `3px solid ${accent}`,
        borderRadius: '2px',
        padding: '1.25rem 1.5rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 0.22s ease, transform 0.22s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* Panel header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.75rem',
          marginBottom: '1rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--color-rule)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--color-paper)',
            letterSpacing: '-0.01em',
          }}
        >
          {block.label}
        </span>
        <span
          className="mono-label"
          style={{ color: accent, fontSize: '0.6rem' }}
        >
          {block.sublabel}
        </span>
      </div>

      {/* 3-column detail grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 2fr',
          gap: '1.25rem',
        }}
      >
        {/* Impedance */}
        <div>
          <div
            className="mono-label"
            style={{ marginBottom: '0.35rem', color: 'var(--color-paper-dim)' }}
          >
            Impedance
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: 'var(--color-paper)',
              lineHeight: 1.4,
            }}
          >
            {block.details.impedance}
          </div>
        </div>

        {/* Signal Level */}
        <div>
          <div
            className="mono-label"
            style={{ marginBottom: '0.35rem', color: 'var(--color-paper-dim)' }}
          >
            Signal Level
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: 'var(--color-paper)',
              lineHeight: 1.4,
            }}
          >
            {block.details.signal}
          </div>
        </div>

        {/* Engineering Note */}
        <div>
          <div
            className="mono-label"
            style={{ marginBottom: '0.35rem', color: 'var(--color-paper-dim)' }}
          >
            Engineering Note
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-paper-mute)',
              lineHeight: 1.6,
            }}
          >
            {block.details.notes}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SignalChainDiagram() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeBlock = CHAIN_BLOCKS.find((b) => b.id === activeId) ?? null;

  const handleBlockClick = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      style={{
        background: 'var(--color-ink-1)',
        border: '1px solid var(--color-rule)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <header
        className="hairline-b"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1.5rem',
        }}
      >
        <span
          className="mono-label"
          style={{ color: 'var(--color-paper-mute)' }}
        >
          Signal Chain
        </span>
        <span
          className="mono-label"
          style={{ color: 'var(--color-paper-dim)', fontSize: '0.58rem' }}
        >
          Interactive · Click to Explore
        </span>
      </header>

      {/* Scrollable chain row */}
      <div style={{ overflowX: 'auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            minWidth: 'max-content',
            padding: '2rem 1.5rem',
          }}
        >
          {CHAIN_BLOCKS.map((block, i) => (
            <div key={block.id} style={{ display: 'flex', alignItems: 'center' }}>
              <BlockButton
                block={block}
                index={i}
                isActive={activeId === block.id}
                onClick={() => handleBlockClick(block.id)}
              />
              {i < CHAIN_BLOCKS.length - 1 && <ArrowConnector />}
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div style={{ padding: '0 1.5rem', minHeight: activeBlock ? undefined : 0 }}>
        {activeBlock && (
          <DetailPanel block={activeBlock} visible={activeBlock !== null} />
        )}
      </div>

      {/* Footer hint */}
      <p
        className="mono-label"
        style={{
          padding: '0.75rem 1.5rem 1rem',
          color: 'var(--color-paper-dim)',
          fontSize: '0.62rem',
          margin: 0,
        }}
      >
        Click any block to see signal engineering details.
      </p>
    </section>
  );
}
