import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
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
import { AppDatePicker, DataTable, PageHeader } from "src/components/ui";

const Usercollectionledger = () => {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [dateMode, setDateMode] = useState("range");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${getSession()?.token || getSession("token") || ""}`,
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/userDropDown`, getHeaders());
        setUsers(res.data || []);
      } catch (err) {
        console.log(err);
        errorToast("Failed to load users");
      }
    };
    loadUsers();
  }, []);

  const fetchLedger = async () => {
    if (!userName) {
      errorToast("Select User");
      return;
    }

    try {
      setLoading(true);
      let url = `${API_BASE}/getUsersCollectionsLedger/${userName}`;

      if (dateMode === "range") {
        if (!fromDate || !toDate) {
          errorToast("Select From and To Date");
          return;
        }
        url = `${API_BASE}/getUsersCollectionsLedger/${userName}/${fromDate}/${toDate}`;
      }

      const res = await axios.get(url, getHeaders());
      const data = (res.data || []).map((item, index) => ({ id: index + 1, ...item }));
      const totals = data.reduce(
        (acc, item) => ({
          monthlyCollection: acc.monthlyCollection + Number(item.monthlyCollection || 0),
          dailyCollection: acc.dailyCollection + Number(item.dailyCollection || 0),
          total: acc.total + Number(item.total || 0),
        }),
        { monthlyCollection: 0, dailyCollection: 0, total: 0 }
      );

      setRows(data.length ? [...data, { id: "total", date: "TOTAL", ...totals }] : data);
      successToast("Ledger loaded successfully");
    } catch (err) {
      console.log(err);
      errorToast("Failed to load ledger");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "id", headerName: "S.No", width: 90 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "monthlyCollection", headerName: "Monthly Collections", width: 220, align: "right", headerAlign: "right" },
    { field: "dailyCollection", headerName: "Daily Collections", width: 220, align: "right", headerAlign: "right" },
    { field: "total", headerName: "Total", width: 160, align: "right", headerAlign: "right" },
  ];

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title="User Collections Ledger"
        subtitle="User-wise collection ledger with MUI date-only filters and export-ready table."
        totalCount={rows.filter((row) => row.id !== "total").length}
        onRefresh={fetchLedger}
        loading={loading}
      />
      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <TextField select label="User" sx={{width:"220px"}} value={userName} onChange={(event) => setUserName(event.target.value)} fullWidth size="small">
              {users.map((user, index) => (
                <MenuItem key={index} value={user}>{user}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <RadioGroup row value={dateMode} onChange={(event) => setDateMode(event.target.value)}>
              <FormControlLabel value="all" control={<Radio />} label="All" />
              <FormControlLabel value="range" control={<Radio />} label="Date Range" />
            </RadioGroup>
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 2
            }}>
            <AppDatePicker label="From Date" value={fromDate} onChange={setFromDate} disabled={dateMode === "all"} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 2
            }}>
            <AppDatePicker label="To Date" value={toDate} onChange={setToDate} disabled={dateMode === "all"} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              md: 2
            }}>
            <Button fullWidth variant="contained" onClick={fetchLedger} disabled={loading}>
              {loading ? <CircularProgress size={22} color="inherit" /> : "Generate"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <DataTable rows={rows} columns={columns} loading={loading} title="User Collection Details" height={520} />
    </Stack>
  );
};

export default Usercollectionledger;
