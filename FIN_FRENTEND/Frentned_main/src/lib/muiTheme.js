import { createTheme } from "@mui/material/styles";

const base = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#0ea5a0" },
    secondary: { main: "#06b6d4" },
    background: {
      default: "#071226",
      paper: "rgba(255,255,255,0.03)",
    },
    text: {
      primary: "#e6eef2",
      secondary: "rgba(255,255,255,0.75)",
    },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
          border: "1px solid rgba(255,255,255,0.04)",
          backdropFilter: "blur(6px)",
          boxShadow: "0 6px 18px rgba(2,6,23,0.5)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: "linear-gradient(90deg,#0ea5a0,#06b6d4)",
          color: "#041217",
          boxShadow: "0 6px 14px rgba(14,165,160,0.12)",
          borderRadius: 10,
        },
        root: { padding: "10px 16px" },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))",
          borderRight: "1px solid rgba(255,255,255,0.04)",
          backdropFilter: "blur(8px)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: "0 8px 24px rgba(2,6,23,0.45)",
          background: "transparent",
        },
      },
    },
  },
});

export default base;
