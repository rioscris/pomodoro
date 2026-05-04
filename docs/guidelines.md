# Engineering guidelines

## Documentation workflow

- All relevant decisions require an ADR.
- Documentation and code must remain synchronized.

## Naming conventions

- Components: `PascalCase`.
- Hooks: `useCamelCase`.
- Feature folders: `kebab-case`.
- Types/interfaces: `PascalCase`.
- Constants: `UPPER_SNAKE_CASE`.

## Component structure

```
src/features/<feature-name>/
  components/
  hooks/
  types/
  index.ts
```

- One main component per file.
- Export only public API from `index.ts`.

## State management

- Local UI state: `useState`/`useReducer`.
- Global state: Context + hooks (`src/contexts`).
- No new state libraries without an ADR.

## Error handling

- User-facing errors when flow is impacted.
- Avoid silent failures.
- Use `try/catch` only where errors are expected.

## Testing strategy

- Unit tests for utilities and hooks.
- Component tests for UI with Testing Library.
- Tests must reference acceptance criteria IDs (e.g., AC-01).

## Quality gates

- Typecheck clean.
- Tests green.
- Documentation updated and consistent.

## Documentation style

- Clarity over completeness.
- Avoid ambiguity.
- Keep each document self-contained.

## UX notes

- Required for new user flows or complex UI states.

## Security & performance

- Never store sensitive data in localStorage.
- Sanitize external inputs (URLs).
- Avoid unnecessary re-renders; memoize only when needed.

## Avoid over-engineering

- Solve the current problem.
- Reuse existing patterns before creating new abstractions.
