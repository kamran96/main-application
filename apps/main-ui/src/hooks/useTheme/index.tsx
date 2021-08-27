import { useEffect, useState } from "react";

let timeOut: any;

export const useTheme = (themeName) => {
  const [themeLoading, setThemeLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setThemeLoading(true);
    let themename = themeName;
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      setTheme(themename);
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        setThemeLoading(false);
      }, 700);
    }, 500);
  }, [themeName]);

  return { themeLoading, theme };
};
