// Facts for the /the-signal-chain page.
//
// Every value below was read from the book's live listing on 2026-10-11:
//   https://strumly.suedeai.ai/book          (listing, contents, colophon, price)
//   https://strumly.suedeai.ai/book/catalog  (the line on The Guitar Without a Number)
//   https://strumly.suedeai.ai/book/lessons/* and /book/print-the-quiet (titles, descriptions)
// guitar.solutions/THE-SIGNAL-CHAIN-WORKBOOK.html 308s to the listing, and
// guitar.solutions itself is the book's original home (200, self-canonical).
//
// The listing does not say how the edition is delivered (print, PDF, or read
// online), so the page does not either. Update this file from the listing, not
// from memory.

export const BOOK_LISTING_URL = 'https://strumly.suedeai.ai/book';
export const BOOK_ENTITY_ID = 'https://strumly.suedeai.ai/book#book';
export const BOOK_CATALOG_URL = 'https://strumly.suedeai.ai/book/catalog';
export const BOOK_ORIGINAL_HOME_URL = 'https://guitar.solutions';

export const BOOK_FACTS = {
  title: 'The Signal Chain',
  author: 'Jason Colapietro, writing as Johnny Suede',
  imprint: 'Johnny Suede Press',
  edition: 'The complete & final edition',
  chapters: 66,
  workshops: 111,
  price: '$19.99',
  freeSampleLessons: 4,
  freeEssays: 9,
} as const;

export interface BookPart {
  name: string;
  chapters: number;
  workshops: number;
}

// The contents as the listing groups them. Chapters sum to 66 and workshops to
// 111, the totals the listing states; lib/__tests__ holds that invariant.
export const BOOK_PARTS: readonly BookPart[] = [
  { name: 'Front Matter', chapters: 1, workshops: 0 },
  { name: 'Six Strings, No Serial Number', chapters: 4, workshops: 0 },
  { name: 'Learning the Language', chapters: 1, workshops: 0 },
  { name: 'Part I: Foundations', chapters: 4, workshops: 0 },
  { name: 'Part II: Birth of Amplification', chapters: 5, workshops: 5 },
  { name: 'Part III: The British Invasion', chapters: 4, workshops: 6 },
  { name: 'Part IV: The First Effects', chapters: 5, workshops: 5 },
  { name: 'Part V: The Pedal Revolution', chapters: 7, workshops: 9 },
  { name: 'Part VI: High Gain & the Modern Era', chapters: 6, workshops: 7 },
  { name: 'Part VII: Tone in Practice — The Players', chapters: 11, workshops: 18 },
  { name: 'Part VIII: Building Your Rig', chapters: 4, workshops: 0 },
  { name: 'The Player’s Gear', chapters: 5, workshops: 0 },
  { name: 'The Songbook', chapters: 3, workshops: 0 },
  { name: 'Epilogue', chapters: 1, workshops: 0 },
  { name: 'Appendices', chapters: 5, workshops: 0 },
  { name: 'The Expanded Workbook — 90s to Now, and Johnny’s Favorites', chapters: 0, workshops: 61 },
];

/** Part VIII chapter titles, numbered as the listing numbers them. */
export const BUILDING_YOUR_RIG_CHAPTERS: readonly { number: number; title: string }[] = [
  { number: 43, title: 'Signal Chain Order: Why Sequence Is Tone' },
  { number: 44, title: 'Gain Staging: The Art of Stacking Dirt' },
  { number: 45, title: 'Building the Pedalboard: Power, Buffers, and Signal Integrity' },
  { number: 46, title: 'Matching Tone to the Music: Choosing Your Voice' },
];

/** The Expanded Workbook's sections and workshop counts. */
export const EXPANDED_WORKBOOK: readonly { name: string; workshops: number }[] = [
  { name: 'The 90s', workshops: 10 },
  { name: 'The 2000s', workshops: 7 },
  { name: 'The 2010s', workshops: 5 },
  { name: 'Now', workshops: 3 },
  { name: 'Johnny’s Favorites', workshops: 36 },
];

export interface SampleLesson {
  number: number;
  song: string;
  artist: string;
  url: string;
  /** The lesson page's live meta description. */
  description: string;
}

export const SAMPLE_LESSONS: readonly SampleLesson[] = [
  {
    number: 14,
    song: 'Purple Haze',
    artist: 'The Jimi Hendrix Experience',
    url: 'https://strumly.suedeai.ai/book/lessons/lesson-purple-haze',
    description:
      'How Purple Haze gets its sound: Fuzz Face, Octavia, a Strat and a loud Marshall. The rig, a budget recipe, the theory, and original tab drills.',
  },
  {
    number: 22,
    song: 'Comfortably Numb',
    artist: 'Pink Floyd (David Gilmour)',
    url: 'https://strumly.suedeai.ai/book/lessons/lesson-comfortably-numb',
    description:
      'The Comfortably Numb solo tone: Big Muff bloom, long delay, a clean Fender-style platform. The rig, a budget recipe, the theory, and original tab drills.',
  },
  {
    number: 28,
    song: 'Pride and Joy',
    artist: 'Stevie Ray Vaughan & Double Trouble',
    url: 'https://strumly.suedeai.ai/book/lessons/lesson-pride-and-joy',
    description:
      'The Pride and Joy shuffle decoded: Tube Screamer into a pushed Fender amp, heavy strings, right-hand technique. Rig, budget recipe, theory, tab drills.',
  },
  {
    number: 38,
    song: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    url: 'https://strumly.suedeai.ai/book/lessons/lesson-smells-like-teen-spirit',
    description:
      'The quiet-loud detonation decoded: a cheap offset, a Boss DS-1, a clean amp doing the contrast. Rig, budget recipe, theory, and original tab drills.',
  },
];

export const PRINT_THE_QUIET = {
  url: 'https://strumly.suedeai.ai/book/print-the-quiet',
  title: 'Print the Quiet',
  description:
    'Nine free essays on tone and dynamics: Buckley’s Hallelujah, the loudness war in numbers, the religion of the compressor and more, by Jason Colapietro.',
  /** The first four essay titles, as the listing shows them. */
  firstEssays: [
    'Jeff Buckley’s Hallelujah: The Tone That Won the Song',
    'The Loudness War, in Numbers',
    'The Religion of the Compressor',
    'The Lost Art of Clean',
  ],
} as const;

export const FREE_LESSONS_URL = 'https://strumly.suedeai.ai/book/lessons';
