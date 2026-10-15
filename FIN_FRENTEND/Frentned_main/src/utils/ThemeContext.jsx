import { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BREAKPOINTS } from "./breakpoints";
import {
  DARK_INK,
  LIGHT_INK,
  alpha,
  contrastRatio,
  contrastText,
  darken,
  deriveSurfaceTokens,
  deriveTokens,
  lighten,
  mix,
  publishSurfaceTokens,
  publishTableHeadTokens,
  publishThemeTokens,
} from "src/lib/themeTokens";
import { COLOR_THEMES, SETTING_CHOICES, SURFACE_OPTIONS, TABLE_HEADER_OPTIONS, fontStack, isHexColor } from "src/lib/themeOptions";
import { COMPANY_ADDRESS, COMPANY_APP_NAME, COMPANY_LOGO } from "src/lib/company";

const ThemeContext = createContext({
  currentTheme: "light",
  settings: {},
  changeCurrentTheme: () => {},
  updateThemeSetting: () => {},
  applyThemeSettings: () => {},
  resetThemeSettings: () => {},
});

const defaultSettings = {
  mode: "light",
  colorTheme: "sunrise",
  // null = the colour theme's own accent; otherwise a #rrggbb that replaces it.
  customAccent: null,
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
  // Where the menu sits, and what the menu, the top bar, the report heading
  // band and the sign-in picture are painted in (src/lib/themeOptions.js).
  navLayout: "static",
  sidebarColor: "default",
  navbarColor: "default",
  tableHeader: "accent",
  loginStyle: "accent",
  // Blank = the built-in name / line / logo from src/lib/company.js.
  brandName: "",
  brandTagline: "",
  brandLogo: "",
};

/** Puts a default back wherever a saved value is not one the app still offers. */
const sanitizeSettings = (settings) => {
  const clean = { ...settings };
  Object.entries(SETTING_CHOICES).forEach(([key, choices]) => {
    if (!choices.includes(clean[key])) clean[key] = defaultSettings[key];
  });
  clean.customAccent = isHexColor(clean.customAccent) ? clean.customAccent.toLowerCase() : null;
  ["brandName", "brandTagline", "brandLogo"].forEach((key) => {
    if (typeof clean[key] !== "string") clean[key] = "";
  });
  return clean;
};

/**
 * The accent in force. A custom accent keeps the colour theme's success /
 * warning / error, and takes its second colour from itself (the same hue
 * drawn towards navy) so gradients stay in one family.
 */
const resolveAccent = (settings) => {
  const named = COLOR_THEMES[settings.colorTheme] || COLOR_THEMES.trust;
  const accent = isHexColor(settings.customAccent)
    ? { ...named, primary: settings.customAccent, secondary: mix(settings.customAccent, "#0f172a", 0.35) }
    : named;
  return settings.mode === "dark" ? { ...accent, primary: readableOnDark(accent.primary) } : accent;
};

/**
 * On the dark page a deep accent (indigo, slate, graphite) all but disappears
 * wherever it is used as ink: outlined buttons, menu icons, the open tab. It is
 * lifted towards white only as far as it takes to be seen (3:1 against the
 * dark card), so accents that already read there are left exactly as chosen.
 */
const DARK_PAPER = "#0f172a";
const readableOnDark = (color) => {
  let lifted = color;
  for (let step = 0; step < 12 && contrastRatio(lifted, DARK_PAPER) < 3; step += 1) {
    lifted = lighten(lifted, 0.1);
  }
  return lifted;
};

/** Tokens for the menu or the top bar, or null to leave the Light / Dark look alone. */
const resolveSurface = (choice, primary) => {
  if (choice === "integrate") return { bg: "var(--canvas)", border: "transparent" };
  if (choice === "accent") return deriveSurfaceTokens(primary);

  const option = SURFACE_OPTIONS.find((item) => item.value === choice);
  if (!option?.bg) return null;

  const tokens = deriveSurfaceTokens(option.bg);
  if (tokens.fg === LIGHT_INK) return tokens;
  // A light plate has room for the theme colour: keep its hover and
  // open-page highlight on the accent, as the default look has them.
  const { accent, onAccent, accentSoft, ...neutral } = tokens;
  return neutral;
};

/** Tokens for the report heading band, or null to leave it on the accent. */
const resolveTableHead = (choice, primary, isDark) => {
  let bg = null;
  let fg = null;

  if (choice === "soft") {
    bg = mix(isDark ? "#0f172a" : "#ffffff", primary, isDark ? 0.4 : 0.16);
    const ink = darken(primary, 0.35);
    if (!isDark) fg = contrastRatio(ink, bg) >= 4.5 ? ink : DARK_INK;
  } else {
    const option = TABLE_HEADER_OPTIONS.find((item) => item.value === choice);
    bg = (isDark && option?.bgDark) || option?.bg || null;
  }
  if (!bg) return null;

  fg = fg || contrastText(bg);
  return { bg, fg, hover: darken(bg, 0.08), divider: alpha(fg, 0.3), rule: darken(bg, 0.22) };
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
    // A sidebar the user had already collapsed, from before the menu layout
    // was a setting, is the Mini layout.
    if (!persisted.navLayout && localStorage.getItem("sidebar-expanded") === "false") {
      persisted.navLayout = "mini";
    }
    return sanitizeSettings({
      ...defaultSettings,
      mode: legacyTheme || defaultSettings.mode,
      ...persisted,
    });
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

  /** Several settings in one go - a preset, or a colour theme that also clears the custom accent. */
  const applyThemeSettings = (changes) => {
    setSettings((prev) => sanitizeSettings({ ...prev, ...changes }));
  };

  const resetThemeSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem("theme", defaultSettings.mode);
  };

  useEffect(() => {
    try {
      localStorage.setItem("enterprise-ui-settings", JSON.stringify(settings));
      localStorage.setItem("theme", settings.mode);
    } catch {
      // Storage is full (a large logo) or unavailable: the look still applies
      // for this visit, it just is not there on the next one.
    }
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

    // Publish the accent and everything derived from it (hover, dark, soft
    // tint, and the readable ink for text on the accent) as CSS custom
    // properties. This is the single source every layer reads: stylesheets via
    // var(--brand-*), and the report exporters via readThemeTokens(). Changing
    // the colour in Settings updates all of them on the spot, no reload.
    {
      const accent = resolveAccent(settings);
      publishThemeTokens(deriveTokens(accent.primary, accent.secondary));

      // The menu, the top bar and the report heading band each take a colour
      // of their own from Settings > Colors. "Default" publishes nothing, and
      // the stylesheets fall back to the look that follows Light / Dark.
      publishSurfaceTokens("sidebar", resolveSurface(settings.sidebarColor, accent.primary));
      publishSurfaceTokens("bar", resolveSurface(settings.navbarColor, accent.primary));
      publishTableHeadTokens(resolveTableHead(settings.tableHeader, accent.primary, theme === "dark"));
    }
    document.documentElement.dataset.navLayout = settings.navLayout;
    document.documentElement.dataset.sidebarColor = settings.sidebarColor;
    document.documentElement.dataset.navbarColor = settings.navbarColor;
    document.documentElement.dataset.loginStyle = settings.loginStyle;
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
    document.documentElement.style.setProperty("--app-font-family", fontStack(settings.fontFamily));

    const transitionTimeout = setTimeout(() => {
      document.documentElement.classList.remove("notransition");
    }, 1);

    return () => clearTimeout(transitionTimeout);
  }, [
    theme,
    settings.colorTheme,
    settings.customAccent,
    settings.navLayout,
    settings.sidebarColor,
    settings.navbarColor,
    settings.tableHeader,
    settings.loginStyle,
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

  const palette = useMemo(() => resolveAccent(settings), [settings.colorTheme, settings.customAccent, settings.mode]);
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
          fontFamily: fontStack(settings.fontFamily),
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
                // the strip to the right of the last heading is part of the band too
                "--DataGrid-t-header-background-base": "var(--table-head-bg)",
              },
              columnHeaders: {
                minHeight: settings.tableDensity === "compact" ? "40px !important" : settings.tableDensity === "spacious" ? "56px !important" : "48px !important",
              },
              // Every grid wears the same heading band - the --table-head-*
              // tokens (style.css; Settings > Colors > Table header) - whether
              // it is the shared DataTable or a screen's own DataGrid. A plain
              // grey here left those screens with a white header and the
              // band's ink on it.
              columnHeader: {
                backgroundColor: "var(--table-head-bg)",
                color: "var(--table-head-fg)",
              },
              columnHeaderTitle: {
                fontWeight: 800,
                color: "var(--table-head-fg)",
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
        applyThemeSettings,
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

/**
 * The name, line and logo shown in the menu, the top bar and on the sign-in
 * page: what Settings > Branding holds, or the built-in ones where a field is
 * blank. Reports keep the registered company name from src/lib/company.js.
 */
export const useBranding = () => {
  const { settings } = useContext(ThemeContext);
  return {
    appName: settings.brandName?.trim() || COMPANY_APP_NAME,
    tagline: settings.brandTagline?.trim() || COMPANY_ADDRESS,
    logo: settings.brandLogo || COMPANY_LOGO,
    hasCustomLogo: Boolean(settings.brandLogo),
  };
};
