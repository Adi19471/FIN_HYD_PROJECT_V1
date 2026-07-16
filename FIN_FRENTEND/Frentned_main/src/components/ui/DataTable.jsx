import React from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  ArticleRounded,
  DescriptionRounded,
  FileDownloadRounded,
  PrintRounded,
  TableViewRounded,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { COMPANY_ADDRESS, COMPANY_NAME } from "src/lib/company";
import { useThemeProvider } from "src/utils/ThemeContext";

const reportDateLabel = () => new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
}).replace(/ /g, "-");

const labelFor = (column) => {
  if (typeof column === "string") return column.replace(/([A-Z])/g, " $1").replace(/_/g, " ");
  return column.headerName || column.field?.replace(/([A-Z])/g, " $1").replace(/_/g, " ");
};

const cellValue = (row, column) => {
  const field = typeof column === "string" ? column : column.field;
  const raw = row[field];
  if (typeof column === "string") return raw ?? "";
  if (column.valueGetter) {
    try {
      return column.valueGetter(raw, row, column) ?? "";
    } catch {
      return raw ?? "";
    }
  }
  if (column.valueFormatter) {
    try {
      return column.valueFormatter(raw, row, column) ?? "";
    } catch {
      return raw ?? "";
    }
  }
  return raw ?? "";
};

export function TableExportMenu({ rows, columns, fileName, buttonLabel = "Download" }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const printableColumns = columns.filter((column) => (typeof column === "string" ? column : column.field && !column.disableExport));
  const hasData = rows.length > 0;

  const closeMenu = () => setAnchorEl(null);
  const reportRows = () => rows.map((row) => printableColumns.map((column) => String(cellValue(row, column))));

  const handleExcel = () => {
    closeMenu();
    if (!hasData) return;
    const exportRows = rows.map((row) =>
      printableColumns.reduce((acc, column) => {
        acc[labelFor(column)] = cellValue(row, column);
        return acc;
      }, {})
    );
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handlePdf = () => {
    closeMenu();
    if (!hasData) return;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const currentDate = reportDateLabel();
    doc.setFontSize(18);
    doc.text(COMPANY_NAME, 14, 14);
    doc.setFontSize(10);
    doc.text(COMPANY_ADDRESS, 14, 20);
    doc.text(`Date: ${currentDate}`, 14, 26);
    doc.setFontSize(13);
    doc.text(fileName, 14, 34);
    autoTable(doc, {
      startY: 40,
      head: [printableColumns.map(labelFor)],
      body: reportRows(),
      styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
      headStyles: { fillColor: [15, 98, 254], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 247, 251] },
    });
    doc.save(`${fileName}.pdf`);
  };

  const handleWord = () => {
    closeMenu();
    if (!hasData) return;
    const currentDate = reportDateLabel();
    const htmlRows = rows
      .map((row) => `<tr>${printableColumns.map((column) => `<td>${cellValue(row, column)}</td>`).join("")}</tr>`)
      .join("");
    const html = `
      <html><head><meta charset="utf-8"><style>
      body{font-family:Arial;padding:20px;color:#111827} h1{font-size:22px;margin:0;text-align:center} p{text-align:center;margin:4px 0;color:#475569} h2{text-align:center;margin:18px 0 14px}
      table{width:100%;border-collapse:collapse} th,td{border:1px solid #cbd5e1;padding:8px;font-size:12px;text-align:left}
      th{background:#0f62fe;color:#fff} tr:nth-child(even){background:#f8fafc}
      </style></head><body><h1>${COMPANY_NAME}</h1><p>${COMPANY_ADDRESS}</p><p><strong>Date:</strong> ${currentDate}</p><h2>${fileName}</h2>
      <table><thead><tr>${printableColumns.map((column) => `<th>${labelFor(column)}</th>`).join("")}</tr></thead><tbody>${htmlRows}</tbody></table>
      </body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    closeMenu();
    if (!hasData) return;
    const currentDate = reportDateLabel();
    const tableHtml = `<table><thead><tr>${printableColumns
      .map((column) => `<th>${labelFor(column)}</th>`)
      .join("")}</tr></thead><tbody>${rows
      .map((row) => `<tr>${printableColumns.map((column) => `<td>${cellValue(row, column)}</td>`).join("")}</tr>`)
      .join("")}</tbody></table>`;
    const printWindow = window.open("", "", "width=1200,height=760");
    printWindow.document.write(`<html><head><title>${fileName}</title><style>
      body{font-family:Arial;padding:20px;color:#111827} h1{text-align:center;margin:0} p{text-align:center;color:#475569;margin:4px 0} h2{text-align:center;margin:18px 0 14px}
      table{width:100%;border-collapse:collapse} th,td{border:1px solid #cbd5e1;padding:8px;font-size:12px;text-align:left}
      th{background:#0f62fe;color:white} tr:nth-child(even){background:#f8fafc}
    </style></head><body><h1>${COMPANY_NAME}</h1><p>${COMPANY_ADDRESS}</p><p><strong>Date:</strong> ${currentDate}</p><h2>${fileName}</h2>${tableHtml}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        startIcon={<FileDownloadRounded />}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        disabled={!hasData}
      >
        {buttonLabel}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem onClick={handleExcel}>
          <ListItemIcon><TableViewRounded fontSize="small" color="success" /></ListItemIcon>
          <ListItemText primary="Download Excel" secondary=".xlsx" />
        </MenuItem>
        <MenuItem onClick={handlePdf}>
          <ListItemIcon><DescriptionRounded fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primary="Download PDF" secondary=".pdf" />
        </MenuItem>
        <MenuItem onClick={handleWord}>
          <ListItemIcon><ArticleRounded fontSize="small" color="primary" /></ListItemIcon>
          <ListItemText primary="Download Word" secondary=".doc" />
        </MenuItem>
        <MenuItem onClick={handlePrint}>
          <ListItemIcon><PrintRounded fontSize="small" /></ListItemIcon>
          <ListItemText primary="Print" />
        </MenuItem>
      </Menu>
    </>
  );
}

/**
 * GridToolbar - the single toolbar for every table: column visibility, filter,
 * density, a quick search box, and ONE export menu (Excel / PDF / Word / Print).
 * This is the only download entry point per table - no duplicate export buttons.
 */
function CustomGridToolbar({ rows, columns, fileName, showExport }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Box sx={{ flex: 1 }} />
      <GridToolbarQuickFilter debounceMs={350} placeholder="Search table..." />
      {showExport && <TableExportMenu rows={rows} columns={columns} fileName={fileName} />}
    </GridToolbarContainer>
  );
}

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
  title,
  subtitle,
  pageSize = 25,
  initialState,
  showCompany = false,
  showExport = true,
  actions,
  ...otherProps
}) => {
  const { settings } = useThemeProvider();
  const tableTitle = title || "finance-export";
  const rowHeight = settings.tableDensity === "compact" ? 40 : settings.tableDensity === "spacious" ? 54 : 46;
  const headerHeight = settings.tableDensity === "compact" ? 44 : settings.tableDensity === "spacious" ? 58 : 52;
  const fontScale = Number(settings.fontScale || 1);
  const tableScale = settings.tableDensity === "compact" ? 0.92 : settings.tableDensity === "spacious" ? 1.08 : 1;
  const pageSizeOptions = React.useMemo(
    () => Array.from(new Set([10, 25, 50, 100, 200, pageSize])).sort((a, b) => a - b),
    [pageSize]
  );
  const [paginationModel, setPaginationModel] = React.useState({ page: 0, pageSize });
  const isAutoHeight = Boolean(otherProps.autoHeight);

  React.useEffect(() => {
    setPaginationModel((model) => ({ ...model, page: 0, pageSize }));
  }, [pageSize, rows.length]);

  return (
    <Paper
      className="enterprise-card"
      elevation={0}
      sx={{
        ...(isAutoHeight
          ? { minHeight: 420 }
          : { height, minHeight: 420, overflow: "hidden" }),
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {(title || subtitle || showCompany || actions) && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: 1,
            borderColor: "divider",
            background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,250,252,0.88))",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            {showCompany && (
              <Typography variant="caption" color="primary" sx={{ fontWeight: 900 }}>
                {COMPANY_NAME} / {COMPANY_ADDRESS} / Date: {reportDateLabel()}
              </Typography>
            )}
            {title && <Typography variant="subtitle1" sx={{ mt: showCompany ? 0.25 : 0 }}>{title}</Typography>}
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
            <Chip size="small" label={`${rows.length} records`} color="primary" variant="outlined" />
            {actions}
          </Stack>
        </Stack>
      )}
      {loading ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {settings.loadingStyle === "bar" ? (
            <Box sx={{ width: "min(420px, 80%)" }}><LinearProgress /></Box>
          ) : (
            <CircularProgress />
          )}
          <Typography color="text.secondary">Loading data...</Typography>
        </Box>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          autosizeOnMount
          autosizeOptions={{ includeHeaders: true, includeOutliers: true, expand: true }}
          showToolbar
          slots={{ toolbar: CustomGridToolbar }}
          slotProps={{
            toolbar: {
              rows,
              columns,
              fileName: tableTitle,
              showExport,
            },
          }}
          rowHeight={rowHeight}
          columnHeaderHeight={headerHeight}
          sx={{
            border: "none",
            flex: 1,
            backgroundColor: "transparent",
            "& .MuiDataGrid-virtualScroller": { overflowAnchor: "none" },
            "& .MuiDataGrid-toolbarContainer": {
              px: 2,
              py: 1.25,
              gap: 1,
              alignItems: "center",
              justifyContent: "flex-end",
              borderBottom: "1px solid",
              borderColor: "divider",
              background:
                "linear-gradient(180deg, rgba(248,250,252,0.9), rgba(255,255,255,0.78))",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-root": {
              minHeight: 34,
            },
            "& .MuiDataGrid-toolbarQuickFilter": {
              minWidth: { xs: "100%", sm: 260 },
              maxWidth: { xs: "100%", sm: 360 },
              marginLeft: { xs: 0, sm: "auto" },
            },
            "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader": {
              backgroundColor: "#f8fafc",
            },
            "& .MuiDataGrid-columnHeader": {
              borderRight: "1px solid",
              borderColor: "divider",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: 800,
              color: "text.primary",
              textTransform: "uppercase",
              fontSize: `${0.75 * fontScale * tableScale}rem`,
              letterSpacing: 0,
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              fontSize: `${0.8125 * fontScale * tableScale}rem`,
            },
            ...(settings.tableStyle === "striped" && {
              "& .MuiDataGrid-row:nth-of-type(even)": {
                backgroundColor: "rgba(248,250,252,0.58)",
              },
            }),
            ...(settings.tableStyle === "bordered" && {
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid",
                borderRight: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                fontSize: `${0.8125 * fontScale * tableScale}rem`,
              },
            }),
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "color-mix(in srgb, var(--brand-primary) 9%, var(--surface-1))",
              cursor: "pointer",
            },
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "color-mix(in srgb, var(--brand-primary) 14%, var(--surface-1))",
            },
            "& .MuiDataGrid-row.Mui-selected:hover": {
              backgroundColor: "color-mix(in srgb, var(--brand-primary) 18%, var(--surface-1))",
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
              outline: "2px solid color-mix(in srgb, var(--brand-primary) 34%, transparent)",
              outlineOffset: "-2px",
            },
            "& .MuiDataGrid-footerContainer": {
              minHeight: 54,
              borderTop: "1px solid",
              borderColor: "divider",
              backgroundColor: "#fff",
              justifyContent: "center",
              px: 2,
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-root": {
              width: "100%",
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-toolbar": {
              width: "100%",
              justifyContent: "center",
              gap: 2,
              px: 0,
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-spacer": {
              display: "none",
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-selectLabel, & .MuiDataGrid-footerContainer .MuiTablePagination-displayedRows": {
              margin: 0,
              fontWeight: 800,
            },
            "& .MuiDataGrid-overlayWrapper": {
              minHeight: 260,
            },
            "& .MuiButtonBase-root": {
              borderRadius: 1.5,
            },
          }}
          initialState={{
            density: settings.tableDensity === "spacious" ? "comfortable" : settings.tableDensity === "standard" ? "standard" : "compact",
            pagination: {
              paginationModel,
            },
            ...initialState,
          }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={pageSizeOptions}
          disableRowSelectionOnClick
          keepNonExistentRowsSelected={false}
          localeText={{
            toolbarQuickFilterPlaceholder: "Search table...",
            noRowsLabel: "No records found",
            footerTotalRows: "Total rows:",
          }}
          {...otherProps}
        />
      )}
    </Paper>
  );
};

export default DataTable;

