import React from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Stack,
} from "@mui/material";
import { actionIcons } from "src/lib/icons";

const SearchIcon = actionIcons.search;
const AddIcon = actionIcons.add;
const RefreshIcon = actionIcons.refresh;
const FilterIcon = actionIcons.filter;
/**
 * PageHeader - the row of page-level controls (search, filter, refresh, add).
 *
 * It carries no title. The screen is already named twice above the content -
 * once by the breadcrumb in the top bar and once by the report banner over the
 * grid - and a third heading between them was just noise.
 *
 * It deliberately does NOT show a record count: the grid card carries its own
 * "N records" chip right above the rows it counts, and two counts on one screen
 * only invite the question of which is authoritative. Refresh likewise belongs
 * to ReportToolbar on screens that have one - pass onRefresh here only when the
 * screen has no toolbar of its own.
 * @param {string} searchPlaceholder - Search input placeholder
 * @param {string} searchValue - Current search value
 * @param {function} onSearchChange - Search change handler
 * @param {function} onAddClick - Add button click handler
 * @param {string} addButtonLabel - Add button label
 * @param {boolean} loading - Loading state
 */
const PageHeader = ({
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  onAddClick,
  addButtonLabel = "Add New",
  loading = false,
  onRefresh,
  onFilterClick,
  actions,
}) => {
  // Nothing to show if the screen passed no controls.
  const hasControls = Boolean(onSearchChange || onFilterClick || onRefresh || actions || onAddClick);
  if (!hasControls) return null;

  return (
    <Box sx={{ mb: 1.5, px: 0.5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
        }}
        >
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
              <Button variant="outlined" startIcon={<FilterIcon />} onClick={onFilterClick} disabled={loading}>
                Filters
              </Button>
            )}
            {onRefresh && (
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onRefresh} disabled={loading}>
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
    </Box>
  );
};

export default PageHeader;

