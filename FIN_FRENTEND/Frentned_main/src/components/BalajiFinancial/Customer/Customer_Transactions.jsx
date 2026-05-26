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
  TablePagination,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { AppDatePicker, ReportCompanyHeader, TableExportMenu } from "src/components/ui";

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
  const fetchCustomers = async (query = "") => {
    const searchText = query.trim();
    if (searchText.length === 1) return;
    setSearchLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/PersonalInfo/autocomplete?q=${encodeURIComponent(searchText)}`,
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
      setPage(0);
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
  const paginatedTransactions = React.useMemo(
    () => transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, transactions]
  );
  const exportColumns = ["sno", "transactionId", "transactionDate", "accountNumber", "transactionName", "particulars", "credit", "debit"];

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
              openOnFocus
              options={masterCodes}
              sx={{width:"220px"}}
              value={selectedAccountCode}
              onChange={(e, val) => setSelectedAccountCode(val)}
              renderInput={(params) => <TextField {...params} label="Account Name" size="small" fullWidth />}
            />
          </Grid>

          <Grid item xs={12} sm={5}>
            <Autocomplete  sx={{width:"220px"}}
              openOnFocus
              filterOptions={(x) => x}
              options={customers}
              getOptionLabel={(opt) => `${opt.id ? opt.id + " - " : ""}${opt.firstname} ${opt.lastname} ${opt.mobile ? "- " + opt.mobile : ""}`}
              value={selectedCustomer}
              onChange={(e, val) => setSelectedCustomer(val)}
              onOpen={() => fetchCustomers("")}
              onInputChange={(e, value) => fetchCustomers(value || "")}
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
            <AppDatePicker
              label="From"
              value={fromDate}
              onChange={setFromDate}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <AppDatePicker
              label="To"
              value={toDate}
              onChange={setToDate}
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
              <TableExportMenu rows={transactions} columns={exportColumns} fileName="Customer_Transactions" />
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Printable Ledger Area */}
      {transactions.length > 0 && (
        <Paper ref={printRef} sx={{ p: 4, backgroundColor: "white" }}>
          <ReportCompanyHeader
            title={selectedCustomer
              ? `${selectedCustomer.id ? selectedCustomer.id + " - " : ""}${selectedCustomer.firstname} ${selectedCustomer.lastname} ${selectedCustomer.mobile ? "- " + selectedCustomer.mobile : ""} ${selectedAccountCode || ""} Ledger`
              : "Customer Ledger"}
            subtitle={fromDate || toDate ? `From ${fromDate ? dayjs(fromDate).format("DD-MMM-YYYY") : "All"} To ${toDate ? dayjs(toDate).format("DD-MMM-YYYY") : "All"}` : "All Transactions"}
            date={reportDate}
          />

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
                {paginatedTransactions.map((row, index) => (
                  <TableRow key={row.transactionId || index}>
                    <TableCell sx={{ border: "1px solid #ddd" }}>{row.sno || page * rowsPerPage + index + 1}</TableCell>
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

          <TablePagination
            component="div"
            count={transactions.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />

          <Typography variant="body2" align="center" sx={{ mt: 4, color: "#555" }}>
            Page {page + 1} of {Math.max(1, Math.ceil(transactions.length / rowsPerPage))}
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
