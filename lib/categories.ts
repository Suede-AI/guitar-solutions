export const CATEGORY_DETAILS: Record<string, { summary: string; useWhen: string }> = {
  Electronics: {
    summary:
      'Pickup loading, cable capacitance, buffer placement, and bypass behavior before the amp ever sees the signal.',
    useWhen:
      'Use this lane when the rig feels darker, stiffer, noisier, or less responsive than the guitar sounds straight into the amp.',
  },
  'Gain & Dynamics': {
    summary:
      'Preamp routing, effects loops, level matching, gain behavior, and the places where time-based effects either stay clear or turn to wash.',
    useWhen:
      'Use this lane when delay, reverb, boost, or amp gain changes the whole feel of the board.',
  },
  Power: {
    summary:
      'Supply isolation, shared rails, current draw, voltage, polarity, and the noise floor hiding under the board.',
    useWhen:
      'Use this lane when hum, buzz, whine, or unexplained harshness follows the pedalboard instead of one pedal.',
  },
  'Signal Chain': {
    summary:
      'The full topology: source, front of amp, preamp, effects loop, power section, and speaker behavior.',
    useWhen:
      'Use this lane when the question is not one pedal, but where every block belongs and why.',
  },
};

export const STUDY_PATH = [
  {
    step: '01',
    label: 'Map the rig',
    slug: 'signal-chain-topology',
    title: 'Signal Chain Topology',
    note: 'Start with the five-block model before moving pedals around.',
  },
  {
    step: '02',
    label: 'Fix the source',
    slug: 'impedance-and-the-first-three-feet',
    title: 'Impedance and the First Three Feet',
    note: 'Check pickup loading, cable length, and first-buffer placement.',
  },
  {
    step: '03',
    label: 'Set levels',
    slug: 'gain-staging-across-the-chain',
    title: 'Gain Staging Across the Chain',
    note: 'Put every block inside its headroom window.',
  },
  {
    step: '04',
    label: 'Route time effects',
    slug: 'effects-loop-serial-vs-parallel',
    title: 'The Effects Loop',
    note: 'Decide what belongs before the preamp and what belongs after it.',
  },
];

export function getCategoryDetails(name: string): { summary: string; useWhen: string } {
  return (
    CATEGORY_DETAILS[name] ?? {
      summary: 'A focused lane in the guitar signal-chain reference.',
      useWhen: 'Use this lane when the guide title matches the problem you hear in the rig.',
    }
  );
}
