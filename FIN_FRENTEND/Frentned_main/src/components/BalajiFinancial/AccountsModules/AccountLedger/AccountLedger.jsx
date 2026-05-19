import React, { useState } from "react";
import { Box, Button, FormControlLabel, Paper, Radio, RadioGroup, Stack } from "@mui/material";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { infoToast, successToast, warningToast, errorToast } from "toastify";
import { AppDatePicker, DataTable, PageHeader } from "src/components/ui";

const AccountLedger = () => {
  const [filterType, setFilterType] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const headers = {
    Authorization: `Bearer ${getSession("token") || ""}`,
    "Content-Type": "application/json",
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE}/getAccountsLedger`;

      if (filterType === "DATE_RANGE") {
        if (!fromDate || !toDate) {
          warningToast("Please select From Date and To Date");
          return;
        }
        url = `${API_BASE}/getAccountsLedger/${fromDate}/${toDate}`;
      }

      const res = await axios.get(url, { headers });
      const formatted = (res.data || []).map((item, index) => ({
        id: index + 1,
        sno: index + 1,
        ...item,
      }));

      setRows(formatted);
      formatted.length ? successToast("Accounts ledger loaded successfully") : infoToast("No ledger records found");
    } catch (err) {
      console.error("Ledger API Error:", err);
      errorToast("Failed to load ledger");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "sno", headerName: "S.No", width: 80 },
    { field: "accountMaster", headerName: "Account Master", flex: 1, minWidth: 220 },
    { field: "credit", headerName: "Credit", width: 150, align: "right", headerAlign: "right" },
    { field: "debit", headerName: "Debit", width: 150, align: "right", headerAlign: "right" },
    { field: "balance", headerName: "Balance", width: 150, align: "right", headerAlign: "right" },
  ];

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title="Account Ledger"
        subtitle="Generate all account ledger data or filter by a date-only range."
        totalCount={rows.length}
        onRefresh={handleGenerate}
        loading={loading}
      />

      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }}>
          <RadioGroup row value={filterType} onChange={(event) => setFilterType(event.target.value)}>
            <FormControlLabel value="ALL" control={<Radio />} label="All" />
            <FormControlLabel value="DATE_RANGE" control={<Radio />} label="Date Range" />
          </RadioGroup>
          <Box sx={{ width: { xs: "100%", md: 220 } }}>
            <AppDatePicker label="From Date" value={fromDate} onChange={setFromDate} disabled={filterType === "ALL"} />
          </Box>
          <Box sx={{ width: { xs: "100%", md: 220 } }}>
            <AppDatePicker label="To Date" value={toDate} onChange={setToDate} disabled={filterType === "ALL"} />
          </Box>
          <Button variant="contained" onClick={handleGenerate} disabled={loading}>
            Generate
          </Button>
        </Stack>
      </Paper>

      <DataTable
        rows={rows}
        columns={columns}
        loading={loading}
        title="Account Ledger Details"
        subtitle="Search, filter, export to Excel/PDF/Word, and print from one table."
        height={560}
      />
    </Stack>
  );
};

export default AccountLedger;
