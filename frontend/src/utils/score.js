/** Maps a 0-100 Reality Score to a label + semantic tone. */
export const getScoreMeta = (v) => {
  if (v >= 80)
    return {
      tone: 'ok',
      label: 'Strong corroboration',
      subtext: 'Most technical claims are backed by original code and problem-solving records.',
    };
  if (v >= 50)
    return {
      tone: 'warn',
      label: 'Moderate alignment',
      subtext: 'Core claims are corroborated, with some unverified skills or private repositories.',
    };
  return {
    tone: 'bad',
    label: 'Low verifiability',
    subtext: 'Significant gap between resume claims and discoverable public codebases.',
  };
};

export const toneForPercent = (v) => (v >= 80 ? 'ok' : v >= 50 ? 'warn' : 'bad');
