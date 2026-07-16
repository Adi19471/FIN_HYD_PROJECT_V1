import React, { useMemo, useState } from "react";
import { Button, Chip, Grid, MenuItem, Paper, Stack, TextField } from "@mui/material";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { errorToast, successToast } from "toastify";
import { AppDatePicker, DataTable, PageHeader } from "src/components/ui";

const formatINR = (value) => `₹ ${Number(value || 0).toLocaleString("en-IN")}`;

const InstalmentDues = () => {
  const [data, setData] = useState([]);
  const [loanType, setLoanType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${getSession("token") || ""}`,
      "Content-Type": "application/json",
    }),
    []
  );

  const loanTypes = [
    { label: "Daily Finance", value: "DAILY_FINANCE" },
    { label: "Monthly Finance", value: "MONTHLY_FINANCE" },
  ];

  const getInstallmentDues = async () => {
    if (!loanType || !fromDate || !toDate) {
      errorToast("Please select Loan Type and Date Range");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE}/installmentDuesList`,
        { loanType, fromDate, toDate },
        { headers }
      );
      setData((res.data || []).map((row, index) => ({ id: row.loanId || row.sno || index + 1, sno: row.sno || index + 1, ...row })));
      successToast("Installment dues loaded successfully");
    } catch (error) {
      console.error("API Error:", error);
      errorToast("Failed to fetch installment dues");
    } finally {
      setLoading(false);
    }
  };

  const rows = useMemo(() => {
    if (!data.length) return data;
    const total = data.reduce(
      (acc, row) => ({
        amount: acc.amount + Number(row.amount || 0),
        installmentAmount: acc.installmentAmount + Number(row.installmentAmount || 0),
        amountPaid: acc.amountPaid + Number(row.amountPaid || 0),
        installmentDue: acc.installmentDue + Number(row.installmentDue || 0),
      }),
      { amount: 0, installmentAmount: 0, amountPaid: 0, installmentDue: 0 }
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
    { field: "installmentAmount", headerName: "Inst. Amt", width: 140, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value) },
    { field: "amountPaid", headerName: "Paid", width: 140, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value) },
    {
      field: "installmentDue",
      headerName: "Due",
      width: 140,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => params.value ? <Chip label={formatINR(params.value)} color="error" size="small" /> : "",
    },
    { field: "noOfInstallmentsPending", headerName: "Pending", width: 120 },
  ];

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title="Instalment Dues"
        subtitle="Pending installment dues by loan type and date-only MUI calendar range."
        totalCount={data.length}
        onRefresh={getInstallmentDues}
        loading={loading}
      />
      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <TextField select label="Loan Type" sx={{width:"220px"}} fullWidth size="small" value={loanType} onChange={(event) => setLoanType(event.target.value)}>
              {loanTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <AppDatePicker label="From Date" value={fromDate} onChange={setFromDate} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <AppDatePicker label="To Date" value={toDate} onChange={setToDate} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <Button fullWidth variant="contained" onClick={getInstallmentDues} disabled={loading}>
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <DataTable rows={rows} columns={columns} loading={loading} title="Instalment Due Details" height={580} />
    </Stack>
  );
};

export default InstalmentDues;
