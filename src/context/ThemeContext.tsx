import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { createCommonStyles } from '../theme/createStyles';
import {
  createShadows,
  darkColors,
  lightColors,
  radius,
  type ThemeColors,
} from '../theme/palettes';

export type ThemeMode = 'light' | 'dark';

const THEME_KEY = 'todoo_theme';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  shadows: ReturnType<typeof createShadows>;
  radius: typeof radius;
  commonStyles: ReturnType<typeof createCommonStyles>;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(stored => {
      if (stored === 'dark' || stored === 'light') {
        setMode(stored);
      }
    });
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    setMode(next);
    AsyncStorage.setItem(THEME_KEY, next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(mode === 'light' ? 'dark' : 'light');
  }, [mode, setTheme]);

  const colors = mode === 'dark' ? darkColors : lightColors;
  const shadows = useMemo(() => createShadows(colors), [colors]);
  const commonStyles = useMemo(() => createCommonStyles(colors), [colors]);

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      colors,
      shadows,
      radius,
      commonStyles,
      toggleTheme,
      setTheme,
    }),
    [mode, colors, shadows, commonStyles, toggleTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
