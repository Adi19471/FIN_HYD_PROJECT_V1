import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
import {
  ArticleRounded,
  DescriptionRounded,
  FileDownloadRounded,
  PrintRounded,
  RefreshRounded,
  TableViewRounded,
} from "@mui/icons-material";
import dayjs from "dayjs";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";
import { AppDatePicker, DataTable } from "src/components/ui";

const reportBorder = "1px solid #263238";

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

const exportColumns = [
  { field: "section", headerName: "Section" },
  { field: "masterCode", headerName: "Group" },
  { field: "code", headerName: "Account" },
  { field: "displayAmount", headerName: "Amount" },
  { field: "originalAmount", headerName: "Original Amount" },
];

const BalanceSheet = () => {
  const [toDate, setToDate] = useState(dayjs());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedDate, setGeneratedDate] = useState(null);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);

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
        section: row.section,
        masterCode: row.masterCode,
        code: row.code,
        displayAmount: money(row.displayAmount),
        originalAmount: Number(row.originalAmount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 }),
      })),
    [normalizedRows]
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

  const handlePrint = () => window.print();

  const closeDownloadMenu = () => setDownloadAnchorEl(null);

  const handleExcel = () => {
    closeDownloadMenu();
    if (!exportRows.length) return;
    const worksheet = XLSX.utils.json_to_sheet(
      exportRows.map((row) =>
        exportColumns.reduce((acc, column) => {
          acc[column.headerName] = row[column.field];
          return acc;
        }, {})
      )
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Balance Sheet");
    XLSX.writeFile(workbook, "Balance_Sheet.xlsx");
  };

  const handlePdf = () => {
    closeDownloadMenu();
    if (!exportRows.length) return;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    doc.setFontSize(16);
    doc.text("SRI BALAJI ENTERPRISES", 14, 14);
    doc.setFontSize(11);
    doc.text("Balance Sheet", 14, 22);
    doc.text(`Date: ${dayjs(generatedDate || toDate).format("DD-MMM-YYYY")}`, 14, 29);
    autoTable(doc, {
      startY: 36,
      head: [exportColumns.map((column) => column.headerName)],
      body: exportRows.map((row) => exportColumns.map((column) => row[column.field])),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [15, 98, 254], textColor: 255, fontStyle: "bold" },
    });
    doc.save("Balance_Sheet.pdf");
  };

  const handleWord = () => {
    closeDownloadMenu();
    if (!exportRows.length) return;
    const rows = exportRows
      .map(
        (row) =>
          `<tr><td>${row.section}</td><td>${row.masterCode}</td><td>${row.code}</td><td style="text-align:right">${row.displayAmount}</td><td style="text-align:right">${row.originalAmount}</td></tr>`
      )
      .join("");
    const html = `<html><head><meta charset="utf-8"><style>
      body{font-family:Arial;padding:20px;color:#111827} table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #263238;padding:7px;font-size:12px} th{background:#0f62fe;color:#fff}
      h1{font-size:20px;margin:0 0 4px} p{margin:0 0 14px}
      </style></head><body><h1>SRI BALAJI ENTERPRISES</h1><p>Balance Sheet - ${dayjs(generatedDate || toDate).format("DD-MMM-YYYY")}</p>
      <table><tr><th>Section</th><th>Group</th><th>Account</th><th>Amount</th><th>Original Amount</th></tr>${rows}</table></body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Balance_Sheet.doc";
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderSection = (title, group, color) => {
    const groups = Object.entries(group || {});

    return (
      <Paper
        elevation={0}
        sx={{
          border: reportBorder,
          borderRadius: 0,
          overflow: "hidden",
          bgcolor: "#fff",
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
            color: "#fff",
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

        <TableContainer sx={scrollTableSx}>
          <Table size="small" stickyHeader sx={{ minWidth: { xs: 520, sm: 620 }, borderCollapse: "collapse" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    border: reportBorder,
                    bgcolor: "#e5e7eb",
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
                    border: reportBorder,
                    bgcolor: "#e5e7eb",
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
                    border: reportBorder,
                    bgcolor: "#e5e7eb",
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
                  <TableCell sx={{ border: reportBorder, py: 1.5, color: "text.secondary" }}>
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
                          border: reportBorder,
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
                          border: reportBorder,
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
                          "&:nth-of-type(even) td": { bgcolor: "#f8fafc" },
                        }}
                      >
                        <TableCell sx={{ border: reportBorder, width: { xs: 44, sm: 52 }, py: 0.65, px: { xs: 0.75, sm: 1 }, color: "text.secondary", fontSize: { xs: 12, sm: 13 } }}>
                          {index + 1}
                        </TableCell>
                        <TableCell sx={{ border: reportBorder, py: 0.65, px: { xs: 0.75, sm: 1 }, fontWeight: 600, fontSize: { xs: 12, sm: 13 }, overflowWrap: "anywhere" }}>
                          {row.code || rowName(row)}
                        </TableCell>
                        <TableCell align="right" sx={{ border: reportBorder, py: 0.65, px: { xs: 0.75, sm: 1 }, fontWeight: 800, fontSize: { xs: 12, sm: 13 }, whiteSpace: "nowrap" }}>
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
    <Box
      sx={{
        p: { xs: 1, sm: 1.5, md: 2.5, xl: 3 },
        bgcolor: "#eef2f6",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #d6dee8",
          borderRadius: 0,
          bgcolor: "#ffffff",
          overflow: "hidden",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
          width: "100%",
          maxWidth: { xs: "100%", xl: 1720 },
          mx: "auto",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 2.5 },
            py: 2,
            bgcolor: "#102a43",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            gap: 1.5,
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ minWidth: 0, flex: "1 1 280px" }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                lineHeight: 1.1,
                fontSize: { xs: 20, sm: 22, md: 24, xl: 28 },
                overflowWrap: "anywhere",
              }}
            >
              Balance Sheet
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.86,
                fontSize: { xs: 12, sm: 13, md: 14 },
                overflowWrap: "anywhere",
              }}
            >
              SRI BALAJI ENTERPRISES | Assets, liabilities, and balance difference
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<FileDownloadRounded />}
            disabled={!data.length}
            onClick={(event) => setDownloadAnchorEl(event.currentTarget)}
            sx={{
              borderRadius: 0,
              alignSelf: { xs: "stretch", sm: "center" },
              bgcolor: "#f8fafc",
              color: "#102a43",
              fontWeight: 900,
              boxShadow: "none",
              textTransform: "none",
              "&:hover": { bgcolor: "#e2e8f0", boxShadow: "none" },
              "&.Mui-disabled": { bgcolor: "rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.75)" },
            }}
          >
            Download
          </Button>
          <Menu
            anchorEl={downloadAnchorEl}
            open={Boolean(downloadAnchorEl)}
            onClose={closeDownloadMenu}
            PaperProps={{
              sx: {
                borderRadius: 0,
                minWidth: 190,
                border: "1px solid #cbd5e1",
                boxShadow: "0 14px 30px rgba(15, 23, 42, 0.16)",
              },
            }}
          >
            <MenuItem
              onClick={() => {
                closeDownloadMenu();
                handlePrint();
              }}
            >
              <ListItemIcon><PrintRounded fontSize="small" /></ListItemIcon>
              <ListItemText>Print</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleWord}>
              <ListItemIcon><ArticleRounded fontSize="small" sx={{ color: "#2859a8" }} /></ListItemIcon>
              <ListItemText>Word</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleExcel}>
              <ListItemIcon><TableViewRounded fontSize="small" sx={{ color: "#2e7d32" }} /></ListItemIcon>
              <ListItemText>Excel</ListItemText>
            </MenuItem>
            <MenuItem onClick={handlePdf}>
              <ListItemIcon><DescriptionRounded fontSize="small" sx={{ color: "#c62828" }} /></ListItemIcon>
              <ListItemText>PDF</ListItemText>
            </MenuItem>
          </Menu>
        </Box>

        <Box sx={{ p: { xs: 1.25, sm: 1.75, md: 2.5, xl: 3 } }}>
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
              sx={{
                width: { xs: "100%", md: 240, xl: 280 },
                "& .MuiOutlinedInput-root": { borderRadius: 0, bgcolor: "#fff" },
              }}
            />
            <Button
              variant="contained"
              onClick={fetchData}
              disabled={loading}
              startIcon={<RefreshRounded />}
              sx={{
                height: 40,
                borderRadius: 0,
                fontWeight: 800,
                width: { xs: "100%", md: "auto" },
                minWidth: { md: 132 },
                bgcolor: "#102a43",
                "&:hover": { bgcolor: "#173b5c" },
              }}
            >
              {loading ? "Generating..." : "Generate"}
            </Button>
            <Chip
              label={`Report Date: ${dayjs(generatedDate || toDate).format("DD-MMM-YYYY")}`}
              sx={{
                borderRadius: 0,
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
            <Alert severity="info" sx={{ borderRadius: 0 }}>
              Select a date and generate the balance sheet.
            </Alert>
          ) : (
            <Stack spacing={2}>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6} lg={4}>
                  <Paper elevation={0} sx={{ p: { xs: 1.25, md: 1.75 }, border: "1px solid #d6dee8", borderRadius: 0, bgcolor: "#f8fffd", height: "100%" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                      TOTAL ASSETS
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f766e", fontSize: { xs: 22, md: 24, xl: 30 }, overflowWrap: "anywhere" }}>
                      {money(totalAssets)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} lg={4}>
                  <Paper elevation={0} sx={{ p: { xs: 1.25, md: 1.75 }, border: "1px solid #d6dee8", borderRadius: 0, bgcolor: "#f8fbff", height: "100%" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                      TOTAL LIABILITIES
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#1d4ed8", fontSize: { xs: 22, md: 24, xl: 30 }, overflowWrap: "anywhere" }}>
                      {money(totalLiabilities)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                  <Paper elevation={0} sx={{ p: { xs: 1.25, md: 1.75 }, border: "1px solid #d6dee8", borderRadius: 0, bgcolor: difference === 0 ? "#f8fffd" : "#fffbeb", height: "100%" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                      DIFFERENCE
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: difference === 0 ? "#0f766e" : "#b45309", fontSize: { xs: 22, md: 24, xl: 30 }, overflowWrap: "anywhere" }}>
                      {money(difference)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={{ xs: 1.5, md: 2 }} alignItems="stretch">
                <Grid item xs={12} lg={6} sx={{ minHeight: 0, display: "flex" }}>
                  {renderSection("ASSETS", groupedData.ASSETS, "#0f766e")}
                </Grid>
                <Grid item xs={12} lg={6} sx={{ minHeight: 0, display: "flex" }}>
                  {renderSection("LIABILITIES", groupedData.LIABILITIES, "#1d4ed8")}
                </Grid>
              </Grid>

              <DataTable
                title="Balance Sheet - All Rows"
                subtitle="Complete API data in DataTable format with search, filters, pagination, print, and downloads."
                rows={normalizedRows}
                columns={detailColumns}
                loading={loading}
                height={{ xs: 520, md: 620, xl: 760 }}
                pageSize={25}
                getRowId={(row) => row.id}
                showCompany={false}
              />
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default BalanceSheet;
