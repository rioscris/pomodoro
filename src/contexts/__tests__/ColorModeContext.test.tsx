import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ColorModeProvider, useColorMode } from '../ColorModeContext';

describe('ColorModeContext', () => {
  it('should provide default colorTheme as grays', () => {
    const { result } = renderHook(() => useColorMode(), {
      wrapper: ({ children }) => <ColorModeProvider>{children}</ColorModeProvider>,
    });

    expect(result.current.colorTheme).toBe('grays');
  });

  it('should allow changing colorTheme', () => {
    const { result } = renderHook(() => useColorMode(), {
      wrapper: ({ children }) => <ColorModeProvider>{children}</ColorModeProvider>,
    });

    act(() => {
      result.current.setColorTheme('classic');
    });

    expect(result.current.colorTheme).toBe('classic');
  });

  it('should persist colorTheme in localStorage', () => {
    const { result } = renderHook(() => useColorMode(), {
      wrapper: ({ children }) => <ColorModeProvider>{children}</ColorModeProvider>,
    });

    act(() => {
      result.current.setColorTheme('classic');
    });

    expect(localStorage.getItem('colorTheme')).toBe('classic');
  });
});
