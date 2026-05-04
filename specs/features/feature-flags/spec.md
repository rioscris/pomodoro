# Feature Spec - Feature flags

## Problem

We need a safe, consistent way to enable or disable features without touching multiple files or making invasive code changes. Today, hiding functionality requires manual edits across components.

## Goal

Introduce a simple, centralized feature-flag system defined in a single configuration file so that toggling a feature requires changing only that file.

## Scope

### In

- A configuration file that exports all feature flags.
- A documented contract for reading flags in the UI.
- A first flag to control the YouTube player feature.

### Out

- Remote flags or runtime toggling (server-driven).
- User-specific or role-based toggles.
- A UI to edit flags.

## Use cases

1. A developer sets `youtubePlayer` to `false` and the YouTube player is hidden from the app.
2. A developer sets `youtubePlayer` to `true` and the YouTube player is available again.
3. A new feature can be added later by extending the config file and importing it where needed.
