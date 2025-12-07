# Project Coding Rules

## Language
- All code, comments, and documentation must be in English
- UI text visible to users must be in Spanish
- Exception: User-facing messages, labels, buttons

## Comments
- Avoid inline comments within function bodies
- Comments should explain WHY, not WHAT
- If code needs many comments to be understood, refactor it instead

## Constants
- No magic numbers: all numeric values must be named constants
- Use UPPER_SNAKE_CASE for constant names
- Exceptions: 0, 1, -1, 100 in obvious contexts (array indices, percentages)

## Styling
- Use CSS classes for static styles
- Use CSS Variables (set via inline style) for dynamic values only
- Don't mix techniques: avoid data-attributes if className already provides the info

## React Hooks
- Include all dependencies in useEffect arrays
- Exception: React setter functions are stable and can be omitted
- Add eslint-disable comment when intentionally omitting dependencies

## File Organization
- Components (.tsx): React logic, state, effects
- Styles (.css): All styling rules
- Utils (.ts): Pure functions, no React dependencies
- Contexts: Global state and related business logic
