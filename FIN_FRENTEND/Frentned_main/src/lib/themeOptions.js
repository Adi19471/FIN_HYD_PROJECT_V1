/**
 * The choices Theme settings offers.
 *
 * ThemeProvider (src/utils/ThemeContext.jsx) turns a choice into colours and
 * publishes them; EnterpriseThemePanel draws the same lists as swatches and
 * tiles. They live here so neither file has to import the other, and so a new
 * option is added in one place.
 */

/** Named accents. `primary` drives everything; the rest are the MUI palette. */
export const COLOR_THEMES = {
  trust: { label: "Trust Blue", primary: "#0f62fe", secondary: "#0e7490", success: "#059669", warning: "#d97706", error: "#dc2626" },
  emerald: { label: "Finance Green", primary: "#047857", secondary: "#0f766e", success: "#16a34a", warning: "#ca8a04", error: "#e11d48" },
  executive: { label: "Executive Slate", primary: "#334155", secondary: "#2563eb", success: "#15803d", warning: "#b45309", error: "#b91c1c" },
  royal: { label: "Royal Indigo", primary: "#4338ca", secondary: "#0891b2", success: "#0f9f6e", warning: "#f59e0b", error: "#ef4444" },
  sunrise: { label: "Sunrise Gold", primary: "#b45309", secondary: "#be123c", success: "#0f766e", warning: "#ea580c", error: "#dc2626" },
  steel: { label: "Steel Teal", primary: "#0f766e", secondary: "#475569", success: "#15803d", warning: "#ca8a04", error: "#be123c" },
  graphite: { label: "Graphite", primary: "#18181b", secondary: "#52525b", success: "#16a34a", warning: "#d97706", error: "#dc2626" },
};

/** A starting point for the custom accent; the picker beside them takes any colour. */
export const QUICK_ACCENTS = ["#2563eb", "#4f46e5", "#7c3aed", "#0d9488", "#059669", "#d97706", "#dc2626", "#e11d48", "#0f172a"];

export const FONT_OPTIONS = [
  { value: "Tahoma", label: "Tahoma", stack: 'Tahoma, Verdana, Geneva, "Segoe UI", sans-serif' },
  { value: "Inter", label: "Inter", stack: '"Inter", system-ui, sans-serif' },
  { value: "Roboto", label: "Roboto", stack: '"Roboto", system-ui, sans-serif' },
  { value: "Poppins", label: "Poppins", stack: '"Poppins", Inter, system-ui, sans-serif' },
  { value: "Manrope", label: "Manrope", stack: '"Manrope", Inter, system-ui, sans-serif' },
  { value: "Open Sans", label: "Open Sans", stack: '"Open Sans", Inter, system-ui, sans-serif' },
  { value: "Lato", label: "Lato", stack: '"Lato", Inter, system-ui, sans-serif' },
  { value: "Nunito", label: "Nunito", stack: '"Nunito", Inter, system-ui, sans-serif' },
  { value: "System", label: "System UI", stack: 'system-ui, -apple-system, "Segoe UI", sans-serif' },
];

export const fontStack = (value) => (FONT_OPTIONS.find((font) => font.value === value) || FONT_OPTIONS[1]).stack;

/**
 * Where the menu sits on a desktop window. On a phone it is always a drawer
 * opened from the top bar, whichever of these is chosen.
 */
export const NAV_LAYOUTS = [
  { value: "static", label: "Static" }, // full sidebar
  { value: "mini", label: "Mini" }, // icon rail
  { value: "overlay", label: "Overlay" }, // hidden; the menu button slides it over the page
  { value: "horizontal", label: "Horizontal" }, // across the top, under the top bar
];

/**
 * Colours the menu and the top bar can take. Options without `bg` are worked
 * out by ThemeProvider: "default" follows Light / Dark, "integrate" takes the
 * page's own canvas, "accent" takes the theme colour.
 */
export const SURFACE_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "integrate", label: "Integrate" },
  { value: "accent", label: "Accent" },
  { value: "charcoal", label: "Charcoal", bg: "#1f2937" },
  { value: "midnight", label: "Midnight", bg: "#0f172a" },
  { value: "indigo", label: "Indigo Night", bg: "#1e1b4b" },
  { value: "teal", label: "Teal Deep", bg: "#042f2e" },
  { value: "maroon", label: "Maroon", bg: "#3f0d12" },
  { value: "white", label: "White", bg: "#ffffff" },
];

/** Heading band of every report grid, on screen and in its exports. */
export const TABLE_HEADER_OPTIONS = [
  { value: "accent", label: "Accent" },
  { value: "soft", label: "Soft accent" },
  { value: "slate", label: "Slate", bg: "#334155" },
  { value: "graphite", label: "Graphite", bg: "#1f2937" },
  { value: "navy", label: "Navy", bg: "#1e3a8a" },
  { value: "plain", label: "Plain", bg: "#e2e8f0", bgDark: "#1e293b" },
];

/** The picture side of the sign-in page. */
export const LOGIN_STYLES = [
  { value: "accent", label: "Accent" }, // the theme colour, as a gradient
  { value: "night", label: "Night" }, // deep navy with an accent glow
  { value: "soft", label: "Soft" }, // a pale tint of the theme colour; follows Light / Dark
];

/** One click: mode, colour and menu together. */
export const THEME_PRESETS = [
  { key: "ledger", name: "Ledger Gold", desc: "Warm gold on a light workspace", mode: "light", colorTheme: "sunrise", sidebarColor: "default", navbarColor: "default", dots: ["#ffffff", "#b45309", "#be123c", "#0f766e"] },
  { key: "trust", name: "Trust Blue", desc: "Banking blue with a midnight menu", mode: "light", colorTheme: "trust", sidebarColor: "midnight", navbarColor: "default", dots: ["#0f172a", "#0f62fe", "#0e7490", "#059669"] },
  { key: "green", name: "Finance Green", desc: "Green accents and a green top bar", mode: "light", colorTheme: "emerald", sidebarColor: "default", navbarColor: "accent", dots: ["#ffffff", "#047857", "#0f766e", "#16a34a"] },
  { key: "vault", name: "Night Vault", desc: "Dark workspace, indigo accents", mode: "dark", colorTheme: "royal", sidebarColor: "default", navbarColor: "default", dots: ["#080f1d", "#0f172a", "#4338ca", "#0891b2"] },
];

const values = (options) => options.map((option) => option.value);

/** What each list-backed setting may hold; anything else falls back to the default. */
export const SETTING_CHOICES = {
  mode: ["light", "dark"],
  colorTheme: Object.keys(COLOR_THEMES),
  fontFamily: values(FONT_OPTIONS),
  navLayout: values(NAV_LAYOUTS),
  sidebarColor: values(SURFACE_OPTIONS),
  navbarColor: values(SURFACE_OPTIONS),
  tableHeader: values(TABLE_HEADER_OPTIONS),
  loginStyle: values(LOGIN_STYLES),
};

export const isHexColor = (value) => typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);

/** Largest logo kept in this browser's storage (it is saved as a data URL). */
export const MAX_LOGO_BYTES = 300 * 1024;
export const LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
