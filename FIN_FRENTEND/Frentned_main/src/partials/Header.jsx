import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { FullscreenRounded } from "@mui/icons-material";
import { actionIcons } from "src/lib/icons";
import SearchModal from "../components/ModalSearch";
import Notifications from "../components/DropdownNotifications.jsx";
import Help from "../components/DropdownHelp";
import UserMenu from "../components/DropdownProfile";
import EnterpriseThemePanel from "../components/EnterpriseThemePanel";
import ThemeToggle from "../components/ThemeToggle";
import { useBranding, useThemeProvider } from "../utils/ThemeContext";
import { breadcrumbsFor } from "src/lib/breadcrumbs";

const MenuRounded = actionIcons.menu;
const SearchRounded = actionIcons.search;
const SettingsRounded = actionIcons.settings;

function Header({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { settings } = useThemeProvider();
  const { appName, tagline, logo } = useBranding();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const breadcrumbs = useMemo(() => breadcrumbsFor(location.pathname), [location.pathname]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <>
      <header
        className={`enterprise-header ${
          settings.navbarStyle === "solid" ? "enterprise-header-solid" : ""
        }`}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ minWidth: 0 }}>
          {/* Shown on a phone, and on a desktop in the Overlay layout (style.css). */}
          <IconButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="enterprise-header-icon enterprise-header-menu"
            aria-label="Open navigation"
          >
            <MenuRounded />
          </IconButton>

          <Link
            to="/"
            className="enterprise-brand enterprise-header-brand"
            aria-label={`${appName} dashboard`}
          >
            <Box className="enterprise-brand-mark">
              <img src={logo} alt="" aria-hidden="true" />
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 0 }}>
              <Typography variant="subtitle1" className="enterprise-header-brand-name" sx={{ lineHeight: 1, fontWeight: 850 }}>
                {appName}
              </Typography>
              <Typography variant="caption" className="enterprise-header-brand-line">
                {tagline}
              </Typography>
            </Box>
          </Link>

          {/* Colours come from the top bar's own tokens (style.css), so the
              trail stays readable on whichever colour the bar is given. */}
          <Box sx={{ display: { xs: "none", md: "block" }, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={`${crumb}-${index}`}>
                  {index > 0 && <Typography className="enterprise-crumb-sep">/</Typography>}
                  <Typography
                    variant="body2"
                    className={`enterprise-crumb ${index === breadcrumbs.length - 1 ? "is-current" : ""}`}
                    sx={{ textTransform: "capitalize", fontWeight: index === breadcrumbs.length - 1 ? 700 : 500 }}
                  >
                    {crumb}
                  </Typography>
                </React.Fragment>
              ))}
            </Stack>
          </Box>
        </Stack>

        <TextField
          className="enterprise-global-search"
          size="small"
          placeholder="Search pages, ledgers, customers..."
          onClick={() => setSearchModalOpen(true)}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Chip size="small" label="Ctrl K" />
              </InputAdornment>
            ),
          }}
          sx={{ display: { xs: "none", lg: "block" } }}
        />

        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ ml: "auto" }}>
          <Tooltip title="Search">
            <IconButton onClick={() => setSearchModalOpen(true)} aria-label="Open command search">
              <SearchRounded />
            </IconButton>
          </Tooltip>
          <Notifications />
          <Help />
          <Tooltip title="Full screen">
            <IconButton onClick={toggleFullscreen} aria-label="Toggle full screen">
              <FullscreenRounded />
            </IconButton>
          </Tooltip>
          <Tooltip title="Theme settings">
            <IconButton onClick={() => setSettingsOpen(true)} aria-label="Open theme settings">
              <SettingsRounded />
            </IconButton>
          </Tooltip>
          <ThemeToggle />
          <UserMenu align="right" />
        </Stack>
      </header>

      <SearchModal id="search-modal" modalOpen={searchModalOpen} setModalOpen={setSearchModalOpen} />
      <EnterpriseThemePanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

export default Header;
