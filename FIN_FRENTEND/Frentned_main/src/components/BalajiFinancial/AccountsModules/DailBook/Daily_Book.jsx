import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import {
  Box,
  Button,
  Divider,
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
} from "@mui/material";
import { PrintRounded } from "@mui/icons-material";
import { useAuth } from "src/utils/authStore";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { successToast, errorToast } from "toastify";
import {
  AppDatePicker,
  DataTable,
  PageHeader,
  TableExportMenu,
  printReport,
} from "src/components/ui";

const STORAGE_KEY = "dailyBook_lastSelectedDate";

const formatINR = (value) => `₹ ${Number(value || 0).toLocaleString("en-IN")}`;
const formatAmount = (value) => Number(value || 0).toLocaleString("en-IN");

// Account master codes, kept in the same buckets the backend reports use (CashBookRepo).
const MF_LOAN = "MF LOAN";
const DF_LOAN = "DF LOAN";
const MF_DOC_CHARGES = "MF DOC CHARGES";
const DF_DOC_CHARGES = "DF DOC CHARGES";
const DF_INTEREST = "DF INTEREST";
const MF_COLLECTION_CODES = ["MF LOAN INSTALLMENT", "MF INTEREST"];
const DF_COLLECTION_CODES = ["DF LOAN INSTALLMENT"];
const LATE_FEE_CODES = ["MF LATE FEE", "DF LATE FEE"];

const num = (value) => Number(value || 0);
const codeOf = (row) => String(row.accountMastercode || row.transactionType || "").trim().toUpperCase();

// Rebuilds the old cash book "User Collections" block from the day transactions.
// An MF loan payout is netted against its doc charges, a DF loan against doc charges and
// interest, and anything outside the loan/collection codes lands in the credits/debits column.
const buildUserCollections = (transactions) => {
  const byUser = new Map();
  const loanIndex = new Map();

  const getUser = (name) => {
    const key = name || "-";
    if (!byUser.has(key)) {
      byUser.set(key, {
        user: key,
        mfLoans: [],
        dfLoans: [],
        mfCollection: 0,
        dfCollection: 0,
        lateFee: 0,
        otherCredit: 0,
        otherDebit: 0,
      });
    }
    return byUser.get(key);
  };

  const getLoan = (userRow, kind, accountNumber) => {
    const key = `${userRow.user}|${kind}|${accountNumber}`;
    if (!loanIndex.has(key)) {
      const entry = { accountNumber, amount: 0, fee: 0, interest: 0 };
      loanIndex.set(key, entry);
      (kind === "MF" ? userRow.mfLoans : userRow.dfLoans).push(entry);
    }
    return loanIndex.get(key);
  };

  transactions.forEach((row) => {
    const userRow = getUser(row.user);
    const code = codeOf(row);
    const accountNumber = row.accountNumber || "-";

    if (code === MF_LOAN) {
      getLoan(userRow, "MF", accountNumber).amount += num(row.debit);
    } else if (code === MF_DOC_CHARGES) {
      getLoan(userRow, "MF", accountNumber).fee += num(row.credit);
    } else if (code === DF_LOAN) {
      getLoan(userRow, "DF", accountNumber).amount += num(row.debit);
    } else if (code === DF_DOC_CHARGES) {
      getLoan(userRow, "DF", accountNumber).fee += num(row.credit);
    } else if (code === DF_INTEREST) {
      getLoan(userRow, "DF", accountNumber).interest += num(row.credit);
    } else if (MF_COLLECTION_CODES.includes(code)) {
      userRow.mfCollection += num(row.credit);
    } else if (DF_COLLECTION_CODES.includes(code)) {
      userRow.dfCollection += num(row.credit);
    } else if (LATE_FEE_CODES.includes(code)) {
      userRow.lateFee += num(row.credit);
    } else {
      userRow.otherCredit += num(row.credit);
      userRow.otherDebit += num(row.debit);
    }
  });

  return [...byUser.values()].map((row) => {
    const mfLoanTotal = row.mfLoans.reduce((sum, loan) => sum + loan.amount - loan.fee, 0);
    const dfLoanTotal = row.dfLoans.reduce((sum, loan) => sum + loan.amount - loan.fee - loan.interest, 0);
    return {
      ...row,
      mfLoanTotal,
      dfLoanTotal,
      total:
        row.mfCollection +
        row.dfCollection +
        row.lateFee +
        row.otherCredit -
        mfLoanTotal -
        dfLoanTotal -
        row.otherDebit,
    };
  });
};

const SummaryLine = ({ label, value, strong = false, color }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.6 }}>
    <Typography variant="body2" color="text.secondary" fontWeight={strong ? 600 : 400}>
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={strong ? 700 : 600} color={color}>
      {formatINR(value)}
    </Typography>
  </Stack>
);

const DailyBook = () => {
  const { isAuthenticated } = useAuth();
  const [transactionDate, setTransactionDate] = useState(localStorage.getItem(STORAGE_KEY) || dayjs().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [deletedTransactions, setDeletedTransactions] = useState([]);
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

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      setLoading(true);
      const [response, deletedResponse] = await Promise.all([
        axios.get(`${API_BASE}/loadAllDayWiseTransactionsSummary/${transactionDate}`, { headers }),
        // Deleted rows come from a separate endpoint; a failure there must not blank the day book.
        axios.get(`${API_BASE}/loadAllDayWiseDeletedTransactions/${transactionDate}`, { headers }).catch(() => ({ data: [] })),
      ]);

      const data = response.data || {};
      setOpeningBalance(data.openingBalance || 0);
      setTransactions((data.cashBookSumaryViewPojoList || []).map((item, index) => ({ id: item.transactionId || index + 1, sno: index + 1, ...item })));
      setCredits(data.credits || 0);
      setDebits(data.debits || 0);
      setClosingBalance(data.closingBalance || 0);
      setDeletedTransactions((deletedResponse.data || []).map((item, index) => ({ id: item.transactionId || index + 1, sno: index + 1, ...item })));
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

  // The cash book has no separate bank ledger, so the whole closing balance sits in hand.
  const cashInHand = closingBalance;
  const cashInBank = 0;

  const userCollections = useMemo(() => buildUserCollections(transactions), [transactions]);

  const collectionTotals = useMemo(
    () =>
      userCollections.reduce(
        (acc, row) => ({
          mfLoanTotal: acc.mfLoanTotal + row.mfLoanTotal,
          dfLoanTotal: acc.dfLoanTotal + row.dfLoanTotal,
          mfCollection: acc.mfCollection + row.mfCollection,
          dfCollection: acc.dfCollection + row.dfCollection,
          lateFee: acc.lateFee + row.lateFee,
          otherCredit: acc.otherCredit + row.otherCredit,
          otherDebit: acc.otherDebit + row.otherDebit,
          total: acc.total + row.total,
        }),
        { mfLoanTotal: 0, dfLoanTotal: 0, mfCollection: 0, dfCollection: 0, lateFee: 0, otherCredit: 0, otherDebit: 0, total: 0 }
      ),
    [userCollections]
  );

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

  const deletedColumns = [
    { field: "sno", headerName: "S.No", width: 80 },
    { field: "transactionId", headerName: "Trans ID", width: 130 },
    { field: "accountNumber", headerName: "Acc. No", width: 130 },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1 },
    { field: "transactionType", headerName: "Type", width: 160 },
    { field: "particulars", headerName: "Particulars", minWidth: 180, flex: 1 },
    { field: "credit", headerName: "Credit", width: 130, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value) },
    { field: "debit", headerName: "Debit", width: 130, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value) },
    { field: "deletedDate", headerName: "Deleted Date", width: 180 },
    { field: "deletedByUser", headerName: "Deleted By", width: 140 },
  ];

  const exportFileName = `daily-book-${transactionDate || dayjs().format("YYYY-MM-DD")}`;

  // Printed above the table on every download / print: the day, then the balances.
  const reportPeriod = useMemo(
    () => (transactionDate ? { label: "Daily Book Date", fromDate: transactionDate } : undefined),
    [transactionDate]
  );

  const reportMeta = useMemo(
    () => [
      { label: "Opening Balance", value: formatINR(openingBalance) },
      { label: "Closing Balance", value: formatINR(closingBalance) },
      { label: "Records", value: transactions.length },
    ],
    [openingBalance, closingBalance, transactions.length]
  );

  // The balance block that sits inside the table. Shared with the exports so a
  // downloaded or printed book shows exactly the same figures as the screen.
  const reportSummary = useMemo(
    () => [
      { label: "Opening Balance", value: openingBalance },
      { label: "Credits", value: credits },
      { label: "Debits", value: debits },
      { label: "Closing Balance", value: closingBalance },
    ],
    [openingBalance, credits, debits, closingBalance]
  );

  const reportOptions = useMemo(
    () => ({ period: reportPeriod, meta: reportMeta, summary: reportSummary }),
    [reportPeriod, reportMeta, reportSummary]
  );

  const handlePrint = () => {
    if (!rows.length) {
      errorToast("Nothing to print. Generate the daily book first.");
      return;
    }
    printReport(rows, columns, exportFileName, reportOptions);
  };

  const cellSx = { fontSize: 13, whiteSpace: "nowrap" };
  const totalCellSx = { ...cellSx, fontWeight: 700 };

  return (
    <Stack spacing={2.5}>
      {/* Download / Print sit at the top beside Refresh, so the whole book can be
          taken away without scrolling down to the grid toolbar. */}
      <PageHeader
        title="Daily Book"
        subtitle="Day-wise transactions, opening balance, credits, debits, and closing balance."
        totalCount={transactions.length}
        onRefresh={fetchDailyBook}
        loading={loading}
        actions={
          <>
            <TableExportMenu
              rows={rows}
              columns={columns}
              fileName={exportFileName}
              reportOptions={reportOptions}
            />
            <Button
              variant="outlined"
              startIcon={<PrintRounded />}
              onClick={handlePrint}
              disabled={loading || !rows.length}
            >
              Print
            </Button>
          </>
        }
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
      {/* Cash position and day balance, laid out like the old cash book report. */}
      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <Paper className="enterprise-card" elevation={0} sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Cash Position</Typography>
            <SummaryLine label="Cash in Hand" value={cashInHand} />
            <SummaryLine label="Cash in Bank" value={cashInBank} />
            <Divider sx={{ my: 0.5 }} />
            <SummaryLine label="Total" value={cashInHand + cashInBank} strong color="primary.main" />
          </Paper>
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <Paper className="enterprise-card" elevation={0} sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Day Balance</Typography>
            <SummaryLine label="Opening Balance" value={openingBalance} />
            <SummaryLine label="Credits (+)" value={credits} color="success.main" />
            <SummaryLine label="Debits (-)" value={debits} color="error.main" />
            <Divider sx={{ my: 0.5 }} />
            <SummaryLine label="Closing Balance" value={closingBalance} strong color="primary.main" />
          </Paper>
        </Grid>
      </Grid>
      {/* <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>User Collections</Typography>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>MF Loans (Amount - Proc Fee)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>DF Loans (Amount - Proc Fee - Interest)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>MF Coll.</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>DF Coll.</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Late Fee</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Credits / Debits</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userCollections.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    No collections for this date
                  </TableCell>
                </TableRow>
              )}
              {userCollections.map((row) => (
                <TableRow key={row.user} hover>
                  <TableCell sx={cellSx}>{row.user}</TableCell>
                  <TableCell sx={cellSx}>
                    {row.mfLoans.map((loan) => (
                      <Typography key={loan.accountNumber} variant="caption" display="block" color="text.secondary">
                        {`${loan.accountNumber} : ${formatAmount(loan.amount)} - ${formatAmount(loan.fee)} = ${formatAmount(loan.amount - loan.fee)}`}
                      </Typography>
                    ))}
                    <Box sx={{ textAlign: "right", fontWeight: 600 }}>{formatAmount(row.mfLoanTotal)}</Box>
                  </TableCell>
                  <TableCell sx={cellSx}>
                    {row.dfLoans.map((loan) => (
                      <Typography key={loan.accountNumber} variant="caption" display="block" color="text.secondary">
                        {`${loan.accountNumber} : ${formatAmount(loan.amount)} - ${formatAmount(loan.fee)} - ${formatAmount(loan.interest)} = ${formatAmount(loan.amount - loan.fee - loan.interest)}`}
                      </Typography>
                    ))}
                    <Box sx={{ textAlign: "right", fontWeight: 600 }}>{formatAmount(row.dfLoanTotal)}</Box>
                  </TableCell>
                  <TableCell align="right" sx={cellSx}>{formatAmount(row.mfCollection)}</TableCell>
                  <TableCell align="right" sx={cellSx}>{formatAmount(row.dfCollection)}</TableCell>
                  <TableCell align="right" sx={cellSx}>{formatAmount(row.lateFee)}</TableCell>
                  <TableCell align="right" sx={cellSx}>
                    <Box>{formatAmount(row.otherCredit)}</Box>
                    <Box>{formatAmount(row.otherDebit)}</Box>
                  </TableCell>
                  <TableCell align="right" sx={{ ...totalCellSx, color: row.total < 0 ? "error.main" : "text.primary" }}>
                    {formatAmount(row.total)}
                  </TableCell>
                </TableRow>
              ))}
              {userCollections.length > 0 && (
                <TableRow>
                  <TableCell sx={totalCellSx}>Total</TableCell>
                  <TableCell align="right" sx={totalCellSx}>{formatAmount(collectionTotals.mfLoanTotal)}</TableCell>
                  <TableCell align="right" sx={totalCellSx}>{formatAmount(collectionTotals.dfLoanTotal)}</TableCell>
                  <TableCell align="right" sx={totalCellSx}>{formatAmount(collectionTotals.mfCollection)}</TableCell>
                  <TableCell align="right" sx={totalCellSx}>{formatAmount(collectionTotals.dfCollection)}</TableCell>
                  <TableCell align="right" sx={totalCellSx}>{formatAmount(collectionTotals.lateFee)}</TableCell>
                  <TableCell align="right" sx={totalCellSx}>
                    <Box>{formatAmount(collectionTotals.otherCredit)}</Box>
                    <Box>{formatAmount(collectionTotals.otherDebit)}</Box>
                  </TableCell>
                  <TableCell align="right" sx={{ ...totalCellSx, color: collectionTotals.total < 0 ? "error.main" : "text.primary" }}>
                    {formatAmount(collectionTotals.total)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper> */}
      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        title="Daily Book Transactions"
        subtitle="Day-wise credits and debits for the selected date."
        height={580}
        period={reportPeriod}
        reportMeta={reportMeta}
        summary={reportSummary}
      />
      {/* <Grid
          size={{
            xs: 12,
            md: 6
          }}>
          <Paper className="enterprise-card" elevation={0} sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Day Balance</Typography>
            <SummaryLine label="Opening Balance" value={openingBalance} />
            <SummaryLine label="Credits (+)" value={credits} color="success.main" />
            <SummaryLine label="Debits (-)" value={debits} color="error.main" />
            <Divider sx={{ my: 0.5 }} />
            <SummaryLine label="Closing Balance" value={closingBalance} strong color="primary.main" />
          </Paper>
        </Grid> */}
    </Stack>
  );
};

export default DailyBook;
