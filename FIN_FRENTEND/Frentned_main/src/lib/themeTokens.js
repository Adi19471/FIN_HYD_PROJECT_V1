/**
 * Colour maths behind the app's dynamic accent.
 *
 * ThemeProvider owns the accent (Settings -> colorTheme -> colorThemes) and
 * publishes the derived tokens below onto <html> as CSS custom properties.
 * Everything downstream reads them:
 *
 *   - CSS (style.css, Sidebar.css) via var(--brand-primary) and friends
 *   - React components via the MUI palette
 *   - the report exporters, which are plain functions with no theme access,
 *     via readThemeTokens() reading the same custom properties back off <html>
 *
 * Nothing here hardcodes an accent. The only literals are neutrals used for
 * contrast decisions and the pre-mount fallback.
 */

// Ink used when a light accent needs dark text instead of white.
export const DARK_INK = "#111827";
export const LIGHT_INK = "#ffffff";

// Only used before ThemeProvider has published anything (SSR harnesses, or a
// print window opened from a document that never mounted the app).
export const FALLBACK_PRIMARY = "#0f62fe";

/* ------------------------------------------------------------------ */
/* conversions                                                         */
/* ------------------------------------------------------------------ */

const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)));

/** Accepts #rgb, #rrggbb and "rgb(r, g, b)". Returns [r, g, b]. */
export const toRgb = (color) => {
  const value = String(color || "").trim();

  const rgbMatch = value.match(/^rgba?\(([^)]+)\)$/i);
  if (rgbMatch) {
    const parts = rgbMatch[1].split(",").map((part) => parseFloat(part));
    return [clamp(parts[0]), clamp(parts[1]), clamp(parts[2])];
  }

  let hex = value.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  if (hex.length < 6) return toRgb(FALLBACK_PRIMARY);
  return [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
};

export const toHex = ([r, g, b]) =>
  "#" + [r, g, b].map((n) => clamp(n).toString(16).padStart(2, "0")).join("");

/** jsPDF wants [r, g, b]; kept as its own name so call sites read clearly. */
export const rgb = toRgb;

/* ------------------------------------------------------------------ */
/* derivation                                                          */
/* ------------------------------------------------------------------ */

/** Blend two colours. `weight` is how much of `b` to take (0..1). */
export const mix = (a, b, weight) => {
  const [r1, g1, b1] = toRgb(a);
  const [r2, g2, b2] = toRgb(b);
  const w = Math.max(0, Math.min(1, weight));
  return toHex([r1 + (r2 - r1) * w, g1 + (g2 - g1) * w, b1 + (b2 - b1) * w]);
};

export const darken = (color, amount = 0.15) => mix(color, "#000000", amount);
export const lighten = (color, amount = 0.15) => mix(color, "#ffffff", amount);

/** Semi-transparent accent, for hover washes and selected rows. */
export const alpha = (color, a) => {
  const [r, g, b] = toRgb(color);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

/* ------------------------------------------------------------------ */
/* contrast                                                            */
/* ------------------------------------------------------------------ */

const channelLuminance = (channel) => {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

/** WCAG relative luminance, 0 (black) to 1 (white). */
export const luminance = (color) => {
  const [r, g, b] = toRgb(color).map(channelLuminance);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrastRatio = (a, b) => {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

/**
 * Readable text for a background — white on a dark accent, near-black on a
 * light one. This is what keeps an orange or amber accent legible instead of
 * white-on-yellow.
 */
export const contrastText = (background) =>
  contrastRatio(background, LIGHT_INK) >= contrastRatio(background, DARK_INK)
    ? LIGHT_INK
    : DARK_INK;

/* ------------------------------------------------------------------ */
/* tokens                                                              */
/* ------------------------------------------------------------------ */

/**
 * The full token set for an accent. One accent in, every shade the UI needs
 * out — so no component ever has to invent its own hover or border colour.
 */
export const deriveTokens = (primary, secondary = primary) => {
  const base = primary || FALLBACK_PRIMARY;
  const onPrimary = contrastText(base);
  // Dividers sit on the accent, so they are a wash of whatever reads on it.
  const divider = alpha(onPrimary, 0.34);

  return {
    primary: base,
    primaryHover: darken(base, 0.12),
    primaryDark: darken(base, 0.22),
    primaryLight: lighten(base, 0.2),
    // Tints for hover rows and selected menu entries.
    primarySoft: alpha(base, 0.1),
    primarySelected: alpha(base, 0.16),
    onPrimary,
    divider,
    secondary: secondary || base,
  };
};

/** CSS custom-property name for each token. */
export const TOKEN_VARS = {
  primary: "--brand-primary",
  primaryHover: "--brand-primary-hover",
  primaryDark: "--brand-primary-dark",
  primaryLight: "--brand-primary-light",
  primarySoft: "--brand-primary-soft",
  primarySelected: "--brand-primary-selected",
  onPrimary: "--on-primary",
  divider: "--brand-divider",
  secondary: "--brand-secondary",
};

/** Publish the tokens onto <html> so CSS and the exporters can read them. */
export const publishThemeTokens = (tokens, root) => {
  const element = root || (typeof document !== "undefined" ? document.documentElement : null);
  if (!element) return;
  Object.entries(TOKEN_VARS).forEach(([key, cssVar]) => {
    if (tokens[key]) element.style.setProperty(cssVar, tokens[key]);
  });
};

/**
 * Read the live tokens back. Used by code that runs outside React — the report
 * exporters build their HTML/PDF long after render, and must pick up whichever
 * accent is active at that moment.
 */
export const readThemeTokens = () => {
  if (typeof document === "undefined") return deriveTokens(FALLBACK_PRIMARY);

  const computed = getComputedStyle(document.documentElement);
  const read = (cssVar) => computed.getPropertyValue(cssVar).trim();
  const primary = read(TOKEN_VARS.primary) || FALLBACK_PRIMARY;

  // Derive from the live accent, then let any explicitly published token win.
  const derived = deriveTokens(primary, read(TOKEN_VARS.secondary) || primary);
  Object.entries(TOKEN_VARS).forEach(([key, cssVar]) => {
    const value = read(cssVar);
    if (value) derived[key] = value;
  });
  return derived;
};
