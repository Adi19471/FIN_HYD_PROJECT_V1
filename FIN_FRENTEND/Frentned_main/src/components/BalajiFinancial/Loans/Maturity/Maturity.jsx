import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AssessmentRounded, RefreshRounded } from "@mui/icons-material";
import axios from "axios";
import dayjs from "dayjs";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { AppDatePicker, DataTable, useDateRange, DROPDOWN_MENU_PROPS } from "src/components/ui";

const loanTypes = [
  { label: "Daily Finance", value: "DAILY_FINANCE" },
  { label: "Monthly Finance", value: "MONTHLY_FINANCE" },
];

const money = (value) => Number(value || 0).toLocaleString("en-IN");

const Maturity = () => {
  const [loanType, setLoanType] = useState("MONTHLY_FINANCE");
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRange("", "");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = getSession("token");
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token || ""}`,
      "Content-Type": "application/json",
    }),
    [token]
  );

  const fetchMaturityLoans = async () => {
    if (!loanType || !fromDate || !toDate) {
      setError("Please select loan type, from date, and to date.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${API_BASE}/maturityLoansList`,
        { loanType, fromDate, toDate },
        { headers }
      );
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setData([]);
      setError(err.response?.data?.message || "Failed to fetch maturity loans.");
    } finally {
      setLoading(false);
    }
  };

  const rows = useMemo(
    () =>
      data.map((row, index) => ({
        id: row.loanId || index + 1,
        sno: row.sno || index + 1,
        loanId: row.loanId || "-",
        customerName: row.customerName || "-",
        startDate: row.startDate ? dayjs(row.startDate, "DD-MM-YYYY").format("DD-MMM-YYYY") : "-",
        endDate: row.endDate ? dayjs(row.endDate, "DD-MM-YYYY").format("DD-MMM-YYYY") : "-",
        amount: Number(row.amount || 0),
        installmentAmount: Number(row.installmentAmount || 0),
        amountPaid: Number(row.amountPaid || 0),
        installmentDue: Number(row.installmentDue || 0),
        noOfInstallmentsPending: row.noOfInstallmentsPending || 0,
      })),
    [data]
  );

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          amount: acc.amount + Number(row.amount || 0),
          paid: acc.paid + Number(row.amountPaid || 0),
          due: acc.due + Number(row.installmentDue || 0),
        }),
        { amount: 0, paid: 0, due: 0 }
      ),
    [rows]
  );

  const columns = [
    { field: "sno", headerName: "S No", width: 80 },
    { field: "loanId", headerName: "Loan ID", width: 130 },
    { field: "customerName", headerName: "Customer", flex: 1, minWidth: 200 },
    { field: "startDate", headerName: "Start", width: 140 },
    { field: "endDate", headerName: "End", width: 140 },
    { field: "amount", headerName: "Amount", width: 140, valueFormatter: (value) => money(value) },
    { field: "installmentAmount", headerName: "Inst. Amt", width: 140, valueFormatter: (value) => money(value) },
    { field: "amountPaid", headerName: "Paid", width: 140, valueFormatter: (value) => money(value) },
    { field: "installmentDue", headerName: "Due", width: 130, valueFormatter: (value) => money(value) },
    { field: "noOfInstallmentsPending", headerName: "Pending", width: 120 },
  ];

  const selectedLoanLabel = loanTypes.find((type) => type.value === loanType)?.label || loanType;

  return (
    <Stack spacing={2.5} sx={{ p: { xs: 1.5, md: 2.5 } }}>
      <Paper className="enterprise-card" elevation={0} sx={{ p: 2.5 }}>
        <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" spacing={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <AssessmentRounded color="primary" />
              <Typography variant="h5">Maturity Ledger Report</Typography>
              <Chip size="small" label={selectedLoanLabel} color="primary" variant="outlined" />
              <Chip size="small" label={`${rows.length} records`} variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Use MUI calendar filters and select loan type directly without oversized dropdowns.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap alignItems="center">
            <TextField
              select
              label="Loan Type"
              size="small"
              value={loanType}
              onChange={(event) => setLoanType(event.target.value)}
              SelectProps={{ MenuProps: DROPDOWN_MENU_PROPS }}
              sx={{ minWidth: 220 }}
            >
              {loanTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
            <AppDatePicker label="From Date" value={fromDate} onChange={setFromDate} />
            <AppDatePicker label="To Date" value={toDate} onChange={setToDate} minDate={toDateMin} maxDate={toDateMax} />
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <RefreshRounded />}
              onClick={fetchMaturityLoans}
              disabled={loading}
            >
              {loading ? "Loading" : "Generate"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
      {error && (
        <Paper className="enterprise-card" elevation={0} sx={{ p: 2, borderColor: "error.light" }}>
          <Typography color="error.main" fontWeight={800}>{error}</Typography>
        </Paper>
      )}
      <Grid container spacing={2}>
        {[
          { label: "Total Amount", value: totals.amount },
          { label: "Total Paid", value: totals.paid },
          { label: "Total Due", value: totals.due },
        ].map((item) => (
          <Grid
            key={item.label}
            size={{
              xs: 12,
              md: 4
            }}>
            <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">{item.label}</Typography>
              <Typography variant="h5">Rs {money(item.value)}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        height={560}
        title={`Maturity Ledger - ${selectedLoanLabel}`}
        subtitle="Search, row count, PDF, Excel, Word, and print are available here."
        pageSize={10}
      />
    </Stack>
  );
};

export default Maturity;
