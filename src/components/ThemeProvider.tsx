import React, {
  FC,
  memo,
  createContext,
  useState,
  useCallback,
  useContext,
  ReactNode
} from 'react';
import { ThemeProvider as MuiThemeProvider, Theme } from '@material-ui/core/styles';
import { lightTheme, darkTheme, projectorTheme } from '../styles/theme';

interface ThemeProviderProps {
  theme: string;
  children: ReactNode;
}

interface ThemeContextInterface {
  toggleTheme: () => void;
  useProjector: boolean;
}

const getTheme = ({ theme, useProjector }: { theme: string; useProjector: boolean }): Theme => {
  if (useProjector) {
    switch (theme) {
      case 'dark':
        // TODO: replace with dark projector theme
        return darkTheme;

      default:
        return projectorTheme;
    }
  }

  switch (theme) {
    case 'dark':
      return darkTheme;

    default:
      return lightTheme;
  }
};

export const ThemeContext = createContext({} as ThemeContextInterface);
export const useThemeToggle = (): (() => void) => {
  const { toggleTheme } = useContext(ThemeContext);
  return toggleTheme;
};
export const useTheme = (theme: string): Theme => {
  const { useProjector } = useContext(ThemeContext);
  return getTheme({ theme, useProjector });
};

const ThemeProvider: FC<ThemeProviderProps> = memo(({ theme = 'light', children }) => {
  const [useProjector, setUseProjector] = useState(false);
  const muiTheme = getTheme({ theme, useProjector });

  const toggleTheme = useCallback(() => {
    setUseProjector(currentUseProjector => !currentUseProjector);
  }, []);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <ThemeContext.Provider value={{ useProjector, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </MuiThemeProvider>
  );
});

export default ThemeProvider;
