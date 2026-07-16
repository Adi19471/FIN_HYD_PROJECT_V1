import React, { useMemo, useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, Grid, Paper, Stack } from "@mui/material";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { errorToast, successToast } from "toastify";
import { AppDatePicker, DataTable, PageHeader } from "src/components/ui";

const Cbledger = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [collectionOnly, setCollectionOnly] = useState(false);
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLedgerData = async () => {
    if (!fromDate || !toDate) {
      errorToast("Please select From Date and To Date");
      return;
    }

    setLoading(true);
    try {
      const token = getSession()?.token || getSession("token") || "";
      const url = collectionOnly
        ? `${API_BASE}/getCollectionsCBLedgerData/${fromDate}/${toDate}`
        : `${API_BASE}/getAllCBLedgerData/${fromDate}/${toDate}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLedgerData((response?.data || []).map((row, index) => ({ id: index + 1, sno: index + 1, ...row })));
      successToast("CB ledger loaded successfully");
    } catch (err) {
      errorToast("Failed to fetch data");
      setLedgerData([]);
    } finally {
      setLoading(false);
    }
  };

  const rows = useMemo(() => {
    const totals = ledgerData.reduce(
      (acc, row) => {
        if (collectionOnly) {
          acc.monthlyFinanceCollections += Number(row.monthlyFinanceCollections || 0);
          acc.dailyFinanceCollections += Number(row.dailyFinanceCollections || 0);
          acc.total += Number(row.total || 0);
        } else {
          acc.credit += Number(row.credit || 0);
          acc.debit += Number(row.debit || 0);
          acc.balance += Number(row.balance || 0);
          acc.closingBalance += Number(row.closingBalance || 0);
        }
        return acc;
      },
      { monthlyFinanceCollections: 0, dailyFinanceCollections: 0, total: 0, credit: 0, debit: 0, balance: 0, closingBalance: 0 }
    );

    return ledgerData.length ? [...ledgerData, { id: "total", sno: "", date: "TOTAL", ...totals }] : ledgerData;
  }, [collectionOnly, ledgerData]);

  const columns = collectionOnly
    ? [
        { field: "sno", headerName: "S.No", width: 80 },
        { field: "date", headerName: "Date", width: 150 },
        { field: "monthlyFinanceCollections", headerName: "Monthly", width: 150, align: "right", headerAlign: "right" },
        { field: "dailyFinanceCollections", headerName: "Daily", width: 150, align: "right", headerAlign: "right" },
        { field: "total", headerName: "Total", width: 150, align: "right", headerAlign: "right" },
      ]
    : [
        { field: "sno", headerName: "S.No", width: 80 },
        { field: "date", headerName: "Date", width: 150 },
        { field: "credit", headerName: "Credit", width: 150, align: "right", headerAlign: "right" },
        { field: "debit", headerName: "Debit", width: 150, align: "right", headerAlign: "right" },
        { field: "balance", headerName: "Balance", width: 150, align: "right", headerAlign: "right" },
        { field: "closingBalance", headerName: "Closing", width: 150, align: "right", headerAlign: "right" },
      ];

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title="CB Ledger Report"
        subtitle="Cash book ledger with date-only MUI calendar filters and fast export table."
        totalCount={ledgerData.length}
        onRefresh={fetchLedgerData}
        loading={loading}
      />
      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
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
            <FormControlLabel
              control={<Checkbox checked={collectionOnly} onChange={(event) => setCollectionOnly(event.target.checked)} />}
              label="Collection Only"
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <Button fullWidth variant="contained" onClick={fetchLedgerData} disabled={loading}>
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        title={collectionOnly ? "CB Collection Ledger" : "CB Ledger Details"}
        subtitle="Consistent table format with search, filters, Excel, PDF, Word, and print."
        height={560}
      />
    </Stack>
  );
};

export default Cbledger;
