import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { DataTable, PageHeader } from "src/components/ui";

const managerOptions = [
  { value: "P3", label: "P001 - JAYARANJAN ROKKAM" },
  { value: "P4", label: "P002 - SURENDAR REDDY" },
  { value: "P5", label: "P003 - MAHESH JANAKI" },
];

const formatAmount = (amount) => Number(amount || 0).toLocaleString("en-IN");
const formatDecimal = (amount) => Number(amount || 0).toFixed(1);

const GroupBusinessDetails = () => {
  const token = getSession()?.token || getSession("token") || "";
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [dateFilter, setDateFilter] = useState(false);
  const [balancesOnly, setBalancesOnly] = useState(false);
  const [managerId, setManagerId] = useState("P3");
  const [fromDate, setFromDate] = useState(dayjs().startOf("year").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));

  const selectedManager = managerOptions.find((item) => item.value === managerId);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const url = dateFilter
        ? `${API_BASE}/group-business-details/${managerId}/${fromDate}/${toDate}`
        : `${API_BASE}/group-business-details/${managerId}`;

      const response = await axios.get(url, { headers });
      let data = response?.data || [];

      if (balancesOnly) {
        data = data.filter((item) => Number(item.balanceOutStandingWithInterest || 0) > 0);
      }

      setRows(
        data.map((row, index) => ({
          id: row.partnerId || index + 1,
          sno: index + 1,
          ...row,
        }))
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, item) => {
        acc.shares += Number(item.noOfShares || 0);
        acc.capital += Number(item.capital || 0);
        acc.balanceWithInterest += Number(item.balanceOutStandingWithInterest || 0);
        acc.balanceWithoutInterest += Number(item.balanceOutStandingWithOutInterest || 0);
        acc.installmentDues += Number(item.installmentDuesOutStanding || 0);
        return acc;
      },
      {
        shares: 0,
        capital: 0,
        balanceWithInterest: 0,
        balanceWithoutInterest: 0,
        installmentDues: 0,
      }
    );
  }, [rows]);

  const columns = [
    { field: "sno", headerName: "S.No", width: 80, align: "center", headerAlign: "center" },
    { field: "partnerId", headerName: "Partner ID", width: 130 },
    { field: "name", headerName: "Name", minWidth: 240, flex: 1 },
    { field: "noOfShares", headerName: "Shares", width: 120, align: "right", headerAlign: "right", valueFormatter: (value) => formatDecimal(value) },
    { field: "capital", headerName: "Capital", width: 150, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "balanceOutStandingWithInterest", headerName: "Balance O/S With Int.", width: 210, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "balanceOutStandingWithOutInterest", headerName: "Balance O/S Without Int.", width: 230, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "installmentDuesOutStanding", headerName: "Installment Dues O/S", width: 210, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
  ];

  const totalRows = [
    { label: "Shares", value: formatDecimal(totals.shares) },
    { label: "Capital", value: formatAmount(totals.capital) },
    { label: "Balance O/S With Int.", value: formatAmount(totals.balanceWithInterest) },
    { label: "Balance O/S Without Int.", value: formatAmount(totals.balanceWithoutInterest) },
    { label: "Installment Dues O/S", value: formatAmount(totals.installmentDues) },
  ];

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title={`${selectedManager?.label || "Partner"} Group Business Ledger`}
        subtitle="Partner group business detail report with clean table totals and record count."
        totalCount={rows.length}
        onRefresh={fetchReport}
        loading={loading}
      />

      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField select fullWidth size="small" label="Partner Group" value={managerId} onChange={(event) => setManagerId(event.target.value)}>
              {managerOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControlLabel control={<Checkbox checked={dateFilter} onChange={(event) => setDateFilter(event.target.checked)} />} label="Date Range" />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField fullWidth size="small" type="date" label="From" InputLabelProps={{ shrink: true }} disabled={!dateFilter} value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField fullWidth size="small" type="date" label="To" InputLabelProps={{ shrink: true }} disabled={!dateFilter} value={toDate} onChange={(event) => setToDate(event.target.value)} />
          </Grid>

          <Grid item xs={12} md={2}>
            <FormControlLabel control={<Checkbox checked={balancesOnly} onChange={(event) => setBalancesOnly(event.target.checked)} />} label="Balances only" />
          </Grid>

          <Grid item xs={12} md={1}>
            <Button fullWidth variant="contained" onClick={fetchReport} disabled={loading}>
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        title="Group Business Details"
        subtitle={`${selectedManager?.label || "Selected partner group"} / ${dayjs().format("DD-MMM-YYYY")}`}
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
        height={380}
        pageSize={25}
        hideFooter
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
      />
    </Stack>
  );
};

export default GroupBusinessDetails;
