import React from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { ClearRounded, SearchRounded } from "@mui/icons-material";

/**
 * GlobalSearch - controlled search box for filtering any report/table.
 * @param {string} value
 * @param {function} onChange - receives the new string value
 * @param {string} placeholder
 */
const GlobalSearch = ({
  value = "",
  onChange,
  placeholder = "Search...",
  size = "small",
  fullWidth = false,
  sx,
}) => (
  <TextField
    size={size}
    value={value}
    placeholder={placeholder}
    fullWidth={fullWidth}
    onChange={(event) => onChange?.(event.target.value)}
    sx={{ minWidth: fullWidth ? undefined : 240, ...sx }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchRounded fontSize="small" color="action" />
        </InputAdornment>
      ),
      endAdornment: value ? (
        <InputAdornment position="end">
          <IconButton size="small" edge="end" onClick={() => onChange?.("")} aria-label="Clear search">
            <ClearRounded fontSize="small" />
          </IconButton>
        </InputAdornment>
      ) : null,
    }}
  />
);

export default GlobalSearch;
