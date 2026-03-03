import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  IconButton,
} from "@mui/material";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import GridOnIcon from "@mui/icons-material/GridOn";

import axios from "axios";
import { toast } from "react-toastify";

import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";


import Loans from "../Loans";

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getSession()?.token || getSession("token") || ""}`,
    "Content-Type": "application/json",
  },
});

const AccountLedger = () => {
  const [filterType, setFilterType] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ API Call
  const handleGenerate = async () => {
    try {
      setLoading(true);

      let url = "";

      if (filterType === "ALL") {


        url = `${API_BASE}/getAccountsLedger`;
      } else {
        if (!fromDate || !toDate) {
          toast.warning("Please select From Date and To Date");
          setLoading(false);
          return;
        }
        url = `${API_BASE}/getAccountsLedger/${fromDate}/${toDate}`;
      }

      const res = await axios.get(url, getHeaders());

      if (res?.data?.length > 0) {
        const formatted = res.data.map((item, index) => ({
          id: index + 1,
          sno: index + 1,
          ...item,
        }));

        setRows(formatted);
        toast.success("Accounts Ledger Loaded Successfully ✅");
      } else {
        setRows([]);
        toast.info("No Ledger Records Found");
      }
    } catch (err) {
      console.error("Ledger API Error:", err);
      toast.error("Failed to Load Ledger ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DataGrid Columns (Same Like Screenshot)
  const columns = [
    { field: "sno", headerName: "S.No", width: 80 },

    {
      field: "accountMaster",
      headerName: "Account Master",
      flex: 1,
      minWidth: 220,
    },

    {
      field: "credit",
      headerName: "Credit",
      width: 160,
      align: "right",
      headerAlign: "right",
    },

    {
      field: "debit",
      headerName: "Debit",
      width: 160,
      align: "right",
      headerAlign: "right",
    },

    {
      field: "balance",
      headerName: "Balance",
      width: 160,
      align: "right",
      headerAlign: "right",
    },
  ];

  // ✅ Export Buttons Dummy
  const handlePrint = () => toast.info("Print feature under development 🖨️");
  const handleWord = () => toast.info("Word export under development 📄");
  const handleExcel = () => toast.info("Excel export under development 📊");
  const handlePdf = () => toast.info("PDF export under development 📑");

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2.5, borderRadius: 2 }}>
    


<Loans />
        <Divider sx={{ my: 2 }} />

        {/* TOP FILTER BAR */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <RadioGroup
            row
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <FormControlLabel value="ALL" control={<Radio />} label="All" />
            <FormControlLabel
              value="DATE_RANGE"
              control={<Radio />}
              label="Date Range"
            />
          </RadioGroup>

          <TextField
            label="From"
            type="date"
            size="small"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={filterType === "ALL"}
          />

          <TextField
            label="To"
            type="date"
            size="small"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={filterType === "ALL"}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerate}
            sx={{ px: 3 }}
          >
            Generate
          </Button>

          {/* Export Buttons Like Screenshot */}
          <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
            <IconButton onClick={handlePrint} color="primary">
              <PrintIcon />
            </IconButton>

            <IconButton onClick={handleWord} color="info">
              <DescriptionIcon />
            </IconButton>

            <IconButton onClick={handleExcel} color="success">
              <GridOnIcon />
            </IconButton>

            <IconButton onClick={handlePdf} color="error">
              <PictureAsPdfIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* REPORT TABLE */}
        <Box sx={{ height: 520, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            slots={{ toolbar: GridToolbar }}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25, 50, 100]}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 10 } },
            }}
            sx={{
              borderRadius: 2,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#cfe8ff",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-row:nth-of-type(odd)": {
                backgroundColor: "#f8fbff",
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default AccountLedger;