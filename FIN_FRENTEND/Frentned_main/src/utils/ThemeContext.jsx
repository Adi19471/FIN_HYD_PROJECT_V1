import { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";

const ThemeContext = createContext({
  currentTheme: "light",
  changeCurrentTheme: () => {},
});

export default function ThemeProvider({ children }) {
  const persistedTheme = localStorage.getItem("theme");
  const [theme, setTheme] = useState(persistedTheme || "light");

  const changeCurrentTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    // Temporarily disable transitions while toggling theme to avoid flash
    document.documentElement.classList.add("notransition");
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    }

    const transitionTimeout = setTimeout(() => {
      document.documentElement.classList.remove("notransition");
    }, 1);

    return () => clearTimeout(transitionTimeout);
  }, [theme]);

  // Build an MUI theme that follows the selected mode so MUI components update.
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,
          primary: { main: "#0ea5a0" },
        },
      }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={{ currentTheme: theme, changeCurrentTheme }}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeProvider = () => useContext(ThemeContext);
