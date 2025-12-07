import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { PomodoroProvider, usePomodoroContext, getNextMode } from '../PomodoroContext';

describe('PomodoroContext', () => {
  it('should provide initial timer state', () => {
    const { result } = renderHook(() => usePomodoroContext(), {
      wrapper: ({ children }) => <PomodoroProvider>{children}</PomodoroProvider>,
    });

    expect(result.current.timerState).toEqual({
      mode: 'pomodoro',
      remainingSeconds: 25 * 60,
      totalSeconds: 25 * 60,
      isRunning: false,
      completedPomodoros: 0,
    });
  });

  it('should allow updating timer state', () => {
    const { result } = renderHook(() => usePomodoroContext(), {
      wrapper: ({ children }) => <PomodoroProvider>{children}</PomodoroProvider>,
    });

    act(() => {
      result.current.setTimerState({
        mode: 'shortBreak',
        remainingSeconds: 300,
        totalSeconds: 300,
        isRunning: true,
        completedPomodoros: 1,
      });
    });

    expect(result.current.timerState.mode).toBe('shortBreak');
    expect(result.current.timerState.remainingSeconds).toBe(300);
    expect(result.current.timerState.isRunning).toBe(true);
    expect(result.current.timerState.completedPomodoros).toBe(1);
  });

  it('should handle shouldPause flag', () => {
    const { result } = renderHook(() => usePomodoroContext(), {
      wrapper: ({ children }) => <PomodoroProvider>{children}</PomodoroProvider>,
    });

    act(() => {
      result.current.setShouldPause(true);
    });

    expect(result.current.shouldPause).toBe(true);
  });

  it('should handle shouldResume flag', () => {
    const { result } = renderHook(() => usePomodoroContext(), {
      wrapper: ({ children }) => <PomodoroProvider>{children}</PomodoroProvider>,
    });

    act(() => {
      result.current.setShouldResume(true);
    });

    expect(result.current.shouldResume).toBe(true);
  });

  describe('getNextMode', () => {
    it('should return shortBreak after pomodoro when completedPomodoros < pomodorosBeforeLongBreak', () => {
      expect(getNextMode('pomodoro', 0, 3)).toBe('shortBreak');
      expect(getNextMode('pomodoro', 1, 3)).toBe('shortBreak');
      expect(getNextMode('pomodoro', 2, 3)).toBe('shortBreak');
    });

    it('should return longBreak after pomodoro when completedPomodoros >= pomodorosBeforeLongBreak', () => {
      expect(getNextMode('pomodoro', 3, 3)).toBe('longBreak');
      expect(getNextMode('pomodoro', 4, 3)).toBe('longBreak');
    });

    it('should return pomodoro after shortBreak', () => {
      expect(getNextMode('shortBreak', 1, 3)).toBe('pomodoro');
    });

    it('should return pomodoro after longBreak', () => {
      expect(getNextMode('longBreak', 0, 3)).toBe('pomodoro');
    });
  });
});
