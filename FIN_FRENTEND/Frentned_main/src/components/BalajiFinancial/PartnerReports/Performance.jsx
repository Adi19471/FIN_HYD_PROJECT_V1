import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { errorToast } from "toastify";
import {
  DataTable,
  PageHeader,
  ReportCompanyHeader,
  ReportToolbar,
  useReportZoom,
} from "src/components/ui";

const formatAmount = (amount) => Number(amount || 0).toLocaleString("en-IN");

const Performance = () => {
  const zoom = useReportZoom();
  const token = getSession()?.token || getSession("token") || "";
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [dateFilter, setDateFilter] = useState(false);
  const [fromDate, setFromDate] = useState(dayjs().startOf("year").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const url = dateFilter
        ? `${API_BASE}/performance/partners/${fromDate}/${toDate}`
        : `${API_BASE}/performance/partners`;

      const response = await axios.get(url, { headers });
      setRows(
        (response?.data || []).map((row, index) => ({
          id: row.partnerId || index + 1,
          sno: index + 1,
          ...row,
        }))
      );
    } catch (error) {
      console.log(error);
      errorToast("Failed to fetch performance report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, item) => {
        acc.loansDisbursed += Number(item.loansDisbursed || 0);
        acc.loansPayment += Number(item.loansPayment || 0);
        acc.interest += Number(item.interest || 0);
        acc.documentCharges += Number(item.documentCharges || 0);
        acc.lateFee += Number(item.lateFee || 0);
        acc.income += Number(item.income || 0);
        return acc;
      },
      {
        loansDisbursed: 0,
        loansPayment: 0,
        interest: 0,
        documentCharges: 0,
        lateFee: 0,
        income: 0,
      }
    );
  }, [rows]);

  const columns = [
    { field: "sno", headerName: "S.No", width: 80, align: "center", headerAlign: "center" },
    { field: "partnerId", headerName: "Partner ID", width: 130 },
    { field: "name", headerName: "Name", minWidth: 220, flex: 1 },
    { field: "loansDisbursed", headerName: "Loans Disbursed", width: 170, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "loansPayment", headerName: "Loans Payments", width: 170, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "interest", headerName: "Interest", width: 140, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "documentCharges", headerName: "Document Charges", width: 180, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "lateFee", headerName: "Late Fee", width: 140, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "income", headerName: "Income", width: 150, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
  ];

  const totalRows = [
    { label: "Loans Disbursed", value: formatAmount(totals.loansDisbursed) },
    { label: "Loans Payments", value: formatAmount(totals.loansPayment) },
    { label: "Interest", value: formatAmount(totals.interest) },
    { label: "Document Charges", value: formatAmount(totals.documentCharges) },
    { label: "Late Fee", value: formatAmount(totals.lateFee) },
    { label: "Income", value: formatAmount(totals.income) },
  ];

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title="Partner Performance Report"
        subtitle="Performance details of all partners with count, searchable table, exports, and total summary."
        totalCount={rows.length}
        onRefresh={fetchPerformance}
        loading={loading}
      />

      <ReportToolbar
        onGenerate={fetchPerformance}
        onRefresh={fetchPerformance}
        loading={loading}
        rows={rows}
        columns={columns}
        fileName="Partner-Performance"
        zoom={zoom}
      />

      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={2}>
            <FormControlLabel control={<Checkbox checked={dateFilter} onChange={(event) => setDateFilter(event.target.checked)} />} label="Date Range" />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField fullWidth size="small" type="date" label="From Date" InputLabelProps={{ shrink: true }} value={fromDate} disabled={!dateFilter} onChange={(event) => setFromDate(event.target.value)} />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField fullWidth size="small" type="date" label="To Date" InputLabelProps={{ shrink: true }} value={toDate} disabled={!dateFilter} onChange={(event) => setToDate(event.target.value)} />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button fullWidth variant="contained" onClick={fetchPerformance} disabled={loading}>
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box ref={zoom.targetRef} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
          <ReportCompanyHeader title="Partner Performance Report" />
        </Paper>

      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        title="Partner Performance Ledger"
        subtitle={`Report date: ${dayjs().format("DD-MMM-YYYY")}`}
        height={640}
        pageSize={25}
      />

      <DataTable
        rows={totalRows.map((row, index) => ({ id: index + 1, ...row }))}
        columns={[
          { field: "label", headerName: "Total Field", flex: 1, minWidth: 220 },
          { field: "value", headerName: "Total Value", flex: 1, minWidth: 180, align: "right", headerAlign: "right" },
        ]}
        title="Total Summary"
        subtitle={`${rows.length} records included in totals`}
        height={390}
        pageSize={25}
        hideFooter
        showExport={false}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
      />
      </Box>
    </Stack>
  );
};

export default Performance;
