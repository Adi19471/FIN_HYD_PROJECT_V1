// Canonical breakpoint scale for the whole app (Bootstrap 5's values).
// The MUI theme (ThemeContext.jsx) and Sidebar.jsx's viewport logic both import
// this so they never drift apart from each other or from the Tailwind
// breakpoints declared in src/css/style.css (which can't import JS, but mirror
// these exact px values in its @theme block).
export const BREAKPOINTS = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 };
