import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const value: ThemeContextValue = {
    theme,
    isDarkMode: theme === 'dark',
    toggleTheme: () => {
      setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
    }
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}
