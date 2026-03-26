import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { successToast, errorToast } from "toastify";

// Lazy load
const Loans = lazy(() => import("../Loans"));

// MUI imports
import {
  Box,
  Paper,
  Typography,
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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const STORAGE_KEY = "dailyBook_lastSelectedDate";

const getHeaders = () => {
  const session = getSession();
  const token = session?.token || "";

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const DailyBook = () => {
  // Initialize with last saved date or today
  const getInitialDate = () => {
    const savedDate = localStorage.getItem(STORAGE_KEY);
    if (savedDate) {
      return dayjs(savedDate);
    }
    return dayjs(); // today
  };

  const [transactionDate, setTransactionDate] = useState(getInitialDate());
  const [loading, setLoading] = useState(false);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [credits, setCredits] = useState(0);
  const [debits, setDebits] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);

  // Save selected date to localStorage whenever it changes
  useEffect(() => {
    if (transactionDate) {
      localStorage.setItem(STORAGE_KEY, transactionDate.format("YYYY-MM-DD"));
    }
  }, [transactionDate]);

  const fetchDailyBook = async () => {
    if (!transactionDate) {
      errorToast("Please select a transaction date");
      return;
    }

    const formattedDate = dayjs(transactionDate).format("YYYY-MM-DD");

    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE}/loadAllDayWiseTransactionsSummary/${formattedDate}`,
        getHeaders()
      );

      const data = response.data;

      setOpeningBalance(data.openingBalance || 0);
      setTransactions(data.cashBookSumaryViewPojoList || []);
      setCredits(data.credits || 0);
      setDebits(data.debits || 0);
      setClosingBalance(data.closingBalance || 0);

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

  // Total calculations from table data
  const totalCredit = transactions.reduce(
    (sum, item) => sum + (Number(item.credit) || 0),
    0
  );
  const totalDebit = transactions.reduce(
    (sum, item) => sum + (Number(item.debit) || 0),
    0
  );

  // Export handlers (placeholder)
  const handlePrint = () => successToast("Print feature coming soon 🖨️");
  const handleWord = () => successToast("Word export coming soon 📄");
  const handleExcel = () => successToast("Excel export coming soon 📊");
  const handlePdf = () => successToast("PDF export coming soon 📑");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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

            <DatePicker
              value={transactionDate}
              onChange={(newValue) => setTransactionDate(newValue)}
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    minWidth: 220,
                    "& .MuiInputBase-root": {
                      backgroundColor: "#fff176",
                      fontWeight: "bold",
                    },
                  },
                },
              }}
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

          <Box sx={{ mt: 3 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Paper sx={{ p: 2, flex: 1, background: "#e8f5e9" }}>
                <Typography variant="subtitle2">Opening Balance</Typography>
                <Typography variant="h6" fontWeight="bold">
                  ₹ {Number(openingBalance).toLocaleString()}
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, flex: 1, background: "#e3f2fd" }}>
                <Typography variant="subtitle2">Total Credits</Typography>
                <Typography variant="h6" fontWeight="bold" color="green">
                  ₹ {Number(credits).toLocaleString()}
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, flex: 1, background: "#ffebee" }}>
                <Typography variant="subtitle2">Total Debits</Typography>
                <Typography variant="h6" fontWeight="bold" color="red">
                  ₹ {Number(debits).toLocaleString()}
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, flex: 1, background: "#ede7f6" }}>
                <Typography variant="subtitle2">Closing Balance</Typography>
                <Typography variant="h6" fontWeight="bold" color="blue">
                  ₹ {Number(closingBalance).toLocaleString()}
                </Typography>
              </Paper>
            </Stack>
          </Box>
        </Paper>

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
    </LocalizationProvider>
  );
};

export default DailyBook;