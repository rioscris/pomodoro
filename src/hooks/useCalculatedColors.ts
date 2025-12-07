import { useColorMode } from '../contexts/ColorModeContext';
import { usePomodoroContext } from '../contexts/PomodoroContext';
import { calculateColors, type ColorScheme } from '../utils/colorUtils';
import { POMODOROS_BEFORE_LONG_BREAK } from '../utils/pomodoro';

export const useCalculatedColors = (): ColorScheme => {
  const { colorTheme } = useColorMode();
  const { timerState } = usePomodoroContext();

  return calculateColors(
    colorTheme,
    timerState.mode,
    timerState.totalSeconds,
    timerState.remainingSeconds,
    timerState.completedPomodoros,
    POMODOROS_BEFORE_LONG_BREAK
  );
};
