import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  AccountBalanceRounded,
  AddCardRounded,
  ApprovalRounded,
  ArrowForwardRounded,
  CurrencyRupeeRounded,
  GroupsRounded,
  LaunchRounded,
  PaymentsRounded,
  ReceiptLongRounded,
  SavingsRounded,
  TrendingUpRounded,
  WarningAmberRounded,
} from "@mui/icons-material";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DataTable } from "src/components/ui";
import { COMPANY_ADDRESS, COMPANY_NAME } from "src/lib/company";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const kpis = [
  { title: "Portfolio Value", label: formatINR(18700000), delta: "+12.4%", icon: AccountBalanceRounded, tone: "#0f62fe" },
  { title: "Today Collection", label: formatINR(318000), delta: "+8.2%", icon: PaymentsRounded, tone: "#059669" },
  { title: "Pending Dues", label: formatINR(684000), delta: "42 cases", icon: WarningAmberRounded, tone: "#d97706" },
  { title: "Active Members", label: "928", delta: "+31 new", icon: GroupsRounded, tone: "#4338ca" },
];

const modules = [
  { title: "Customer Master", path: "/customer", note: "Profiles, KYC, search, export", icon: GroupsRounded },
  { title: "Daily Finance", path: "/Daily-Finace", note: "Daily loan register and filters", icon: CurrencyRupeeRounded },
  { title: "Monthly Finance", path: "/Monthly-Finance", note: "Monthly loan creation and reports", icon: AccountBalanceRounded },
  { title: "Quick Cash Book", path: "/Transactions/Quick_Cash_Book", note: "Fast transaction entry", icon: AddCardRounded },
  { title: "Daily Book", path: "/AccountsModules/DailyBook", note: "Cash movement and day close", icon: ReceiptLongRounded },
  { title: "Installment Dues", path: "/Loans/InstalmentDues", note: "Dues review and follow-up", icon: ApprovalRounded },
];

const cashflow = [
  { month: "Jan", income: 42, expense: 24 },
  { month: "Feb", income: 48, expense: 26 },
  { month: "Mar", income: 55, expense: 30 },
  { month: "Apr", income: 51, expense: 27 },
  { month: "May", income: 63, expense: 32 },
  { month: "Jun", income: 71, expense: 35 },
];

const collections = [
  { day: "Mon", value: 52 },
  { day: "Tue", value: 61 },
  { day: "Wed", value: 48 },
  { day: "Thu", value: 76 },
  { day: "Fri", value: 69 },
  { day: "Sat", value: 82 },
];

const transactions = [
  { id: "TXN-1048", customer: "Rajesh Kumar", type: "Receipt", amount: 18000, status: "Posted" },
  { id: "TXN-1047", customer: "Lakshmi Traders", type: "Loan", amount: 125000, status: "Approval" },
  { id: "TXN-1046", customer: "Mohan Rao", type: "Installment", amount: 9200, status: "Overdue" },
  { id: "TXN-1045", customer: "Sri Sai Stores", type: "Cashbook", amount: 44000, status: "Posted" },
  { id: "TXN-1044", customer: "Venkata Agency", type: "Receipt", amount: 26500, status: "Posted" },
];

const activity = [
  "Daily book closed by cashier",
  "Partner settlement request created",
  "Receipt ledger exported to Excel",
  "Customer KYC updated",
];

function KpiCard({ item }) {
  const Icon = item.icon;
  return (
    <Paper className="enterprise-card dashboard-kpi" elevation={0}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" color="text.secondary">{item.title}</Typography>
          <Typography variant="h5" sx={{ mt: 0.75 }}>{item.label}</Typography>
        </Box>
        <Box className="dashboard-kpi-icon" sx={{ color: item.tone, bgcolor: `${item.tone}18` }}>
          <Icon />
        </Box>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
        <Chip size="small" label={item.delta} color={item.tone === "#d97706" ? "warning" : "success"} />
        <Typography variant="caption" color="text.secondary">vs last cycle</Typography>
      </Stack>
    </Paper>
  );
}

function Panel({ title, subtitle, action, children }) {
  return (
    <Paper className="enterprise-card dashboard-panel" elevation={0}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
        </Box>
        {action}
      </Stack>
      {children}
    </Paper>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const openInNewTab = (path) => window.open(path, "_blank", "noopener,noreferrer");

  const transactionColumns = [
    { field: "id", headerName: "Txn ID", width: 120 },
    { field: "customer", headerName: "Customer", minWidth: 190, flex: 1 },
    { field: "type", headerName: "Type", width: 130 },
    {
      field: "amount",
      headerName: "Amount",
      width: 140,
      valueFormatter: (value) => formatINR(Number(value || 0)),
    },
    {
      field: "status",
      headerName: "Status",
      width: 125,
      renderCell: (params) => (
        <span className={`finance-status ${params.value === "Posted" ? "success" : params.value === "Approval" ? "warning" : "error"}`}>
          {params.value}
        </span>
      ),
    },
  ];

  return (
    <Stack spacing={2.5}>
      <Paper className="enterprise-card dashboard-hero" elevation={0}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={2.5} justifyContent="space-between" alignItems={{ lg: "center" }}>
          <Box>
            <Chip size="small" label={COMPANY_ADDRESS} color="primary" sx={{ mb: 1.5 }} />
            <Typography variant="h3">{COMPANY_NAME}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 780 }}>
              One admin workspace for collections, dues, ledgers, loans, reports, and daily cash operations.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button startIcon={<AddCardRounded />} variant="contained" onClick={() => navigate("/Transactions/Quick_Cash_Book")}>
              Quick Entry
            </Button>
            <Button startIcon={<ReceiptLongRounded />} variant="outlined" onClick={() => navigate("/AccountsModules/DailyBook")}>
              Daily Book
            </Button>
            <Button startIcon={<ApprovalRounded />} variant="outlined" onClick={() => navigate("/Loans/InstalmentDues")}>
              Dues Review
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={2}>
        {kpis.map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item.title}>
            <KpiCard item={item} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Grid item xs={12} sm={6} lg={4} key={module.path}>
              <Paper className="enterprise-card dashboard-module" elevation={0}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Box className="dashboard-module-icon"><Icon /></Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="subtitle1">{module.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{module.note}</Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1.4 }}>
                      <Button size="small" variant="contained" onClick={() => navigate(module.path)}>Open</Button>
                      <Button size="small" variant="outlined" startIcon={<LaunchRounded />} onClick={() => openInNewTab(module.path)}>
                        New Tab
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Panel title="Revenue And Expense Trend" subtitle="Monthly movement in lakh INR">
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashflow}>
                  <defs>
                    <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f62fe" stopOpacity={0.32} />
                      <stop offset="95%" stopColor="#0f62fe" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d97706" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.35} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="income" stroke="#0f62fe" fill="url(#income)" strokeWidth={3} />
                  <Area type="monotone" dataKey="expense" stroke="#d97706" fill="url(#expense)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Panel>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Panel title="Weekly Collections" subtitle="Collection performance index">
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={collections}>
                  <XAxis dataKey="day" />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--brand-success)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Panel>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <DataTable
            rows={transactions}
            columns={transactionColumns}
            height={430}
            title="Recent Transactions"
            subtitle="Shared table format with search, filters, export, print, pagination, and total count."
            pageSize={10}
            actions={<Button size="small" endIcon={<ArrowForwardRounded />} onClick={() => navigate("/Customer/Customer_Transactions")}>View All</Button>}
          />
        </Grid>

        <Grid item xs={12} lg={4}>
          <Panel title="Approval Health" subtitle="Workflow and audit status">
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Loan approvals</Typography>
                  <Typography variant="body2" fontWeight={900}>74%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={74} sx={{ mt: 1, height: 8, borderRadius: 99 }} />
              </Box>
              <Box>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Collection closure</Typography>
                  <Typography variant="body2" fontWeight={900}>89%</Typography>
                </Stack>
                <LinearProgress variant="determinate" value={89} color="success" sx={{ mt: 1, height: 8, borderRadius: 99 }} />
              </Box>
              <Stack spacing={1.2} sx={{ pt: 1 }}>
                {activity.map((item) => (
                  <Stack key={item} direction="row" spacing={1.2} alignItems="center">
                    <SavingsRounded color="primary" fontSize="small" />
                    <Typography variant="body2">{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Panel>
        </Grid>
      </Grid>
    </Stack>
  );
}
