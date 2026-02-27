import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  alpha,
  useTheme,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Assume these are your custom components
import SearchModal from '../components/ModalSearch';
import Notifications from '../components/DropdownNotifications';
import Help from '../components/DropdownHelp';
import UserMenu from '../components/DropdownProfile';

// ────────────────────────────────────────────────
// Modern 2025–2026 Fintech Dark Theme
// Deeper background, stronger glassmorphism, subtle gradient
// ────────────────────────────────────────────────
const fintechBlueTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',     // Keep your bright professional blue
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#10b981',     // Emerald – success / money
      light: '#34d399',
      dark: '#047857',
    },
    background: {
      default: '#0a0f1a',           // Very deep slate — modern fintech favorite
      paper: alpha('#111827', 0.78), // Slightly more opaque glass card feel
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
    },
    divider: alpha('#3b82f6', 0.20),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'transparent',
          boxShadow: 'none',
          backdropFilter: 'blur(32px) saturate(180%)', // Stronger glassmorphism
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.18)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(59, 130, 246, 0.20)',
          background: 'rgba(255, 255, 255, 0.04)',
          transition: 'all 0.25s ease',
          '&:hover': {
            background: 'rgba(59, 130, 246, 0.16)',
            borderColor: 'rgba(59, 130, 246, 0.55)',
            transform: 'scale(1.08)',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          fontWeight: 800,
          letterSpacing: '-0.02em',
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function Header({ sidebarOpen, setSidebarOpen }) {
  const theme = useTheme();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ThemeProvider theme={fintechBlueTheme}>
      <AppBar position="sticky" elevation={0}>
        {/* Modern fintech background: deep gradient + subtle noise/glass */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'linear-gradient(135deg, #0a0f1a 0%, #0f172a 50%, #111827 100%)',
            zIndex: -2,
          }}
        />

        {/* Optional very subtle noise texture (comment out if unwanted) */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.07,
            backgroundImage: `
              url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")
            `,
            zIndex: -1.5,
          }}
        />

        {/* Glass overlay + animated subtle mesh accents */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(1px)', // Very light extra diffusion
            background: 'linear-gradient(to bottom right, rgba(59,130,246,0.05), rgba(16,185,129,0.04), transparent 70%)',
            opacity: 0.9,
            pointerEvents: 'none',
            zIndex: -1,
          }}
        >
          {/* Floating accent dots (your original mesh idea — refined) */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                radial-gradient(circle at 15% 75%, #3b82f6 1.2px, transparent 3px),
                radial-gradient(circle at 85% 30%, #10b981 1px, transparent 2.8px),
                radial-gradient(circle at 45% 55%, #60a5fa 0.9px, transparent 2.5px)
              `,
              backgroundSize: '220px 220px',
              animation: 'floatMesh 50s ease-in-out infinite',
              opacity: 0.4,
            }}
          />
        </Box>

        <Toolbar sx={{ px: { xs: 2, sm: 3, lg: 5 }, minHeight: 64 }}>
          {/* Left – Mobile menu + Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              sx={{ display: { lg: 'none' } }}
              aria-label="open sidebar"
            >
              <MenuIcon sx={{ color: 'primary.main' }} />
            </IconButton>

            {/* Logo + Brand (unchanged — looks great) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 28px rgba(59,130,246,0.38)',
                    border: '2.5px solid rgba(59,130,246,0.24)',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#ffffff',
                      fontWeight: '900',
                      fontSize: '1.45rem',
                      letterSpacing: '-0.04em',
                    }}
                  >
                    BF
                  </Typography>
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    inset: -6,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.36) 0%, transparent 70%)',
                    filter: 'blur(12px)',
                    animation: 'pulse 6s ease-in-out infinite',
                    zIndex: -1,
                  }}
                />
              </Box>

              {/* <Box>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    background: 'linear-gradient(90deg, #60a5fa, #3b82f6, #1d4ed8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.1,
                  }}
                >
                  BALAJI
                  <Box component="span" sx={{ color: 'text.primary', ml: 1 }}>
                    FINANCE
                  </Box>
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: 'primary.light',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    opacity: 0.9,
                    fontSize: '0.78rem',
                  }}
                >
                  Premium Banking Dashboard
                </Typography>
              </Box> */}
            </Box>
          </Box>

          {/* Right side actions */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton
              color="inherit"
              onClick={() => setSearchModalOpen(true)}
              sx={{
                ...(searchModalOpen && {
                  boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.38)}`,
                }),
              }}
            >
              <SearchIcon sx={{ color: 'primary.main' }} />
            </IconButton>

            <SearchModal
              id="search-modal"
              modalOpen={searchModalOpen}
              setModalOpen={setSearchModalOpen}
            />

            <Notifications />
            <Help />
            <UserMenu />

            <IconButton
              color="inherit"
              onClick={() => setDarkMode(!darkMode)}
              sx={{ ml: 1 }}
            >
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            <Box
              sx={{
                width: '1px',
                height: 36,
                backgroundColor: 'divider',
                mx: 1.5,
                opacity: 0.6,
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Animations */}
      <Box
        component="style"
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes floatMesh {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              50% { transform: translate(-12px, -18px) rotate(2.5deg); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 0.36; transform: scale(1); }
              50% { opacity: 0.70; transform: scale(1.14); }
            }
          `,
        }}
      />
    </ThemeProvider>
  );
}

export default Header;