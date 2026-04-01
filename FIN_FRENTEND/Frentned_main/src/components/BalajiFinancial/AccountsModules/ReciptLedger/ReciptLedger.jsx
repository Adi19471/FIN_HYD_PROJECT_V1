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


const ReceiptLedger = () => {

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [ledgerData, setLedgerData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Common Header Function (Token Passing Here)
  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${getSession()?.token || ""}`,
      "Content-Type": "application/json"
    }
  });

  // ✅ Columns based on your backend response
  const columns = [
    { field: "sno", headerName: "S.No", width: 80 },

    {
      field: "date",
      headerName: "Date",
      width: 120
    },

    {
      field: "transId",
      headerName: "Trans ID",
      width: 120
    },

    {
      field: "loanId",
      headerName: "Loan ID",
      width: 120
    },

    {
      field: "loanDate",
      headerName: "Loan Date",
      width: 120
    },

    {
      field: "customerName",
      headerName: "Customer Name",
      flex: 1,
      minWidth: 200
    },

    {
      field: "amountPaid",
      headerName: "Amount",
      width: 120,
      renderCell: (params) => (
        <strong>₹ {params.value}</strong>
      )
    },

    {
      field: "lateFee",
      headerName: "Late Fee",
      width: 100
    },

    {
      field: "total",
      headerName: "Total",
      width: 120
    },

    {
      field: "totalPaid",
      headerName: "Total Paid",
      width: 130
    },

    {
      field: "balance",
      headerName: "Balance",
      width: 130
    },

    {
      field: "currentInstallmentNumber",
      headerName: "Current Inst.",
      width: 120
    },

    {
      field: "balanceInstallmentNumber",
      headerName: "Balance Inst.",
      width: 120
    },

    {
      field: "particulars",
      headerName: "Particulars",
      flex: 1,
      minWidth: 150
    }
  ];

  // ✅ Fetch Ledger API
  const fetchLedger = async () => {

    if (!fromDate || !toDate) {
      errorToast("Please select From and To Date");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.get(
        `${API_BASE}/ReceiptsLedger/${fromDate}/${toDate}`,
        getHeaders() // 🔥 token passing correctly here
      );

      // ⚠ DataGrid needs unique "id"
      const formattedData = res.data.map((item, index) => ({
        id: index + 1,
        ...item
      }));

      setLedgerData(formattedData);

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

  

      <Paper elevation={3} sx={{ p: 3 }}>

        <Typography variant="h5" mb={2}>
          Receipt Ledger
        </Typography>

        {/* Date Filters */}
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

        {/* Ledger Table */}
        <Box height={500}>

          <DataGrid
            rows={ledgerData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            loading={loading}
            disableRowSelectionOnClick
          />

        </Box>

      </Paper>

    </Box>
  );
};

export default ReceiptLedger;