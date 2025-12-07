import { describe, it, expect } from 'vitest';
import { calculateColors } from '../colorUtils';

describe('colorUtils', () => {
  describe('calculateColors', () => {
    it('should return initial color scheme at the start of pomodoro', () => {
      const colors = calculateColors(
        'classic',
        'pomodoro',
        1500,
        1500,
        0,
        3
      );

      expect(colors.background).toBe('#ffb6c1');
      expect(colors.text).toBe('#8b0000');
    });

    it('should interpolate colors halfway through pomodoro', () => {
      const colors = calculateColors(
        'classic',
        'pomodoro',
        1500,
        750,
        0,
        3
      );

      expect(colors.background).not.toBe('#ffb6c1');
      expect(colors.background).not.toBe('#b0e0e6');
    });

    it('should transition from pomodoro to shortBreak colors', () => {
      const colors = calculateColors(
        'classic',
        'pomodoro',
        1500,
        0,
        0,
        3
      );

      expect(colors.background).toBe('#b0e0e6');
    });

    it('should work with grays theme', () => {
      const colors = calculateColors(
        'grays',
        'pomodoro',
        1500,
        1500,
        0,
        3
      );

      expect(colors.background).toBe('#0a0a0a');
      expect(colors.text).toBe('#ffffff');
    });

    it('should transition to longBreak after completing pomodoros', () => {
      const colors = calculateColors(
        'classic',
        'pomodoro',
        1500,
        0,
        3,
        3
      );

      expect(colors.background).toBe('#98fb98');
    });

    it('should handle shortBreak to pomodoro transition', () => {
      const startColors = calculateColors(
        'classic',
        'shortBreak',
        300,
        300,
        1,
        3
      );

      const endColors = calculateColors(
        'classic',
        'shortBreak',
        300,
        0,
        1,
        3
      );

      expect(startColors.background).toBe('#b0e0e6');
      expect(endColors.background).toBe('#ffb6c1');
    });

    it('should handle longBreak to pomodoro transition', () => {
      const startColors = calculateColors(
        'classic',
        'longBreak',
        900,
        900,
        0,
        3
      );

      const endColors = calculateColors(
        'classic',
        'longBreak',
        900,
        0,
        0,
        3
      );

      expect(startColors.background).toBe('#98fb98');
      expect(endColors.background).toBe('#ffb6c1');
    });

    it('should handle division by zero (totalSeconds = 0)', () => {
      const colors = calculateColors(
        'classic',
        'pomodoro',
        0,
        0,
        0,
        3
      );

      // Should return the initial scheme without errors
      expect(colors.background).toBe('#ffb6c1');
      expect(colors.text).toBe('#8b0000');
    });

    it('should clamp progress when remainingSeconds > totalSeconds', () => {
      const colors = calculateColors(
        'classic',
        'pomodoro',
        100,
        200, // More remaining than total
        0,
        3
      );

      // Progress should be clamped to 0, returning initial scheme
      expect(colors.background).toBe('#ffb6c1');
    });

    it('should clamp progress when remainingSeconds is negative', () => {
      const colors = calculateColors(
        'classic',
        'pomodoro',
        100,
        -10, // Negative remaining
        0,
        3
      );

      // Progress should be clamped to 1, returning next scheme
      expect(colors.background).toBe('#b0e0e6');
    });
  });
});
