import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Stack
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { successToast, errorToast } from "toastify";

import Loans from "../Loans";

const ReceiptLedger = () => {

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Table columns
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 90
    },
    {
      field: "receiptNo",
      headerName: "Receipt No",
      width: 150
    },
    {
      field: "date",
      headerName: "Date",
      width: 150
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      width: 220,
      flex: 1
    },
    {
      field: "amount",
      headerName: "Amount (₹)",
      width: 150,
      renderCell: (params) => (
        <strong>₹ {params.value}</strong>
      )
    }
  ];

  // Fetch Ledger API
  const fetchLedger = async () => {

    if (!fromDate || !toDate) {
      errorToast("Please select From and To Date");
      return;
    }

    try {

      setLoading(true);

      const session = getSession();

      const res = await axios.get(
        `${API_BASE}/ReceiptsLedger/${fromDate}/${toDate}`,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setLedgerData(res.data);

      successToast("Ledger loaded successfully");

    } catch (error) {

      console.error(error);

      errorToast(
        error?.response?.data?.message ||
        "Failed to load ledger"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
<Loans />
      <Paper elevation={3} sx={{ p: 3 }}>

        <Typography variant="h5" mb={2}>
          Receipt Ledger
        </Typography>

        {/* Filters */}
        <Stack direction="row" spacing={2} mb={3}>

          <TextField
            label="From Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <TextField
            label="To Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <Button
            variant="contained"
            onClick={fetchLedger}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Generate"
            )}
          </Button>

        </Stack>

        {/* Table */}
        <Box height={450}>

          <DataGrid
            rows={ledgerData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            loading={loading}
            disableSelectionOnClick
          />

        </Box>

      </Paper>

    </Box>
  );
};

export default ReceiptLedger;