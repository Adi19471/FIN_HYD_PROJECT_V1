import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
} from "@mui/material";
import { actionIcons } from "src/lib/icons";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";
import {
  AppDatePicker,
  DataTable,
  ReportCompanyHeader,
  ReportToolbar,
  TableExportMenu,
} from "src/components/ui";
import { useTheme } from "@mui/material/styles";

const GenerateIcon = actionIcons.generate;

const scrollTableSx = {
  height: {
    xs: "min(62vh, 420px)",
    sm: "min(58vh, 460px)",
    md: "min(56vh, 520px)",
    lg: "calc(100vh - 390px)",
    xl: "calc(100vh - 410px)",
  },
  minHeight: { xs: 300, sm: 340, md: 380, lg: 420 },
  maxHeight: { xs: 480, sm: 560, md: 640, lg: 720, xl: 860 },
  overflow: "auto",
  overscrollBehavior: "contain",
  WebkitOverflowScrolling: "touch",
  scrollbarWidth: "thin",
  scrollbarColor: "#64748b #e2e8f0",
  "&::-webkit-scrollbar": {
    width: 12,
    height: 12,
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#e2e8f0",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#64748b",
    border: "2px solid #e2e8f0",
  },
};

const money = (value) =>
  Number(Math.abs(Number(value || 0))).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

const amountValue = (value) => Math.abs(Number(value || 0));

const rowName = (row) =>
  row.code || row.description || row.accountName || row.name || row.accountCode || "-";

const normalizeType = (type = "") => {
  const value = String(type).trim().toUpperCase();
  return value.includes("LIABIL") ? "LIABILITIES" : "ASSETS";
};

// Amounts stay raw numbers so Excel keeps them summable; the formatter only
// dresses up the PDF / Word / CSV / print output, which reads valueFormatter.
const exportColumns = [
  { field: "section", headerName: "Section", width: 130 },
  { field: "masterCode", headerName: "Group", width: 180 },
  { field: "code", headerName: "Account", width: 260 },
  { field: "displayAmount", headerName: "Amount", width: 150, align: "right", valueFormatter: (value) => money(value) },
  { field: "originalAmount", headerName: "Original Amount", width: 170, align: "right", valueFormatter: (value) => money(value) },
];

const BalanceSheet = () => {
  const theme = useTheme();
  const [toDate, setToDate] = useState(dayjs());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedDate, setGeneratedDate] = useState(null);

  const token = getSession()?.token || getSession("token") || "";

  const normalizedRows = useMemo(
    () =>
      data.map((row, index) => ({
        id: `${normalizeType(row.type)}-${row.masterCode || row.accountMasterCode || "OTHERS"}-${rowName(row)}-${index}`,
        serial: index + 1,
        section: normalizeType(row.type),
        masterCode: row.masterCode || row.accountMasterCode || "OTHERS",
        code: rowName(row),
        displayAmount: amountValue(row.amount),
        originalAmount: Number(row.amount || 0),
        raw: row,
      })),
    [data]
  );

  const groupedData = useMemo(() => {
    const result = { ASSETS: {}, LIABILITIES: {} };

    normalizedRows.forEach((item) => {
      if (!result[item.section][item.masterCode]) result[item.section][item.masterCode] = [];
      result[item.section][item.masterCode].push(item);
    });

    return result;
  }, [normalizedRows]);

  const getSubTotal = (items = []) =>
    items.reduce((sum, item) => sum + amountValue(item.displayAmount ?? item.amount), 0);

  const getMainTotal = (group = {}) =>
    Object.values(group)
      .flat()
      .reduce((sum, item) => sum + amountValue(item.displayAmount ?? item.amount), 0);

  const totalAssets = getMainTotal(groupedData.ASSETS);
  const totalLiabilities = getMainTotal(groupedData.LIABILITIES);
  const difference = Math.abs(totalAssets - totalLiabilities);

  const exportRows = useMemo(
    () =>
      normalizedRows.map((row) => ({
        id: row.id,
        section: row.section,
        masterCode: row.masterCode,
        code: row.code,
        displayAmount: amountValue(row.displayAmount),
        originalAmount: Number(row.originalAmount || 0),
      })),
    [normalizedRows]
  );

  // Report date and the totals block printed under every exported table.
  const reportOptions = useMemo(
    () => ({
      period: { fromDate: generatedDate || toDate, label: "Balance Sheet As On" },
      summary: [
        { label: "Total Assets", value: totalAssets },
        { label: "Total Liabilities", value: totalLiabilities },
        { label: "Difference", value: difference },
      ],
    }),
    [generatedDate, toDate, totalAssets, totalLiabilities, difference]
  );

  const detailColumns = useMemo(
    () => [
      {
        field: "serial",
        headerName: "No",
        width: 80,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "section",
        headerName: "Type",
        minWidth: 130,
        flex: 0.8,
      },
      {
        field: "masterCode",
        headerName: "Group",
        minWidth: 170,
        flex: 1,
      },
      {
        field: "code",
        headerName: "Account",
        minWidth: 220,
        flex: 1.4,
      },
      {
        field: "displayAmount",
        headerName: "Amount",
        minWidth: 150,
        flex: 0.8,
        align: "right",
        headerAlign: "right",
        valueFormatter: (value) => money(value),
      },
      {
        field: "originalAmount",
        headerName: "Original Amount",
        minWidth: 160,
        flex: 0.8,
        align: "right",
        headerAlign: "right",
        valueFormatter: (value) =>
          Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 }),
      },
    ],
    []
  );

  const fetchData = async () => {
    if (!toDate) {
      alert("Please select a date");
      return;
    }

    if (!token) {
      alert("Authentication token not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      const reportDate = dayjs(toDate).format("YYYY-MM-DD");
      const res = await axios.get(`${API_BASE}/balanceSheet/${reportDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const rows = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.result)
            ? res.data.result
            : [];

      setData(rows);
      setGeneratedDate(toDate);
    } catch (err) {
      console.error("Error fetching balance sheet:", err);
      alert(err.response?.data?.message || "Failed to fetch balance sheet");
    } finally {
      setLoading(false);
    }
  };



  // ASSETS take the theme's primary, LIABILITIES its secondary, so the two
  // halves stay distinguishable in every accent instead of being pinned to a
  // hardcoded teal and blue.
  const renderSection = (title, group, color) => {
    const onColor = theme.palette.getContrastText(color);
    const groups = Object.entries(group || {});

    return (
      <Paper
        elevation={0}
        sx={{
          border: "1px solid", borderColor: "divider",
          borderRadius: 0,
          overflow: "hidden",
          bgcolor: "background.paper",
          boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          width: "100%",
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 1,
            bgcolor: color,
            color: onColor,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 0.75,
          }}
        >
          <Typography sx={{ fontWeight: 900, fontSize: { xs: 14, md: 15 } }}>{title}</Typography>
          <Typography sx={{ fontWeight: 900, fontSize: { xs: 14, md: 15 }, textAlign: { xs: "left", sm: "right" } }}>
            Total: {money(getMainTotal(group))}
          </Typography>
        </Box>

        <TableContainer sx={{ ...scrollTableSx, overflowX: "auto" }}>
          <Table size="small" stickyHeader sx={{ minWidth: 460, borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    border: "1px solid", borderColor: "divider",
                    bgcolor: "action.hover",
                    fontWeight: 900,
                    width: { xs: 44, sm: 52 },
                    py: 0.75,
                    px: { xs: 0.75, sm: 1 },
                    fontSize: { xs: 12, sm: 13 },
                  }}
                >
                  No
                </TableCell>
                <TableCell
                  sx={{
                    border: "1px solid", borderColor: "divider",
                    bgcolor: "action.hover",
                    fontWeight: 900,
                    py: 0.75,
                    px: { xs: 0.75, sm: 1 },
                    fontSize: { xs: 12, sm: 13 },
                  }}
                >
                  Account
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    border: "1px solid", borderColor: "divider",
                    bgcolor: "action.hover",
                    fontWeight: 900,
                    width: { xs: 126, sm: 150 },
                    py: 0.75,
                    px: { xs: 0.75, sm: 1 },
                    fontSize: { xs: 12, sm: 13 },
                  }}
                >
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ border: "1px solid", borderColor: "divider", py: 2.5, color: "text.secondary" }}>
                    No records
                  </TableCell>
                </TableRow>
              ) : (
                groups.map(([masterCode, rows]) => (
                  <React.Fragment key={`${title}-${masterCode}`}>
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        sx={{
                          border: "1px solid", borderColor: "divider",
                          py: 0.65,
                          px: { xs: 0.75, sm: 1 },
                          bgcolor: alpha(color, 0.11),
                          fontWeight: 900,
                          fontSize: { xs: 12, sm: 13 },
                          overflowWrap: "anywhere",
                        }}
                      >
                        {String(masterCode).toUpperCase()}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          border: "1px solid", borderColor: "divider",
                          py: 0.65,
                          px: { xs: 0.75, sm: 1 },
                          bgcolor: alpha(color, 0.11),
                          fontWeight: 900,
                          width: { xs: 126, sm: 150 },
                          fontSize: { xs: 12, sm: 13 },
                        }}
                      >
                        {money(getSubTotal(rows))}
                      </TableCell>
                    </TableRow>
                    {rows.map((row, index) => (
                      <TableRow
                        key={`${masterCode}-${index}`}
                        hover
                        sx={{
                          "&:nth-of-type(even) td": { bgcolor: "action.hover" },
                        }}
                      >
                        <TableCell sx={{ border: "1px solid", borderColor: "divider", width: { xs: 44, sm: 52 }, py: 0.65, px: { xs: 0.75, sm: 1 }, color: "text.secondary", fontSize: { xs: 12, sm: 13 } }}>
                          {index + 1}
                        </TableCell>
                        <TableCell sx={{ border: "1px solid", borderColor: "divider", py: 0.65, px: { xs: 0.75, sm: 1 }, fontWeight: 600, fontSize: { xs: 12, sm: 13 }, overflowWrap: "anywhere" }}>
                          {row.code || rowName(row) || "\u2014"}
                        </TableCell>
                        <TableCell align="right" sx={{ border: "1px solid", borderColor: "divider", py: 0.65, px: { xs: 0.75, sm: 1 }, fontWeight: 800, fontSize: { xs: 12, sm: 13 }, whiteSpace: "nowrap" }}>
                          {money(row.displayAmount ?? row.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  return (
    <>
      {/* Same furniture as every other report: an action bar, then the company
          banner. The breadcrumb overhead already names the screen. */}
      <ReportToolbar onRefresh={fetchData} loading={loading}>
        <TableExportMenu
          rows={exportRows}
          columns={exportColumns}
          fileName="Balance_Sheet"
          reportOptions={reportOptions}
        />
      </ReportToolbar>

      <Paper sx={{ p: { xs: 1.5, md: 3 }, mt: 2 }}>
        <ReportCompanyHeader
          title="Balance Sheet"
          subtitle="Assets, liabilities and the balance difference"
          date={generatedDate || toDate}
        />
        <Box sx={{ mt: 2 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ xs: "stretch", md: "center" }}
            flexWrap="wrap"
            sx={{ mb: 2 }}
          >
            <AppDatePicker
              label="Date"
              value={toDate}
              onChange={setToDate}
              sx={{ width: { xs: "100%", md: 240, xl: 280 } }}
            />
            <Button
              variant="contained"
              onClick={fetchData}
              disabled={loading}
              startIcon={<GenerateIcon />}
              sx={{
                height: 40,
                fontWeight: 800,
                width: { xs: "100%", md: "auto" },
                minWidth: { md: 132 },
              }}
            >
              {loading ? "Generating..." : "Generate"}
            </Button>
            <Chip
              label={`Report Date: ${dayjs(generatedDate || toDate).format("DD-MMM-YYYY")}`}
              variant="outlined"
              color="primary"
              sx={{
                fontWeight: 800,
                alignSelf: { xs: "stretch", sm: "flex-start", md: "center" },
                justifyContent: "center",
                maxWidth: "100%",
              }}
            />
          </Stack>

          {loading ? (
            <Box sx={{ display: "grid", placeItems: "center", minHeight: 360 }}>
              <LoadingSpinner />
            </Box>
          ) : data.length === 0 ? (
            <Alert severity="info">
              Select a date and generate the balance sheet.
            </Alert>
          ) : (
            <Stack spacing={2}>
              <Grid container spacing={1.5}>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 4
                  }}>
                  <Paper elevation={0} sx={{ p: { xs: 1.25, md: 1.75 }, border: "1px solid", borderColor: "divider", bgcolor: alpha(theme.palette.primary.main, 0.06), height: "100%" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                      TOTAL ASSETS
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "primary.main", fontSize: { xs: 22, md: 24, xl: 30 }, overflowWrap: "anywhere" }}>
                      {money(totalAssets)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 4
                  }}>
                  <Paper elevation={0} sx={{ p: { xs: 1.25, md: 1.75 }, border: "1px solid", borderColor: "divider", bgcolor: alpha(theme.palette.secondary.main, 0.06), height: "100%" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                      TOTAL LIABILITIES
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "secondary.main", fontSize: { xs: 22, md: 24, xl: 30 }, overflowWrap: "anywhere" }}>
                      {money(totalLiabilities)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    sm: 12,
                    lg: 4
                  }}>
                  <Paper elevation={0} sx={{ p: { xs: 1.25, md: 1.75 }, border: "1px solid", borderColor: difference === 0 ? "divider" : "warning.main", bgcolor: alpha(difference === 0 ? theme.palette.success.main : theme.palette.warning.main, 0.08), height: "100%" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                      DIFFERENCE
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: difference === 0 ? "success.main" : "warning.main", fontSize: { xs: 22, md: 24, xl: 30 }, overflowWrap: "anywhere" }}>
                      {money(difference)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={{ xs: 1.5, md: 2 }} alignItems="stretch">
                <Grid
                  sx={{ minHeight: 0, display: "flex" }}
                  size={{
                    xs: 12,
                    xl: 6
                  }}>
                  {renderSection("ASSETS", groupedData.ASSETS, theme.palette.primary.main)}
                </Grid>
                <Grid
                  sx={{ minHeight: 0, display: "flex" }}
                  size={{
                    xs: 12,
                    xl: 6
                  }}>
                  {renderSection("LIABILITIES", groupedData.LIABILITIES, theme.palette.secondary.main)}
                </Grid>
              </Grid>

              <DataTable
                fileName="Balance_Sheet_Rows"
                subtitle="Every row behind the summary above - searchable, filterable and downloadable."
                rows={normalizedRows}
                columns={detailColumns}
                loading={loading}
                height={{ xs: 520, md: 620, xl: 760 }}
                pageSize={25}
                getRowId={(row) => row.id}
                showCompany={false}
                period={reportOptions.period}
                summary={reportOptions.summary}
              />
            </Stack>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default BalanceSheet;
