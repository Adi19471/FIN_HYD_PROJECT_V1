import React, { useState, useCallback, lazy, Suspense } from "react";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { successToast, errorToast } from "toastify";

// Lazy load the Loans component for better performance
const Loans = lazy(() => import("../Loans"));

// MUI imports
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DescriptionIcon from "@mui/icons-material/Description";
import GridOnIcon from "@mui/icons-material/GridOn";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import dayjs from "dayjs";

// ── Reusable headers ────────────────────────────────────────
const getHeaders = () => {
  const session = getSession();           // ← get once
  const token = session?.token || "";     // safe access

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const DailyBook = () => {
  const [transactionDate, setTransactionDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const fetchDailyBook = async () => {
    if (!transactionDate) {
      errorToast("Please select a transaction date");
      return;
    }

    const formattedDate = dayjs(transactionDate).format("YYYY-MM-DD");

    try {
      setLoading(true);

      // Use the reusable getHeaders()
      const response = await axios.get(
        `${API_BASE}/loadAllDayWiseTransactionsSummary/${formattedDate}`,
        getHeaders()                      // ← this was missing!
      );

      const data = response.data;
      setOpeningBalance(data.openingBalance || 0);
      setTransactions(data.cashBookSumaryViewPojoList || []); // note possible typo: cashBookSummary...
      successToast("Daily book loaded successfully");
    } catch (error) {
      console.error("Failed to load daily book:", error);
      if (error.response?.status === 401) {
        errorToast("Session expired. Please login again.");
      } else {
        errorToast("Failed to load daily book");
      }
    } finally {
      setLoading(false);
    }
  };

  // Total calculations
  const totalCredit = transactions.reduce(
    (sum, item) => sum + (Number(item.credit) || 0),
    0
  );
  const totalDebit = transactions.reduce(
    (sum, item) => sum + (Number(item.debit) || 0),
    0
  );

  // Placeholder export handlers
  const handlePrint = () => successToast("Print feature coming soon 🖨️");
  const handleWord  = () => successToast("Word export coming soon 📄");
  const handleExcel = () => successToast("Excel export coming soon 📊");
  const handlePdf   = () => successToast("PDF export coming soon 📑");

  return (
    <Box sx={{ p: 2, maxWidth: 1500, mx: "auto", position: "relative" }}>
      <Loans />

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            borderRadius: 2,
          }}
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      )}

      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <Typography fontWeight="bold">Date :</Typography>

          <TextField
            type="date"
            value={transactionDate ? dayjs(transactionDate).format("YYYY-MM-DD") : ""}
            onChange={(e) => setTransactionDate(e.target.value ? dayjs(e.target.value) : null)}
            size="small"
            sx={{
              minWidth: 220,
              "& .MuiInputBase-root": {
                backgroundColor: "#fff176",
                fontWeight: "bold",
              },
            }}
            InputLabelProps={{ shrink: true }}
          />

          <Button
            variant="contained"
            onClick={fetchDailyBook}
            disabled={loading || !transactionDate}
            sx={{ minWidth: 120 }}
          >
            {loading ? "Loading..." : "Generate"}
          </Button>

          <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
            <Tooltip title="Print">
              <IconButton color="primary" onClick={handlePrint}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Word">
              <IconButton color="info" onClick={handleWord}>
                <DescriptionIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Excel">
              <IconButton color="success" onClick={handleExcel}>
                <GridOnIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export PDF">
              <IconButton color="error" onClick={handlePdf}>
                <PictureAsPdfIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight="bold">
          Opening Balance :{" "}
          <span style={{ color: "green" }}>
            ₹ {Number(openingBalance).toLocaleString()}
          </span>
        </Typography>
      </Paper>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && transactions.length > 0 && (
        <TableContainer
          component={Paper}
          elevation={2}
          sx={{ mt: 3, borderRadius: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#cfe8ff" }}>
                <TableCell><b>S.No</b></TableCell>
                <TableCell><b>Trans ID</b></TableCell>
                <TableCell><b>Acc. No</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Type</b></TableCell>
                <TableCell><b>Particulars</b></TableCell>
                <TableCell align="right"><b>Credit</b></TableCell>
                <TableCell align="right"><b>Debit</b></TableCell>
                <TableCell><b>User</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((item, index) => (
                <TableRow
                  key={item.transactionId || index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f5fbff",
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.transactionId || "-"}</TableCell>
                  <TableCell>{item.accountNumber || "-"}</TableCell>
                  <TableCell>{item.name || "-"}</TableCell>
                  <TableCell>{item.transactionType || "-"}</TableCell>
                  <TableCell>{item.particulars || "-"}</TableCell>
                  <TableCell align="right">
                    {item.credit ? Number(item.credit).toLocaleString() : "0"}
                  </TableCell>
                  <TableCell align="right">
                    {item.debit ? Number(item.debit).toLocaleString() : "0"}
                  </TableCell>
                  <TableCell>{item.user || "-"}</TableCell>
                </TableRow>
              ))}

              <TableRow sx={{ backgroundColor: "#bbdefb" }}>
                <TableCell colSpan={6} align="right">
                  <b>Total</b>
                </TableCell>
                <TableCell align="right">
                  <b>{totalCredit.toLocaleString()}</b>
                </TableCell>
                <TableCell align="right">
                  <b>{totalDebit.toLocaleString()}</b>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && transactions.length === 0 && transactionDate && (
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mt: 4 }}
        >
          No records found for the selected date.
        </Typography>
      )}
    </Box>
  );
};

export default DailyBook;