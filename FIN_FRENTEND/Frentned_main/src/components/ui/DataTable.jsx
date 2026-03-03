import React from "react";
import { Box, Paper, CircularProgress, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

/**
 * DataTable - Consistent DataGrid wrapper
 * @param {Array} rows - Table rows data
 * @param {Array} columns - Column definitions
 * @param {boolean} loading - Loading state
 * @param {function} getRowId - Function to get row ID
 * @param {number} height - Table height (default: 600)
 * @param {object} otherProps - Additional DataGrid props
 */
const DataTable = ({
  rows = [],
  columns = [],
  loading = false,
  getRowId = (row) => row.id,
  height = 600,
  ...otherProps
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        height: height,
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {loading ? (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography color="text.secondary">Loading data...</Typography>
        </Box>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              printOptions: { disableToolbarButton: true },
            },
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5",
              borderBottom: "2px solid #e0e0e0",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 600,
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f8f9fa",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "2px solid #e0e0e0",
            },
          }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          {...otherProps}
        />
      )}
    </Paper>
  );
};

export default DataTable;

