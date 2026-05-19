import { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext({
  currentTheme: "light",
  settings: {},
  changeCurrentTheme: () => {},
  updateThemeSetting: () => {},
  resetThemeSettings: () => {},
});

const defaultSettings = {
  mode: "light",
  colorTheme: "trust",
  fontFamily: "Inter",
  fontScale: 1.04,
  density: "comfortable",
  tableDensity: "compact",
  tableStyle: "striped",
  formStyle: "filled",
  iconStyle: "rounded",
  loadingStyle: "pulse",
  sidebarStyle: "expanded",
  navbarStyle: "glass",
  radius: 12,
};

const colorThemes = {
  trust: {
    primary: "#0f62fe",
    secondary: "#0e7490",
    success: "#059669",
    warning: "#d97706",
    error: "#dc2626",
  },
  emerald: {
    primary: "#047857",
    secondary: "#0f766e",
    success: "#16a34a",
    warning: "#ca8a04",
    error: "#e11d48",
  },
  executive: {
    primary: "#334155",
    secondary: "#2563eb",
    success: "#15803d",
    warning: "#b45309",
    error: "#b91c1c",
  },
  royal: {
    primary: "#4338ca",
    secondary: "#0891b2",
    success: "#0f9f6e",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  sunrise: {
    primary: "#b45309",
    secondary: "#be123c",
    success: "#0f766e",
    warning: "#ea580c",
    error: "#dc2626",
  },
  steel: {
    primary: "#0f766e",
    secondary: "#475569",
    success: "#15803d",
    warning: "#ca8a04",
    error: "#be123c",
  },
  graphite: {
    primary: "#18181b",
    secondary: "#52525b",
    success: "#16a34a",
    warning: "#d97706",
    error: "#dc2626",
  },
};

const fontStacks = {
  Inter: '"Inter", system-ui, sans-serif',
  Roboto: '"Roboto", system-ui, sans-serif',
  Poppins: '"Poppins", Inter, system-ui, sans-serif',
  Manrope: '"Manrope", Inter, system-ui, sans-serif',
  "Open Sans": '"Open Sans", Inter, system-ui, sans-serif',
  Lato: '"Lato", Inter, system-ui, sans-serif',
  Nunito: '"Nunito", Inter, system-ui, sans-serif',
  System: 'system-ui, -apple-system, "Segoe UI", sans-serif',
};

const readSettings = () => {
  try {
    const legacyTheme = localStorage.getItem("theme");
    const persisted = JSON.parse(localStorage.getItem("enterprise-ui-settings") || "{}");
    return {
      ...defaultSettings,
      mode: legacyTheme || defaultSettings.mode,
      ...persisted,
    };
  } catch {
    return defaultSettings;
  }
};

export default function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(readSettings);
  const theme = settings.mode;

  const changeCurrentTheme = (newTheme) => {
    setSettings((prev) => ({ ...prev, mode: newTheme }));
    localStorage.setItem("theme", newTheme);
  };

  const updateThemeSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetThemeSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem("theme", defaultSettings.mode);
  };

  useEffect(() => {
    localStorage.setItem("enterprise-ui-settings", JSON.stringify(settings));
    localStorage.setItem("theme", settings.mode);
  }, [settings]);

  useEffect(() => {
    document.documentElement.classList.add("notransition");
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.style.colorScheme = "dark";
    }
    document.documentElement.dataset.themeColor = settings.colorTheme;
    document.documentElement.dataset.density = settings.density;
    document.documentElement.dataset.tableDensity = settings.tableDensity;
    document.documentElement.dataset.tableStyle = settings.tableStyle;
    document.documentElement.dataset.formStyle = settings.formStyle;
    document.documentElement.dataset.iconStyle = settings.iconStyle;
    document.documentElement.dataset.loadingStyle = settings.loadingStyle;
    document.documentElement.dataset.navbarStyle = settings.navbarStyle;
    document.documentElement.style.setProperty("--app-font-scale", settings.fontScale);
    document.documentElement.style.setProperty("--app-radius", `${settings.radius}px`);
    document.documentElement.style.setProperty("--app-font-family", fontStacks[settings.fontFamily] || fontStacks.Inter);

    const transitionTimeout = setTimeout(() => {
      document.documentElement.classList.remove("notransition");
    }, 1);

    return () => clearTimeout(transitionTimeout);
  }, [
    theme,
    settings.colorTheme,
    settings.density,
    settings.fontFamily,
    settings.fontScale,
    settings.radius,
    settings.tableDensity,
    settings.tableStyle,
    settings.formStyle,
    settings.iconStyle,
    settings.loadingStyle,
    settings.navbarStyle,
  ]);

  const palette = colorThemes[settings.colorTheme] || colorThemes.trust;
  const isDark = theme === "dark";

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme,
          primary: { main: palette.primary },
          secondary: { main: palette.secondary },
          success: { main: palette.success },
          warning: { main: palette.warning },
          error: { main: palette.error },
          background: {
            default: isDark ? "#080f1d" : "#f5f7fb",
            paper: isDark ? "#0f172a" : "#ffffff",
          },
          text: {
            primary: isDark ? "#f8fafc" : "#0f172a",
            secondary: isDark ? "#94a3b8" : "#475569",
          },
          divider: isDark ? "rgba(148, 163, 184, 0.18)" : "rgba(15, 23, 42, 0.1)",
        },
        typography: {
          fontFamily:
            fontStacks[settings.fontFamily] || fontStacks.Inter,
          fontSize: 14 * Number(settings.fontScale || 1),
          h1: { fontWeight: 900, letterSpacing: 0 },
          h2: { fontWeight: 900, letterSpacing: 0 },
          h3: { fontWeight: 900, letterSpacing: 0 },
          h4: { fontWeight: 900, letterSpacing: 0 },
          h5: { fontWeight: 850, letterSpacing: 0 },
          h6: { fontWeight: 850, letterSpacing: 0 },
          subtitle1: { fontWeight: 800, letterSpacing: 0 },
          subtitle2: { fontWeight: 800, letterSpacing: 0 },
          button: { textTransform: "none", fontWeight: 700 },
        },
        shape: { borderRadius: settings.radius },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                border: `1px solid ${isDark ? "rgba(148,163,184,0.16)" : "rgba(15,23,42,0.08)"}`,
                boxShadow: isDark
                  ? "0 18px 40px rgba(0,0,0,0.26)"
                  : "0 18px 45px rgba(15,23,42,0.07)",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                border: `1px solid ${isDark ? "rgba(148,163,184,0.16)" : "rgba(15,23,42,0.08)"}`,
                boxShadow: isDark
                  ? "0 18px 40px rgba(0,0,0,0.28)"
                  : "0 16px 38px rgba(15,23,42,0.07)",
              },
            },
          },
          MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
              root: {
                borderRadius: Math.max(8, settings.radius),
                minHeight: settings.density === "compact" ? 32 : settings.density === "spacious" ? 44 : 40,
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              size: settings.density === "compact" ? "small" : "medium",
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: Math.max(8, settings.radius),
                backgroundColor:
                  settings.formStyle === "minimal"
                    ? "transparent"
                    : isDark
                    ? "rgba(15,23,42,0.72)"
                    : "rgba(255,255,255,0.9)",
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: settings.radius + 4,
                overflow: "hidden",
              },
            },
          },
          MuiDataGrid: {
            styleOverrides: {
              root: {
                border: 0,
                fontSize: settings.tableDensity === "compact" ? 12.5 : settings.tableDensity === "spacious" ? 14 : 13.5,
              },
              columnHeaders: {
                minHeight: settings.tableDensity === "compact" ? "40px !important" : settings.tableDensity === "spacious" ? "56px !important" : "48px !important",
              },
              columnHeader: {
                backgroundColor: isDark ? "#111827" : "#f8fafc",
              },
              columnHeaderTitle: {
                fontWeight: 800,
                color: isDark ? "#cbd5e1" : "#334155",
              },
              row: {
                minHeight: settings.tableDensity === "compact" ? "40px !important" : settings.tableDensity === "spacious" ? "56px !important" : "48px !important",
              },
            },
          },
        },
      }),
    [
      theme,
      palette,
      isDark,
      settings.fontFamily,
      settings.fontScale,
      settings.radius,
      settings.density,
      settings.tableDensity,
      settings.formStyle,
    ]
  );

  return (
    <ThemeContext.Provider
      value={{
        currentTheme: theme,
        settings,
        changeCurrentTheme,
        updateThemeSetting,
        resetThemeSettings,
      }}
    >
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useThemeProvider = () => useContext(ThemeContext);
