// Summaries of the eight signal chain guides for the /signal-chain-guides page.
//
// The guides themselves live on Strumly (strumly.suedeai.ai/guides/<slug>),
// which is their canonical home; content/guides/*.mdx in this repo is the
// source-of-record they were migrated from. This page summarizes and links
// them. It does not republish the guide bodies.
//
// Title, category, and published date mirror each guide's frontmatter, and
// lib/__tests__ fails if they drift or if a guide is added without a summary.
// `liveTitle` is the canonical page's <title> (without the " · Strumly"
// suffix) as served on 2026-10-11, and is the link text. Every number in a
// summary appears in the guide it summarizes.

export const STRUMLY_GUIDES_URL = 'https://strumly.suedeai.ai/guides';

export interface GuideSummary {
  slug: string;
  title: string;
  liveTitle: string;
  category: string;
  published: string;
  summary: string;
}

export function strumlyGuideUrl(slug: string): string {
  return `${STRUMLY_GUIDES_URL}/${slug}`;
}

export const GUIDE_SUMMARIES: readonly GuideSummary[] = [
  {
    slug: 'signal-chain-topology',
    title: 'Signal Chain Topology: What Actually Goes Where, and Why',
    liveTitle: 'Signal Chain Topology: What Goes Where',
    category: 'Signal Chain',
    published: '2026-05-26',
    summary:
      'Reduces any rig, analog, digital, or modeler, to five blocks: source, front of amp, preamp, effects loop, and power section and speaker. It sets out the front-of-amp order (buffer, tuner, wah or filter, compressor, drive, EQ), explains why a vintage germanium fuzz wants to see the pickup directly, and lists the usual mistakes: delay before overdrive, compression after gain, and reverb in front of the amp.',
  },
  {
    slug: 'impedance-and-the-first-three-feet',
    title: 'Impedance and the First Three Feet',
    liveTitle: 'Impedance and the First Three Feet',
    category: 'Electronics',
    published: '2026-05-24',
    summary:
      'Explains why the unbuffered cable between the guitar and the first pedal is a common, cheap-to-fix source of lost tone. Instrument cables often sit around 30 to 80 pF per foot and premium low-capacitance cables around 12 to 25, and 20 feet of cheap cable presents roughly 600 pF. A buffer with a high input impedance and a low output impedance moves the rolloff out of the audio band. Its rule of thumb: under 10 feet of premium cable is fine without one; past 20 feet, buffer at both ends.',
  },
  {
    slug: 'cable-capacitance-and-frequency-response',
    title: 'Cable Capacitance and Frequency Response: The Spec That Actually Matters',
    liveTitle: 'Cable Capacitance and Frequency Response',
    category: 'Electronics',
    published: '2026-02-01',
    summary:
      'Treats every guitar cable as a capacitor that forms a low-pass filter with the pickup’s source impedance. Its table runs 15 feet of cable into a 10 kΩ source: about 53 kHz cutoff at 20 pF per foot, about 21 kHz at 50, and about 10 kHz at 100. With a buffer at the start of the chain, capacitance stops mattering, so the money goes to durability and shielding instead.',
  },
  {
    slug: 'true-bypass-vs-buffered',
    title: 'True Bypass vs. Buffered: What Your Pedal Actually Does',
    liveTitle: 'True Bypass vs. Buffered Pedals',
    category: 'Electronics',
    published: '2026-05-15',
    summary:
      'Shows what each bypass type does with the pedal off: true bypass wires input to output, buffered bypass keeps an input buffer in the path. True bypass is fine for short runs under 15 feet with few pedals; once total cable passes 20 feet, one good buffer early in the chain restores the highs. The exception is vintage germanium fuzz, which goes first with nothing buffered ahead of it.',
  },
  {
    slug: 'pedalboard-order-methodology',
    title: 'Pedalboard Order: A Practical Methodology',
    liveTitle: 'Pedalboard Order: A Practical Methodology',
    category: 'Signal Chain',
    published: '2026-01-15',
    summary:
      'Treats the standard order (dynamics, drive, modulation, time, amp) as a default and explains the reason behind each slot: compressor and wah before drive, modulation after it, delay and reverb last or in the loop. It covers the exceptions, including pitch shifters ahead of drive, three useful volume pedal positions, and stacking drives, and builds a board by starting with three pedals and adding one at a time.',
  },
  {
    slug: 'gain-staging-across-the-chain',
    title: 'Gain Staging Across the Chain',
    liveTitle: 'Gain Staging Across the Chain',
    category: 'Signal Chain',
    published: '2026-05-22',
    summary:
      'Keeps every block between its headroom ceiling and its noise floor. A boost at minimum is rarely at unity: three stacked boosts can hit the amp 6 to 12 dB hotter than the pickup, while six buffers or gates in series can lose 3 to 6 dB. Most tube preamp inputs start clipping around 100 to 200 mV peak. The guide gives a four-step procedure for setting unity across a board, one pedal at a time.',
  },
  {
    slug: 'effects-loop-serial-vs-parallel',
    title: 'The Effects Loop: Serial, Parallel, and the Four-Cable Method',
    liveTitle: 'Effects Loop: Serial vs. Parallel vs. Four-Cable',
    category: 'Gain & Dynamics',
    published: '2026-03-10',
    summary:
      'Explains the send and return between preamp and power amp, and why delay and reverb stay clearer there than in front of a driven amp. It compares serial loops, which put the pedal fully in the path, with parallel loops, which blend wet and dry on a mix control, then wires the four-cable method step by step and covers the mismatch between instrument-level (-10 dBV) and line-level (+4 dBu) gear.',
  },
  {
    slug: 'power-supply-and-noise-floor',
    title: 'Power Supply and Noise Floor: The Hidden Variable in Your Tone',
    liveTitle: 'Power Supply and Noise Floor for Guitar Tone',
    category: 'Power',
    published: '2026-04-20',
    summary:
      'Diagnoses noise by its sound: 60 Hz hum points to a ground loop, 120 Hz buzz to rectification artifacts, a high whine to digital pedals. It explains why daisy chains spread noise across a shared rail, what isolated outputs isolate, and which specs to check: current draw with 20 to 30 percent headroom, voltage, center-negative polarity, and regulation. Its recommendations scale from one to four analog pedals up to boards of eight or more.',
  },
];

/** Reading order for the page: each group names the guides it holds, by slug. */
export const GUIDE_GROUPS: readonly { heading: string; intro: string; slugs: readonly string[] }[] = [
  {
    heading: 'Start with the map',
    intro: 'The topology guide is the overview the others hang from.',
    slugs: ['signal-chain-topology'],
  },
  {
    heading: 'Between the guitar and the first pedal',
    intro: 'Three guides on the same physics: pickup impedance, cable capacitance, and where a buffer belongs.',
    slugs: ['impedance-and-the-first-three-feet', 'cable-capacitance-and-frequency-response', 'true-bypass-vs-buffered'],
  },
  {
    heading: 'On the board',
    intro: 'Which pedal goes where, and how loud each one should hand the signal on.',
    slugs: ['pedalboard-order-methodology', 'gain-staging-across-the-chain'],
  },
  {
    heading: 'Between the preamp and the power amp',
    intro: 'Where time-based effects usually sound best, and how to wire them there.',
    slugs: ['effects-loop-serial-vs-parallel'],
  },
  {
    heading: 'Powering the board',
    intro: 'The noise floor under everything else.',
    slugs: ['power-supply-and-noise-floor'],
  },
];
