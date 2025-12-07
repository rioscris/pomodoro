/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getItemFromLocalStorage, setItemToLocalStorage } from '../utils/localStorage';

export type ColorTheme = 'grays' | 'classic';
export type PomodoroMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface ColorModeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider');
  }
  return context;
};

interface ColorModeProviderProps {
  children: ReactNode;
}

export const ColorModeProvider: React.FC<ColorModeProviderProps> = ({ children }) => {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    const saved = getItemFromLocalStorage('colorTheme', 'grays');
    return saved as ColorTheme;
  });

  useEffect(() => {
    setItemToLocalStorage('colorTheme', colorTheme);
  }, [colorTheme]);

  const setColorTheme = (theme: ColorTheme) => {
    setColorThemeState(theme);
  };

  return (
    <ColorModeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorModeContext.Provider>
  );
};
