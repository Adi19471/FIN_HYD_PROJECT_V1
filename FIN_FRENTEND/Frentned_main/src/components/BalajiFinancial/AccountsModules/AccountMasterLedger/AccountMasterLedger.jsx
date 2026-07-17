import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { successToast, errorToast } from "toastify";
import { AppDatePicker, DataTable, PageHeader, useDateRange } from "src/components/ui";

const formatINR = (value) => `₹ ${Number(value || 0).toLocaleString("en-IN")}`;

const AccountMasterLedger = () => {
  const [masterCodes, setMasterCodes] = useState([]);
  const [masterName, setMasterName] = useState("");
  const [dateMode, setDateMode] = useState("all");
  const { fromDate, toDate, setFromDate, setToDate, toDateMin, toDateMax } = useDateRange("", "");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const headers = {
    Authorization: `Bearer ${getSession("token") || ""}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const loadMasterCodes = async () => {
      try {
        const res = await axios.get(`${API_BASE}/account-master-droddown/findAllMasterCodes`, { headers });
        setMasterCodes(res.data || []);
      } catch (error) {
        console.error("Dropdown Error:", error);
        errorToast("Failed to load account names");
      }
    };
    loadMasterCodes();
  }, []);

  const fetchLedger = async () => {
    if (!masterName) {
      errorToast("Select Account Name");
      return;
    }

    try {
      setLoading(true);
      let url = `${API_BASE}/getRecordsByAccountMasterCode/${masterName}`;

      if (dateMode === "range") {
        if (!fromDate || !toDate) {
          errorToast("Select From and To Date");
          return;
        }
        url = `${API_BASE}/getRecordsByAccountMasterCode/${masterName}/${fromDate}/${toDate}`;
      }

      const res = await axios.get(url, { headers });
      let runningBalance = 0;
      const formattedRows = (res.data || []).map((item, index) => {
        const debit = Number(item.debit || item.debitAmount || 0);
        const credit = Number(item.credit || item.creditAmount || 0);
        runningBalance += credit - debit;
        return {
          id: index + 1,
          date: item.date || item.txnDate || "",
          transCode: item.transCode || item.accountMastercode || masterName,
          name: item.name || item.accountName || "",
          particulars: item.particulars || item.description || "",
          debit,
          credit,
          balance: item.balance || item.runningBalance || runningBalance,
        };
      });

      setRows(formattedRows);
      successToast("Ledger loaded successfully");
    } catch (error) {
      console.error("Ledger Error:", error);
      errorToast(error.response?.status === 401 ? "Session expired. Please login again." : "Failed to load ledger");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", headerName: "S.No", width: 80 },
    { field: "date", headerName: "Date", width: 140 },
    { field: "transCode", headerName: "Code", width: 130 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 240 },
    { field: "particulars", headerName: "Particulars", flex: 1, minWidth: 220 },
    { field: "debit", headerName: "Debit", width: 150, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value) },
    { field: "credit", headerName: "Credit", width: 150, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value) },
    { field: "balance", headerName: "Balance", width: 160, align: "right", headerAlign: "right", valueFormatter: (value) => formatINR(value) },
  ];

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title="Account Master Ledger"
        subtitle="Master account statement with MUI date-only calendar filters and export-ready table."
        totalCount={rows.length}
        onRefresh={fetchLedger}
        loading={loading}
      />

      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", lg: "row" }} spacing={2} alignItems={{ xs: "stretch", lg: "center" }}>
          <TextField select label="Account Name" value={masterName} onChange={(event) => setMasterName(event.target.value)} sx={{ minWidth: 260 }} size="small">
            {masterCodes.map((item, index) => (
              <MenuItem key={index} value={item}>{item}</MenuItem>
            ))}
          </TextField>

          <RadioGroup row value={dateMode} onChange={(event) => setDateMode(event.target.value)}>
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel value="range" control={<Radio />} label="Date Range" />
          </RadioGroup>

          <Box sx={{ width: { xs: "100%", lg: 210 } }}>
            <AppDatePicker label="From Date" value={fromDate} onChange={setFromDate} disabled={dateMode === "all"} />
          </Box>
          <Box sx={{ width: { xs: "100%", lg: 210 } }}>
            <AppDatePicker label="To Date" value={toDate} onChange={setToDate} disabled={dateMode === "all"} minDate={toDateMin} maxDate={toDateMax} />
          </Box>

          <Button variant="contained" onClick={fetchLedger} disabled={loading}>
            {loading ? <CircularProgress size={22} color="inherit" /> : "Generate"}
          </Button>
        </Stack>
      </Paper>

      <DataTable rows={rows} columns={columns} loading={loading} title="Account Master Ledger Details" height={560} />
    </Stack>
  );
};

export default AccountMasterLedger;
