import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

vi.mock('react-timer-hook', () => ({
  useTimer: () => ({
    minutes: 25,
    seconds: 0,
    pause: vi.fn(),
    isRunning: false,
    resume: vi.fn(),
    restart: vi.fn(),
  }),
}));

const renderPomodoroWithFlags = async (flags: { youtubePlayer: boolean }) => {
  vi.resetModules();
  vi.doMock('../../shared/config/featureFlags', () => ({
    FEATURE_FLAGS: flags,
    isFeatureEnabled: (flag: keyof typeof flags) => flags[flag],
  }));

  const { default: Pomodoro } = await import('../Pomodoro');
  const { PomodoroProvider } = await import('../../contexts/PomodoroContext');
  const { ColorModeProvider } = await import('../../contexts/ColorModeContext');

  return render(
    <BrowserRouter>
      <ColorModeProvider>
        <PomodoroProvider>
          <Pomodoro />
        </PomodoroProvider>
      </ColorModeProvider>
    </BrowserRouter>
  );
};

describe('Pomodoro - YouTube feature flag', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('hides YouTube controls when the flag is off', async () => {
    await renderPomodoroWithFlags({ youtubePlayer: false });
    expect(screen.queryByPlaceholderText('Pega URL de YouTube aquí')).not.toBeInTheDocument();
  });

  it('shows YouTube controls when the flag is on', async () => {
    await renderPomodoroWithFlags({ youtubePlayer: true });
    expect(screen.getByPlaceholderText('Pega URL de YouTube aquí')).toBeInTheDocument();
  });
});
