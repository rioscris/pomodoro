import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCalculatedColors } from '../useCalculatedColors';
import { ColorModeProvider } from '../../contexts/ColorModeContext';
import { PomodoroProvider } from '../../contexts/PomodoroContext';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ColorModeProvider>
    <PomodoroProvider>
      {children}
    </PomodoroProvider>
  </ColorModeProvider>
);

describe('useCalculatedColors', () => {
  it('should return colors based on current context state', () => {
    const { result } = renderHook(() => useCalculatedColors(), { wrapper });

    expect(result.current).toHaveProperty('background');
    expect(result.current).toHaveProperty('text');
    expect(result.current).toHaveProperty('secondaryText');
    expect(result.current).toHaveProperty('border');
  });

  it('should return grays theme colors by default', () => {
    const { result } = renderHook(() => useCalculatedColors(), { wrapper });

    expect(result.current.background).toBe('#0a0a0a');
    expect(result.current.text).toBe('#ffffff');
  });
});
