import type { ColorTheme, PomodoroMode } from '../contexts/ColorModeContext';
import { getNextMode } from '../contexts/PomodoroContext';

export interface ColorScheme {
  background: string;
  text: string;
  secondaryText: string;
  border: string;
}

export const COLOR_PALETTES: Record<ColorTheme, Record<PomodoroMode, ColorScheme>> = {
  grays: {
    pomodoro: {
      background: '#0a0a0a',
      text: '#ffffff',
      secondaryText: '#b0b0b0',
      border: '#ffffff',
    },
    shortBreak: {
      background: '#2d2d2d',
      text: '#d0d0d0',
      secondaryText: '#909090',
      border: '#d0d0d0',
    },
    longBreak: {
      background: '#1f1f1f',
      text: '#e8e8e8',
      secondaryText: '#a0a0a0',
      border: '#e8e8e8',
    },
  },
  classic: {
    pomodoro: {
      background: '#FFB6C1',
      text: '#8B0000',
      secondaryText: '#A52A2A',
      border: '#8B0000',
    },
    shortBreak: {
      background: '#B0E0E6',
      text: '#00008B',
      secondaryText: '#191970',
      border: '#00008B',
    },
    longBreak: {
      background: '#98FB98',
      text: '#006400',
      secondaryText: '#2E8B57',
      border: '#006400',
    },
  },
};

/**
 * Interpolates between two numeric values
 */
const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

/**
 * Converts a hex color to RGB
 */
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : { r: 0, g: 0, b: 0 };
};

/**
 * Converts RGB to hex
 */
const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Interpolates between two hex colors
 */
const lerpColor = (color1: string, color2: string, t: number): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const r = lerp(rgb1.r, rgb2.r, t);
  const g = lerp(rgb1.g, rgb2.g, t);
  const b = lerp(rgb1.b, rgb2.b, t);

  return rgbToHex(r, g, b);
};

/**
 * Interpolates between two complete color schemes
 */
const lerpColorScheme = (scheme1: ColorScheme, scheme2: ColorScheme, t: number): ColorScheme => {
  return {
    background: lerpColor(scheme1.background, scheme2.background, t),
    text: lerpColor(scheme1.text, scheme2.text, t),
    secondaryText: lerpColor(scheme1.secondaryText, scheme2.secondaryText, t),
    border: lerpColor(scheme1.border, scheme2.border, t),
  };
};

export const calculateColors = (
  colorTheme: ColorTheme,
  pomodoroMode: PomodoroMode,
  totalSeconds: number,
  remainingSeconds: number,
  completedPomodoros: number,
  pomodorosBeforeLongBreak: number = 3
): ColorScheme => {
  const palette = COLOR_PALETTES[colorTheme];
  const currentScheme = palette[pomodoroMode];
  const nextMode = getNextMode(pomodoroMode, completedPomodoros, pomodorosBeforeLongBreak);
  const nextScheme = palette[nextMode];

  // Ensure progress is always between 0 and 1, and handle edge cases
  const progress = totalSeconds > 0
    ? Math.max(0, Math.min(1, 1 - (remainingSeconds / totalSeconds)))
    : 0;

  return lerpColorScheme(currentScheme, nextScheme, progress);
};
