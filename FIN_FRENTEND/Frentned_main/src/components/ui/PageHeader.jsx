import React from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { actionIcons } from "src/lib/icons";
import { ScreenHeader } from "./ScreenParts";

const SearchIcon = actionIcons.search;
const AddIcon = actionIcons.add;
const RefreshIcon = actionIcons.refresh;
const FilterIcon = actionIcons.filter;
/**
 * PageHeader - the screen's header card with its page-level controls
 * (search, filter, refresh, add) on the right.
 *
 * Given a `title` it is the same header every screen opens with
 * (ScreenHeader: icon, name, one line on what the screen is for), so a ledger
 * opens like a report or an entry screen. Without one it is just the row of
 * controls, for a screen that already has a header of its own.
 *
 * It deliberately does NOT show a record count: the grid card carries its own
 * "N records" chip right above the rows it counts, and two counts on one screen
 * only invite the question of which is authoritative. Refresh likewise belongs
 * to ReportToolbar on screens that have one - pass onRefresh here only when the
 * screen has no toolbar of its own.
 * @param {Component} icon - The screen's icon (src/lib/icons.js navIcons)
 * @param {string} title - The screen's name; turns the row into the header card
 * @param {string} subtitle - One line on what the screen is for
 * @param {string} searchPlaceholder - Search input placeholder
 * @param {string} searchValue - Current search value
 * @param {function} onSearchChange - Search change handler
 * @param {function} onAddClick - Add button click handler
 * @param {string} addButtonLabel - Add button label
 * @param {boolean} loading - Loading state
 */
const PageHeader = ({
  icon,
  title,
  subtitle,
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
  const hasControls = Boolean(onSearchChange || onFilterClick || onRefresh || actions || onAddClick);

  const controls = hasControls && (
    <>
      {onSearchChange && (
        <TextField
          className="scr-head-search"
          size="small"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
      )}
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
          sx={{ whiteSpace: "nowrap" }}
        >
          {addButtonLabel}
        </Button>
      )}
    </>
  );

  if (title) {
    return (
      <ScreenHeader icon={icon} title={title} subtitle={subtitle}>
        {controls}
      </ScreenHeader>
    );
  }

  // Nothing to show if the screen passed no controls.
  if (!hasControls) return null;

  return (
    <Box className="scr-head-actions" sx={{ mb: 1.5 }}>
      {controls}
    </Box>
  );
};

export default PageHeader;
