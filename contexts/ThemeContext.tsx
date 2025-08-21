import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark';

interface Colors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  canvas: string;
  stroke: string;
}

interface Typography {
  fontSize: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  fontWeight: {
    normal: string;
    bold: string;
  };
}

export interface Theme {
  mode: ThemeMode;
  colors: Colors;
  typography: Typography;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
  };
}

const lightColors: Colors = {
  background: '#f0f0f0',
  surface: '#ffffff',
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF6B6B',
  text: '#000000',
  textSecondary: '#666666',
  border: '#E5E5E5',
  success: '#4CD964',
  warning: '#FF9500',
  error: '#FF3B30',
  canvas: '#ffffff',
  stroke: '#FF0000',
};

const darkColors: Colors = {
  background: '#000000',
  surface: '#1C1C1E',
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  accent: '#FF6B6B',
  text: '#FFFFFF',
  textSecondary: '#AEAEB2',
  border: '#38383A',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  canvas: '#1C1C1E',
  stroke: '#FF453A',
};

const typography: Typography = {
  fontSize: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
  },
  fontWeight: {
    normal: '400',
    bold: '600',
  },
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const borderRadius = {
  small: 4,
  medium: 8,
  large: 20,
};

const createTheme = (mode: ThemeMode): Theme => ({
  mode,
  colors: mode === 'light' ? lightColors : darkColors,
  typography,
  spacing,
  borderRadius,
});

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialMode = 'light' 
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(initialMode);
  const theme = createTheme(themeMode);

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const handleSetThemeMode = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
  }, []);

  const value: ThemeContextType = {
    theme,
    themeMode,
    toggleTheme,
    setThemeMode: handleSetThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};