import { getScoreMeta, toneForPercent } from './score';

describe('Score Utility Functions', () => {
  test('toneForPercent correctly classifies scores', () => {
    expect(toneForPercent(90)).toBe('ok');
    expect(toneForPercent(80)).toBe('ok');
    expect(toneForPercent(79)).toBe('warn');
    expect(toneForPercent(50)).toBe('warn');
    expect(toneForPercent(49)).toBe('bad');
    expect(toneForPercent(0)).toBe('bad');
  });

  test('getScoreMeta returns proper metadata for high scores', () => {
    const meta = getScoreMeta(85);
    expect(meta.tone).toBe('ok');
    expect(meta.label).toBe('Strong corroboration');
  });

  test('getScoreMeta returns proper metadata for moderate scores', () => {
    const meta = getScoreMeta(65);
    expect(meta.tone).toBe('warn');
    expect(meta.label).toBe('Moderate alignment');
  });

  test('getScoreMeta returns proper metadata for low scores', () => {
    const meta = getScoreMeta(30);
    expect(meta.tone).toBe('bad');
    expect(meta.label).toBe('Low verifiability');
  });
});
