import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button } from 'grommet';
import { useTimer } from 'react-timer-hook';
import { Play, Pause } from 'grommet-icons';

const Colors = {
  Text: '#fae5c5',
  Background: '#f08b4f',
};


const getTimeFromLocalStorage = (key: string, fallback: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) || fallback;
  }
  return fallback;
};

const parseTime = (str: string): { minutes: number, seconds: number } => {
  const [mm, ss] = str.split(':').map(Number);
  return { minutes: mm || 0, seconds: ss || 0 };
};

const getExpiryDate = (minutes: number, seconds: number): Date => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  date.setSeconds(date.getSeconds() + seconds);
  return date;
};

const timeToString = (number: number): string => {
  return number < 10 ? `0${number}` : `${number}`;
}


type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';
const MODES = ['pomodoro', 'shortBreak', 'longBreak'] as Mode[];
const POMODOROS_BEFORE_LONG_BREAK = 3;

const modeLabels: Record<Mode, string> = {
  pomodoro: 'Pomodoro',
  shortBreak: 'Descanso corto',
  longBreak: 'Descanso largo',
};

const Pomodoro: React.FC = () => {
  const pomodoroTime = getTimeFromLocalStorage('pomodoro', '25:00');
  const shortBreakTime = getTimeFromLocalStorage('shortBreak', '05:00');
  const longBreakTime = getTimeFromLocalStorage('longBreak', '15:00');

  const [mode, setMode] = useState<Mode>('pomodoro');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);


  const getCurrentModeTime = useCallback(() => {
    if (mode === 'pomodoro') return parseTime(pomodoroTime);
    if (mode === 'shortBreak') return parseTime(shortBreakTime);
    return parseTime(longBreakTime);
  }, [mode, pomodoroTime, shortBreakTime, longBreakTime]);

  const { minutes, seconds, pause, isRunning, resume, restart } = useTimer({
    expiryTimestamp: (() => { const { minutes, seconds } = getCurrentModeTime(); return getExpiryDate(minutes, seconds); })(),
    autoStart: false,
    onExpire: () => {
      if (mode === 'pomodoro') {
        if (completedPomodoros === POMODOROS_BEFORE_LONG_BREAK) {
          setMode('longBreak');
          setCompletedPomodoros(0);
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
    const { minutes, seconds } = getCurrentModeTime();
    restart(getExpiryDate(minutes, seconds), false);
  }, [mode, pomodoroTime, shortBreakTime, longBreakTime]);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    if (newMode === 'pomodoro') {
      setCompletedPomodoros((prev) => (mode === 'longBreak' ? 0 : prev));
    }
  };

  const toggleTimer = () => {
    if (isRunning) {
      pause();
    } else {
      resume();
    }
  };

  return (
    <div>
      <Box align="center" justify="center" gap="medium">
        <Box direction="row" gap="small" margin={{ bottom: 'small' }}>
          {(MODES).map((m) => (
            <Button
              key={m}
              label={modeLabels[m]}
              onClick={() => handleModeChange(m)}
              primary={mode === m}
              color={mode === m ? Colors.Background : undefined}
              style={{ fontWeight: mode === m ? 'bold' : 'normal' }}
            />
          ))}
        </Box>
        <Button
          primary
          label={`${timeToString(minutes)}:${timeToString(seconds)}`}
          onClick={toggleTimer}
          color={Colors.Background}
          style={{
            fontSize: '3em',
            minWidth: '200px',
            minHeight: '200px',
            borderRadius: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            color: Colors.Text,
          }}
        />
        <Box margin={{ top: 'small' }}>
          <span style={{ color: Colors.Text }}>
            {mode === 'pomodoro' && `Pomodoros completados: ${completedPomodoros}`}
          </span>
        </Box>
      </Box>
    </div>
  );
};

export default Pomodoro;