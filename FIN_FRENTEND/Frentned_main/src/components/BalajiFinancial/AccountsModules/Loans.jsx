import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AccountBalanceRounded,
  CalendarMonthRounded,
  FactCheckRounded,
  PaidRounded,
  ReceiptLongRounded,
  TrendingUpRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AppDatePicker, DataTable, PageHeader } from "src/components/ui";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const modules = [
  { title: "Daily Book", path: "/AccountsModules/DailyBook", icon: CalendarMonthRounded, note: "Day-wise cash movement and closing balance" },
  { title: "CB Ledger", path: "/AccountsModules/Cbledger", icon: ReceiptLongRounded, note: "Cash book credit, debit, and collection ledger" },
  { title: "Account Ledger", path: "/AccountsModules/AccountLedger", icon: AccountBalanceRounded, note: "All account balances or date range ledger" },
  { title: "Account Master Ledger", path: "/AccountsModules/AccountMasterLedger", icon: FactCheckRounded, note: "Master account statement with running balance" },
  { title: "User Collection Ledger", path: "/AccountsModules/Usercollectionledger", icon: PaidRounded, note: "User-wise daily and monthly collection totals" },
  { title: "Receipt Ledger", path: "/AccountsModules/ReciptLedger", icon: ReceiptLongRounded, note: "Receipt, installment, late fee, and balance register" },
  { title: "Distributed Loans", path: "/Loans/Distubuted", icon: TrendingUpRounded, note: "Disbursed loan list with paid and due totals" },
  { title: "Instalment Dues", path: "/Loans/InstalmentDues", icon: FactCheckRounded, note: "Pending installment dues by loan type and period" },
];

const sampleLoans = [
  { id: 1, loanId: "LN-1001", customerName: "Ravi Kumar", loanType: "Monthly Finance", startDate: "2026-05-01", endDate: "2026-11-01", amount: 50000, paid: 12000, due: 38000, status: "ACTIVE" },
  { id: 2, loanId: "LN-1002", customerName: "Suresh Traders", loanType: "Daily Finance", startDate: "2026-05-03", endDate: "2026-08-03", amount: 20000, paid: 8500, due: 11500, status: "ACTIVE" },
  { id: 3, loanId: "LN-1003", customerName: "Lakshmi Stores", loanType: "Monthly Finance", startDate: "2026-04-12", endDate: "2026-10-12", amount: 75000, paid: 75000, due: 0, status: "CLOSED" },
];

function StatCard({ title, value, icon: Icon, tone = "primary" }) {
  return (
    <Paper className="enterprise-card" elevation={0} sx={{ p: 2, height: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h5" sx={{ mt: 0.5 }}>{value}</Typography>
        </Box>
        <Box className="dashboard-module-icon" color={`${tone}.main`}>
          <Icon />
        </Box>
      </Stack>
    </Paper>
  );
}

export default function Loans() {
  const navigate = useNavigate();
  const [loanType, setLoanType] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredRows = useMemo(
    () =>
      sampleLoans.filter((row) => {
        const matchesType = loanType === "ALL" || row.loanType === loanType;
        const matchesFrom = !fromDate || row.startDate >= fromDate;
        const matchesTo = !toDate || row.startDate <= toDate;
        return matchesType && matchesFrom && matchesTo;
      }),
    [loanType, fromDate, toDate]
  );

  const columns = [
    { field: "loanId", headerName: "Loan ID", width: 120 },
    { field: "customerName", headerName: "Customer", minWidth: 190, flex: 1 },
    { field: "loanType", headerName: "Type", width: 160 },
    { field: "startDate", headerName: "Start Date", width: 130 },
    { field: "endDate", headerName: "End Date", width: 130 },
    { field: "amount", headerName: "Amount", width: 130, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value || 0) },
    { field: "paid", headerName: "Paid", width: 130, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value || 0) },
    { field: "due", headerName: "Due", width: 130, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value || 0) },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <span className={`finance-status ${params.value === "ACTIVE" ? "success" : "warning"}`}>
          {params.value}
        </span>
      ),
    },
  ];

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title="Loans Management"
        subtitle="Loan register, date-only filters, account ledgers, disbursed loans, dues, exports, and print actions."
        addButtonLabel="New Loan"
        onAddClick={() => navigate("/Loan")}
        totalCount={filteredRows.length}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Total Loans" value="156" icon={AccountBalanceRounded} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Portfolio Amount" value={formatINR(4520000)} icon={PaidRounded} tone="success" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Pending Dues" value={formatINR(684000)} icon={FactCheckRounded} tone="warning" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="This Month" value="89 loans" icon={TrendingUpRounded} />
        </Grid>
      </Grid>

      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField select label="Loan Type" value={loanType} onChange={(event) => setLoanType(event.target.value)} fullWidth size="small">
              <MenuItem value="ALL">All Loans</MenuItem>
              <MenuItem value="Daily Finance">Daily Finance</MenuItem>
              <MenuItem value="Monthly Finance">Monthly Finance</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <AppDatePicker label="From Date" value={fromDate} onChange={setFromDate} />
          </Grid>
          <Grid item xs={12} md={3}>
            <AppDatePicker label="To Date" value={toDate} onChange={setToDate} />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button fullWidth variant="outlined" onClick={() => { setLoanType("ALL"); setFromDate(""); setToDate(""); }}>
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Grid item xs={12} md={6} lg={3} key={module.path}>
              <Paper className="enterprise-card dashboard-module" elevation={0}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box className="dashboard-module-icon"><Icon /></Box>
                    <Typography variant="subtitle1">{module.title}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">{module.note}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button size="small" variant="contained" onClick={() => navigate(module.path)}>Open</Button>
                    <Chip size="small" label="Date only" variant="outlined" />
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <DataTable
        rows={filteredRows}
        columns={columns}
        title="Loan Details"
        subtitle="Fast MUI table format with date-only filters, search, Excel, PDF, Word, and print."
        height={520}
        pageSize={10}
      />
    </Stack>
  );
}
