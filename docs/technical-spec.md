# Technical specifications

## Stack

- React + TypeScript
- Vite
- Vitest + Testing Library

## Architecture

- Main UI in `src/components/Pomodoro.tsx`.
- Contexts in `src/contexts` for global state.
- Reusable hooks in `src/hooks`.
- Utilities in `src/utils`.

## Persistence

- `localStorage` is used for configuration and the YouTube queue.

## Routes

- Routes are declared in `src/utils/routes.ts`.

## Tests

- Unit tests in `src/**/__tests__`.
- Global setup in `src/test/setup.ts`.

## Technical backlog

- Document contracts for contexts and hooks.
- Consolidate error-handling and logging policies.
- Define performance metrics (render and timer).
