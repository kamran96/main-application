import { useEffect, useState } from 'react';

let timeOut: any;

export const useTheme = (themeName: 'light' | 'dark') => {
  const [themeLoading, setThemeLoading] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (themeName !== theme) {
      setThemeLoading(true);
      const themename = themeName;
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        setTheme(themename);
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
          setThemeLoading(false);
        }, 700);
      }, 500);
    }
  }, [themeName]);

  return { themeLoading, theme };
};
