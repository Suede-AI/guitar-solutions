// The guitarchords.info chord and scale library, indexed for /chords-and-scales.
//
// Generated from the live guitarchords.info sitemap on 2026-10-11: every URL in
// it was fetched and returned 200, index/follow, with a self-referencing
// canonical. Names, shapes, chord tones, formulas, step patterns, and the
// one-line scale characters are copied from each page's own title and meta
// description. To refresh, re-read the sitemap; do not edit values by hand.
//
// Shapes read from the low E string to the high E string in standard tuning
// (EADGBE); x is a muted string and 0 an open one. Scale steps use W for a
// whole step, H for a half step, and W+H for three semitones. Both conventions
// are the ones guitarchords.info states on its chord and scale pages.

export const GUITARCHORDS_ORIGIN = 'https://guitarchords.info';

export type ChordFamily =
  | 'major'
  | 'minor'
  | 'dominant-seventh'
  | 'major-seventh'
  | 'minor-seventh'
  | 'suspended'
  | 'power';

export interface LibraryChord {
  slug: string;
  url: string;
  symbol: string;
  name: string;
  shape: string;
  tones: string;
  formula: string;
  family: ChordFamily;
}

export interface LibraryScale {
  slug: string;
  url: string;
  name: string;
  formula: string;
  steps: string;
  character: string;
}

export const CHORD_FAMILIES: readonly { family: ChordFamily; heading: string; formula: string }[] = [
  { family: 'major', heading: 'Major chords', formula: '1 3 5' },
  { family: 'minor', heading: 'Minor chords', formula: '1 b3 5' },
  { family: 'dominant-seventh', heading: 'Dominant seventh chords', formula: '1 3 5 b7' },
  { family: 'major-seventh', heading: 'Major seventh chords', formula: '1 3 5 7' },
  { family: 'minor-seventh', heading: 'Minor seventh chords', formula: '1 b3 5 b7' },
  { family: 'suspended', heading: 'Suspended chords', formula: '1 2 5 or 1 4 5' },
  { family: 'power', heading: 'Power chords', formula: '1 5' },
];

export const LIBRARY_CHORDS: readonly LibraryChord[] = [
  { slug: 'c-major', url: 'https://guitarchords.info/chords/c-major', symbol: 'C', name: 'C major', shape: 'x32010', tones: 'C E G', formula: '1 3 5', family: 'major' },
  { slug: 'd-major', url: 'https://guitarchords.info/chords/d-major', symbol: 'D', name: 'D major', shape: 'xx0232', tones: 'D F# A', formula: '1 3 5', family: 'major' },
  { slug: 'e-major', url: 'https://guitarchords.info/chords/e-major', symbol: 'E', name: 'E major', shape: '022100', tones: 'E G# B', formula: '1 3 5', family: 'major' },
  { slug: 'g-major', url: 'https://guitarchords.info/chords/g-major', symbol: 'G', name: 'G major', shape: '320003', tones: 'G B D', formula: '1 3 5', family: 'major' },
  { slug: 'a-major', url: 'https://guitarchords.info/chords/a-major', symbol: 'A', name: 'A major', shape: 'x02220', tones: 'A C# E', formula: '1 3 5', family: 'major' },
  { slug: 'a-minor', url: 'https://guitarchords.info/chords/a-minor', symbol: 'Am', name: 'A minor', shape: 'x02210', tones: 'A C E', formula: '1 b3 5', family: 'minor' },
  { slug: 'e-minor', url: 'https://guitarchords.info/chords/e-minor', symbol: 'Em', name: 'E minor', shape: '022000', tones: 'E G B', formula: '1 b3 5', family: 'minor' },
  { slug: 'd-minor', url: 'https://guitarchords.info/chords/d-minor', symbol: 'Dm', name: 'D minor', shape: 'xx0231', tones: 'D F A', formula: '1 b3 5', family: 'minor' },
  { slug: 'c7', url: 'https://guitarchords.info/chords/c7', symbol: 'C7', name: 'C dominant seventh', shape: 'x32310', tones: 'C E G Bb', formula: '1 3 5 b7', family: 'dominant-seventh' },
  { slug: 'd7', url: 'https://guitarchords.info/chords/d7', symbol: 'D7', name: 'D dominant seventh', shape: 'xx0212', tones: 'D F# A C', formula: '1 3 5 b7', family: 'dominant-seventh' },
  { slug: 'e7', url: 'https://guitarchords.info/chords/e7', symbol: 'E7', name: 'E dominant seventh', shape: '020100', tones: 'E G# B D', formula: '1 3 5 b7', family: 'dominant-seventh' },
  { slug: 'g7', url: 'https://guitarchords.info/chords/g7', symbol: 'G7', name: 'G dominant seventh', shape: '320001', tones: 'G B D F', formula: '1 3 5 b7', family: 'dominant-seventh' },
  { slug: 'a7', url: 'https://guitarchords.info/chords/a7', symbol: 'A7', name: 'A dominant seventh', shape: 'x02020', tones: 'A C# E G', formula: '1 3 5 b7', family: 'dominant-seventh' },
  { slug: 'b7', url: 'https://guitarchords.info/chords/b7', symbol: 'B7', name: 'B dominant seventh', shape: 'x21202', tones: 'B D# F# A', formula: '1 3 5 b7', family: 'dominant-seventh' },
  { slug: 'cmaj7', url: 'https://guitarchords.info/chords/cmaj7', symbol: 'Cmaj7', name: 'C major seventh', shape: 'x32000', tones: 'C E G B', formula: '1 3 5 7', family: 'major-seventh' },
  { slug: 'dmaj7', url: 'https://guitarchords.info/chords/dmaj7', symbol: 'Dmaj7', name: 'D major seventh', shape: 'xx0222', tones: 'D F# A C#', formula: '1 3 5 7', family: 'major-seventh' },
  { slug: 'emaj7', url: 'https://guitarchords.info/chords/emaj7', symbol: 'Emaj7', name: 'E major seventh', shape: '021100', tones: 'E G# B D#', formula: '1 3 5 7', family: 'major-seventh' },
  { slug: 'fmaj7', url: 'https://guitarchords.info/chords/fmaj7', symbol: 'Fmaj7', name: 'F major seventh', shape: 'xx3210', tones: 'F A C E', formula: '1 3 5 7', family: 'major-seventh' },
  { slug: 'gmaj7', url: 'https://guitarchords.info/chords/gmaj7', symbol: 'Gmaj7', name: 'G major seventh', shape: '320002', tones: 'G B D F#', formula: '1 3 5 7', family: 'major-seventh' },
  { slug: 'amaj7', url: 'https://guitarchords.info/chords/amaj7', symbol: 'Amaj7', name: 'A major seventh', shape: 'x02120', tones: 'A C# E G#', formula: '1 3 5 7', family: 'major-seventh' },
  { slug: 'am7', url: 'https://guitarchords.info/chords/am7', symbol: 'Am7', name: 'A minor seventh', shape: 'x02010', tones: 'A C E G', formula: '1 b3 5 b7', family: 'minor-seventh' },
  { slug: 'em7', url: 'https://guitarchords.info/chords/em7', symbol: 'Em7', name: 'E minor seventh', shape: '020000', tones: 'E G B D', formula: '1 b3 5 b7', family: 'minor-seventh' },
  { slug: 'dm7', url: 'https://guitarchords.info/chords/dm7', symbol: 'Dm7', name: 'D minor seventh', shape: 'xx0211', tones: 'D F A C', formula: '1 b3 5 b7', family: 'minor-seventh' },
  { slug: 'bm7', url: 'https://guitarchords.info/chords/bm7', symbol: 'Bm7', name: 'B minor seventh', shape: 'x24232', tones: 'B D F# A', formula: '1 b3 5 b7', family: 'minor-seventh' },
  { slug: 'dsus2', url: 'https://guitarchords.info/chords/dsus2', symbol: 'Dsus2', name: 'D suspended second', shape: 'xx0230', tones: 'D E A', formula: '1 2 5', family: 'suspended' },
  { slug: 'dsus4', url: 'https://guitarchords.info/chords/dsus4', symbol: 'Dsus4', name: 'D suspended fourth', shape: 'xx0233', tones: 'D G A', formula: '1 4 5', family: 'suspended' },
  { slug: 'asus2', url: 'https://guitarchords.info/chords/asus2', symbol: 'Asus2', name: 'A suspended second', shape: 'x02200', tones: 'A B E', formula: '1 2 5', family: 'suspended' },
  { slug: 'asus4', url: 'https://guitarchords.info/chords/asus4', symbol: 'Asus4', name: 'A suspended fourth', shape: 'x02230', tones: 'A D E', formula: '1 4 5', family: 'suspended' },
  { slug: 'esus4', url: 'https://guitarchords.info/chords/esus4', symbol: 'Esus4', name: 'E suspended fourth', shape: '022200', tones: 'E A B', formula: '1 4 5', family: 'suspended' },
  { slug: 'e5', url: 'https://guitarchords.info/chords/e5', symbol: 'E5', name: 'E power chord', shape: '022xxx', tones: 'E B', formula: '1 5', family: 'power' },
  { slug: 'a5', url: 'https://guitarchords.info/chords/a5', symbol: 'A5', name: 'A power chord', shape: 'x022xx', tones: 'A E', formula: '1 5', family: 'power' },
  { slug: 'd5', url: 'https://guitarchords.info/chords/d5', symbol: 'D5', name: 'D power chord', shape: 'xx023x', tones: 'D A', formula: '1 5', family: 'power' },
  { slug: 'g5', url: 'https://guitarchords.info/chords/g5', symbol: 'G5', name: 'G power chord', shape: '355xxx', tones: 'G D', formula: '1 5', family: 'power' },
  { slug: 'f-major', url: 'https://guitarchords.info/chords/f-major', symbol: 'F', name: 'F major', shape: '133211', tones: 'F A C', formula: '1 3 5', family: 'major' },
  { slug: 'b-minor', url: 'https://guitarchords.info/chords/b-minor', symbol: 'Bm', name: 'B minor', shape: 'x24432', tones: 'B D F#', formula: '1 b3 5', family: 'minor' },
  { slug: 'b-major', url: 'https://guitarchords.info/chords/b-major', symbol: 'B', name: 'B major', shape: 'x24442', tones: 'B D# F#', formula: '1 3 5', family: 'major' },
  { slug: 'f-sharp-minor', url: 'https://guitarchords.info/chords/f-sharp-minor', symbol: 'F#m', name: 'F# minor', shape: '244222', tones: 'F# A C#', formula: '1 b3 5', family: 'minor' },
  { slug: 'c-sharp-minor', url: 'https://guitarchords.info/chords/c-sharp-minor', symbol: 'C#m', name: 'C# minor', shape: 'x46654', tones: 'C# E G#', formula: '1 b3 5', family: 'minor' },
  { slug: 'g-minor', url: 'https://guitarchords.info/chords/g-minor', symbol: 'Gm', name: 'G minor', shape: '355333', tones: 'G Bb D', formula: '1 b3 5', family: 'minor' },
];

export const LIBRARY_SCALES: readonly LibraryScale[] = [
  { slug: 'major', url: 'https://guitarchords.info/scales/major', name: 'Major', formula: '1 2 3 4 5 6 7', steps: 'W W H W W W H', character: 'Bright, happy, the default for most pop and folk.' },
  { slug: 'natural-minor', url: 'https://guitarchords.info/scales/natural-minor', name: 'Natural minor', formula: '1 2 b3 4 5 b6 b7', steps: 'W H W W H W W', character: 'Darker, melancholy. Sad ballads, minor-key rock.' },
  { slug: 'major-pentatonic', url: 'https://guitarchords.info/scales/major-pentatonic', name: 'Major pentatonic', formula: '1 2 3 5 6', steps: 'W W W+H W W+H', character: 'Country, classic rock, melodic solos.' },
  { slug: 'minor-pentatonic', url: 'https://guitarchords.info/scales/minor-pentatonic', name: 'Minor pentatonic', formula: '1 b3 4 5 b7', steps: 'W+H W W W+H W', character: 'Rock and blues default: most lead guitar lives here.' },
  { slug: 'blues', url: 'https://guitarchords.info/scales/blues', name: 'Blues', formula: '1 b3 4 b5 5 b7', steps: 'W+H W H H W+H W', character: 'Minor pentatonic + the b5 “blue note.”' },
  { slug: 'dorian', url: 'https://guitarchords.info/scales/dorian', name: 'Dorian', formula: '1 2 b3 4 5 6 b7', steps: 'W H W W W H W', character: 'Jazz, funk, jam-band staple. Minor with a raised 6th.' },
  { slug: 'phrygian', url: 'https://guitarchords.info/scales/phrygian', name: 'Phrygian', formula: '1 b2 b3 4 5 b6 b7', steps: 'H W W W H W W', character: 'Dark minor mode with a flat 2. Spanish and metal color.' },
  { slug: 'lydian', url: 'https://guitarchords.info/scales/lydian', name: 'Lydian', formula: '1 2 3 #4 5 6 7', steps: 'W W W H W W H', character: 'Major mode with a raised 4th. Floating, cinematic.' },
  { slug: 'mixolydian', url: 'https://guitarchords.info/scales/mixolydian', name: 'Mixolydian', formula: '1 2 3 4 5 6 b7', steps: 'W W H W W H W', character: 'Major with a flat 7. Classic rock and Celtic.' },
  { slug: 'locrian', url: 'https://guitarchords.info/scales/locrian', name: 'Locrian', formula: '1 b2 b3 4 b5 b6 b7', steps: 'H W W H W W W', character: 'Diminished mode with flat 2 and flat 5. Theory study.' },
  { slug: 'harmonic-minor', url: 'https://guitarchords.info/scales/harmonic-minor', name: 'Harmonic minor', formula: '1 2 b3 4 5 b6 7', steps: 'W H W W H W+H H', character: 'Minor with a raised 7th. Strong dominant pull.' },
  { slug: 'melodic-minor', url: 'https://guitarchords.info/scales/melodic-minor', name: 'Melodic minor', formula: '1 2 b3 4 5 6 7', steps: 'W H W W W W H', character: 'Minor with raised 6th and 7th. Jazz minor vocabulary.' },
];

export interface LibrarySection {
  url: string;
  /** The page's live <title>, without the site-name suffix. */
  title: string;
  /** The page's live meta description. */
  description: string;
}

export const LIBRARY_SECTIONS: readonly LibrarySection[] = [
  { url: 'https://guitarchords.info', title: 'Guitar Chords: Free Chord Finder, Chart, Scales & Tuner', description: 'Free guitar chord chart with fingering diagrams, scale trainer, chromatic tuner, and metronome. No sign-up, no tracking.' },
  { url: 'https://guitarchords.info/chords', title: 'Guitar Chord Chart & Library: Free Fingering Diagrams', description: 'Free guitar chord chart with SVG fingering diagrams for open chords, barre chords, 7ths, maj7, min7, sus, and power chords. Standard tuning. No sign-up.' },
  { url: 'https://guitarchords.info/scales', title: 'Guitar Scales Chart: All Keys & Modes', description: 'Interactive guitar scale chart for all 12 keys. Major, minor, pentatonics, blues, and all 7 modes. Full neck visualization. Free, no sign-up.' },
  { url: 'https://guitarchords.info/tuner', title: 'Free Online Guitar Tuner: Chromatic, No Download', description: 'Free online chromatic guitar tuner. Works in the browser via Web Audio API, no app download, no sign-up. YIN pitch detection, sub-cent accuracy.' },
  { url: 'https://guitarchords.info/metronome', title: 'Free Online Metronome: Tap Tempo, BPM, Time Signatures', description: 'Free online metronome with tap tempo, adjustable BPM, and time signature support. Sample-accurate Web Audio scheduling. No download, no sign-up.' },
];

/** Root order for sorting chords within a family. */
const ROOT_ORDER = ['C', 'C#', 'D', 'E', 'F', 'F#', 'G', 'A', 'B'];

function rootOf(symbol: string): string {
  return symbol.length > 1 && symbol[1] === '#' ? symbol.slice(0, 2) : symbol.slice(0, 1);
}

export function chordsInFamily(family: ChordFamily): LibraryChord[] {
  return LIBRARY_CHORDS.filter((c) => c.family === family).sort(
    (a, b) =>
      ROOT_ORDER.indexOf(rootOf(a.symbol)) - ROOT_ORDER.indexOf(rootOf(b.symbol)) ||
      a.symbol.localeCompare(b.symbol),
  );
}
