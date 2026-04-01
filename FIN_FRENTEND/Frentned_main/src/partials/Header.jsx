import React, { useState, useCallback, memo } from 'react';
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
// Modern 2025–2026 Fintech Light Theme
// Clean white base, trust blue primary, lime success, subtle glass
// High readability, premium banking feel
// ────────────────────────────────────────────────
const fintechLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0ea5e9',     // Modern blue-teal – trust + innovation
      light: '#38bdf8',
      dark: '#0284c7',
    },
    secondary: {
      main: '#84cc16',     // Fresh lime – money/growth/energy
      light: '#a3e635',
      dark: '#65a30d',
    },
    background: {
      default: '#f8fafc',           // Soft off-white – clean & modern
      paper: '#ffffff',             // Pure white cards/glass
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    divider: alpha('#0ea5e9', 0.12),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'transparent',
          boxShadow: 'none',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          borderBottom: '1px solid rgba(14, 165, 233, 0.12)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(14, 165, 233, 0.18)',
          background: 'rgba(255, 255, 255, 0.75)',
          transition: 'all 0.25s ease',
          '&:hover': {
            background: 'rgba(14, 165, 233, 0.12)',
            borderColor: 'rgba(14, 165, 233, 0.45)',
            transform: 'scale(1.06)',
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
  const [darkMode, setDarkMode] = useState(false); // Default to light now

  // Memoized handlers for better performance
  const handleMenuClick = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen, setSidebarOpen]);

  const handleSearchClick = useCallback(() => {
    setSearchModalOpen(true);
  }, []);

  const handleDarkModeToggle = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  return (
    <ThemeProvider theme={fintechLightTheme}>
      <AppBar position="sticky" elevation={0}>
        {/* Subtle light gradient background */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
            zIndex: -2,
          }}
        />

        {/* Very light glass overlay + subtle accent */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(2px)',
            background: 'linear-gradient(to bottom right, rgba(14,165,233,0.04), rgba(132,204,22,0.03), transparent 70%)',
            opacity: 0.95,
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />

        <Toolbar sx={{ px: { xs: 2, sm: 3, lg: 5 }, minHeight: 64 }}>
          {/* Left – Mobile menu + Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleMenuClick}
              sx={{ display: { lg: 'none' } }}
              aria-label="open sidebar"
            >
              <MenuIcon sx={{ color: 'primary.main' }} />
            </IconButton>

            {/* Updated Logo + Brand – light mode friendly */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7, #0369a1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 24px rgba(14,165,233,0.28)',
                    border: '2.5px solid rgba(14,165,233,0.18)',
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
                    B/F
                  </Typography>
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    inset: -6,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(14,165,233,0.28) 0%, transparent 70%)',
                    filter: 'blur(10px)',
                    animation: 'pulse 6s ease-in-out infinite',
                    zIndex: -1,
                  }}
                />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    background: 'linear-gradient(90deg, #38bdf8, #0ea5e9, #0284c7)',
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
                    color: 'primary.main',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    opacity: 0.9,
                    fontSize: '0.78rem',
                  }}
                >
                  Premium Banking Dashboard
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right side actions */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton
              color="inherit"
              onClick={handleSearchClick}
              sx={{
                ...(searchModalOpen && {
                  boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.28)}`,
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
              onClick={handleDarkModeToggle}
              sx={{ ml: 1 }}
            >
              {darkMode ? <Brightness7Icon sx={{ color: 'secondary.main' }} /> : <Brightness4Icon sx={{ color: 'primary.main' }} />}
            </IconButton>

            <Box
              sx={{
                width: '1px',
                height: 36,
                backgroundColor: 'divider',
                mx: 1.5,
                opacity: 0.5,
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Animations – kept subtle */}
      <Box
        component="style"
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes pulse {
              0%, 100% { opacity: 0.28; transform: scale(1); }
              50% { opacity: 0.55; transform: scale(1.12); }
            }
          `,
        }}
      />
    </ThemeProvider>
  );
}

export default Header;