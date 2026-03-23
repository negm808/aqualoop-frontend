import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const useTheme = () => {
  const { theme, setTheme } = useStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};
