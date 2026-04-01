import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";


import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { successToast, errorToast } from "toastify";

/* -------------------- COMMON AUTH HEADER -------------------- */
const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${
      getSession()?.token || getSession("token") || ""
    }`,
    "Content-Type": "application/json"
  }
});

const AccountMasterLedger = () => {

  const [masterCodes, setMasterCodes] = useState([]);
  const [masterName, setMasterName] = useState("");
  const [dateMode, setDateMode] = useState("all");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  /* -------------------- TABLE COLUMNS -------------------- */
  const columns = [
    { field: "id", headerName: "S.No", width: 80 },

    {
      field: "date",
      headerName: "Date",
      width: 150
    },

    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 250
    },

    {
      field: "debit",
      headerName: "Debit (₹)",
      width: 150,
      renderCell: (params) => (
        <span style={{ color: "red", fontWeight: "bold" }}>
          ₹ {Number(params.value || 0).toLocaleString()}
        </span>
      )
    },

    {
      field: "credit",
      headerName: "Credit (₹)",
      width: 150,
      renderCell: (params) => (
        <span style={{ color: "green", fontWeight: "bold" }}>
          ₹ {Number(params.value || 0).toLocaleString()}
        </span>
      )
    },

    {
      field: "balance",
      headerName: "Balance (₹)",
      width: 160,
      renderCell: (params) => (
        <strong>
          ₹ {Number(params.value || 0).toLocaleString()}
        </strong>
      )
    }
  ];

  /* -------------------- LOAD DROPDOWN -------------------- */
  const loadMasterCodes = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/account-master-droddown/findAllMasterCodes`,
        getHeaders()
      );

      setMasterCodes(res.data || []);
    } catch (error) {
      console.error("Dropdown Error:", error);
      errorToast("Failed to load account names");
    }
  };

  useEffect(() => {
    loadMasterCodes();
  }, []);

  /* -------------------- FETCH LEDGER -------------------- */
  const fetchLedger = async () => {

    if (!masterName) {
      errorToast("Select Account Name");
      return;
    }

    try {

      setLoading(true);

      let url = "";

      if (dateMode === "all") {
        url = `${API_BASE}/getRecordsByAccountMasterCode/${masterName}`;
      } else {

        if (!fromDate || !toDate) {
          errorToast("Select From and To Date");
          return;
        }

        url = `${API_BASE}/getRecordsByAccountMasterCode/${masterName}/${fromDate}/${toDate}`;
      }

      const res = await axios.get(url, getHeaders());

      console.log("Ledger Response:", res.data);

      let runningBalance = 0;

      const formattedRows = (res.data || []).map((item, index) => {

        const debit = Number(item.debit || item.debitAmount || 0);
        const credit = Number(item.credit || item.creditAmount || 0);

        runningBalance += credit - debit;

        return {
          id: index + 1,
          date: item.date || item.txnDate || "",
          description: item.description || item.particulars || "",
          debit,
          credit,
          balance: item.balance || item.runningBalance || runningBalance
        };
      });

      setRows(formattedRows);

      successToast("Ledger Loaded Successfully");

    } catch (error) {

      console.error("Ledger Error:", error);

      if (error.response?.status === 401) {
        errorToast("Session Expired. Please Login Again.");
      } else {
        errorToast("Failed to load ledger");
      }

    } finally {
      setLoading(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <Box p={3}>



      <Paper elevation={3} sx={{ p: 3 }}>

        <Typography variant="h5" mb={3}>
          Account Master Ledger
        </Typography>

        <Stack spacing={2} direction="row" alignItems="center" flexWrap="wrap">

          {/* Account Dropdown */}
          <TextField
            select
            label="Account Name"
            value={masterName}
            onChange={(e) => setMasterName(e.target.value)}
            sx={{ minWidth: 250 }}
          >
         
         {masterCodes.map((item, index) => (
  <MenuItem key={index} value={item}>
    {item}
  </MenuItem>
))}
          </TextField>

          {/* Radio Buttons */}
          <RadioGroup
            row
            value={dateMode}
            onChange={(e) => setDateMode(e.target.value)}
          >
            <FormControlLabel value="all" control={<Radio />} label="All" />
            <FormControlLabel value="range" control={<Radio />} label="Date Range" />
          </RadioGroup>

          {/* Date Range */}
          {dateMode === "range" && (
            <>
              <TextField
                type="date"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />

              <TextField
                type="date"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </>
          )}

          {/* Generate Button */}
          <Button
            variant="contained"
            onClick={fetchLedger}
            disabled={loading}
          >
            {loading
              ? <CircularProgress size={22} color="inherit" />
              : "Generate"}
          </Button>

        </Stack>

        {/* DataGrid */}
        <Box mt={3} height={500}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 20, 50]}
            loading={loading}
            disableRowSelectionOnClick
          />
        </Box>

      </Paper>
    </Box>
  );
};

export default AccountMasterLedger;