// Maps each signal-chain guide slug to the matching Suede Guitar Studio app
// tool (guitar.solutions, the strumly app). Signal-chain-topology guides map
// to /rig (the board builder + stats card that links back here — see T17 in
// strumly's .planning/PLAN.md and components/rig/stats-card.tsx); guides
// about a single physical measurement without a chain-building angle map to
// the closer-fit tool (/tuner, /bench) where one exists.

export interface RelatedAppLink {
  /** Absolute URL to the app surface this guide should send readers to. */
  href: string;
  /** Short label for the tool, used in the guide-page callout. */
  label: string;
}

export const APP_BASE_URL = "https://guitar.solutions";

const RIG_LINK: RelatedAppLink = {
  href: `${APP_BASE_URL}/rig`,
  label: "the Rig board builder",
};

const TUNER_LINK: RelatedAppLink = {
  href: `${APP_BASE_URL}/tuner`,
  label: "the tuner",
};

const BENCH_LINK: RelatedAppLink = {
  href: `${APP_BASE_URL}/bench`,
  label: "the bench diagnostic",
};

// Slug -> app tool. Keys mirror the mdx filenames under content/guides/.
export const RELATED_APP_LINKS: Record<string, RelatedAppLink> = {
  // Core signal-chain guides — these are also the three guides linked from
  // the Rig stats card (order notes, gain stack, power/noise) plus the
  // topology footer link, so the callout on this side closes the loop back
  // to the same board builder.
  "pedalboard-order-methodology": RIG_LINK,
  "gain-staging-across-the-chain": RIG_LINK,
  "power-supply-and-noise-floor": RIG_LINK,
  "signal-chain-topology": RIG_LINK,

  // True-bypass, impedance, and cabling guides are about chain-building
  // decisions (what to put on the board and in what order) so they route to
  // the same board builder rather than a single-purpose tool.
  "true-bypass-vs-buffered": RIG_LINK,
  "impedance-and-the-first-three-feet": RIG_LINK,
  "cable-capacitance-and-frequency-response": RIG_LINK,

  // Effects-loop routing is a chain-topology decision (series vs. parallel
  // placement in the loop), so it stays on the board builder rather than
  // the tuner or bench, which don't model loop routing.
  "effects-loop-serial-vs-parallel": RIG_LINK,
};

export function getRelatedAppLink(slug: string): RelatedAppLink | undefined {
  return RELATED_APP_LINKS[slug];
}
