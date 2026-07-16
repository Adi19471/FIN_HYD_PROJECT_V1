import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  AssessmentRounded,
  CalendarMonthRounded,
  RefreshRounded,
  TrendingUpRounded,
} from "@mui/icons-material";
import axios from "axios";
import dayjs from "dayjs";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { COMPANY_ADDRESS, COMPANY_NAME } from "src/lib/company";
import { AppDatePicker, DataTable } from "src/components/ui";

const money = (value) => Number(value || 0).toLocaleString("en-IN");

const emptyStatus = {
  targetCollections: 0,
  receivedCollections: 0,
  balanceCollections: 0,
};

const BussinessCollectionReports = () => {
  const [fromDate, setFromDate] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(dayjs().endOf("month").format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const token = getSession("token") || "";
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/businessCollectionsReport/${fromDate}/${toDate}`, { headers });
      setReportData(Array.isArray(response.data) ? response.data : []);
      setLastUpdated(dayjs());
    } catch (error) {
      setReportData([]);
      console.error("Business Collection Report Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const groupedData = useMemo(() => {
    const result = {
      DAILY_FINANCE: { ACTIVE: emptyStatus, MATURED: emptyStatus },
      MONTHLY_FINANCE: { ACTIVE: emptyStatus, MATURED: emptyStatus },
    };

    reportData.forEach((item) => {
      if (!result[item.loanType]) result[item.loanType] = {};
      result[item.loanType][item.loanStatus] = item;
    });

    return result;
  }, [reportData]);

  const totals = useMemo(
    () =>
      reportData.reduce(
        (acc, item) => ({
          target: acc.target + Number(item.targetCollections || 0),
          received: acc.received + Number(item.receivedCollections || 0),
          balance: acc.balance + Number(item.balanceCollections || 0),
        }),
        { target: 0, received: 0, balance: 0 }
      ),
    [reportData]
  );

  const rows = useMemo(
    () =>
      reportData.map((item, index) => ({
        id: `${item.loanType}-${item.loanStatus}-${index}`,
        sno: index + 1,
        loanType: item.loanType?.replace("_", " ") || "-",
        loanStatus: item.loanStatus || "-",
        targetCollections: item.targetCollections || 0,
        receivedCollections: item.receivedCollections || 0,
        balanceCollections: item.balanceCollections || 0,
      })),
    [reportData]
  );

  const columns = [
    { field: "sno", headerName: "S No", width: 80 },
    { field: "loanType", headerName: "Loan Type", flex: 1, minWidth: 180 },
    { field: "loanStatus", headerName: "Status", width: 130 },
    { field: "targetCollections", headerName: "Target", width: 150, valueFormatter: (value) => money(value) },
    { field: "receivedCollections", headerName: "Received", width: 150, valueFormatter: (value) => money(value) },
    { field: "balanceCollections", headerName: "Balance", width: 150, valueFormatter: (value) => money(value) },
  ];

  const SummaryCard = ({ title, value, note, color = "primary", icon: Icon = AssessmentRounded }) => (
    <Paper className="enterprise-card" elevation={0} sx={{ p: 2, height: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h5" sx={{ mt: 0.5 }}>Rs {money(value)}</Typography>
          <Typography variant="caption" color="text.secondary">{note}</Typography>
        </Box>
        <Box className="dashboard-kpi-icon" color={`${color}.main`}>
          <Icon />
        </Box>
      </Stack>
    </Paper>
  );

  const FinanceBlock = ({ title, data }) => {
    const active = data.ACTIVE || emptyStatus;
    const matured = data.MATURED || emptyStatus;
    return (
      <Paper className="enterprise-card" elevation={0} sx={{ p: 2.5, height: "100%" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Box>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body2" color="text.secondary">Active and matured collection status</Typography>
          </Box>
          <Chip label={`${money(Number(active.receivedCollections || 0) + Number(matured.receivedCollections || 0))} received`} color="primary" variant="outlined" />
        </Stack>
        <Grid container spacing={2}>
          {[
            { label: "Active Target", value: active.targetCollections },
            { label: "Active Received", value: active.receivedCollections },
            { label: "Active Balance", value: active.balanceCollections },
            { label: "Matured Target", value: matured.targetCollections },
            { label: "Matured Received", value: matured.receivedCollections },
            { label: "Matured Balance", value: matured.balanceCollections },
          ].map((item) => (
            <Grid
              key={item.label}
              size={{
                xs: 12,
                sm: 6
              }}>
              <Box sx={{ p: 1.5, border: 1, borderColor: "divider", borderRadius: 1, bgcolor: "background.paper" }}>
                <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                <Typography fontWeight={900}>Rs {money(item.value)}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  };

  return (
    <Stack spacing={2.5} sx={{ p: { xs: 1.5, md: 2.5 } }}>
      <Paper className="enterprise-card" elevation={0} sx={{ p: 2.5 }}>
        <Stack direction={{ xs: "column", lg: "row" }} justifyContent="space-between" spacing={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <AssessmentRounded color="primary" />
              <Typography variant="h5">Business Collections Report</Typography>
              <Chip size="small" label={`${rows.length} records`} color="primary" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {COMPANY_NAME} / {COMPANY_ADDRESS}
            </Typography>
            {lastUpdated && (
              <Typography variant="caption" color="text.secondary">
                Last updated {lastUpdated.format("DD-MMM-YYYY hh:mm A")}
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap alignItems="center">
            <AppDatePicker
              label="From Date"
              size="small"
              value={fromDate}
              onChange={setFromDate}
              sx={{ width: 170 }}
            />
            <AppDatePicker
              label="To Date"
              size="small"
              value={toDate}
              onChange={setToDate}
              sx={{ width: 170 }}
            />
            <Button variant="contained" startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <RefreshRounded />} onClick={fetchReport} disabled={loading}>
              {loading ? "Loading" : "Generate"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
            md: 4
          }}>
          <SummaryCard title="Target Collections" value={totals.target} note="Total expected collection" icon={CalendarMonthRounded} />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 4
          }}>
          <SummaryCard title="Received Collections" value={totals.received} note="Total amount received" color="success" icon={TrendingUpRounded} />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 4
          }}>
          <SummaryCard title="Collection Balance" value={totals.balance} note="Pending collection balance" color="warning" icon={AssessmentRounded} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
            lg: 6
          }}>
          <FinanceBlock title="Daily Finance" data={groupedData.DAILY_FINANCE} />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 6
          }}>
          <FinanceBlock title="Monthly Finance" data={groupedData.MONTHLY_FINANCE} />
        </Grid>
      </Grid>
      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        height={520}
        title={`Business Collections ${fromDate} to ${toDate}`}
        subtitle="Search, row count, print, PDF, Excel, and Word downloads are available from this table."
        pageSize={10}
      />
    </Stack>
  );
};

export default BussinessCollectionReports;
