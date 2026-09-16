/**
 * The palette a report renders in — screen grid, Excel, PDF, Word and print.
 *
 * Nothing here is a fixed colour. `reportPalette()` reads the live accent that
 * ThemeProvider published (see src/lib/themeTokens.js), so a report picks up
 * whatever the user chose in Settings at the moment it is generated.
 *
 * Printed output stays on white paper with dark body text whatever the app's
 * light/dark mode is — only the header band and accents follow the theme.
 */

import { readThemeTokens, rgb } from "./themeTokens";

export { rgb };

// Paper neutrals. These are deliberately fixed: a financial report prints on
// white with dark ink no matter which application theme is on screen.
export const REPORT_PAPER = "#ffffff";
export const REPORT_INK = "#111827";
export const REPORT_TOTAL_BG = "#e2e8f0";
export const REPORT_GRID_LINE = "#cbd5e1";
export const REPORT_GRID_FRAME = "#94a3b8";
export const REPORT_ZEBRA = "#f9fafb";

/**
 * Accent-derived colours for the current theme, resolved fresh on each call.
 *
 *   headerBg      solid band behind the column headings
 *   headerText    readable ink on that band (white or near-black, by contrast)
 *   headerRule    the heavier line under the band, and small accent text
 *   divider       the line between heading cells
 */
export const reportPalette = () => {
  const tokens = readThemeTokens();
  return {
    headerBg: tokens.primary,
    headerBgHover: tokens.primaryHover,
    headerRule: tokens.primaryDark,
    headerText: tokens.onPrimary,
    divider: tokens.divider,
    soft: tokens.primarySoft,
    totalBg: REPORT_TOTAL_BG,
    // jsPDF takes [r, g, b].
    headerBgRgb: rgb(tokens.primary),
    headerRuleRgb: rgb(tokens.primaryDark),
    headerTextRgb: rgb(tokens.onPrimary),
    totalBgRgb: rgb(REPORT_TOTAL_BG),
  };
};
