import React, { useMemo, useState } from "react";
import { Button, Chip, Grid, Paper, Stack } from "@mui/material";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { errorToast, successToast } from "toastify";
import { AppDatePicker, DataTable, PageHeader } from "src/components/ui";

const formatINR = (value) => `₹ ${Number(value || 0).toLocaleString("en-IN")}`;

const Distubuted = () => {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${getSession("token") || ""}`,
    }),
    []
  );

  const getDisbursedList = async () => {
    if (!fromDate || !toDate) {
      errorToast("Please select both From and To dates");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/disbursedList`, {
        headers,
        params: { fromDate, toDate },
      });
      setData((res.data || []).map((row, index) => ({ id: row.loanId || row.sno || index + 1, sno: row.sno || index + 1, ...row })));
      successToast("Disbursed loans loaded successfully");
    } catch (error) {
      console.error(error);
      errorToast("Failed to load disbursed loans");
    } finally {
      setLoading(false);
    }
  };

  const rows = useMemo(() => {
    if (!data.length) return data;
    const total = data.reduce(
      (acc, row) => ({
        amount: acc.amount + Number(row.amount || 0),
        amountPaid: acc.amountPaid + Number(row.amountPaid || 0),
        installmentDue: acc.installmentDue + Number(row.installmentDue || 0),
      }),
      { amount: 0, amountPaid: 0, installmentDue: 0 }
    );
    return [...data, { id: "total", customerName: "TOTAL", ...total }];
  }, [data]);

  const columns = [
    { field: "sno", headerName: "S.No", width: 80 },
    { field: "loanId", headerName: "Loan ID", width: 120 },
    { field: "customerName", headerName: "Customer", minWidth: 200, flex: 1 },
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

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title="Distributed Loans"
        subtitle="Disbursed loan list with date-only MUI calendar filters and export-ready totals."
        totalCount={data.length}
        onRefresh={getDisbursedList}
        loading={loading}
      />
      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <AppDatePicker label="From Date" value={fromDate} onChange={setFromDate} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <AppDatePicker label="To Date" value={toDate} onChange={setToDate} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <Button fullWidth variant="contained" onClick={getDisbursedList} disabled={loading}>
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        title="Distributed Loan Details"
        height="calc(100vh - 300px)"
        pageSize={50}
      />
    </Stack>
  );
};

export default Distubuted;
