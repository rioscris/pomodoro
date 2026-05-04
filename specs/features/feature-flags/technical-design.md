# Technical design - Feature flags

## Objective

Provide a lightweight, centralized feature-flag system defined in a single configuration file. Feature flags should be static at build/runtime and easy to update by editing one file.

## Proposed configuration file

- Location: `src/shared/config/featureFlags.ts`
- Export a typed object that contains all flags.

```ts
export type FeatureFlags = {
  youtubePlayer: boolean;
};

export const FEATURE_FLAGS: FeatureFlags = {
  youtubePlayer: false,
};
```

> The single source of truth is `FEATURE_FLAGS`. Any future flags are added here.

## Access pattern

- Consumers import `FEATURE_FLAGS` directly.
- Optional: a small helper for readability and future extension.

```ts
export const isFeatureEnabled = <K extends keyof FeatureFlags>(flag: K): boolean =>
  FEATURE_FLAGS[flag];
```

## Integration points

### YouTube feature

- Primary: the UI section that renders the YouTube player and queue.
- Secondary: any buttons or navigation paths that lead to YouTube controls.

Pseudo-example usage:

```tsx
{FEATURE_FLAGS.youtubePlayer && (
  <YouTubePlayer />
)}
```

## Data contract

- Flags are compile-time constants and do not change during runtime.
- No persistence needed.

## Error handling

- If a flag is missing, TypeScript should fail at compile time.

## Testing strategy

- Add a unit test to validate that `FEATURE_FLAGS` includes all supported flags.
- Add a component test to ensure the YouTube player is hidden when the flag is off.

## Rollout steps

1. Create `src/shared/config/featureFlags.ts`.
2. Update YouTube-related components to guard rendering behind the flag.
3. Add tests referenced by acceptance criteria AC-03/AC-04.

## Notes

- This approach intentionally avoids remote or runtime flag updates.
- Future enhancements can add environment-specific overrides if needed.
