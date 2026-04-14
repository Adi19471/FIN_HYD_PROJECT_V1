import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  Divider,
  Autocomplete,
  CircularProgress,
  TablePagination,
  Skeleton,
  TextField,          // ← Added for smooth loading
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";

const Customer_Report = () => {
  const [accountOptions, setAccountOptions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const token = getSession()?.token || getSession("token") || "";
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // Fetch Account Master Codes
  const fetchMasterCodes = useCallback(async () => {
    setLoadingAccounts(true);
    try {
      const res = await axios.get(
        `${API_BASE}/account-master-droddown/findAllMasterCodes`,
        { headers }
      );
      const options = res.data.map((code) => ({
        label: code,
        value: code,
      }));
      setAccountOptions(options);
    } catch (err) {
      console.error("Failed to fetch master codes:", err);
      setAccountOptions([]);
    } finally {
      setLoadingAccounts(false);
    }
  }, [headers]);

  // Fetch Report
  const fetchReport = useCallback(async (accountCode) => {
    if (!accountCode) return;

    setLoadingReport(true);
    setError(null);
    setReportData([]);        // Clear immediately to avoid old data flash

    try {
      const res = await axios.get(
        `${API_BASE}/customerReportController/${encodeURIComponent(accountCode)}`,
        { headers }
      );
      setReportData(res.data || []);
      setPage(0);
    } catch (err) {
      console.error("Report fetch error:", err);
      setError("Failed to load report. Please try again.");
      setReportData([]);
    } finally {
      setLoadingReport(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchMasterCodes();
  }, [fetchMasterCodes]);

  const handleAccountSelect = (event, newValue) => {
    setSelectedAccount(newValue);
    if (newValue?.value) {
      fetchReport(newValue.value);
    } else {
      setReportData([]);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const totals = useMemo(() => {
    const totalCredits = reportData.reduce((sum, item) => sum + (item.credits || 0), 0);
    const totalDebits = reportData.reduce((sum, item) => sum + (item.debits || 0), 0);
    const totalBalance = reportData.reduce((sum, item) => sum + (item.balance || 0), 0);
    return { totalCredits, totalDebits, totalBalance };
  }, [reportData]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Search Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={accountOptions}
              loading={loadingAccounts}
              value={selectedAccount}
              onChange={handleAccountSelect}
              sx={{width:"220px"}}
              getOptionLabel={(option) => option?.label || ""}
              isOptionEqualToValue={(option, value) => option.value === value?.value}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Account Head"
                  placeholder="Choose an account..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingAccounts && <CircularProgress color="inherit" size={20} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => selectedAccount?.value && fetchReport(selectedAccount.value)}
              disabled={loadingReport || !selectedAccount}
            >
              Generate Report
            </Button>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button variant="outlined" size="small">🖨️ Print</Button>
              <Button variant="outlined" size="small" color="error">PDF</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Company Header */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">SRI BALAJI ENTERPRISES</Typography>
        <Typography>Madhura Nagar, Hyderabad.</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Date: {dayjs().format("DD-MMM-YYYY")}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {loadingReport ? (
        <LoadingSpinner />
      ) : error ? (
        <Typography color="error" align="center" sx={{ my: 4 }}>{error}</Typography>
      ) : reportData.length === 0 && !selectedAccount ? (
        <Typography align="center" color="text.secondary" sx={{ my: 4 }}>
          Please select an Account Head to generate the report
        </Typography>
      ) : (
        <>
          {selectedAccount && (
            <Typography variant="h6" align="center" gutterBottom>
              {selectedAccount.label}
            </Typography>
          )}

          <TableContainer 
            component={Paper} 
            sx={{ 
              border: "1px solid #ddd",
              minHeight: "450px",           // ← Prevents jumping/shaking
              overflow: "auto"
            }}
          >
            <Table sx={{ minWidth: 900, borderCollapse: "collapse" }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell sx={{ border: "1px solid #ccc", fontWeight: "bold" }}>S.No</TableCell>
                  <TableCell sx={{ border: "1px solid #ccc", fontWeight: "bold" }}>Customer ID</TableCell>
                  <TableCell sx={{ border: "1px solid #ccc", fontWeight: "bold" }}>Customer Name</TableCell>
                  <TableCell align="right" sx={{ border: "1px solid #ccc", fontWeight: "bold" }}>Credits</TableCell>
                  <TableCell align="right" sx={{ border: "1px solid #ccc", fontWeight: "bold" }}>Debits</TableCell>
                  <TableCell align="right" sx={{ border: "1px solid #ccc", fontWeight: "bold" }}>Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loadingReport ? (
                  // Skeleton rows while loading
                  Array.from(new Array(5)).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ border: "1px solid #ccc" }}><Skeleton /></TableCell>
                      <TableCell sx={{ border: "1px solid #ccc" }}><Skeleton /></TableCell>
                      <TableCell sx={{ border: "1px solid #ccc" }}><Skeleton width="60%" /></TableCell>
                      <TableCell align="right"><Skeleton /></TableCell>
                      <TableCell align="right"><Skeleton /></TableCell>
                      <TableCell align="right"><Skeleton /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  reportData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={row.sno || index}>
                        <TableCell sx={{ border: "1px solid #ccc" }}>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell sx={{ border: "1px solid #ccc" }}>{row.customerId}</TableCell>
                        <TableCell sx={{ border: "1px solid #ccc" }}>{row.customerName}</TableCell>
                        <TableCell align="right" sx={{ border: "1px solid #ccc" }}>
                          {Number(row.credits || 0).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell align="right" sx={{ border: "1px solid #ccc" }}>
                          {Number(row.debits || 0).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            border: "1px solid #ccc",
                            fontWeight: "bold",
                            color: (row.balance || 0) >= 0 ? "green" : "red",
                          }}
                        >
                          {Number(row.balance || 0).toLocaleString("en-IN")}
                        </TableCell>
                      </TableRow>
                    ))
                )}

                {/* Total Row */}
                {!loadingReport && reportData.length > 0 && (
                  <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                    <TableCell colSpan={3} align="right" sx={{ border: "1px solid #ccc", fontWeight: "bold" }}>
                      Total
                    </TableCell>
                    <TableCell align="right" sx={{ border: "1px solid #ccc", fontWeight: "bold" }}>
                      {totals.totalCredits.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell align="right" sx={{ border: "1px solid #ccc", fontWeight: "bold" }}>
                      {totals.totalDebits.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell align="right" sx={{ border: "1px solid #ccc", fontWeight: "bold", color: "green" }}>
                      {totals.totalBalance.toLocaleString("en-IN")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {reportData.length > 0 && (
            <TablePagination
              component="div"
              count={reportData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 15, 20]}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default Customer_Report;