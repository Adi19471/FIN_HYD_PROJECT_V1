import React, { useState } from "react";
import { Button, Grid, Paper, Stack } from "@mui/material";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { successToast, errorToast } from "toastify";
import { AppDatePicker, DataTable, PageHeader, useDateRange } from "src/components/ui";

const ReceiptLedger = () => {
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRange("", "");
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${getSession()?.token || ""}`,
      "Content-Type": "application/json",
    },
  });

  const fetchLedger = async () => {
    if (!fromDate || !toDate) {
      errorToast("Please select From and To Date");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/ReceiptsLedger/${fromDate}/${toDate}`, getHeaders());
      setLedgerData((res.data || []).map((item, index) => ({ id: index + 1, sno: index + 1, ...item })));
      successToast("Ledger loaded successfully");
    } catch (error) {
      console.error(error);
      errorToast(error?.response?.data?.message || "Failed to load ledger");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "sno", headerName: "S.No", width: 80 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "transId", headerName: "Trans ID", width: 120 },
    { field: "loanId", headerName: "Loan ID", width: 120 },
    { field: "loanDate", headerName: "Loan Date", width: 120 },
    { field: "customerName", headerName: "Customer Name", flex: 1, minWidth: 200 },
    { field: "amountPaid", headerName: "Amount", width: 120, align: "right", headerAlign: "right" },
    { field: "lateFee", headerName: "Late Fee", width: 110, align: "right", headerAlign: "right" },
    { field: "total", headerName: "Total", width: 120, align: "right", headerAlign: "right" },
    { field: "totalPaid", headerName: "Total Paid", width: 130, align: "right", headerAlign: "right" },
    { field: "balance", headerName: "Balance", width: 130, align: "right", headerAlign: "right" },
    { field: "currentInstallmentNumber", headerName: "Current Inst.", width: 130 },
    { field: "balanceInstallmentNumber", headerName: "Balance Inst.", width: 130 },
    { field: "particulars", headerName: "Particulars", flex: 1, minWidth: 160 },
  ];

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title="Receipt Ledger"
        subtitle="Receipt, installment, late fee, paid amount, and balance details with date-only filters."
        totalCount={ledgerData.length}
        onRefresh={fetchLedger}
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
            <AppDatePicker label="To Date" value={toDate} onChange={setToDate} minDate={toDateMin} maxDate={toDateMax} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 4
            }}>
            <Button fullWidth variant="contained" onClick={fetchLedger} disabled={loading}>
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <DataTable rows={ledgerData} columns={columns} loading={loading} title="Receipt Ledger Details" height={580} />
    </Stack>
  );
};

export default ReceiptLedger;
