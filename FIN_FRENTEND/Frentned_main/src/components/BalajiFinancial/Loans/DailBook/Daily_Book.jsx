import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { successToast, errorToast } from "toastify";

import Loans from "../Loans";

// ── MUI imports ────────────────────────────────────────────────
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

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

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

      const session = getSession();
      const response = await axios.get(
        `${API_BASE}/loadAllDayWiseTransactionsSummary/${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );

      const data = response.data;

      setOpeningBalance(data.openingBalance || 0);
      setTransactions(data.cashBookSumaryViewPojoList || []);

      successToast("Daily book loaded successfully");
    } catch (error) {
      console.error("Failed to load daily book:", error);
      errorToast("Failed to load daily book");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Total Credit / Debit calculation
  const totalCredit = transactions.reduce(
    (sum, item) => sum + (Number(item.credit) || 0),
    0
  );

  const totalDebit = transactions.reduce(
    (sum, item) => sum + (Number(item.debit) || 0),
    0
  );

  // Dummy Export Actions
  const handlePrint = () => successToast("Print feature coming soon 🖨️");
  const handleWord = () => successToast("Word export coming soon 📄");
  const handleExcel = () => successToast("Excel export coming soon 📊");
  const handlePdf = () => successToast("PDF export coming soon 📑");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 2, maxWidth: 1500, mx: "auto" }}>
        <Loans />


        {/* Top Filter Bar (Like Screenshot) */}
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
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{
                    minWidth: 220,
                    "& .MuiInputBase-root": {
                      backgroundColor: "#fff176", // yellow like screenshot
                      fontWeight: "bold",
                    },
                  }}
                />
              )}
            />

            <Button
              variant="contained"
              onClick={fetchDailyBook}
              disabled={loading || !transactionDate}
              sx={{ minWidth: 120 }}
            >
              {loading ? "Loading..." : "Generate"}
            </Button>

            {/* Export Icons Like Screenshot */}
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

          {/* Opening Balance */}
          <Typography variant="subtitle1" fontWeight="bold">
            Opening Balance :{" "}
            <span style={{ color: "green" }}>
              ₹ {Number(openingBalance).toLocaleString()}
            </span>
          </Typography>
        </Paper>

        {/* Loader */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Table */}
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
                    <TableCell>{item.transactionId}</TableCell>
                    <TableCell>{item.accountNumber}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.transactionType}</TableCell>
                    <TableCell>{item.particulars}</TableCell>

                    <TableCell align="right">
                      {item.credit ? Number(item.credit).toLocaleString() : "0"}
                    </TableCell>

                    <TableCell align="right">
                      {item.debit ? Number(item.debit).toLocaleString() : "0"}
                    </TableCell>

                    <TableCell>{item.user}</TableCell>
                  </TableRow>
                ))}

                {/* Total Row */}
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

                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* No Records */}
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
