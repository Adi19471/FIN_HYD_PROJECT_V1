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
import { AppDatePicker } from "src/components/ui";

const reportBorder = "1px solid #263238";

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
  { field: "amount", headerName: "Amount" },
];

const BalanceSheet = () => {
  const [toDate, setToDate] = useState(dayjs());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedDate, setGeneratedDate] = useState(null);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);

  const token = getSession()?.token || getSession("token") || "";

  const groupedData = useMemo(() => {
    const result = { ASSETS: {}, LIABILITIES: {} };

    data.forEach((item) => {
      const section = normalizeType(item.type);
      const group = item.masterCode || item.accountMasterCode || "OTHERS";
      if (!result[section][group]) result[section][group] = [];
      result[section][group].push(item);
    });

    return result;
  }, [data]);

  const getSubTotal = (items = []) =>
    items.reduce((sum, item) => sum + amountValue(item.amount), 0);

  const getMainTotal = (group = {}) =>
    Object.values(group)
      .flat()
      .reduce((sum, item) => sum + amountValue(item.amount), 0);

  const totalAssets = getMainTotal(groupedData.ASSETS);
  const totalLiabilities = getMainTotal(groupedData.LIABILITIES);
  const difference = Math.abs(totalAssets - totalLiabilities);

  const exportRows = useMemo(
    () =>
      ["ASSETS", "LIABILITIES"].flatMap((section) =>
        Object.entries(groupedData[section] || {}).flatMap(([masterCode, rows]) =>
          rows.map((row) => ({
            section,
            masterCode,
            code: rowName(row),
            amount: money(row.amount),
          }))
        )
      ),
    [groupedData]
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
          `<tr><td>${row.section}</td><td>${row.masterCode}</td><td>${row.code}</td><td style="text-align:right">${row.amount}</td></tr>`
      )
      .join("");
    const html = `<html><head><meta charset="utf-8"><style>
      body{font-family:Arial;padding:20px;color:#111827} table{width:100%;border-collapse:collapse}
      th,td{border:1px solid #263238;padding:7px;font-size:12px} th{background:#0f62fe;color:#fff}
      h1{font-size:20px;margin:0 0 4px} p{margin:0 0 14px}
      </style></head><body><h1>SRI BALAJI ENTERPRISES</h1><p>Balance Sheet - ${dayjs(generatedDate || toDate).format("DD-MMM-YYYY")}</p>
      <table><tr><th>Section</th><th>Group</th><th>Account</th><th>Amount</th></tr>${rows}</table></body></html>`;
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
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 1,
            bgcolor: color,
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 900, fontSize: 15 }}>{title}</Typography>
          <Typography sx={{ fontWeight: 900, fontSize: 15 }}>
            Total: {money(getMainTotal(group))}
          </Typography>
        </Box>

        <TableContainer sx={{ maxHeight: 520 }}>
          <Table size="small" stickyHeader sx={{ borderCollapse: "collapse" }}>
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
                          bgcolor: alpha(color, 0.11),
                          fontWeight: 900,
                        }}
                      >
                        {String(masterCode).toUpperCase()}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          border: reportBorder,
                          py: 0.65,
                          bgcolor: alpha(color, 0.11),
                          fontWeight: 900,
                          width: 150,
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
                        <TableCell sx={{ border: reportBorder, width: 52, py: 0.65, color: "text.secondary" }}>
                          {index + 1}
                        </TableCell>
                        <TableCell sx={{ border: reportBorder, py: 0.65, fontWeight: 600 }}>
                          {rowName(row)}
                        </TableCell>
                        <TableCell align="right" sx={{ border: reportBorder, py: 0.65, fontWeight: 800 }}>
                          {money(row.amount)}
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
    <Box sx={{ p: { xs: 1.5, md: 2.5 }, bgcolor: "#eef2f6", minHeight: "100vh" }}>
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #d6dee8",
          borderRadius: 0,
          bgcolor: "#ffffff",
          overflow: "hidden",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
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
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              Balance Sheet
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.86 }}>
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

        <Box sx={{ p: { xs: 2, md: 2.5 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ xs: "stretch", md: "center" }}
            sx={{ mb: 2 }}
          >
            <AppDatePicker
              label="Date"
              value={toDate}
              onChange={setToDate}
              sx={{
                width: { xs: "100%", md: 240 },
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
                bgcolor: "#102a43",
                "&:hover": { bgcolor: "#173b5c" },
              }}
            >
              {loading ? "Generating..." : "Generate"}
            </Button>
            <Chip
              label={`Report Date: ${dayjs(generatedDate || toDate).format("DD-MMM-YYYY")}`}
              sx={{ borderRadius: 0, fontWeight: 800, alignSelf: { xs: "flex-start", md: "center" } }}
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
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 1.75, border: "1px solid #d6dee8", borderRadius: 0, bgcolor: "#f8fffd" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                      TOTAL ASSETS
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f766e" }}>
                      {money(totalAssets)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 1.75, border: "1px solid #d6dee8", borderRadius: 0, bgcolor: "#f8fbff" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                      TOTAL LIABILITIES
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#1d4ed8" }}>
                      {money(totalLiabilities)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 1.75, border: "1px solid #d6dee8", borderRadius: 0, bgcolor: difference === 0 ? "#f8fffd" : "#fffbeb" }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>
                      DIFFERENCE
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: difference === 0 ? "#0f766e" : "#b45309" }}>
                      {money(difference)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                  {renderSection("ASSETS", groupedData.ASSETS, "#0f766e")}
                </Grid>
                <Grid item xs={12} lg={6}>
                  {renderSection("LIABILITIES", groupedData.LIABILITIES, "#1d4ed8")}
                </Grid>
              </Grid>
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default BalanceSheet;
