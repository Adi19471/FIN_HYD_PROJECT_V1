import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AssessmentRounded,
  CloseRounded,
  SearchRounded,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "src/utils/authStore";
import { hasPermissionAccess, PATH_PERMISSION_CODES } from "src/utils/permissions";
import { sidebarGroups } from "src/partials/SidebarConfig";

// Every searchable screen, derived from the sidebar's own nav config (the
// same sidebarGroups data that renders Sidebar.jsx) plus Dashboard, which
// the sidebar renders separately outside sidebarGroups. Deriving from here
// - instead of a hand-maintained list - means a screen added to the sidebar
// is automatically searchable with no second list to keep in sync, and
// permission-gated the same way the sidebar itself is.
const buildSearchIndex = (user) => {
  const pages = [];

  if (hasPermissionAccess(user, PATH_PERMISSION_CODES["/"])) {
    pages.push({ name: "Dashboard", link: "/", group: "Home", icon: AssessmentRounded });
  }

  sidebarGroups
    .filter((group) => group.key !== "auth")
    .forEach((group) => {
      group.items
        .filter((item) => hasPermissionAccess(user, PATH_PERMISSION_CODES[item.path]))
        .forEach((item) => {
          pages.push({ name: item.label, link: item.path, group: group.label, icon: item.icon });
        });
    });

  return pages;
};

function ModalSearch({ id, searchId, modalOpen, setModalOpen }) {
  const { user } = useAuth();
  const searchInput = useRef(null);
  const [query, setQuery] = useState("");

  const quickPages = useMemo(() => buildSearchIndex(user), [user]);
  const categories = useMemo(
    () => Array.from(new Set(quickPages.map((item) => item.group))),
    [quickPages]
  );

  useEffect(() => {
    if (modalOpen) {
      setQuery("");
      setTimeout(() => searchInput.current?.focus(), 80);
    }
  }, [modalOpen]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return quickPages;
    return quickPages.filter((item) =>
      `${item.name} ${item.group} ${item.link}`.toLowerCase().includes(term)
    );
  }, [query, quickPages]);

  return (
    <Dialog
      id={id}
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "enterprise-card",
        sx: { overflow: "hidden", mt: { xs: 2, sm: -12 } },
      }}
      aria-labelledby={`${id}-title`}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography id={`${id}-title`} variant="h6">Open Screen</Typography>
            <Typography variant="body2" color="text.secondary">
              Search pages, reports, ledgers, and transaction tools.
            </Typography>
          </Box>
          <IconButton onClick={() => setModalOpen(false)} aria-label="Close search">
            <CloseRounded />
          </IconButton>
        </Stack>
        <TextField
          id={searchId}
          inputRef={searchInput}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Type screen name, report, ledger, loan..."
          fullWidth
          sx={{ mt: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <DialogContent sx={{ p: 2, bgcolor: "rgba(248,250,252,0.72)" }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
          {categories.map((item) => (
            <Chip key={item} size="small" label={item} variant="outlined" />
          ))}
        </Stack>

        <Paper elevation={0} sx={{ border: 1, borderColor: "divider", overflow: "hidden" }}>
          <List disablePadding>
            {results.map((item) => {
              const Icon = item.icon;
              return (
                <ListItemButton
                  key={item.link}
                  component={Link}
                  to={item.link}
                  onClick={() => setModalOpen(false)}
                  sx={{ borderBottom: 1, borderColor: "divider", py: 1.25 }}
                >
                  <ListItemIcon>
                    <Box className="dashboard-module-icon" sx={{ width: 38, height: 38 }}>
                      <Icon fontSize="small" />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    secondary={item.group}
                    primaryTypographyProps={{ fontWeight: 900 }}
                  />
                  <Chip size="small" label="Open" color="primary" variant="outlined" />
                </ListItemButton>
              );
            })}
            {!results.length && (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography fontWeight={900}>No matching screen</Typography>
                <Typography variant="body2" color="text.secondary">
                  Try searching by screen name, section, or path.
                </Typography>
              </Box>
            )}
          </List>
        </Paper>
      </DialogContent>
    </Dialog>
  );
}

export default ModalSearch;
