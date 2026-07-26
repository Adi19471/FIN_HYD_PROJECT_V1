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
import {
  AppDatePicker,
  DataTable,
  PageHeader,
  ReportCompanyHeader,
  ReportToolbar,
  useReportZoom,
  useDateRange,
} from "src/components/ui";

const formatAmount = (amount) => Number(amount || 0).toLocaleString("en-IN");
const formatDecimal = (amount) => Number(amount || 0).toFixed(1);

const Group_Bussiness = () => {
  const token = getSession("token") || "";

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token]
  );

  const zoom = useReportZoom();

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [dateFilter, setDateFilter] = useState(false);
  const [balancesOnly, setBalancesOnly] = useState(false);
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRange(
    dayjs().startOf("year").format("YYYY-MM-DD"),
    dayjs().format("YYYY-MM-DD")
  );

  const fetchReport = async () => {
    try {
      setLoading(true);
      const url = dateFilter
        ? `${API_BASE}/group-business/${fromDate}/${toDate}`
        : `${API_BASE}/group-business`;

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
        acc.noOfShares += Number(item.noOfShares || 0);
        acc.capital += Number(item.capital || 0);
        acc.noOfLoans += Number(item.noOfLoans || 0);
        acc.disbursedAmount += Number(item.disbursedAmount || 0);
        acc.disbursedAmountWithInterest += Number(item.disbursedAmountWithInterest || 0);
        acc.paidAmount += Number(item.paidAmount || 0);
        acc.balanceOutStandingWithInterest += Number(item.balanceOutStandingWithInterest || 0);
        acc.balanceOutStandingWithOutInterest += Number(item.balanceOutStandingWithOutInterest || 0);
        acc.installmentDuesOutStanding += Number(item.installmentDuesOutStanding || 0);
        return acc;
      },
      {
        noOfShares: 0,
        capital: 0,
        noOfLoans: 0,
        disbursedAmount: 0,
        disbursedAmountWithInterest: 0,
        paidAmount: 0,
        balanceOutStandingWithInterest: 0,
        balanceOutStandingWithOutInterest: 0,
        installmentDuesOutStanding: 0,
      }
    );
  }, [rows]);

  const columns = [
    { field: "sno", headerName: "S.No", width: 80, align: "center", headerAlign: "center" },
    { field: "partnerId", headerName: "Partner ID", width: 130 },
    { field: "name", headerName: "Name", minWidth: 220, flex: 1 },
    { field: "noOfShares", headerName: "Shares", width: 120, align: "right", headerAlign: "right", valueFormatter: (value) => formatDecimal(value) },
    { field: "capital", headerName: "Capital", width: 140, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "noOfLoans", headerName: "Loans", width: 110, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "disbursedAmount", headerName: "Disbursed Amount", width: 170, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "disbursedAmountWithInterest", headerName: "Disb. Amt With Interest", width: 210, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "paidAmount", headerName: "Paid Amount", width: 150, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "balanceOutStandingWithInterest", headerName: "Balance O/S With Int.", width: 200, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "balanceOutStandingWithOutInterest", headerName: "Balance O/S Without Int.", width: 220, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "installmentDuesOutStanding", headerName: "Installment Dues O/S", width: 200, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
  ];

  const totalRows = [
    { label: "Shares", value: formatDecimal(totals.noOfShares) },
    { label: "Capital", value: formatAmount(totals.capital) },
    { label: "Loans", value: formatAmount(totals.noOfLoans) },
    { label: "Disbursed Amount", value: formatAmount(totals.disbursedAmount) },
    { label: "Disb. Amt With Interest", value: formatAmount(totals.disbursedAmountWithInterest) },
    { label: "Paid Amount", value: formatAmount(totals.paidAmount) },
    { label: "Balance O/S With Int.", value: formatAmount(totals.balanceOutStandingWithInterest) },
    { label: "Balance O/S Without Int.", value: formatAmount(totals.balanceOutStandingWithOutInterest) },
    { label: "Installment Dues O/S", value: formatAmount(totals.installmentDuesOutStanding) },
  ];

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title="Partner Group Business Ledger"
        subtitle="Group-wise partner business ledger with filters, count, totals, search, sorting, and exports."
        totalCount={rows.length}
        onRefresh={fetchReport}
        loading={loading}
      />
      <ReportToolbar
        onGenerate={fetchReport}
        onRefresh={fetchReport}
        loading={loading}
        rows={rows}
        columns={columns}
        fileName="Group-Business"
        zoom={zoom}
      />
      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid
            size={{
              xs: 12,
              md: 2
            }}>
            <FormControlLabel control={<Checkbox checked={dateFilter} onChange={(event) => setDateFilter(event.target.checked)} />} label="Date Range" />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <AppDatePicker label="From Date" value={fromDate} disabled={!dateFilter} onChange={setFromDate} />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <AppDatePicker label="To Date" value={toDate} disabled={!dateFilter} onChange={setToDate} minDate={toDateMin} maxDate={toDateMax} />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 2
            }}>
            <FormControlLabel control={<Checkbox checked={balancesOnly} onChange={(event) => setBalancesOnly(event.target.checked)} />} label="Balances only" />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 2
            }}>
            <Button fullWidth variant="contained" onClick={fetchReport} disabled={loading}>
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Box ref={zoom.targetRef} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
          <ReportCompanyHeader title="Group Business Report" />
        </Paper>

      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        title="Group Business Details"
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
        height={430}
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

export default Group_Bussiness;
