import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  TextField,
  Grid,
  Autocomplete,
  CircularProgress,
  Divider,
  FormControlLabel,
} from "@mui/material";
import { Print } from "@mui/icons-material";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

const token = getSession()?.token || getSession("token") || "";

const CustomerTransactions = () => {
  const [masterCodes, setMasterCodes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedAccountCode, setSelectedAccountCode] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [reportDate] = useState(dayjs().format("DD-MMM-YYYY"));

  const printRef = useRef(null);

  // Fetch Master Codes (Account Names)
  const fetchMasterCodes = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/account-master-droddown/findAllMasterCodes`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMasterCodes(res.data || []);
    } catch (err) {
      console.error("Error fetching master codes:", err);
    }
  };

  // Fetch Customers for Autocomplete
  const fetchCustomers = async (query) => {
    if (!query || query.length < 2) return;
    setSearchLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/PersonalInfo/autocomplete?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCustomers(res.data || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Fetch Transactions
  const fetchTransactions = async () => {
    if (!selectedAccountCode || !selectedCustomer?.id) {
      alert("Please select both Account Name and Customer");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/CustomerTransaction`,
        {
          accountCode: selectedAccountCode,
          customerId: selectedCustomer.id,
          fromDate: fromDate || "",
          toDate: toDate || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setTransactions(res.data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      alert("Failed to load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterCodes();
  }, []);

  // Calculate Totals
  const totals = React.useMemo(() => {
    const credit = transactions.reduce((sum, t) => sum + (parseFloat(t.credit) || 0), 0);
    const debit = transactions.reduce((sum, t) => sum + (parseFloat(t.debit) || 0), 0);
    return { credit, debit };
  }, [transactions]);

  // Print Handler (Better approach)
  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Ledger Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #1976d2; color: white; }
            .total-row { background-color: #e3f2fd; font-weight: bold; }
            .text-right { text-align: right; }
            .header { text-align: center; margin-bottom: 30px; }
            .green { color: green; }
            .red { color: red; }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Typography variant="h5" gutterBottom>
        Customer Transactions / Ledger
      </Typography>

      {/* Search Panel - Matching Screenshot Style */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Autocomplete
              options={masterCodes}
              sx={{width:"220px"}}
              value={selectedAccountCode}
              onChange={(e, val) => setSelectedAccountCode(val)}
              renderInput={(params) => <TextField {...params} label="Account Name" size="small" fullWidth />}
            />
          </Grid>

          <Grid item xs={12} sm={5}>
            <Autocomplete  sx={{width:"220px"}}
              options={customers}
              getOptionLabel={(opt) => `${opt.id ? opt.id + " - " : ""}${opt.firstname} ${opt.lastname} ${opt.mobile ? "- " + opt.mobile : ""}`}
              value={selectedCustomer}
              onChange={(e, val) => setSelectedCustomer(val)}
              onInputChange={(e, value) => value.length >= 2 && fetchCustomers(value)}
              loading={searchLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Customer Name"
                  size="small"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: searchLoading ? <CircularProgress size={20} /> : params.InputProps.endAdornment,
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControlLabel
              control={<input type="radio" checked />}
              label="All"
            />
            <FormControlLabel
              control={<input type="radio" />}
              label="Date Range"
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              label="From"
              type="date"
              size="small"
              fullWidth
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              label="To"
              type="date"
              size="small"
              fullWidth
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={fetchTransactions}
              disabled={loading || !selectedAccountCode || !selectedCustomer}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              Generate
            </Button>
          </Grid>

          {transactions.length > 0 && (
            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                startIcon={<Print />}
                onClick={handlePrint}
                fullWidth
              >
                Print / PDF
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Printable Ledger Area */}
      {transactions.length > 0 && (
        <Paper ref={printRef} sx={{ p: 4, backgroundColor: "white" }}>
          <Box className="header">
            <Typography variant="h4" fontWeight="bold">
              SRI BALAJI ENTERPRISES
            </Typography>
            <Typography variant="h6">Madhura Nagar, Hyderabad.</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Date: {reportDate}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
            {selectedCustomer
              ? `${selectedCustomer.id ? selectedCustomer.id + " - " : ""}${selectedCustomer.firstname} ${selectedCustomer.lastname} ${selectedCustomer.mobile ? "- " + selectedCustomer.mobile : ""} ${selectedAccountCode || ""} Ledger`
              : "Ledger"}
          </Typography>

          <TableContainer>
            <Table sx={{ borderCollapse: "collapse" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  <TableCell sx={{ color: "white", border: "1px solid #aaa", fontWeight: "bold" }}>S.No</TableCell>
                  <TableCell sx={{ color: "white", border: "1px solid #aaa", fontWeight: "bold" }}>Trans ID</TableCell>
                  <TableCell sx={{ color: "white", border: "1px solid #aaa", fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ color: "white", border: "1px solid #aaa", fontWeight: "bold" }}>Account No</TableCell>
                  <TableCell sx={{ color: "white", border: "1px solid #aaa", fontWeight: "bold" }}>Transaction Name</TableCell>
                  <TableCell sx={{ color: "white", border: "1px solid #aaa", fontWeight: "bold" }}>Particulars</TableCell>
                  <TableCell align="right" sx={{ color: "white", border: "1px solid #aaa", fontWeight: "bold" }}>Credit</TableCell>
                  <TableCell align="right" sx={{ color: "white", border: "1px solid #aaa", fontWeight: "bold" }}>Debit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((row, index) => (
                  <TableRow key={row.transactionId || index}>
                    <TableCell sx={{ border: "1px solid #ddd" }}>{row.sno || index + 1}</TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>{row.transactionId}</TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      {dayjs(row.transactionDate).format("DD-MMM-YYYY")}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>{row.accountNumber}</TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>{row.transactionName}</TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>{row.particulars || "-"}</TableCell>
                    <TableCell align="right" sx={{ border: "1px solid #ddd", color: "green" }}>
                      {row.credit ? Number(row.credit).toFixed(0) : "-"}
                    </TableCell>
                    <TableCell align="right" sx={{ border: "1px solid #ddd", color: "red" }}>
                      {row.debit ? Number(row.debit).toFixed(0) : "-"}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Total Row */}
                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                  <TableCell colSpan={6} align="right" sx={{ border: "1px solid #ddd", fontWeight: "bold" }}>
                    Total
                  </TableCell>
                  <TableCell align="right" sx={{ border: "1px solid #ddd", fontWeight: "bold", color: "green" }}>
                    {totals.credit.toFixed(0)}
                  </TableCell>
                  <TableCell align="right" sx={{ border: "1px solid #ddd", fontWeight: "bold", color: "red" }}>
                    {totals.debit.toFixed(0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="body2" align="center" sx={{ mt: 4, color: "#555" }}>
            Page 1 of 1
          </Typography>
        </Paper>
      )}

      {transactions.length === 0 && !loading && selectedCustomer && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography>No transactions found for the selected criteria.</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default CustomerTransactions;