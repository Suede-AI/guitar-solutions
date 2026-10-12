// The practice tools listed on /practice-tools.
//
// Every URL was fetched on 2026-10-11 and returned 200 with index/follow (or
// no robots meta) and a self-referencing canonical. `title` is the page's
// live <title> without the site-name suffix and `description` is its live
// meta description; `does` is a plain summary of what the page itself shows.
// Strumly's /coach route was left out: it redirects to app.suedeai.ai, which
// is noindex.

export interface PracticeTool {
  name: string;
  url: string;
  /** The page's live <title>, without the site-name suffix. */
  title: string;
  /** The page's live meta description. */
  description: string;
  /** What the product does, from its live page. */
  does: string;
}

export const PRODUCTS: readonly PracticeTool[] = [
  {
    name: 'Strumly',
    url: 'https://strumly.suedeai.ai',
    title: 'Strumly: AI Guitar Coach That Remembers Your Last Session',
    description:
      'AI guitar coach by Suede AI: real-time chord feedback, practice drills, and ear training. Free in early access; Pro $19.99/month for full practice history.',
    does:
      'Strumly listens while you play, scores every chord change in real time, and opens the next session with one specific drill picked from the last one. Audio stays on your device. Its browser toolkit, listed below, is free while Strumly is in early access, and the tuner stays free.',
  },
  {
    name: 'Suede Guitar Tuner & Studio',
    url: 'https://fretpulse.suedeai.ai',
    title: 'Online Guitar Tuner & Metronome',
    description:
      'Tune your guitar online with a chromatic tuner and metronome. Choose Standard E, Drop D, or alternate guitar tunings, check intonation, save setup notes.',
    does:
      'A tuner and metronome on the web and on iPhone, with an intonation coach that compares the open string to the 12th fret, a buzz scan, a bench diagnostic for setup problems, and a setup baseline for logging action and neck relief.',
  },
  {
    name: 'GuitarHub',
    url: 'https://guitarhub.org',
    title: 'Guitar Lessons & Practice Tools',
    description:
      'Explore guitar lessons with lifetime access, plus free practice routines and advanced drills. GuitarHub by Suede AI keeps web progress in your browser.',
    does:
      'GuitarHub builds a free 30-day practice plan around one goal, with a recording on day 1 and day 30 to compare. It has seven free browser tools, 15 free field guides, 105 guided lessons in seven stages, and an Advanced Lab of 23 scored drills.',
  },
  {
    name: 'guitar.solutions',
    url: 'https://guitar.solutions',
    title: 'The Signal Chain by Jason Colapietro',
    description:
      'The Signal Chain, Jason Colapietro’s book of 111 song lessons, with guides on impedance, gain staging and pedalboard order, and the Strumly coach.',
    does:
      'The original home of The Signal Chain and the signal chain guides. It now links to where each one lives on Strumly, including the free course that turns the book’s song lessons into a playing order.',
  },
  {
    name: 'Suede Sing',
    url: 'https://sing.suedeai.ai',
    title: 'Online Singing Practice with Live Pitch',
    description:
      'Online singing practice with live pitch feedback, warmups and songs. The pitch meter and range test are free; guided practice is 5 free minutes a day.',
    does:
      'For guitarists who sing: sing into the mic and see the note you are singing in real time, warm up with guided exercises, practice songs in your key, and take the vocal range test. It runs in the browser with no install.',
  },
];

export interface ToolGroup {
  heading: string;
  intro: string;
  tools: readonly { url: string; title: string; description: string }[];
}

// Strumly's toolkit, grouped close to the way Strumly's home page groups it
// (its "Tune up" bench diagnostic sits with the rig tools here).
export const STRUMLY_TOOL_GROUPS: readonly ToolGroup[] = [
  {
    heading: 'Start here',
    intro: 'The five tools Strumly points beginners to first.',
    tools: [
      {
        url: 'https://strumly.suedeai.ai/tuner',
        title: 'Free Guitar Tuner',
        description: 'A free in-browser guitar tuner. No sign-up, and audio never leaves your device.',
      },
      {
        url: 'https://strumly.suedeai.ai/chords',
        title: 'Guitar Chord Library',
        description:
          'Guitar chord library — open, barre, 7th, maj7, min7, sus, and power chord shapes for standard tuning, with fingerings you can read at a glance.',
      },
      {
        url: 'https://strumly.suedeai.ai/strumming',
        title: 'Strumming Patterns for Guitar: Free Trainer',
        description:
          'Practice down/up strum patterns synced to tempo, with distinct audio for each direction. Presets plus a custom pattern builder.',
      },
      {
        url: 'https://strumly.suedeai.ai/hero',
        title: 'Play Along Guitar Songs: Real-Time Feedback',
        description:
          'Pick a song and hear it played. Then turn on your microphone and play along: Strumly scores every chord change in real time, in your browser.',
      },
      {
        url: 'https://strumly.suedeai.ai/path',
        title: 'Beginner Guitar Lessons: A Free Practice Path',
        description:
          'A free, leveled guitar course in three stages: Foundations, Repertoire & tone, and Train with the coach. Each step links to a Strumly tool. No sign-up.',
      },
    ],
  },
  {
    heading: 'Keep time and keep practicing',
    intro: 'Timing, repetition, and the habit itself.',
    tools: [
      {
        url: 'https://strumly.suedeai.ai/metronome',
        title: 'Free Online Metronome with Tap Tempo',
        description: 'In-browser metronome with tap tempo and time signatures. Set the pulse and keep the take honest.',
      },
      {
        url: 'https://strumly.suedeai.ai/speed-trainer',
        title: 'Metronome Speed Trainer: Gradual BPM Ramp',
        description:
          'Set a start and target tempo and let the metronome ramp up in small steps or a smooth climb. Muted bars test your internal timing. In-browser.',
      },
      {
        url: 'https://strumly.suedeai.ai/looper',
        title: 'Practice Looper — Record & Play Back',
        description:
          'Record a quick take of yourself playing and play it back instantly — 100% in-browser, nothing leaves your device.',
      },
      {
        url: 'https://strumly.suedeai.ai/backing-tracks',
        title: 'Guitar Backing Tracks — Loop a Rhythm Section',
        description:
          'Loop a rhythm section behind any chord progression — pick a song or type your own, set the tempo, and practice with real rhythm instead of a bare click.',
      },
      {
        url: 'https://strumly.suedeai.ai/fretboard-trainer',
        title: 'Fretboard Trainer — Learn the Notes on Guitar',
        description:
          'Two 60-second drills — name the lit note or find it on the neck. Pick your strings and fret range, build a streak, and see which zones need work.',
      },
      {
        url: 'https://strumly.suedeai.ai/streak',
        title: 'Practice Streak & Badges',
        description:
          'Practice days, streaks, and badges for finished lessons and quizzes — tracked on this device, free, no account.',
      },
      {
        url: 'https://strumly.suedeai.ai/virtual-guitar',
        title: 'Virtual Guitar Online | Play Guitar in Your Browser',
        description:
          'Play an interactive virtual guitar online with standard guitar, electric synth, and bass synth voices. Use a pointer, touch, or keyboard. No sign-up.',
      },
    ],
  },
  {
    heading: 'Train your ear and learn songs',
    intro: 'Scales, intervals, and the songs to use them on.',
    tools: [
      {
        url: 'https://strumly.suedeai.ai/scales',
        title: 'Guitar Scale Trainer',
        description:
          'Interactive guitar fretboard for every key and seven essential scales — major, natural minor, pentatonic, blues, dorian, and mixolydian.',
      },
      {
        url: 'https://strumly.suedeai.ai/ear-trainer',
        title: 'Guitar Ear Trainer — Free Interval & Chord Quiz',
        description: 'In-browser ear trainer for guitarists. Hear two notes, name the interval — all twelve, from minor 2nd to octave.',
      },
      {
        url: 'https://strumly.suedeai.ai/songs',
        title: 'Easy Guitar Songs',
        description:
          'Chord progressions for popular guitar songs — Wonderwall, Stand By Me, Three Little Birds, Hallelujah, and more — with verified keys, capos, and tempos.',
      },
      {
        url: 'https://strumly.suedeai.ai/transpose',
        title: 'Guitar Chord Transposer',
        description:
          'Transpose any chord progression to a new key or capo position instantly. Pick a canonical song or type your own chords.',
      },
    ],
  },
  {
    heading: 'Work out the theory',
    intro: 'Find a chord, a key, or a progression, then take it to the fretboard.',
    tools: [
      {
        url: 'https://strumly.suedeai.ai/circle-of-fifths',
        title: 'Interactive Circle of Fifths: Keys & Chords',
        description:
          'Click any key to see its signature, relative minor, all seven diatonic chords, and common progressions — with audio playback. Built for guitarists.',
      },
      {
        url: 'https://strumly.suedeai.ai/keys',
        title: 'Chords by Key: All 24 Major & Minor Keys',
        description:
          'Every diatonic triad and seventh chord in all 24 guitar keys, with key signatures, Roman numerals, and the progressions built from them.',
      },
      {
        url: 'https://strumly.suedeai.ai/chord-identifier',
        title: 'Reverse Chord Finder — Identify Any Guitar Chord',
        description:
          'Tap a shape on an interactive fretboard and get every matching chord name, ranked — with interval spelling and slash-chord notation.',
      },
      {
        url: 'https://strumly.suedeai.ai/capo',
        title: 'Guitar Capo Calculator and Chord Converter',
        description:
          'Pick the key a song sounds in and get every capo position with the open shapes to play, ranked by ease. Includes a full capo chart and chord converter.',
      },
      {
        url: 'https://strumly.suedeai.ai/progression-generator',
        title: 'Chord Progression Generator by Key & Mood',
        description:
          'Generate a 4-chord guitar progression in any key. Pick a mood, shuffle, lock chords you like, and play it back.',
      },
    ],
  },
  {
    heading: 'Build and check your rig',
    intro: 'Plan the board, hear the amp, and triage setup problems.',
    tools: [
      {
        url: 'https://strumly.suedeai.ai/rig',
        title: 'Rig — Signal Chain Builder',
        description: 'Build your pedalboard signal chain and see power draw, noise risk, and gain-stack stats update live.',
      },
      {
        url: 'https://strumly.suedeai.ai/amp-lab',
        title: 'Online Guitar Amp Simulator: Live Amp Modeling',
        description:
          'Free live guitar amp modeling in your browser. Plug in your mic and hear your guitar through real neural amp models in real time. No sign-up, no app.',
      },
      {
        url: 'https://strumly.suedeai.ai/bench',
        title: 'Guitar Setup Diagnostic: Fret Buzz & Action',
        description:
          'Free AI guitar-tech triage. Describe a symptom like buzzing strings, intonation or action height and get likely causes and what to try first. No sign-up.',
      },
    ],
  },
];

/** Every outbound URL on the page, for tests and link audits. */
export function allPracticeToolUrls(): string[] {
  return [
    ...PRODUCTS.map((p) => p.url),
    ...STRUMLY_TOOL_GROUPS.flatMap((g) => g.tools.map((t) => t.url)),
  ];
}
