import React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";

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
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, md: 3 },
        mb: 3,
        borderRadius: 2,
        background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
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
        {/* Title Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h5"
            sx={{
              color: "white",
              fontWeight: 600,
              fontSize: { xs: "1.25rem", md: "1.5rem" },
            }}
          >
            {title}
          </Typography>
          {totalCount !== undefined && (
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.7)",
                backgroundColor: "rgba(255,255,255,0.1)",
                px: 2,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              Total: {totalCount}
            </Typography>
          )}
        </Box>

        {/* Actions Section */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          {/* Search Field */}
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            disabled={loading}
            sx={{
              minWidth: { xs: "100%", sm: 250 },
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Add Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            disabled={loading}
            sx={{
              backgroundColor: "#4caf50",
              "&:hover": {
                backgroundColor: "#43a047",
              },
              whiteSpace: "nowrap",
              px: 3,
            }}
          >
            {addButtonLabel}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default PageHeader;

