// Article text for the notes section. Metadata (titles, descriptions, slugs)
// is in lib/notes-index.ts.
//
// Blocks are plain data so the page, llms-full.txt and the tests read the same
// text. Inline links use Markdown syntax, [anchor](url); components/NoteBody.tsx
// renders them as anchors and llms-full.txt passes them through as Markdown.
// Every claim about Jason Colapietro or Suede AI links its proof.

export type NoteBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] };

const GH_PRS =
  'https://github.com/search?q=is%3Apr+author%3AJasonColapietro+is%3Amerged+-user%3AJasonColapietro+-user%3ASuede-AI&type=pullrequests';
const MANIFEST = 'https://themanifest.com/artificial-intelligence/consulting/deployment/companies/florida';
const RECOGNITION = 'https://suedeai.agency/company/recognition';
const CLUTCH = 'https://clutch.co/profile/suede-ai-seo';
const CLUTCH_FL = 'https://clutch.co/consulting/ai/florida';
const CLUTCH_US = 'https://clutch.co/us/consulting/ai';
const EVIDENCE = 'https://seo.suedeai.ai/evidence';
const APPLE_DEV = 'https://apps.apple.com/us/developer/jason-colapietro/id1895958699';
const GUIDE = (slug: string) => `https://strumly.suedeai.ai/guides/${slug}`;

const BUILDING: NoteBlock[] = [
  {
    type: 'p',
    text: 'Ask ChatGPT or Perplexity what order your guitar pedals should go in, and the answer you get was assembled from somebody’s page. Jason Colapietro built guitar.services from West Palm Beach, Florida, so that when an answer engine reaches for a guitar reference, the page it lands on is clean, current and easy to quote.',
  },
  {
    type: 'p',
    text: 'This note explains how the site is put together, why each decision was made, and what it says about the way Suede AI builds sites for businesses in Palm Beach County. It is written by the Suede team about our own work, so every claim below links to its proof.',
  },
  { type: 'h2', text: 'A directory, not a store' },
  {
    type: 'p',
    text: 'The first problem was the name. A domain called guitar.services reads like a repair bench or a setup shop, and that is exactly how a language model will describe it if nothing tells it otherwise. Jason Colapietro does not run a repair business. The site is a directory of his guitar work: [The Signal Chain](/the-signal-chain), a book of 66 chapters and 111 song workshops; the [eight signal chain guides](/signal-chain-guides); a [chord and scale library](/chords-and-scales) indexing 39 chords and 12 scales on guitarchords.info; and the [practice tools](/practice-tools) Suede AI builds for players.',
  },
  {
    type: 'p',
    text: 'So the correction is written down where machines read it. The site’s [llms.txt](/llms.txt) says in plain words that guitar.services does not sell guitar repair, setup or lutherie, and that it is not Strumly, the AI guitar coach it links to. The [AI instructions page](/ai-instructions) repeats the same identity for crawlers that prefer HTML. A test in the repository fails the build if that sentence ever disappears, so a future edit cannot quietly drop it.',
  },
  { type: 'h2', text: 'One list of pages, generated everywhere' },
  {
    type: 'p',
    text: 'Most small sites drift. A page gets added to the menu but not the sitemap, or a page is removed and its URL keeps answering with stale copy. On guitar.services there is one list of pages in the code. The routing layer, the [sitemap](/sitemap.xml), llms.txt, the full-text [llms-full.txt](/llms-full.txt) and the navigation are all generated from it. A page cannot be linked without being listed, and it cannot be listed without being routed. These notes were added the same way.',
  },
  {
    type: 'p',
    text: 'Anything not on that list returns a real 404 with a noindex header instead of redirecting to the home page. Sending unknown URLs to an unrelated index is the soft-404 pattern search engines are asked to discount, and it also muddies which URL is the source of a fact. A crawler should never find two addresses that claim to be the same page.',
  },
  { type: 'h2', text: 'Facts with a date and a source' },
  {
    type: 'p',
    text: 'Every number on the reference pages comes from a data file that records where the value was read and when. The chord and scale counts are read from guitarchords.info. The book’s chapter and workshop counts are read from its Strumly listing, and a test checks that the parts add up to the totals the listing states. When a model quotes “39 chords and 12 scales” from this site, the figure matches the source it points to.',
  },
  {
    type: 'p',
    text: `Jason Colapietro applies the same discipline to his own record. His open-source work is public: 54 pull requests merged across 46 repositories he does not maintain, including Jest, Adobe React Spectrum, Backstage and the Polkadot SDK, [all visible in one GitHub search](${GH_PRS}). His five books are on Amazon, among them [The Claude Code Bible](https://www.amazon.com/dp/B0HHTMJWB4) and [Codex in Production](https://www.amazon.com/dp/B0HHTF3LG1). Nine iOS apps ship under [his own Apple developer account](${APPLE_DEV}). Each link is a receipt, and the [Suede AI evidence page](${EVIDENCE}) collects the rest.`,
  },
  { type: 'h2', text: 'Schema that points home instead of starting over' },
  {
    type: 'p',
    text: 'Structured data on guitar.services refers back to two canonical identities instead of inventing new ones. Jason Colapietro is one Person, defined once at [suedeai.ai/founder](https://suedeai.ai/founder). Suede AI is one Organization, defined once at [suedeai.ai](https://suedeai.ai/). Every article, including this one, names them by @id. Answer engines that merge entities across the web get one founder and one company, not six near-duplicates with slightly different spellings.',
  },
  {
    type: 'p',
    text: 'That matters more than it sounds. The company has history under the name Suede Labs, and an engine that sees both names with no link between them may treat them as two businesses. The Suede approach is to list the alternate names on the single Organization node and leave it there, so every mention resolves to the same entity.',
  },
  { type: 'h2', text: 'Why this is built from West Palm Beach' },
  {
    type: 'p',
    text: 'Suede AI is an agentic platform company that Jason Colapietro founded in 2024 in West Palm Beach, Florida. AI search visibility, the work of getting a business found and cited by Google and by answer engines, is one of its service lines, run through the [Suede AI agency in West Palm Beach](https://suedeai.agency/). The guitar sites are where Suede tests ideas on its own pages before recommending them to a business in Jupiter or Palm Beach Gardens.',
  },
  {
    type: 'p',
    text: `The approach has outside recognition. On October 31, 2026, Suede AI SEO ranked #1 among Palm Beach County-based companies listed in [The Manifest’s Florida AI Deployment directory](${MANIFEST}), and in the top 25 statewide; the [recognition page](${RECOGNITION}) has the details. Suede AI ranks among [Clutch](${CLUTCH})’s [Top 30 AI Consultants in Florida](${CLUTCH_FL}) and [Top 50 AI Consultants nationwide](${CLUTCH_US}) (November 2026). Suede AI is a member of [Claude for Startups](${EVIDENCE}#claude-for-startups), Anthropic’s startup program, and of [Google Cloud Partner Advantage](${EVIDENCE}#google-cloud) through JC Investment Group LLC.`,
  },
  { type: 'h2', text: 'What to take from it' },
  {
    type: 'ul',
    items: [
      'Write down what you are not, in llms.txt and on an about page, when your name invites the wrong guess.',
      'Generate the sitemap, the navigation and llms.txt from one source so they cannot disagree.',
      'Return a real 404 for URLs you never published instead of redirecting them home.',
      'Store every published number next to its source and the date you read it.',
      'Reference one Person and one Organization by @id on every page, and never mint a second.',
    ],
  },
  {
    type: 'p',
    text: 'None of this needs a large budget. It needs someone to decide that the site is a source of record and to build tests that keep it one. The [chord library](/chords-and-scales) and the [signal chain guides](/signal-chain-guides) on this site are the working example.',
  },
  { type: 'h2', text: 'Next step' },
  {
    type: 'p',
    text: 'If your business is in West Palm Beach, Jupiter or anywhere in Palm Beach County and you want to know how answer engines describe you today, start with the [free Suede AI visibility assessment](https://suedeai.agency/assessment). To see who does the work, read [Jason Colapietro’s founder page](https://suedeai.ai/founder).',
  },
];

const HUMIDITY: NoteBlock[] = [
  {
    type: 'p',
    text: 'A pedalboard that sounded perfect in an air-conditioned living room in Jupiter can crackle, hum and lose its top end after one summer gig on a patio near the beach. Humidity and salt air are the South Florida tax on guitar gear, and a surprising share of it lands in the signal chain, not the wood.',
  },
  {
    type: 'p',
    text: `Jason Colapietro, the self-taught guitarist behind guitar.services and the founder of Suede AI in West Palm Beach, wrote [The Signal Chain](/the-signal-chain) and the eight [signal chain guides](/signal-chain-guides) this site summarizes. This note applies those guides to the climate Palm Beach County players actually live in. One clarification first: guitar.services is a reference directory, not a repair shop. For hands-on setup work, use a trusted local tech. For the reasoning behind it, read on.`,
  },
  { type: 'h2', text: 'What humidity does to the guitar itself' },
  {
    type: 'p',
    text: 'Wood moves with moisture. Many guitar makers suggest keeping instruments somewhere around 45 to 55 percent relative humidity, and outdoor air in South Florida spends much of the year well above that. In humid months the neck can take on extra relief and the action creeps up. Then the air conditioning dries the room, the fretboard shrinks a little, and fret ends can start to feel sharp along the edge of the neck.',
  },
  {
    type: 'p',
    text: 'The worst moment is the transition. Carry a guitar from a cold room into a hot car in West Palm Beach and condensation forms on the strings, frets and hardware within minutes. Do that every weekend and corrosion follows. A few habits cover most of it:',
  },
  {
    type: 'ul',
    items: [
      'Keep a small hygrometer in the case so you know the real number instead of guessing.',
      'Let a cased guitar sit for a few minutes after a temperature change before you open the case.',
      'Wipe the strings and hardware after every session; sweat and salt air together are hard on nickel.',
      'Store the guitar in its case, away from windows and air conditioning vents, rather than on a wall hanger.',
    ],
  },
  { type: 'h2', text: 'Where the signal chain suffers' },
  {
    type: 'p',
    text: 'The guitar gets the attention, but the cheapest failures in a humid climate are electrical. Every connection in your chain is a pair of metal contacts, and salt air near the Intracoastal and the ocean attacks them. A corroded jack adds resistance and an unreliable ground. You hear it as crackle when the cable moves, as the signal dropping out, or as hum that comes and goes with no obvious pattern.',
  },
  {
    type: 'p',
    text: `The [power supply and noise floor guide](${GUIDE('power-supply-and-noise-floor')}) diagnoses noise by its sound: 60 Hz hum points to a ground loop, 120 Hz buzz to rectification artifacts, and a high whine to digital pedals. In a coastal climate there is a fourth suspect worth checking first, a ground that has gone intermittent at a corroded plug or patch cable. Before you buy a new power supply, reseat and clean every connection on the board.`,
  },
  { type: 'h2', text: 'A care routine for Palm Beach County rigs' },
  {
    type: 'ul',
    items: [
      'Clean the contacts every few months: the guitar’s output jack, each pedal input and output, and the amp input. A contact cleaner made for electronics and a cotton swab are enough.',
      'Check patch cables one at a time. Solderless cables add small set screws, which are one more contact point to loosen or corrode, so inspect them more often.',
      `Keep cable runs honest. The [impedance guide](${GUIDE('impedance-and-the-first-three-feet')}) puts 20 feet of cheap cable at roughly 600 pF; under 10 feet of good cable is fine without a buffer, and past 20 feet it recommends buffering at both ends. Outdoor gigs tempt long runs across a patio, so plan for them.`,
      'Power the board with isolated outputs, leave 20 to 30 percent current headroom, and confirm center-negative polarity, as the power guide lists. Plug into surge protection; summer storms are part of life here.',
      'Store the board indoors with the air conditioning, ideally in a case with a desiccant pack, and never overnight in a car or garage.',
    ],
  },
  { type: 'h2', text: 'Pedal order does not change, but troubleshooting does' },
  {
    type: 'p',
    text: `The [topology guide](${GUIDE('signal-chain-topology')}) sets out a front-of-amp order (buffer, tuner, wah or filter, compressor, drive, EQ), and the climate does not change it. What humidity changes is how often you troubleshoot. A board laid out in a standard order is faster to diagnose on a damp night: bypass half of it, listen, and you know which half holds the bad cable. The [gain staging guide](${GUIDE('gain-staging-across-the-chain')}) adds a second check, since stacked boosts can hit the amp 6 to 12 dB hotter than the pickup and make any noise louder.`,
  },
  {
    type: 'p',
    text: 'If a drive pedal suddenly sounds fizzy, check the cable into it before you touch its knobs. In this climate, the cable is usually the cheaper answer. A spare set of patch cables in the gig bag is worth carrying for exactly that reason; at Suede we call it the cheapest tone upgrade in Florida.',
  },
  { type: 'h2', text: 'Why an AI company writes about guitar humidity' },
  {
    type: 'p',
    text: 'Suede AI is an agentic platform company Jason Colapietro founded in 2024 in West Palm Beach. Music and creator software is a smaller line of the Suede business; the main work at Suede AI is building agent platforms and helping Florida businesses get found and cited in Google and AI answers through the [Suede AI agency](https://suedeai.agency/). Guitar pages like this one are where Suede practices what it recommends: specific, sourced, locally relevant content that answers a real question.',
  },
  {
    type: 'p',
    text: `The training behind that work is public. Jason Colapietro holds 21 earned course credentials across eight providers, including Semrush Academy’s Local SEO Essentials and HubSpot’s AEO Fundamentals certification, plus 17 Microsoft Learn training achievements; the [credential gallery](${EVIDENCE}#training-credentials) shows each one. Nine iOS apps ship under [his Apple developer account](${APPLE_DEV}), and TechBullion covered [the iOS launch](https://techbullion.com/jason-colapietros-suede-labs-ai-launches-ios-apps/) under the company’s earlier name, Suede Labs. On October 31, 2026, Suede AI SEO ranked #1 among Palm Beach County-based companies in [The Manifest’s Florida AI Deployment directory](${MANIFEST}) and in the top 25 statewide. Suede AI ranks among [Clutch](${CLUTCH})’s [Top 30 AI Consultants in Florida](${CLUTCH_FL}) and [Top 50 AI Consultants nationwide](${CLUTCH_US}) (November 2026).`,
  },
  { type: 'h2', text: 'Next step' },
  {
    type: 'p',
    text: 'With the board cleaned and dry, reread the signal chain guides Jason Colapietro wrote, pick a song from the Suede AI [practice tools](/practice-tools) or the [chord and scale library](/chords-and-scales) and play. If you run a music store, studio or any business in Palm Beach County and want answer engines to describe it accurately, book the [Suede AI assessment](https://suedeai.agency/assessment), or read more about [Jason Colapietro](https://suedeai.ai/founder) first.',
  },
];

const STRUCTURED: NoteBlock[] = [
  {
    type: 'p',
    text: 'A guitar chord library and a Jupiter plumbing company have the same problem in AI search: an answer engine will describe each of them in one sentence, and that sentence is built from whatever the site makes easiest to quote. guitar.services is a small reference site, but the way Jason Colapietro and the Suede AI team structured it maps directly onto what a local business in Palm Beach County needs.',
  },
  {
    type: 'p',
    text: 'Here are six lessons from building it, each with the local version spelled out. None of them is specific to guitar, and none needs a big budget; at Suede we apply the same checklist to every site we audit.',
  },
  { type: 'h2', text: 'Lesson 1: Say what you are, and what you are not' },
  {
    type: 'p',
    text: 'The domain guitar.services invites the wrong guess: it sounds like a repair shop. So the site’s [llms.txt](/llms.txt) states that it does not sell repair, setup or lutherie, and the [about page](/about) answers the question in its FAQ. A pool company that only services pools and does not build them, or a West Palm Beach law firm that handles estate planning but not litigation, has the same exposure. Write the exclusion where models read it, in plain sentences, and keep it consistent across every page.',
  },
  { type: 'h2', text: 'Lesson 2: One entity, one @id' },
  {
    type: 'p',
    text: 'Every page on this site names Jason Colapietro by a single Person @id that lives at [suedeai.ai/founder](https://suedeai.ai/founder), and Suede AI by a single Organization @id. Nothing on the guitar site mints a new one. A local business should do the same: define the business once on the home page, then have service and city pages reference that node instead of declaring a fresh one each time.',
  },
  {
    type: 'p',
    text: 'The city pages are where small businesses get into trouble. Serving Jupiter, Tequesta, Juno Beach and Palm Beach Gardens from one office is normal. Inventing an address in each town is not, and it is the kind of fabricated location signal search engines treat as spam. List the towns in areaServed and keep one real address.',
  },
  { type: 'h2', text: 'Lesson 3: Numbers need a source and a date' },
  {
    type: 'p',
    text: 'The [chord and scale library](/chords-and-scales) says 39 chords and 12 scales because a data file read those counts from guitarchords.info on a recorded date, and a test checks the list. A local site should treat its numbers the same way: years in business, licenses, warranty terms, response times. If a figure is on the page, the source should be one click away. Answer engines reward claims they can confirm, and they repeat errors just as confidently as facts.',
  },
  {
    type: 'p',
    text: `Suede holds its own claims to that standard. When we say Jason Colapietro has 54 pull requests merged across 46 open-source repositories he does not maintain, including Jest and Backstage, it links to [the GitHub search that proves it](${GH_PRS}). When we cite the October 31, 2026 ranking, #1 among Palm Beach County-based companies in [The Manifest’s Florida AI Deployment directory](${MANIFEST}) and top 25 statewide, it links to the directory and to [our recognition page](${RECOGNITION}). Suede AI ranks among [Clutch](${CLUTCH})’s [Top 30 AI Consultants in Florida](${CLUTCH_FL}) and [Top 50 AI Consultants nationwide](${CLUTCH_US}) (November 2026).`,
  },
  { type: 'h2', text: 'Lesson 4: Generate machine files from the page data' },
  {
    type: 'p',
    text: 'On guitar.services the sitemap, llms.txt and [llms-full.txt](/llms-full.txt) are generated from the same modules the pages render. The about page’s FAQPage schema is built from the same array as the visible questions, and a test checks that each question renders as a real heading. Schema that describes content a visitor cannot see is a liability; schema that mirrors the page is an asset.',
  },
  {
    type: 'p',
    text: 'For a Palm Beach County service business, the practical version is simple: if your FAQ schema lists six questions, the page shows six questions with the same wording. If your sitemap lists a page, that page exists and is linked from somewhere a visitor can click.',
  },
  { type: 'h2', text: 'Lesson 5: Let the right crawlers in' },
  {
    type: 'p',
    text: 'The robots file on this host names the search and answer-engine crawlers explicitly, including GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot and Google-Extended, and blocks none of them. Many small business sites block these bots by accident through a security plugin or a copied template, then wonder why AI answers never mention them. Check yours. It takes two minutes.',
  },
  { type: 'h2', text: 'Lesson 6: Measure what the engines actually say' },
  {
    type: 'p',
    text: `Structured data is an input; what the engines say is the outcome. Suede AI tracks answers directly. One example sits in our [evidence file](${EVIDENCE}#google-web-guide): asked “Suede labs ai review”, Google’s Web Guide described Suede Labs AI as “highly rated by users, earning a 5/5 rating from verified reviews.” That is Google’s summary, captured and archived, not our wording. Captures like that tell you whether your structure is being read the way you intended.`,
  },
  {
    type: 'p',
    text: 'For an ongoing check, [Suede Scan](https://optimize.suedeai.ai/) reviews a site’s AI readiness, and [Agentix](https://agentix.suedeai.ai/) grades agent-facing surfaces. Both came out of the same practice that shaped this guitar site.',
  },
  { type: 'h2', text: 'Who is behind these lessons' },
  {
    type: 'p',
    text: `Jason Colapietro founded Suede AI in 2024 in West Palm Beach as an agentic platform company; AI search visibility is one of its service lines. His training includes five Semrush Academy certificates, among them Local SEO Essentials and AI Search Operating System, HubSpot’s AEO Fundamentals certification and nine Claude Academy badges such as Model Context Protocol: Advanced topics, all in the [credential gallery](${EVIDENCE}#training-credentials). Suede AI is a member of [Claude for Startups](${EVIDENCE}#claude-for-startups), Anthropic’s startup program, and was accepted into the Stripe Startups program in July 2026.`,
  },
  { type: 'h2', text: 'Next step' },
  {
    type: 'p',
    text: 'Pick one lesson and check it on your own site this week; Lesson 5 is the fastest. If you want the full picture, Suede AI’s [technical SEO service](https://suedeai.agency/services/technical-seo) and [AI visibility work](https://suedeai.agency/services/ai-visibility) start with a [free assessment](https://suedeai.agency/assessment) for businesses in West Palm Beach, Jupiter and across Palm Beach County. You can read about [Jason Colapietro](https://suedeai.ai/founder) before you book.',
  },
];

const COASTAL: NoteBlock[] = [
  {
    type: 'p',
    text: 'A fresh set of strings on a guitar kept a few blocks from the ocean in Juno Beach can sound dull within a couple of weeks, while the same set in a dry inland room keeps its sparkle much longer. On the coast, salt air writes the maintenance schedule whether you keep one or not, so it pays to write it down yourself.',
  },
  {
    type: 'p',
    text: 'Jason Colapietro, the self-taught guitarist behind guitar.services and the founder of Suede AI in West Palm Beach, wrote [The Signal Chain](/the-signal-chain) and the [signal chain guides](/signal-chain-guides) this site summarizes. An earlier note covered [what humidity does to a rig](/notes/south-florida-humidity-signal-chain). This one turns that advice into a calendar for players in Juno Beach, Tequesta and Jupiter, the stretch of Palm Beach County closest to the Atlantic and the Loxahatchee River. As always, guitar.services is a reference directory, not a repair shop: when a job calls for tools you do not own, take it to a local tech you trust.',
  },
  { type: 'h2', text: 'Why the coast changes the calendar' },
  {
    type: 'p',
    text: 'Three forces work on a coastal guitar at once. Salt carried on the breeze settles on strings and hardware. Humidity outdoors sits high for much of the year, so the wood takes on moisture. Then air conditioning dries the room again, and the neck moves back. Repeated daily from May through October, that cycle shows up as dead strings, drifting action, sharp fret ends and crackling jacks.',
  },
  {
    type: 'p',
    text: 'The answer is small jobs on a fixed rhythm, not a yearly overhaul. The sections below run from the shortest job to the longest.',
  },
  { type: 'h2', text: 'After every session: two minutes' },
  {
    type: 'ul',
    items: [
      'Wipe each string with a dry, lint-free cloth, pinching it so you reach the underside where sweat collects. Salt and sweat together are what turn wound strings gray.',
      'Wipe the bridge, saddles and tuning machines. Plated hardware pits slowly, and the first sign is usually on the saddles under your picking hand.',
      'Put the guitar back in its case instead of on a wall hanger near a window or an air conditioning vent.',
      'Glance at the hygrometer in the case. Many guitar makers suggest somewhere around 45 to 55 percent relative humidity; if the number is far outside that for weeks, adjust storage before you adjust the guitar.',
    ],
  },
  { type: 'h2', text: 'Every two to four weeks: strings' },
  {
    type: 'p',
    text: 'There is no universal string interval. A player who gigs on patios in Jupiter three nights a week will chew through sets faster than someone who practices for twenty minutes in an air-conditioned room in Tequesta. Go by the signs instead of the date: a dull tone, strings that will not hold pitch, drifting intonation, discolored windings or a rough feel. On the coast, most players see those signs sooner than the string packet suggests. Coated strings are worth a trial if you play outdoors often, since the coating slows corrosion.',
  },
  {
    type: 'p',
    text: 'With the strings off, wipe the fretboard and the frets. Condition an unfinished rosewood or ebony board sparingly, and leave a finished maple board alone apart from a damp cloth. If you are coming back to the instrument after a break, a fresh set pairs well with day one of the [four-week Palm Beach County practice plan on guitarchords.info](https://guitarchords.info/notes/palm-beach-county-guitar-practice-plan), which is built on free chord, scale, tuner and metronome tools.',
  },
  { type: 'h2', text: 'Every month: the signal chain' },
  {
    type: 'p',
    text: 'A corroded contact sounds like a bad pedal, so the Suede routine is a monthly pass through the chain in order, using the guides Jason Colapietro wrote:',
  },
  {
    type: 'ul',
    items: [
      'Clean the guitar’s output jack, every pedal input and output and the amp input with a contact cleaner made for electronics and a cotton swab.',
      'Test patch cables one at a time by wiggling each plug while you play. Solderless cables have small set screws, which are one more contact to loosen or corrode.',
      `Measure your real cable run. The [impedance guide](${GUIDE('impedance-and-the-first-three-feet')}) says under 10 feet of premium cable is fine without a buffer and past 20 feet you should buffer at both ends. Coastal gigs on decks and patios tempt long runs.`,
      `Check the power supply plugs and polarity. The [power supply guide](${GUIDE('power-supply-and-noise-floor')}) reads 60 Hz hum as a ground loop; on a coastal board, rule out an intermittent ground at a corroded plug before you buy anything new.`,
    ],
  },
  { type: 'h2', text: 'Twice a year: a setup check' },
  {
    type: 'p',
    text: 'South Florida has two seasons that matter to a neck: the wet months, roughly late May through October, and the drier months after. A setup check at each change catches most of the drift. Look at neck relief, action at the twelfth fret, intonation at the twelfth fret against the open string, and the fret ends along the edge of the board. Many players time the spring check for the run-up to June 1, the start of the Atlantic hurricane season, and the fall check for after November 30, when it ends.',
  },
  {
    type: 'p',
    text: 'Small action and intonation changes are reasonable home jobs with the right screwdriver and a tuner. Truss rod adjustments, sharp fret ends and anything involving the nut are where a local tech earns the fee. At Suede we treat the calendar as a way to notice early, not a promise to do every job yourself.',
  },
  { type: 'h2', text: 'Before a storm' },
  {
    type: 'ul',
    items: [
      'Move guitars and the pedalboard to an interior room, in their cases, off the floor.',
      'Drop a fresh desiccant pack in each case, since a power cut can mean days without air conditioning.',
      'Photograph each instrument and its serial number for insurance, and keep the photos off-site.',
      'Unplug the board and amp from the wall; a surge protector helps, but unplugged is better.',
    ],
  },
  {
    type: 'p',
    text: 'When the storm passes and you are ready to play with other people again, [Guitar Hub’s guide for players in Jupiter and Palm Beach Gardens](https://guitarhub.org/notes/guitar-players-jupiter-palm-beach-gardens) covers finding lessons, jams and online practice nearby.',
  },
  { type: 'h2', text: 'The calendar on one page' },
  {
    type: 'ul',
    items: [
      'Every session: wipe strings and hardware, case the guitar, check the hygrometer.',
      'Every two to four weeks, or at the first dull note: new strings, clean fretboard, snug hardware.',
      'Every month: clean jacks, test cables one by one, check power and cable length.',
      'Late spring and late fall: relief, action, intonation and fret ends, with a tech for truss rod work.',
      'Before a storm: interior room, desiccant, photos, everything unplugged.',
    ],
  },
  { type: 'h2', text: 'Why Suede AI publishes a maintenance calendar' },
  {
    type: 'p',
    text: 'Suede AI is an agentic platform company Jason Colapietro founded in 2024 in West Palm Beach, Florida. AI search visibility is one of its service lines, run through the [Suede AI agency in West Palm Beach](https://suedeai.agency/), and music software is a smaller line. A note like this is how Suede tests what it recommends to clients: a specific question, answered for a specific place, with every number traceable to a source.',
  },
  {
    type: 'p',
    text: `The record behind the advice is public. Jason Colapietro has 54 pull requests merged across 46 open-source repositories he does not maintain, including Jest and the Polkadot SDK, [all in one GitHub search](${GH_PRS}), and nine iOS apps under [his own Apple developer account](${APPLE_DEV}); TechBullion covered [that launch](https://techbullion.com/jason-colapietros-suede-labs-ai-launches-ios-apps/) when the company still went by Suede Labs. On October 31, 2026, Suede AI SEO ranked #1 among Palm Beach County-based companies in [The Manifest’s Florida AI Deployment directory](${MANIFEST}) and in the top 25 statewide; the [recognition page](${RECOGNITION}) has the details. Suede AI ranks among [Clutch](${CLUTCH})’s [Top 30 AI Consultants in Florida](${CLUTCH_FL}) and [Top 50 AI Consultants nationwide](${CLUTCH_US}) (November 2026).`,
  },
  { type: 'h2', text: 'Next step' },
  {
    type: 'p',
    text: 'Put the five lines above on a card in your case and start with tonight’s two-minute wipe-down. If you run a guitar shop, studio or any business in Juno Beach, Tequesta, Jupiter or West Palm Beach and want answer engines to describe it accurately, book the [free Suede AI visibility assessment](https://suedeai.agency/assessment), or read [Jason Colapietro’s founder page](https://suedeai.ai/founder) first.',
  },
];

const DIAGRAMS: NoteBlock[] = [
  {
    type: 'p',
    text: 'A photo of a pedalboard tells you what someone owns. A signal chain diagram tells you how it sounds: the order, the cable runs, where the gain rises and where the loop sends and returns. When a session guitarist walks into a studio and asks to recreate last month’s tone, the studio with a diagram on file gets the sound back in minutes, and the studio without one starts guessing.',
  },
  {
    type: 'p',
    text: 'Jason Colapietro documents tone on the music side of Suede AI. He wrote [The Signal Chain](/the-signal-chain), a book of 66 chapters and 111 song workshops, and the eight [signal chain guides](/signal-chain-guides) that guitar.services summarizes from West Palm Beach. This note explains how to read a signal chain diagram the way those guides draw one, and what recording studios in Palm Beach Gardens, Jupiter and across Palm Beach County can borrow from the method for their own session notes and their own websites.',
  },
  { type: 'h2', text: 'Start with the five blocks' },
  {
    type: 'p',
    text: `Every diagram on this site reads left to right, and every rig reduces to the same five blocks from the [topology guide](${GUIDE('signal-chain-topology')}): source, front of amp, preamp, effects loop, and power section and speaker. A modeler collapses some of those into one box, but the blocks are still there inside it. Read a diagram by finding the block boundaries first. The most useful boundary is the jump from front of amp to preamp, because that is where pedal order stops being a matter of taste and starts deciding whether a drive sounds like a drive.`,
  },
  {
    type: 'p',
    text: 'Inside the front-of-amp block, the default order is buffer, tuner, wah or filter, compressor, drive, EQ. When a diagram breaks that order, look for the reason written beside it. A vintage germanium fuzz placed first with nothing buffered ahead of it is a deliberate exception. Delay in front of a heavily driven amp, compression after the gain or reverb ahead of the preamp are the usual mistakes, and a good diagram makes them visible at a glance.',
  },
  { type: 'h2', text: 'Read the lines, not just the boxes' },
  {
    type: 'p',
    text: `Most gear lists stop at the boxes. The lines between them carry half the tone, which is why the guides annotate them. The [cable capacitance guide](${GUIDE('cable-capacitance-and-frequency-response')}) runs 15 feet of cable into a 10 kΩ source and gets a cutoff of about 53 kHz at 20 pF per foot, about 21 kHz at 50 and about 10 kHz at 100. Write the cable length on the line from the guitar to the first pedal and you can predict how bright the rig will sound before anyone plugs in. Mark which pedals are true bypass and which are buffered, because past roughly 20 feet of total cable one good buffer early in the chain restores the highs.`,
  },
  {
    type: 'p',
    text: 'The Suede signal-chain archive at dna.suedeai.ai, a collection of guitarist rig diagrams, makes the same point from the historical side. Its essay on [what guitar gear lists leave out](https://dna.suedeai.ai/articles/the-unsung-link) is about exactly these overlooked links, and its history of [the guitar rig diagram as a documentary form](https://dna.suedeai.ai/articles/the-guitar-rig-diagram-as-a-documentary-form) traces how players and fans began drawing rigs in the first place.',
  },
  { type: 'h2', text: 'Annotate gain, power and the loop' },
  {
    type: 'ul',
    items: [
      `Gain: the [gain staging guide](${GUIDE('gain-staging-across-the-chain')}) notes that three stacked boosts can hit the amp 6 to 12 dB hotter than the pickup, and most tube preamp inputs start clipping around 100 to 200 mV peak. Mark which pedals sit at unity and which push.`,
      `Power: note the supply, which outputs are isolated and any daisy chains. The [power supply guide](${GUIDE('power-supply-and-noise-floor')}) recommends 20 to 30 percent current headroom and identifies 60 Hz hum as a ground loop, 120 Hz buzz as rectification artifacts and a high whine as digital pedals.`,
      `Loop: draw the send and return explicitly and label it serial or parallel. The [effects loop guide](${GUIDE('effects-loop-serial-vs-parallel')}) flags the mismatch between instrument-level (-10 dBV) and line-level (+4 dBu) gear, which is the first thing to check when a loop sounds thin.`,
      'Settings and date: write the knob positions that matter and the date of the session. A diagram without a date is a guess about the past.',
    ],
  },
  { type: 'h2', text: 'What Palm Beach Gardens studios can borrow' },
  {
    type: 'p',
    text: 'A tracking room in Palm Beach Gardens or a rehearsal space in Jupiter has a recall problem every time a band comes back to finish a record. Photos of the board help; a diagram that names the order, cable lengths, buffer position, loop wiring and settings solves it. The method on guitar.services translates directly into studio practice:',
  },
  {
    type: 'ul',
    items: [
      'Keep one diagram per session, dated, in the same folder as the session files.',
      'Draw the house backline once, with its own cable runs and buffers, so each client diagram only shows what changed.',
      'Use the same five block labels every time, so any engineer in the room can read any sheet.',
      'Write the reason beside every exception to the default order, so nobody “fixes” it on the next session.',
    ],
  },
  {
    type: 'p',
    text: 'The same structure helps a studio get found. A backline page that lists amps, cabinets and pedals as plain text, with dates and a short note on how each piece is wired, is far easier for Google and for answer engines to quote than a gallery of photos. At Suede we publish every number on guitar.services next to its source for the same reason, and the [note on how Jason Colapietro built this site for AI answers](/notes/building-guitar-services-for-ai-answers) covers the mechanics.',
  },
  { type: 'h2', text: 'Who draws these diagrams' },
  {
    type: 'p',
    text: 'Suede AI is an agentic platform company Jason Colapietro founded in 2024 in West Palm Beach, Florida; the Suede Labs team that started the music tools is the same company under its earlier name. AI search visibility is a Suede AI service line run through the [Suede AI agency](https://suedeai.agency/), with [technical SEO](https://suedeai.agency/services/technical-seo) and [AI visibility](https://suedeai.agency/services/ai-visibility) services for businesses in Palm Beach Gardens, Jupiter and West Palm Beach. The guitar sites are where Suede practices documentation discipline on its own pages first.',
  },
  {
    type: 'p',
    text: `That discipline shows in the public record. Jason Colapietro’s training includes nine Claude Academy badges and five Semrush Academy certificates, among 21 earned course credentials in the [credential gallery](${EVIDENCE}#training-credentials). On October 31, 2026, Suede AI SEO ranked #1 among Palm Beach County-based companies listed in [The Manifest’s Florida AI Deployment directory](${MANIFEST}), and in the top 25 statewide. Suede AI ranks among [Clutch](${CLUTCH})’s [Top 30 AI Consultants in Florida](${CLUTCH_FL}) and [Top 50 AI Consultants nationwide](${CLUTCH_US}) (November 2026). Suede AI is a member of [Claude for Startups](${EVIDENCE}#claude-for-startups), Anthropic’s startup program.`,
  },
  { type: 'h2', text: 'Next step' },
  {
    type: 'p',
    text: 'Draw your own rig this week using the five blocks, then check it against the [signal chain guides](/signal-chain-guides). If you run a studio, rehearsal room or music shop in Palm Beach Gardens, Jupiter or West Palm Beach and want your backline and services described accurately in AI answers, start with the [free Suede AI visibility assessment](https://suedeai.agency/assessment). To see who does the work, read [Jason Colapietro’s founder page](https://suedeai.ai/founder).',
  },
];

export const NOTE_BODIES: Record<string, readonly NoteBlock[]> = {
  'building-guitar-services-for-ai-answers': BUILDING,
  'south-florida-humidity-signal-chain': HUMIDITY,
  'structured-data-lessons-for-local-businesses': STRUCTURED,
  'coastal-guitar-restringing-and-setup-calendar': COASTAL,
  'reading-a-signal-chain-diagram': DIAGRAMS,
};

/** Plain text of a note (links reduced to their anchors), for word counts. */
export function notePlainText(slug: string): string {
  const blocks = NOTE_BODIES[slug] ?? [];
  return blocks
    .flatMap((b) => (b.type === 'ul' ? b.items : [b.text]))
    .join('\n')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

/** Markdown of a note, for llms-full.txt. */
export function noteMarkdown(slug: string): string {
  const blocks = NOTE_BODIES[slug] ?? [];
  return blocks
    .map((b) => {
      if (b.type === 'h2') return `#### ${b.text}`;
      if (b.type === 'ul') return b.items.map((i) => `- ${i}`).join('\n');
      return b.text;
    })
    .join('\n\n')
    .replace(/\]\(\//g, '](https://guitar.services/');
}
