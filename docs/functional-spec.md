# Functional specifications

## Objective

Describe the expected behavior of the Pomodoro application.

## Current scope

- Pomodoro timer with work and break modes.
- Time and color theme configuration.
- YouTube playback and queue management.

## Functional requirements

- FR-01: The user can start, pause, and reset the timer.
- FR-02: The user can switch modes (pomodoro, short break, long break).
- FR-03: The user can adjust mode durations in settings.
- FR-04: The user can select a color theme.
- FR-05: The user can add YouTube URLs to a queue.
- FR-06: The user can control YouTube playback.

## Business rules

- The timer advances in one-second intervals.
- At the end of a mode, a configurable sound plays.
- Settings persist in local storage.

## Acceptance criteria (pending validation)

- [ ] The timer keeps accurate time when switching tabs.
- [ ] Settings persist after reloading the page.
- [ ] The applied theme affects the entire UI.
