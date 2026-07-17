import { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BREAKPOINTS } from "./breakpoints";

const ThemeContext = createContext({
  currentTheme: "light",
  settings: {},
  changeCurrentTheme: () => {},
  updateThemeSetting: () => {},
  resetThemeSettings: () => {},
});

const defaultSettings = {
  mode: "light",
  colorTheme: "sunrise",
  fontFamily: "Tahoma",
  fontScale: 1.08,
  screenScale: 1,
  density: "comfortable",
  tableDensity: "compact",
  tableStyle: "striped",
  formStyle: "outlined",
  iconStyle: "pulse",
  loadingStyle: "pulse",
  sidebarStyle: "expanded",
  navbarStyle: "rounded",
  radius: 0,
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
  Tahoma: 'Tahoma, Verdana, Geneva, "Segoe UI", sans-serif',
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
    // One-time migration to the new app default font (Tahoma). Upgrades the
    // previous auto-defaults while respecting any other explicit user choice.
    if (localStorage.getItem("ui-font-v2") !== "1") {
      if (!persisted.fontFamily || persisted.fontFamily === "Manrope" || persisted.fontFamily === "Inter") {
        persisted.fontFamily = "Tahoma";
      }
      localStorage.setItem("ui-font-v2", "1");
    }
    // One-time migration to square corners (radius 0) across the app.
    if (localStorage.getItem("ui-radius-v1") !== "1") {
      persisted.radius = 0;
      localStorage.setItem("ui-radius-v1", "1");
    }
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
    document.documentElement.style.setProperty("--app-screen-zoom", settings.screenScale || 1);
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
    settings.screenScale,
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
  const fontScale = Number(settings.fontScale || 1);
  const densityUnit = settings.density === "compact" ? 0.9 : settings.density === "spacious" ? 1.12 : 1;
  const tableScale = settings.tableDensity === "compact" ? 0.92 : settings.tableDensity === "spacious" ? 1.08 : 1;

  const muiTheme = useMemo(
    () =>
      createTheme({
        breakpoints: { values: BREAKPOINTS },
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
          fontSize: 14 * fontScale,
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
                borderRadius: settings.radius,
                minHeight: settings.density === "compact" ? 32 : settings.density === "spacious" ? 44 : 40,
                paddingLeft: settings.density === "compact" ? 12 : settings.density === "spacious" ? 20 : 16,
                paddingRight: settings.density === "compact" ? 12 : settings.density === "spacious" ? 20 : 16,
                fontSize: `${0.875 * fontScale}rem`,
                lineHeight: 1.25,
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                width: settings.density === "compact" ? 34 : settings.density === "spacious" ? 44 : 40,
                height: settings.density === "compact" ? 34 : settings.density === "spacious" ? 44 : 40,
                borderRadius: settings.iconStyle === "sharp" ? 6 : settings.iconStyle === "soft" ? 12 : "50%",
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontSize: `${0.75 * fontScale}rem`,
                height: settings.density === "compact" ? 24 : settings.density === "spacious" ? 32 : 28,
                fontWeight: 800,
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                minHeight: settings.density === "compact" ? 38 : settings.density === "spacious" ? 52 : 44,
                fontSize: `${0.86 * fontScale}rem`,
                fontWeight: 800,
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              size: settings.density === "compact" ? "small" : "medium",
            },
          },
          MuiSelect: {
            defaultProps: {
              size: settings.density === "compact" ? "small" : "medium",
            },
          },
          MuiAutocomplete: {
            defaultProps: {
              size: settings.density === "compact" ? "small" : "medium",
              fullWidth: true,
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: settings.radius,
                minHeight: settings.density === "compact" ? 36 : settings.density === "spacious" ? 50 : 44,
                backgroundColor:
                  settings.formStyle === "minimal"
                    ? "transparent"
                    : isDark
                    ? "rgba(15,23,42,0.72)"
                    : "rgba(255,255,255,0.9)",
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              input: {
                fontSize: `${0.94 * fontScale}rem`,
                fontWeight: 700,
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                minHeight: settings.density === "compact" ? 34 : settings.density === "spacious" ? 46 : 40,
                fontSize: `${0.9 * fontScale}rem`,
                whiteSpace: "normal",
                wordBreak: "break-word",
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                paddingTop: `${10 * densityUnit}px`,
                paddingBottom: `${10 * densityUnit}px`,
                fontSize: `${0.86 * fontScale * tableScale}rem`,
              },
              head: {
                fontSize: `${0.78 * fontScale * tableScale}rem`,
                fontWeight: 900,
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: settings.radius,
                overflow: "hidden",
              },
            },
          },
          MuiDataGrid: {
            styleOverrides: {
              root: {
                border: 0,
                fontSize: `${0.82 * fontScale * tableScale}rem`,
                fontWeight: 700,
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
              cell: {
                fontWeight: 700,
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
      settings.screenScale,
      settings.radius,
      settings.density,
      settings.tableDensity,
      settings.formStyle,
      settings.iconStyle,
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
