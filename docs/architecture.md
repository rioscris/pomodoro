# Architecture

## Objective

Define the frontend architecture to ensure maintainability, scalability, and strict alignment with documentation.

## Principles

- Clear separation of concerns by layer and domain.
- Strict TypeScript typing.
- Predictable UI state (local vs global is explicit).

## Project structure (mandatory)

```
/docs
  architecture.md
  decisions.md
  guidelines.md

/specs
  /features
    /<feature-name>
      spec.md
      acceptance-criteria.md
      ux-notes.md
      technical-design.md

/src
  /app
  /features
  /shared
```

## System map

- Pomodoro timer
- User configuration
- YouTube queue and player controls

## Documentation ↔ Implementation contract

- Documentation is the source of truth when present.
- Each acceptance criterion must map to tests or documented manual verification.
- Any behavior change requires a documentation update first.

## Quality attributes

- Maintainability
- Scalability
- Testability
- Basic observability (logs)
