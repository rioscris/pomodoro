# Technical design - Focus sound toggle

## Components involved

- `Configurations` (adds the toggle).
- `Pomodoro` (consumes the preference).

## Data types

```ts
export type SoundPreferences = {
  focusEndEnabled: boolean;
};
```

## State

- Global in the Pomodoro context.
- Persisted in `localStorage`.

## APIs or services

- `localStorage` to store the preference.

## Key decisions

- Reuse the existing context instead of a new state library.
- Keep the preference in a single configuration object.
