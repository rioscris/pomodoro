import { describe, it, expect } from 'vitest';
import { FEATURE_FLAGS, isFeatureEnabled } from '../featureFlags';

describe('featureFlags', () => {
  it('exposes the YouTube player flag', () => {
    expect(FEATURE_FLAGS).toHaveProperty('youtubePlayer');
    expect(typeof FEATURE_FLAGS.youtubePlayer).toBe('boolean');
  });

  it('returns the flag state via helper', () => {
    expect(isFeatureEnabled('youtubePlayer')).toBe(FEATURE_FLAGS.youtubePlayer);
  });
});
