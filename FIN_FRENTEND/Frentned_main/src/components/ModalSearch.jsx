import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AccountBalanceRounded,
  AddCardRounded,
  AssessmentRounded,
  CloseRounded,
  GroupsRounded,
  ReceiptLongRounded,
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

const quickPages = [
  { name: "Dashboard", link: "/", group: "Home", keywords: "overview counts realtime", icon: AssessmentRounded },
  { name: "Quick Cash Book", link: "/Transactions/Quick_Cash_Book", group: "Transactions", keywords: "quick entry cash collection", icon: AddCardRounded },
  { name: "Business Cash Book", link: "/BussinessCashBook_Main", group: "Transactions", keywords: "daily monthly finance payment", icon: ReceiptLongRounded },
  { name: "Daily Book", link: "/AccountsModules/DailyBook", group: "Accounts", keywords: "day close cash movement", icon: ReceiptLongRounded },
  { name: "Business Collections Report", link: "/Bussiness/BussinessCollectionReportsimport", group: "Reports", keywords: "collections report df mf", icon: AssessmentRounded },
  { name: "Customer Profiles", link: "/customer", group: "Master", keywords: "customer kyc profile", icon: GroupsRounded },
  { name: "Daily Finance", link: "/Daily-Finace", group: "Loans", keywords: "daily loan register", icon: AccountBalanceRounded },
  { name: "Monthly Finance", link: "/Monthly-Finance", group: "Loans", keywords: "monthly loan register", icon: AccountBalanceRounded },
];

function ModalSearch({ id, searchId, modalOpen, setModalOpen }) {
  const searchInput = useRef(null);
  const [query, setQuery] = useState("");

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
      `${item.name} ${item.group} ${item.keywords}`.toLowerCase().includes(term)
    );
  }, [query]);

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
          {["Transactions", "Reports", "Accounts", "Loans", "Master"].map((item) => (
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
                    secondary={`${item.group} / ${item.keywords}`}
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
                  Try searching for cashbook, report, customer, ledger, daily, or monthly.
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
