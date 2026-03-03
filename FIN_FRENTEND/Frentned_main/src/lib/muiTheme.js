import { createTheme } from "@mui/material/styles";

const base = createTheme({
  palette: {
    mode: "dark",
    primary: { 
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#1d4ed8",
    },
    secondary: { 
      main: "#10b981",
      light: "#34d399",
      dark: "#047857",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#dc2626",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
    },
    success: {
      main: "#10b981",
      light: "#34d399",
      dark: "#059669",
    },
    background: {
      default: "#0a0f1a",
      paper: "rgba(17, 24, 39, 0.8)",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
    },
    divider: "rgba(59, 130, 246, 0.15)",
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { 
      textTransform: "none", 
      fontWeight: 600,
      borderRadius: 8,
    },
    body1: {
      fontSize: '0.95rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background:
            "linear-gradient(180deg, rgba(31, 41, 55, 0.9) 0%, rgba(17, 24, 39, 0.8) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.1)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          color: "#ffffff",
          boxShadow: "0 4px 14px rgba(59, 130, 246, 0.35)",
          borderRadius: 10,
          padding: "10px 20px",
          transition: 'all 0.3s ease',
          '&:hover': {
            background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
            boxShadow: "0 6px 20px rgba(59, 130, 246, 0.45)",
            transform: 'translateY(-2px)',
          },
        },
        containedSecondary: {
          background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
          color: "#ffffff",
          boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
          borderRadius: 10,
          '&:hover': {
            boxShadow: "0 6px 20px rgba(16, 185, 129, 0.45)",
            transform: 'translateY(-2px)',
          },
        },
        root: { 
          padding: "10px 20px",
          borderRadius: 8,
          transition: 'all 0.2s ease',
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          }
        }
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          background:
            "linear-gradient(180deg, rgba(17, 24, 39, 0.95) 0%, rgba(10, 15, 26, 0.98) 100%)",
          borderRight: "1px solid rgba(59, 130, 246, 0.1)",
          backdropFilter: "blur(16px)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
          background: "transparent",
          border: "1px solid rgba(59, 130, 246, 0.1)",
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.35)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.2s ease',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(59, 130, 246, 0.5)',
              }
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3b82f6',
                borderWidth: 2,
              }
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: "1px solid rgba(59, 130, 246, 0.15)",
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: "rgba(59, 130, 246, 0.1)",
        }
      }
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid rgba(59, 130, 246, 0.2)',
          },
        }
      }
    }
  },
});

export default base;
