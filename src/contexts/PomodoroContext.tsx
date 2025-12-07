/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { parseTime, DEFAULT_POMODORO_TIME } from '../utils/pomodoro';
import { getItemFromLocalStorage } from '../utils/localStorage';

export type PomodoroMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export const getNextMode = (currentMode: PomodoroMode, completedPomodoros: number, pomodorosBeforeLongBreak: number): PomodoroMode => {
  if (currentMode === 'pomodoro') {
    return completedPomodoros >= pomodorosBeforeLongBreak ? 'longBreak' : 'shortBreak';
  }
  return 'pomodoro';
};

export interface TimerState {
  mode: PomodoroMode;
  remainingSeconds: number;
  totalSeconds: number;
  isRunning: boolean;
  completedPomodoros: number;
}

interface PomodoroContextType {
  shouldPause: boolean;
  setShouldPause: (pause: boolean) => void;
  shouldResume: boolean;
  setShouldResume: (resume: boolean) => void;
  timerState: TimerState;
  setTimerState: (state: TimerState | ((prev: TimerState) => TimerState)) => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const usePomodoroContext = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoroContext must be used within a PomodoroProvider');
  }
  return context;
};

interface PomodoroProviderProps {
  children: ReactNode;
}

export const PomodoroProvider: React.FC<PomodoroProviderProps> = ({ children }) => {
  const [shouldPause, setShouldPause] = useState(false);
  const [shouldResume, setShouldResume] = useState(false);

  const savedPomodoroTime = getItemFromLocalStorage('pomodoro', DEFAULT_POMODORO_TIME);
  const initialTime = parseTime(savedPomodoroTime);
  const initialSeconds = initialTime.minutes * 60 + initialTime.seconds;

  const [timerState, setTimerState] = useState<TimerState>({
    mode: 'pomodoro',
    remainingSeconds: initialSeconds,
    totalSeconds: initialSeconds,
    isRunning: false,
    completedPomodoros: 0,
  });

  return (
    <PomodoroContext.Provider
      value={{
        shouldPause,
        setShouldPause,
        shouldResume,
        setShouldResume,
        timerState,
        setTimerState,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
};
