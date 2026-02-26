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

const Usercollectionledger = () => {

  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");

  const [dateMode, setDateMode] = useState("range");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [rows, setRows] = useState([]);

  const [loading, setLoading] = useState(false);

  const [totals, setTotals] = useState({
    monthly: 0,
    daily: 0,
    total: 0
  });

  // Table Columns
  const columns = [
    {
      field: "id",
      headerName: "S.No",
      width: 90
    },
    {
      field: "date",
      headerName: "Date",
      width: 150
    },
    {
      field: "monthlyCollection",
      headerName: "Monthly Finance Collections",
      width: 250,
      renderCell: (params) => (
        <strong>₹ {params.value || 0}</strong>
      )
    },
    {
      field: "dailyCollection",
      headerName: "Daily Finance Collections",
      width: 250,
      renderCell: (params) => (
        <strong>₹ {params.value || 0}</strong>
      )
    },
    {
      field: "total",
      headerName: "Total",
      width: 150,
      renderCell: (params) => (
        <strong>₹ {params.value || 0}</strong>
      )
    }
  ];

  // Load Users dropdown
  const loadUsers = async () => {

    try {

      const session = getSession();

      const res = await axios.get(
        `${API_BASE}/userDropDown`,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`
          }
        }
      );

      setUsers(res.data);

    } catch {

      errorToast("Failed to load users");

    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Fetch Ledger
  const fetchLedger = async () => {

    if (!userName) {
      errorToast("Select User");
      return;
    }

    try {

      setLoading(true);

      const session = getSession();

      const res = await axios.get(
        `${API_BASE}/getUsersCollectionsLedger/${userName}/${fromDate}/${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`
          }
        }
      );

      const data = res.data.map((item, index) => ({
        id: index + 1,
        ...item
      }));

      setRows(data);

      // Calculate totals
      let monthly = 0;
      let daily = 0;
      let total = 0;

      data.forEach(item => {
        monthly += item.monthlyCollection || 0;
        daily += item.dailyCollection || 0;
        total += item.total || 0;
      });

      setTotals({ monthly, daily, total });

      successToast("Ledger loaded successfully");

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
          User Collections Ledger
        </Typography>

        {/* Filters */}
        <Stack direction="row" spacing={2} alignItems="center">

          {/* User Dropdown */}
          <TextField
            select
            label="User"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            {users.map((user, index) => (
              <MenuItem key={index} value={user.userName}>
                {user.userName}
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

          {/* Generate Button */}
          <Button
            variant="contained"
            onClick={fetchLedger}
            disabled={loading}
          >
            {loading
              ? <CircularProgress size={22} color="inherit"/>
              : "Generate"}
          </Button>

        </Stack>

        {/* Table */}
        <Box mt={3} height={400}>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20]}
            loading={loading}
          />

        </Box>

        {/* Totals */}
        <Box mt={2}>

          <Typography variant="h6">
            Total Monthly: ₹ {totals.monthly}
          </Typography>

          <Typography variant="h6">
            Total Daily: ₹ {totals.daily}
          </Typography>

          <Typography variant="h6">
            Grand Total: ₹ {totals.total}
          </Typography>

        </Box>

      </Paper>

    </Box>
  );
};

export default Usercollectionledger;