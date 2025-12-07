import React, { useEffect } from 'react';
import { Box, Button } from 'grommet';
import { useTimer } from 'react-timer-hook';
import { usePomodoroContext } from '../contexts/PomodoroContext';
import { useCalculatedColors } from '../hooks/useCalculatedColors';
import { getItemFromLocalStorage } from '../utils/localStorage';
import {
  POMODOROS_BEFORE_LONG_BREAK,
  DEFAULT_POMODORO_TIME,
  DEFAULT_SHORT_BREAK_TIME,
  DEFAULT_LONG_BREAK_TIME,
  parseTime,
  timeToString,
  getExpiryDate
} from '../utils/pomodoro';
import './Pomodoro.css';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';
const MODES: Mode[] = ['pomodoro', 'shortBreak', 'longBreak'];

const modeLabels: Record<Mode, string> = {
  pomodoro: 'Pomodoro',
  shortBreak: 'Descanso corto',
  longBreak: 'Descanso largo',
};

const Pomodoro: React.FC = () => {
  const pomodoroTime = getItemFromLocalStorage('pomodoro', DEFAULT_POMODORO_TIME);
  const shortBreakTime = getItemFromLocalStorage('shortBreak', DEFAULT_SHORT_BREAK_TIME);
  const longBreakTime = getItemFromLocalStorage('longBreak', DEFAULT_LONG_BREAK_TIME);

  const {
    shouldPause,
    setShouldPause,
    shouldResume,
    setShouldResume,
    timerState,
    setTimerState
  } = usePomodoroContext();

  const colors = useCalculatedColors();

  const mode = timerState.mode;
  const completedPomodoros = timerState.completedPomodoros;

  const setMode = (newMode: Mode) => {
    setTimerState(prev => ({
      ...prev,
      mode: newMode
    }));
  };

  const setCompletedPomodoros = (value: number | ((prev: number) => number)) => {
    setTimerState(prev => ({
      ...prev,
      completedPomodoros: typeof value === 'function' ? value(prev.completedPomodoros) : value
    }));
  };

  const getCurrentModeTime = () => {
    if (mode === 'pomodoro') return parseTime(pomodoroTime);
    if (mode === 'shortBreak') return parseTime(shortBreakTime);
    return parseTime(longBreakTime);
  };

  const { minutes, seconds, pause, isRunning, resume, restart } = useTimer({
    expiryTimestamp: (() => {
      const { minutes, seconds } = getCurrentModeTime();
      return getExpiryDate(minutes, seconds);
    })(),
    autoStart: false,
    onExpire: () => {
      if (mode === 'pomodoro') {
        if (completedPomodoros === POMODOROS_BEFORE_LONG_BREAK) {
          setMode('longBreak');
        } else {
          setMode('shortBreak');
          setCompletedPomodoros((n) => n + 1);
        }
      } else {
        setMode('pomodoro');
      }
    },
  });

  useEffect(() => {
    const { minutes: mins, seconds: secs } = getCurrentModeTime();
    const totalSecs = mins * 60 + secs;
    const savedRemainingSeconds = timerState.remainingSeconds;

    setTimerState(prev => ({
      ...prev,
      totalSeconds: totalSecs,
    }));

    if (savedRemainingSeconds > 0 && savedRemainingSeconds <= totalSecs) {
      const expiryDate = new Date();
      expiryDate.setSeconds(expiryDate.getSeconds() + savedRemainingSeconds);
      restart(expiryDate, false);
    } else {
      restart(getExpiryDate(mins, secs), false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* TODO: Improve useEffects execution order and remove useRef */
  const isFirstUpdate = React.useRef(true);
  useEffect(() => {
    if (isFirstUpdate.current) {
      isFirstUpdate.current = false;
      return;
    }

    const { minutes: mins, seconds: secs } = getCurrentModeTime();
    const totalSecs = mins * 60 + secs;

    setTimerState(prev => ({
      ...prev,
      mode,
      remainingSeconds: totalSecs,
      totalSeconds: totalSecs,
      isRunning: false
    }));

    restart(getExpiryDate(mins, secs), false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, pomodoroTime, shortBreakTime, longBreakTime]);

  useEffect(() => {
    const remainingSeconds = minutes * 60 + seconds;
    setTimerState(prev => ({
      ...prev,
      remainingSeconds,
      isRunning
    }));
  }, [minutes, seconds, isRunning, setTimerState]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
  };

  const toggleTimer = () => {
    if (isRunning) {
      pause();
    } else {
      resume();
    }
  };

  useEffect(() => {
    if (shouldPause && isRunning) {
      pause();
      setShouldPause(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPause, isRunning]);

  useEffect(() => {
    if (shouldResume && !isRunning) {
      resume();
      setShouldResume(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldResume, isRunning]);

  return (
    <Box
      align="center"
      justify="center"
      gap="large"
      pad="large"
      className="pomodoro-container"
      style={{
        // @ts-expect-error - CSS variables
        '--text-color': colors.text,
        '--bg-color': colors.background,
        '--border-color': colors.border,
        '--secondary-text-color': colors.secondaryText,
      }}
    >
      {/* Mode buttons */}
      <Box
        direction="row"
        gap="medium"
        wrap
        justify="center"
        className="mode-buttons-container"
      >
        {(MODES).map((m) => (
          <Button
            key={m}
            label={modeLabels[m]}
            onClick={() => handleModeChange(m)}
            primary={mode === m}
            className={`mode-button ${mode === m ? 'mode-button-active' : 'mode-button-inactive'}`}
          />
        ))}
      </Box>

      {/* Large timer display */}
      <Button
        plain
        label={`${timeToString(minutes)}:${timeToString(seconds)}`}
        onClick={toggleTimer}
        className="timer-display"
      />

      {/* Status indicator */}
      <Box align="center" gap="small" className="status-container">
        <span className="status-indicator">
          {isRunning ? '▶ En progreso' : '⏸ Pausado'}
        </span>
        <span className="pomodoro-counter">
          Pomodoros completados: {completedPomodoros}
        </span>
      </Box>
    </Box>
  );
};

export default Pomodoro;