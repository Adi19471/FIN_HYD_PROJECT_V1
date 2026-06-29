import React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Stack,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  RefreshRounded,
  TuneRounded,
} from "@mui/icons-material";
/**
 * PageHeader - Consistent header for all pages
 * @param {string} title - Page title
 * @param {string} searchPlaceholder - Search input placeholder
 * @param {string} searchValue - Current search value
 * @param {function} onSearchChange - Search change handler
 * @param {function} onAddClick - Add button click handler
 * @param {string} addButtonLabel - Add button label
 * @param {number} totalCount - Total count to display
 * @param {boolean} loading - Loading state
 */
const PageHeader = ({
  title,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  onAddClick,
  addButtonLabel = "Add New",
  totalCount,
  loading = false,
  subtitle = "",
  onRefresh,
  onFilterClick,
  actions,
}) => {
  return (
    <Paper
      className="enterprise-card"
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
        }}
        >
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
            <Typography variant="h5">{title}</Typography>
            {totalCount !== undefined && <Chip size="small" label={`${totalCount} records`} color="primary" />}
          </Stack>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35, fontWeight: 650 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
          }}
        >
          {onSearchChange && (
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              disabled={loading}
              sx={{
                minWidth: { xs: "100%", sm: 300 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {onFilterClick && (
              <Button variant="outlined" startIcon={<TuneRounded />} onClick={onFilterClick} disabled={loading}>
                Filters
              </Button>
            )}
            {onRefresh && (
              <Button variant="outlined" startIcon={<RefreshRounded />} onClick={onRefresh} disabled={loading}>
                Refresh
              </Button>
            )}
            {actions}
            {onAddClick && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAddClick}
                disabled={loading}
                sx={{
                  whiteSpace: "nowrap",
                  px: 3,
                }}
              >
                {addButtonLabel}
              </Button>
            )}
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export default PageHeader;

