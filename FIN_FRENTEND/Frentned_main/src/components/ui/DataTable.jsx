import React from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  useGridApiContext,
} from "@mui/x-data-grid";
import {
  ArticleRounded,
  ChevronLeftRounded,
  ChevronRightRounded,
  DescriptionRounded,
  FileDownloadRounded,
  GridOnRounded,
  PrintRounded,
  TableViewRounded,
} from "@mui/icons-material";
import { COMPANY_ADDRESS, COMPANY_NAME } from "src/lib/company";
import { useThemeProvider } from "src/utils/ThemeContext";
import {
  exportCsv,
  exportExcel,
  exportPdf,
  exportWord,
  isTotalRow,
  printReport,
  reportDateLabel,
  summaryValue,
} from "./reportExport";

// Default responsive height for a DataTable that doesn't pass its own `height`.
// Exported so outlier screens (e.g. Partner.jsx, which wraps a raw DataGrid
// instead of this component) can reuse the exact same breakpoint scale.
export const DEFAULT_TABLE_HEIGHT = {
  xs: "min(70vh, 460px)",
  sm: "min(66vh, 520px)",
  md: "min(62vh, 560px)",
  lg: "calc(100vh - 260px)",
  xl: "calc(100vh - 280px)",
};

/**
 * Append a totals row for the given numeric fields. The row carries __isTotal so
 * the exporters render it bold on a tinted band, and so the record count and the
 * grid's own sorting can tell it apart from real data.
 *
 * @param {Array} rows        Data rows (without a totals row).
 * @param {Array} totalFields Numeric field names to sum.
 * @param {object} labelCell  Where the "TOTAL" caption goes, e.g. { customerName: "TOTAL" }.
 */
export const withTotalsRow = (rows = [], totalFields = [], labelCell = {}) => {
  if (!rows.length || !totalFields.length) return rows;
  const totals = totalFields.reduce((acc, field) => {
    acc[field] = rows.reduce((sum, row) => sum + Number(row[field] || 0), 0);
    return acc;
  }, {});
  return [...rows, { id: "total", __isTotal: true, ...labelCell, ...totals }];
};

export function TableExportMenu({
  rows,
  columns,
  fileName,
  buttonLabel = "Download",
  reportOptions = {},
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const hasData = rows.length > 0;
  const closeMenu = () => setAnchorEl(null);

  const run = (exporter) => () => {
    closeMenu();
    if (hasData) exporter(rows, columns, fileName, reportOptions);
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
        <MenuItem onClick={run(exportExcel)}>
          <ListItemIcon><TableViewRounded fontSize="small" color="success" /></ListItemIcon>
          <ListItemText primary="Download Excel" secondary=".xlsx" />
        </MenuItem>
        <MenuItem onClick={run(exportPdf)}>
          <ListItemIcon><DescriptionRounded fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primary="Download PDF" secondary=".pdf" />
        </MenuItem>
        <MenuItem onClick={run(exportWord)}>
          <ListItemIcon><ArticleRounded fontSize="small" color="primary" /></ListItemIcon>
          <ListItemText primary="Download Word" secondary=".doc" />
        </MenuItem>
        <MenuItem onClick={run(exportCsv)}>
          <ListItemIcon><GridOnRounded fontSize="small" color="action" /></ListItemIcon>
          <ListItemText primary="Download CSV" secondary=".csv" />
        </MenuItem>
        <MenuItem onClick={run(printReport)}>
          <ListItemIcon><PrintRounded fontSize="small" /></ListItemIcon>
          <ListItemText primary="Print" />
        </MenuItem>
      </Menu>
    </>
  );
}

/**
 * Left / right column scroll buttons. The partner reports are wider than the
 * screen, and their horizontal scrollbar sits at the foot of the table where it
 * is easy to miss, so the toolbar carries the same movement as a pair of
 * buttons. They step by roughly a screenful and hide themselves whenever the
 * table already fits.
 */
function ColumnScrollButtons() {
  const apiRef = useGridApiContext();
  const [state, setState] = React.useState({ overflow: false, atStart: true, atEnd: true });

  const sync = React.useCallback(() => {
    const api = apiRef.current;
    if (!api?.getRootDimensions) return;
    const dimensions = api.getRootDimensions();
    if (!dimensions?.isReady) return;
    const max = dimensions.contentSize.width - dimensions.viewportInnerSize.width;
    const left = api.getScrollPosition().left;
    const next = { overflow: Boolean(dimensions.hasScrollX) && max > 4, atStart: left <= 2, atEnd: left >= max - 2 };
    // Scroll fires many times a second - only re-render when a button's state
    // actually turns over, so the toolbar's search box is left alone.
    setState((current) =>
      current.overflow === next.overflow && current.atStart === next.atStart && current.atEnd === next.atEnd
        ? current
        : next
    );
  }, [apiRef]);

  React.useEffect(() => {
    sync();
    const events = [
      "scrollPositionChange",
      "virtualScrollerContentSizeChange",
      "viewportInnerSizeChange",
      "columnsChange",
      "debouncedResize",
    ];
    const unsubscribe = events.map((event) => apiRef.current.subscribeEvent(event, sync));
    return () => unsubscribe.forEach((off) => off());
  }, [apiRef, sync]);

  if (!state.overflow) return null;

  const step = (direction) => () => {
    const api = apiRef.current;
    const dimensions = api.getRootDimensions();
    const page = Math.max(240, dimensions.viewportInnerSize.width * 0.8);
    api.scroll({ left: api.getScrollPosition().left + direction * page });
  };

  return (
    <Stack direction="row" spacing={0.25} alignItems="center" sx={{ ml: 0.5 }}>
      <Tooltip title="Scroll columns left">
        <span>
          <IconButton size="small" onClick={step(-1)} disabled={state.atStart}>
            <ChevronLeftRounded fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Scroll columns right">
        <span>
          <IconButton size="small" onClick={step(1)} disabled={state.atEnd}>
            <ChevronRightRounded fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}

/**
 * GridToolbar - the single toolbar for every table: column visibility, filter,
 * density, a quick search box, and ONE export menu (Excel / PDF / Word / Print).
 * This is the only download entry point per table - no duplicate export buttons.
 */
function CustomGridToolbar({ rows, columns, fileName, showExport, reportOptions }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <ColumnScrollButtons />
      <Box sx={{ flex: 1 }} />
      <GridToolbarQuickFilter debounceMs={350} placeholder="Search table..." />
      {showExport && (
        <>
          <TableExportMenu
            rows={rows}
            columns={columns}
            fileName={fileName}
            reportOptions={reportOptions}
          />
          {/* Print is in the Download menu too, but it is the button people
              reach for on a report screen, so it also stands on its own. */}
          <Button
            size="small"
            variant="outlined"
            startIcon={<PrintRounded />}
            onClick={() => printReport(rows, columns, fileName, reportOptions)}
            disabled={!rows.length}
          >
            Print
          </Button>
        </>
      )}
    </GridToolbarContainer>
  );
}

/**
 * DataTable - Consistent DataGrid wrapper
 * @param {Array} rows - Table rows data
 * @param {Array} columns - Column definitions
 * @param {boolean} loading - Loading state
 * @param {function} getRowId - Function to get row ID
 * @param {number|object} height - Table height (default: responsive DEFAULT_TABLE_HEIGHT)
 * @param {object} period - { fromDate, toDate, label } printed on every export
 * @param {Array} reportMeta - [{ label, value }] filter lines printed on every export
 * @param {Array} totalFields - numeric fields to sum into a TOTAL row
 * @param {object} totalLabelCell - where the TOTAL caption sits, e.g. { customerName: "TOTAL" }
 * @param {Array} summary - [{ label, value }] shown under the grid and on every
 *   export, e.g. creditDebitSummary(rows) for Credits / Debits / Balance
 * @param {object} otherProps - Additional DataGrid props
 */
const DataTable = ({
  rows = [],
  columns = [],
  loading = false,
  getRowId = (row) => row.id,
  height = DEFAULT_TABLE_HEIGHT,
  title,
  subtitle,
  pageSize = 25,
  initialState,
  showCompany = false,
  showExport = true,
  actions,
  period,
  reportMeta,
  totalFields,
  totalLabelCell,
  summary,
  ...otherProps
}) => {
  const { settings } = useThemeProvider();
  const tableTitle = title || "finance-export";

  // A screen either hands us a totals row itself (the older screens do) or asks
  // for one via totalFields. Either way it must reach the export, and it must
  // not be counted as a record.
  const tableRows = React.useMemo(
    () =>
      totalFields?.length && !rows.some(isTotalRow)
        ? withTotalsRow(rows, totalFields, totalLabelCell)
        : rows,
    [rows, totalFields, totalLabelCell]
  );
  const recordCount = React.useMemo(() => tableRows.filter((row) => !isTotalRow(row)).length, [tableRows]);
  const reportOptions = React.useMemo(
    () => ({ period, meta: reportMeta, summary }),
    [period, reportMeta, summary]
  );

  // Row highlight. These reports are wide enough that the eye loses the line
  // when reading across, so hovering lights the whole row and clicking pins it
  // - the row stays marked while you scroll sideways or read off a figure.
  const [activeRowId, setActiveRowId] = React.useState(null);
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
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
            <Chip size="small" label={`${recordCount} records`} color="primary" variant="outlined" />
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
          rows={tableRows}
          columns={columns}
          getRowId={getRowId}
          getRowClassName={(params) =>
            [
              isTotalRow(params.row) ? "datatable-total-row" : "",
              params.id === activeRowId ? "datatable-active-row" : "",
            ]
              .filter(Boolean)
              .join(" ")
          }
          onRowClick={(params) =>
            setActiveRowId((current) => (current === params.id ? null : params.id))
          }
          autosizeOnMount
          autosizeOptions={{ includeHeaders: true, includeOutliers: true, expand: true }}
          showToolbar
          slots={{ toolbar: CustomGridToolbar }}
          slotProps={{
            toolbar: {
              rows: tableRows,
              columns,
              fileName: tableTitle,
              showExport,
              reportOptions,
            },
          }}
          rowHeight={rowHeight}
          columnHeaderHeight={headerHeight}
          // The grid draws its own scrollbars and sizes them from what the
          // browser reports; browsers with overlay scrollbars report 0, which
          // left the wide reports with no horizontal bar to grab. Pin it.
          scrollbarSize={14}
          sx={{
            border: "none",
            flex: 1,
            backgroundColor: "transparent",
            "& .MuiDataGrid-virtualScroller": { overflowAnchor: "none" },
            // A report wider than the screen is read by scrolling sideways, so
            // the bar has to look like one: brand thumb on a tinted track.
            "& .MuiDataGrid-scrollbar": {
              "&::-webkit-scrollbar": { width: 14, height: 14 },
              "&::-webkit-scrollbar-track": { backgroundColor: "#e2e8f0", borderRadius: 999 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "color-mix(in srgb, var(--brand-primary) 62%, transparent)",
                border: "3px solid #e2e8f0",
                borderRadius: 999,
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "var(--brand-primary)",
              },
            },
            "& .MuiDataGrid-scrollbar--horizontal": {
              backgroundColor: "#e2e8f0",
            },
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
            // Grid lines live in the global enterprise layer (src/css/style.css),
            // which sets them with !important - do not restyle borders here.
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
            // The TOTAL row reads as a summary band, not another data row.
            "& .MuiDataGrid-row.datatable-total-row": {
              backgroundColor: "#e2e8f0",
              borderTop: "2px solid var(--brand-primary)",
            },
            "& .MuiDataGrid-row.datatable-total-row .MuiDataGrid-cell": {
              fontWeight: 800,
            },
            // Hovering lights the full width of the row so the line stays
            // readable across every column. `&&` doubles the class to outrank
            // the DataGrid's own row-hover rule, which is emitted after sx at
            // equal specificity and would otherwise win.
            "&& .MuiDataGrid-row:hover": {
              backgroundColor: "color-mix(in srgb, var(--brand-primary) 13%, var(--surface-1))",
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
            // A clicked row stays marked - inset shadow draws the left accent
            // without shifting the cells. Declared last so it wins over
            // striping and hover.
            "&& .MuiDataGrid-row.datatable-active-row, && .MuiDataGrid-row.datatable-active-row:hover": {
              backgroundColor: "color-mix(in srgb, var(--brand-primary) 22%, var(--surface-1))",
              boxShadow: "inset 3px 0 0 0 var(--brand-primary)",
            },
            "& .MuiDataGrid-row.datatable-active-row .MuiDataGrid-cell": {
              fontWeight: 700,
              backgroundColor: "transparent",
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
      {Boolean(summary?.length) && (
        <Stack
          direction="row"
          justifyContent="flex-end"
          sx={{
            flex: "0 0 auto",
            px: 2.5,
            py: 1.5,
            borderTop: 1,
            borderColor: "divider",
            backgroundColor: "#f8fafc",
          }}
        >
          <Box sx={{ minWidth: 260 }}>
            {summary.map((line, index) => (
              <Stack
                key={line.label}
                direction="row"
                justifyContent="space-between"
                sx={{
                  py: 0.35,
                  ...(index === summary.length - 1 && {
                    mt: 0.35,
                    pt: 0.6,
                    borderTop: "1px solid",
                    borderColor: "text.secondary",
                  }),
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  {line.label} :
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
                  {summaryValue(line.value)}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Stack>
      )}
    </Paper>
  );
};

export default DataTable;

