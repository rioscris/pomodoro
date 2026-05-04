export type FeatureFlags = {
  youtubePlayer: boolean;
};

export const FEATURE_FLAGS: FeatureFlags = {
  youtubePlayer: false,
};

export const isFeatureEnabled = <K extends keyof FeatureFlags>(flag: K): boolean =>
  FEATURE_FLAGS[flag];
