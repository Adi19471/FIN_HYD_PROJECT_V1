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
import Loans from "../Loans";

import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { successToast, errorToast } from "toastify";

const AccountMasterLedger = () => {

  const [masterCodes, setMasterCodes] = useState([]);
  const [masterName, setMasterName] = useState("");

  const [dateMode, setDateMode] = useState("range");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Table columns
  const columns = [
    { field: "id", headerName: "ID", width: 90 },

    {
      field: "date",
      headerName: "Date",
      width: 150
    },

    {
      field: "description",
      headerName: "Description",
      width: 250,
      flex: 1
    },

    {
      field: "debit",
      headerName: "Debit (₹)",
      width: 150,
      renderCell: (params) => (
        <span style={{ color: "red", fontWeight: "bold" }}>
          ₹ {params.value || 0}
        </span>
      )
    },

    {
      field: "credit",
      headerName: "Credit (₹)",
      width: 150,
      renderCell: (params) => (
        <span style={{ color: "green", fontWeight: "bold" }}>
          ₹ {params.value || 0}
        </span>
      )
    },

    {
      field: "balance",
      headerName: "Balance (₹)",
      width: 150,
      renderCell: (params) => (
        <strong>₹ {params.value || 0}</strong>
      )
    }
  ];

  // Load dropdown
  const loadMasterCodes = async () => {

    try {

      const session = getSession();

      const res = await axios.get(
        `${API_BASE}/account-master-droddown/findAllMasterCodes`,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`
          }
        }
      );

      setMasterCodes(res.data);

    } catch {

      errorToast("Failed to load account names");

    }
  };

  useEffect(() => {
    loadMasterCodes();
  }, []);

  // Fetch Ledger
  const fetchLedger = async () => {

    if (!masterName) {
      errorToast("Select Account Name");
      return;
    }

    try {

      setLoading(true);

      const session = getSession();

      const res = await axios.get(
        `${API_BASE}/getRecordsByAccountMasterCode/${masterName}/${fromDate}/${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`
          }
        }
      );

      setRows(
        res.data.map((item, index) => ({
          id: index + 1,
          ...item
        }))
      );

      successToast("Ledger Loaded");

    } catch {

      errorToast("Failed to load ledger");

    } finally {

      setLoading(false);

    }
  };

  return (
    <Box p={3}>

      <Loans />

      <Paper elevation={3} sx={{ p: 3 }}>

        <Typography variant="h5" mb={3}>
          Account Master Ledger
        </Typography>

        {/* Filters */}
        <Stack spacing={2} direction="row" alignItems="center">

          {/* Dropdown */}
          <TextField
            select
            label="Account Name"
            value={masterName}
            onChange={(e) => setMasterName(e.target.value)}
            sx={{ minWidth: 250 }}
          >
            {masterCodes.map((item, index) => (
              <MenuItem key={index} value={item.masterName}>
                {item.masterName}
              </MenuItem>
            ))}
          </TextField>

          {/* Radio */}
          <RadioGroup
            row
            value={dateMode}
            onChange={(e) => setDateMode(e.target.value)}
          >
            <FormControlLabel
              value="all"
              control={<Radio />}
              label="All"
            />

            <FormControlLabel
              value="range"
              control={<Radio />}
              label="Date Range"
            />
          </RadioGroup>

          {/* Dates */}
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

          {/* Generate */}
          <Button
            variant="contained"
            onClick={fetchLedger}
            disabled={loading}
          >
            {loading
              ? <CircularProgress size={22} color="inherit" />
              : "Generate"
            }
          </Button>

        </Stack>

        {/* Table */}
        <Box mt={3} height={450}>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            loading={loading}
          />

        </Box>

      </Paper>

    </Box>
  );
};

export default AccountMasterLedger;