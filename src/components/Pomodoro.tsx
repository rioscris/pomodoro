import { Box, Button, Page } from 'grommet';
import { SettingsOption, Play, Pause, Add, Trash, Close } from 'grommet-icons';
import React, { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import { usePomodoroContext } from '../contexts/PomodoroContext';
import { useCalculatedColors } from '../hooks/useCalculatedColors';
import { useSounds } from '../hooks/useSounds';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';
import type { YouTubeQueueItem } from '../hooks/useYouTubePlayer';
import { FEATURE_FLAGS } from '../shared/config/featureFlags';
import { getItemFromLocalStorage, setItemToLocalStorage } from '../utils/localStorage';
import {
  DEFAULT_LONG_BREAK_TIME,
  DEFAULT_POMODORO_TIME,
  DEFAULT_SHORT_BREAK_TIME,
  getExpiryDate,
  parseTime,
  POMODOROS_BEFORE_LONG_BREAK,
  timeToString
} from '../utils/pomodoro';
import './Pomodoro.css';
import { useNavigate } from 'react-router-dom';

type Mode = 'pomodoro' | 'shortBreak' | 'longBreak';
const MODES: Mode[] = ['pomodoro', 'shortBreak', 'longBreak'];

const modeLabels: Record<Mode, string> = {
  pomodoro: 'Pomodoro',
  shortBreak: 'Descanso corto',
  longBreak: 'Descanso largo',
};

const extractVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const Pomodoro: React.FC = () => {
  const pomodoroTime = getItemFromLocalStorage('pomodoro', DEFAULT_POMODORO_TIME);
  const shortBreakTime = getItemFromLocalStorage('shortBreak', DEFAULT_SHORT_BREAK_TIME);
  const longBreakTime = getItemFromLocalStorage('longBreak', DEFAULT_LONG_BREAK_TIME);

  const navigate = useNavigate();

  const {
    shouldPause,
    setShouldPause,
    shouldResume,
    setShouldResume,
    timerState,
    setTimerState
  } = usePomodoroContext();

  const colors = useCalculatedColors();
  const { playClickSound, playTransitionSound } = useSounds();

  const mode = timerState.mode;
  const completedPomodoros = timerState.completedPomodoros;

  const [inputValue, setInputValue] = useState<string>('');
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const isYoutubeEnabled = FEATURE_FLAGS.youtubePlayer;

  useEffect(() => {
    setInputValue(completedPomodoros.toString());
  }, [completedPomodoros]);

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

  const handlePomodoroCounterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === '') {
      setInputValue(value);
      return;
    }

    if (!/^\d+$/.test(value)) {
      return;
    }

    const num = parseInt(value);
    if (num >= 0 && num <= 99) {
      setInputValue(value);
      setCompletedPomodoros(num);
    }
  };

  const handlePomodoroCounterBlur = () => {
    if (inputValue === '' || !/^\d+$/.test(inputValue)) {
      setInputValue(completedPomodoros.toString());
    }
  };

  const handleYoutubeUrlSubmit = () => {
    const videoId = extractVideoId(youtubeUrl);
    console.log('URL ingresada:', youtubeUrl);
    console.log('Video ID extraído:', videoId);
    if (videoId) {
      const newItem: YouTubeQueueItem = {
        id: `${videoId}-${Date.now()}`,
        videoId,
        title: youtubeUrl,
        url: youtubeUrl,
      };
      console.log('Agregando a cola:', newItem);
      youtube.addToQueue(newItem);
      setYoutubeUrl('');
    } else {
      console.log('URL inválida, no se pudo extraer videoId');
    }
  };

  const handleClearQueue = () => {
    youtube.clearQueue();
    setItemToLocalStorage('youtubeQueue', '[]');
  };

  const { minutes, seconds, pause, isRunning, resume, restart } = useTimer({
    expiryTimestamp: (() => {
      const { minutes, seconds } = getCurrentModeTime();
      return getExpiryDate(minutes, seconds);
    })(),
    autoStart: false,
    onExpire: () => {
      if (mode === 'pomodoro') {
        setCompletedPomodoros((n) => n + 1);
        if ((completedPomodoros + 1) % POMODOROS_BEFORE_LONG_BREAK === 0) {
          playTransitionSound(true);
          setMode('longBreak');
        } else {
          playTransitionSound(false);
          setMode('shortBreak');
        }
      } else {
        playTransitionSound(false);
        setMode('pomodoro');
      }
    },
  });

  const youtube = useYouTubePlayer(isRunning, isYoutubeEnabled);

  useEffect(() => {
    if (!isYoutubeEnabled) return;

    const savedQueue = getItemFromLocalStorage('youtubeQueue', '[]');
    try {
      const parsedQueue = JSON.parse(savedQueue);
      console.log('Cola guardada en localStorage:', parsedQueue);
      if (Array.isArray(parsedQueue) && parsedQueue.length > 0) {
        parsedQueue.forEach((item: any) => {
          // Validar que el item tenga la estructura correcta
          if (item && item.videoId && item.url) {
            youtube.addToQueue(item);
          } else {
            console.warn('Item inválido en cola guardada:', item);
          }
        });
      }
    } catch (e) {
      console.error('Error loading YouTube queue:', e);
      // Limpiar localStorage si hay error
      setItemToLocalStorage('youtubeQueue', '[]');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isYoutubeEnabled]);

  useEffect(() => {
    if (!isYoutubeEnabled) return;

    if (youtube.queue.length > 0) {
      setItemToLocalStorage('youtubeQueue', JSON.stringify(youtube.queue));
    }
  }, [isYoutubeEnabled, youtube.queue]);

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
    playClickSound();
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
    <Page
      kind='full'
      className="pomodoro-page"
      style={{
        // @ts-expect-error - CSS variables
        '--text-color': colors.text,
        '--bg-color': colors.background,
        '--border-color': colors.border,
        '--secondary-text-color': colors.secondaryText,
      }}
    >
      <Box
        align="center"
        justify="center"
        gap="large"
        pad="large"
        className="pomodoro-container"
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
          <Box direction="row" align="center" className="pomodoro-counter-container">
            <span className="pomodoro-counter-label">
              Pomodoros completados:
            </span>
            <input
              type="text"
              value={inputValue}
              onChange={handlePomodoroCounterChange}
              onBlur={handlePomodoroCounterBlur}
              placeholder="0"
              className="pomodoro-counter-input-inline"
              style={{
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.background,
              }}
            />
          </Box>
        </Box>

        {/* YouTube Player Controls */}
        {isYoutubeEnabled && (
          <Box align="center" gap="medium" className="youtube-container">
            {/* Add to Queue */}
            <Box direction="row" gap="small" align="center" className="youtube-input-container">
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleYoutubeUrlSubmit()}
                placeholder="Pega URL de YouTube aquí"
                className="youtube-url-input"
              />
              <Button
                icon={<Add size="small" color={colors.text} />}
                onClick={handleYoutubeUrlSubmit}
                className="youtube-button"
              />
            </Box>

            {/* Player Controls */}
            {youtube.queue.length > 0 && (
              <Box gap="small" align="center">
                <Box direction="row" gap="small" align="center" justify="center">
                  <Button
                    icon={youtube.isPlaying ? <Pause size="small" color={colors.background} /> : <Play size="small" color={colors.background} />}
                    onClick={youtube.togglePlayPause}
                    // disabled={!youtube.isPlayerReady}
                    className="youtube-play-button"
                  />
                  <Button
                    icon={<Trash size="small" color={colors.text} />}
                    onClick={handleClearQueue}
                    className="youtube-button youtube-clear-button"
                  />
                </Box>

                {/* Current Video Info */}
                {youtube.currentVideo && (
                  <span className="youtube-status">
                    🎵 {youtube.currentIndex + 1}/{youtube.queue.length}: {youtube.currentVideo.title.slice(0, 50)}...
                  </span>
                )}

                {/* Queue List */}
                <Box gap="xsmall" className="youtube-queue">
                  {youtube.queue.map((item, index) => (
                    <Box
                      key={item.id}
                      direction="row"
                      gap="small"
                      align="center"
                      justify="between"
                      className={`youtube-queue-item ${index === youtube.currentIndex ? 'active' : ''}`}
                      onClick={() => youtube.playAtIndex(index)}
                    >
                      <span className="youtube-queue-item-text">
                        {index + 1}. {item.title.slice(0, 40)}...
                      </span>
                      <Button
                        icon={<Close size="small" color={index === youtube.currentIndex ? colors.background : colors.text} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          youtube.removeFromQueue(item.id);
                        }}
                        plain
                        className="youtube-queue-button"
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* Hidden YouTube Player */}
        {isYoutubeEnabled && <div id="youtube-player" style={{ display: 'none' }}></div>}

        <Button
          icon={<SettingsOption size="large" color={colors.text} />}
          onClick={() => navigate('/configurations')}
          plain
          className="configurations-button"
        />
      </Box>
    </Page>

  );
};

export default Pomodoro;