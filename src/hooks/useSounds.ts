import { useCallback } from 'react';

export const useSounds = () => {
  const playClickSound = useCallback(() => {
    const audio = new Audio('/button_press_1.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.error('Error playing click sound:', err));
  }, []);

  const playTransitionSound = useCallback((isLongBreak: boolean = false) => {
    const soundFile = isLongBreak ? '/timer_toggle_break_long.mp3' : '/timer_toggle_pomos.mp3';
    const audio = new Audio(soundFile);
    audio.volume = 0.5;
    audio.play().catch(err => console.error('Error playing transition sound:', err));
  }, []);

  return {
    playClickSound,
    playTransitionSound,
  };
};
