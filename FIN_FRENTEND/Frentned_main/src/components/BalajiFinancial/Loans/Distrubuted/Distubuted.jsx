import React, { useMemo, useState } from "react";
import { Button, Checkbox, Chip, FormControlLabel, Grid, Paper, Stack } from "@mui/material";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { errorToast, successToast } from "toastify";
import { AppDatePicker, DataTable, PageHeader, useDateRange } from "src/components/ui";

const formatINR = (value) => `₹ ${Number(value || 0).toLocaleString("en-IN")}`;

const Distubuted = () => {
  const [data, setData] = useState([]);
  const [allLoans, setAllLoans] = useState(false);
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRange("", "");
  const [loading, setLoading] = useState(false);
  // Range that produced the rows on screen - printed on every export. Null when "All" was loaded.
  const [appliedRange, setAppliedRange] = useState(null);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${getSession("token") || ""}`,
    }),
    []
  );

  // all is passed in by the checkbox handler, where the allLoans state has not updated yet.
  const getDisbursedList = async (all = allLoans) => {
    if (!all && (!fromDate || !toDate)) {
      errorToast("Please select both From and To dates");
      return;
    }

    setLoading(true);
    try {
      // No dates = every disbursed loan.
      const res = await axios.get(`${API_BASE}/disbursedList`, {
        headers,
        params: all ? undefined : { fromDate, toDate },
      });
      setData((res.data || []).map((row, index) => ({ id: row.loanId || row.sno || index + 1, sno: row.sno || index + 1, ...row })));
      setAppliedRange(all ? null : { fromDate, toDate });
      successToast("Disbursed loans loaded successfully");
    } catch (error) {
      console.error(error);
      errorToast("Failed to load disbursed loans");
    } finally {
      setLoading(false);
    }
  };

  // Ticking "All" loads every loan straight away; unticked waits for the dates and Generate.
  const handleAllLoansChange = (event) => {
    const all = event.target.checked;
    setAllLoans(all);
    if (all) getDisbursedList(all);
  };

  const reportPeriod = useMemo(
    () =>
      appliedRange
        ? { label: "Loans Distributed From", fromDate: appliedRange.fromDate, toDate: appliedRange.toDate }
        : undefined,
    [appliedRange]
  );

  const columns = [
    { field: "sno", headerName: "S.No", width: 80 },
    { field: "loanId", headerName: "Loan ID", width: 120 },
    { field: "customerName", headerName: "Customer", minWidth: 200, flex: 1 },
    { field: "guarentorName", headerName: "Guarantor Name", width: 175 },
    { field: "partnerName", headerName: "Partner Name", width: 150 },
    { field: "startDate", headerName: "Start", width: 130 },
    { field: "endDate", headerName: "End", width: 130 },
    { field: "amount", headerName: "Amount", width: 140, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value) },
    { field: "amountPaid", headerName: "Paid", width: 140, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value) },
    { field: "installmentDue", headerName: "Due", width: 140, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value) },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => params.value ? <Chip label={params.value} color={params.value === "ACTIVE" ? "success" : "error"} size="small" /> : null,
    },
  ];

  const totalFields = ["amount", "amountPaid", "installmentDue"];

  return (
    <Stack spacing={2.5}>
      <PageHeader
        onRefresh={() => getDisbursedList()}
        loading={loading}
      />
      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid
            size={{
              xs: 12,
              md: 2
            }}>
            <FormControlLabel
              control={<Checkbox checked={allLoans} onChange={handleAllLoansChange} disabled={loading} />}
              label="All"
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <AppDatePicker label="From Date" value={fromDate} onChange={setFromDate} disabled={allLoans} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <AppDatePicker label="To Date" value={toDate} onChange={setToDate} disabled={allLoans} minDate={toDateMin} maxDate={toDateMax} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <Button fullWidth variant="contained" onClick={() => getDisbursedList()} disabled={loading}>
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <DataTable
        rows={data}
        columns={columns}
        loading={loading}
        title="Distributed Loan Details"
        height="calc(100 * var(--app-vh) - 300px)"
        pageSize={50}
        period={reportPeriod}
        totalFields={totalFields}
        totalLabelCell={{ customerName: "TOTAL" }}
      />
    </Stack>
  );
};

export default Distubuted;
