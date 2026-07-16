import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useAuth } from "src/utils/authStore";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { successToast, errorToast } from "toastify";
import { AppDatePicker, DataTable, PageHeader } from "src/components/ui";

const STORAGE_KEY = "dailyBook_lastSelectedDate";

const formatINR = (value) => `₹ ${Number(value || 0).toLocaleString("en-IN")}`;

const DailyBook = () => {
  const { isAuthenticated } = useAuth();
  const [transactionDate, setTransactionDate] = useState(localStorage.getItem(STORAGE_KEY) || dayjs().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [credits, setCredits] = useState(0);
  const [debits, setDebits] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);

  useEffect(() => {
    if (transactionDate) localStorage.setItem(STORAGE_KEY, transactionDate);
  }, [transactionDate]);

  const fetchDailyBook = async () => {
    if (!transactionDate) {
      errorToast("Please select a transaction date");
      return;
    }

    const token = getSession()?.token || getSession("token") || "";
    if (!token) {
      errorToast("Authentication token not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/loadAllDayWiseTransactionsSummary/${transactionDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data || {};
      setOpeningBalance(data.openingBalance || 0);
      setTransactions((data.cashBookSumaryViewPojoList || []).map((item, index) => ({ id: item.transactionId || index + 1, sno: index + 1, ...item })));
      setCredits(data.credits || 0);
      setDebits(data.debits || 0);
      setClosingBalance(data.closingBalance || 0);
      successToast("Daily book loaded successfully");
    } catch (error) {
      console.error("Failed to load daily book:", error);
      errorToast(error.response?.status === 401 ? "Session expired. Please login again." : "Failed to load daily book");
    } finally {
      setLoading(false);
    }
  };

  const totalCredit = transactions.reduce((sum, item) => sum + (Number(item.credit) || 0), 0);
  const totalDebit = transactions.reduce((sum, item) => sum + (Number(item.debit) || 0), 0);
  const rows = transactions.length
    ? [...transactions, { id: "total", sno: "", particulars: "TOTAL", credit: totalCredit, debit: totalDebit }]
    : transactions;

  const columns = [
    { field: "sno", headerName: "S.No", width: 80 },
    { field: "transactionId", headerName: "Trans ID", width: 130 },
    { field: "accountNumber", headerName: "Acc. No", width: 130 },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1 },
    { field: "transactionType", headerName: "Type", width: 140 },
    { field: "accountMastercode", headerName: "Account Master Code", width: 190 },
    { field: "particulars", headerName: "Particulars", minWidth: 200, flex: 1 },
    { field: "credit", headerName: "Credit", width: 130, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value) },
    { field: "debit", headerName: "Debit", width: 130, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value) },
    { field: "user", headerName: "User", width: 130 },
  ];

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title="Daily Book"
        subtitle="Day-wise transactions, opening balance, credits, debits, and closing balance."
        totalCount={transactions.length}
        onRefresh={fetchDailyBook}
        loading={loading}
      />
      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <AppDatePicker label="Transaction Date" value={transactionDate} onChange={setTransactionDate} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <Button fullWidth variant="contained" onClick={fetchDailyBook} disabled={loading || !transactionDate || !isAuthenticated}>
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Grid container spacing={2}>
        {[
          ["Opening Balance", openingBalance, "success"],
          ["Total Credits", credits, "primary"],
          ["Total Debits", debits, "error"],
          ["Closing Balance", closingBalance, "secondary"],
        ].map(([label, value, color]) => (
          <Grid
            key={label}
            size={{
              xs: 12,
              sm: 6,
              lg: 3
            }}>
            <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">{label}</Typography>
              <Typography variant="h6" color={`${color}.main`}>{formatINR(value)}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        title="Daily Book Transactions"
        subtitle="Date-only MUI calendar filter with fast table, search, Excel, PDF, Word, and print."
        height={580}
      />
    </Stack>
  );
};

export default DailyBook;
