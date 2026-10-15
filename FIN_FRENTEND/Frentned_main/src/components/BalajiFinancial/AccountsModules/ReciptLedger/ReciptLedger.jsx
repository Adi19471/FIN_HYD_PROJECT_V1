import React, { useMemo, useState } from "react";
import { Button, FormControlLabel, Grid, Paper, Radio, RadioGroup, Stack } from "@mui/material";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { successToast, errorToast } from "toastify";
import { AppDatePicker, DataTable, PageHeader, useDateRange } from "src/components/ui";
import { roundAmount } from "src/components/ui/reportExport";

// TOTAL row directly under these columns. Module-level so DataTable's totals memo stays stable.
const TOTAL_FIELDS = ["amountPaid", "lateFee", "total", "totalPaid", "balance"];
const TOTAL_LABEL_CELL = { customerName: "TOTAL" };

const sumOf = (rows, field) => roundAmount(rows.reduce((sum, row) => sum + Number(row[field] || 0), 0));

const ReceiptLedger = () => {
  const [dateMode, setDateMode] = useState("range");
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRange("", "");
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${getSession()?.token || ""}`,
      "Content-Type": "application/json",
    },
  });

  // mode is passed in by the radio handler, where the dateMode state has not updated yet.
  const fetchLedger = async (mode = dateMode) => {
    let url = `${API_BASE}/ReceiptsLedger`;

    if (mode === "range") {
      if (!fromDate || !toDate) {
        errorToast("Please select From and To Date");
        return;
      }
      url = `${API_BASE}/ReceiptsLedger/${fromDate}/${toDate}`;
    }

    try {
      setLoading(true);
      const res = await axios.get(url, getHeaders());
      setLedgerData((res.data || []).map((item, index) => ({ id: index + 1, sno: index + 1, ...item })));
      successToast("Ledger loaded successfully");
    } catch (error) {
      console.error(error);
      errorToast(error?.response?.data?.message || "Failed to load ledger");
    } finally {
      setLoading(false);
    }
  };

  // Picking "All" loads every receipt straight away; "Date Range" waits for the dates and Generate.
  const handleDateModeChange = (event) => {
    const mode = event.target.value;
    setDateMode(mode);
    if (mode === "all") fetchLedger(mode);
  };

  // Grand total under the TOTAL row (and on every export). TA = Amount + Total + Total Paid + Balance.
  const summary = useMemo(() => {
    if (!ledgerData.length) return undefined;
    const ta = ["amountPaid", "total", "totalPaid", "balance"].reduce((sum, field) => sum + sumOf(ledgerData, field), 0);
    // return [{ label: "Total Amount (TA)", value: roundAmount(ta) }];
  }, [ledgerData]);

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
        onRefresh={() => fetchLedger()}
        loading={loading}
      />
      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <RadioGroup row value={dateMode} onChange={handleDateModeChange}>
              <FormControlLabel value="all" control={<Radio />} label="All" disabled={loading} />
              <FormControlLabel value="range" control={<Radio />} label="Date Range" disabled={loading} />
            </RadioGroup>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <AppDatePicker label="From Date" value={fromDate} onChange={setFromDate} disabled={dateMode === "all"} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <AppDatePicker label="To Date" value={toDate} onChange={setToDate} disabled={dateMode === "all"} minDate={toDateMin} maxDate={toDateMax} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <Button fullWidth variant="contained" onClick={() => fetchLedger()} disabled={loading}>
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <DataTable
        rows={ledgerData}
        columns={columns}
        loading={loading}
        title="Receipt Ledger Details"
        height={580}
        totalFields={TOTAL_FIELDS}
        totalLabelCell={TOTAL_LABEL_CELL}
        summary={summary}
      />
    </Stack>
  );
};

export default ReceiptLedger;
