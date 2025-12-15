import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableContainer,
  Divider,
  Autocomplete,
  CircularProgress,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"; // Changed to DateTimePicker
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import axios from "axios";
import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

const Business_MonthlyFinance = () => {
  const headers = {
    Authorization: `Bearer ${getSession("token") || ""}`,
  };

  const [accountList, setAccountList] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [printReceipt, setPrintReceipt] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    accountNo: "",
    partnerName: "",
    guarantorName: "",
    loanAmount: 0,
    installmentAmount: 0,
    periodFrom: "",
    periodTo: "",
    date: dayjs(), // Now includes date + time (default: now)
    balance: 0,
    amountPaid: "",
    pendingLateFee: 0,
    installmentDetailsList: [],
  });

  // Fetch accounts for autocomplete
  const fetchAccounts = useCallback(async (query = "") => {
    setLoadingAccounts(true);
    try {
      const loanType = "MONTHLY_FINANCE";
      const res = await axios.get(
        `${API_BASE}/BusinessMember/loanDetailsAutoComplete/${loanType}`,
        {
          headers,
          params: { q: query },
        }
      );
      setAccountList(res.data || []);
    } catch (err) {
      errorToast("Failed to load accounts");
      console.error(err);
    } finally {
      setLoadingAccounts(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAccounts(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, fetchAccounts]);

  // Load loan details when user selects an account
  const loadLoanInfo = async (loanId) => {
    if (!loanId) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/loadMFLoanInformation/${loanId}`, { headers });
      const data = res.data;

      setSelectedLoanId(loanId);

      setForm({
        accountNo: data.accountNo || "",
        partnerName: data.partnerName || "",
        guarantorName: data.guarantorName || "",
        loanAmount: data.loanAmount || 0,
        installmentAmount: data.installmentAmount || 0,
        periodFrom: data.periodFrom || "",
        periodTo: data.periodTo || "",
        date: dayjs(), // Always reset to current date & time when loading
        balance: data.balance || 0,
        amountPaid: "",
        pendingLateFee: data.pendingLateFee || 0,
        installmentDetailsList: (data.installmentDetailsList || []).map((inst) => ({
          ...inst,
          paid: !!inst.paid,
        })),
      });

      successToast("Loan details loaded successfully");
    } catch (err) {
      errorToast("Failed to load loan information");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Pay Now
  const handlePay = async () => {
    if (!selectedLoanId) {
      errorToast("Please select a loan account first");
      return;
    }

    const amount = Number(form.amountPaid);
    if (!amount || amount <= 0) {
      errorToast("Please enter a valid amount to pay");
      return;
    }

    if (!form.date?.isValid()) {
      errorToast("Please select a valid date and time");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        accountNo: form.accountNo,
        partnerName: form.partnerName,
        guarantorName: form.guarantorName,
        loanAmount: form.loanAmount,
        installmentAmount: form.installmentAmount,
        periodFrom: form.periodFrom,
        periodTo: form.periodTo,
        date: form.date.format("YYYY-MM-DD HH:mm:ss"), // Full datetime sent to backend
        balance: form.balance,
        amountPaid: amount,
        pendingLateFee: form.pendingLateFee,
        lateFee: 0,
        dueAmount: 0,
        installmentDetailsList: form.installmentDetailsList.map((inst) => ({
          installmentNumber: inst.installmentNumber,
          dueDate: inst.dueDate,
          lateFeeDate: inst.lateFeeDate,
          installmentAmount: inst.installmentAmount,
          lateFee: inst.lateFee || 0,
          total: (inst.installmentAmount || 0) + (inst.lateFee || 0),
          paid: inst.paid ? 1 : 0,
        })),
      };

      await axios.post(
        `${API_BASE}/saveMFLoanInformation/${selectedLoanId}`,
        payload,
        { headers }
      );

      successToast(`Payment of ₹${amount} recorded successfully!`);

      if (printReceipt) {
        successToast("Receipt printing triggered...");
      }

      setForm(prev => ({ ...prev, amountPaid: "" }));
      await loadLoanInfo(selectedLoanId); // Reload fresh data
    } catch (err) {
      errorToast("Payment failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" height="100vh" bgcolor="#f5f5f5">
        <Box flexGrow={1} p={3} sx={{ overflowY: "auto" }}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" fontWeight="bold" mb={4}>
              Monthly Finance - Payment Collection
            </Typography>

            {/* Search Account */}
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={accountList}
                  getOptionLabel={(option) => option.displayString || ""}
                  inputValue={searchInput}
                  onInputChange={(e, value, reason) => {
                    if (reason === "input" || reason === "reset") {
                      setSearchInput(value);
                    }
                  }}
                  onChange={(e, value) => {
                    if (value) {
                      loadLoanInfo(value.loanId);
                      setSearchInput(value.displayString || "");
                    }
                  }}
                  loading={loadingAccounts}
                  noOptionsText="Type to search customer or account..."
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Customer / Account"
                      placeholder="Name or Account No"
                      size="small"
                      fullWidth
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
              <Grid item xs={12} md={6}>
                <TextField
                  label="Account No"
                  value={form.accountNo}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>

            {/* Loan & Customer Details */}
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField label="Partner Name" value={form.partnerName} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField label="Guarantor Name" value={form.guarantorName} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField label="Loan Amount" value={form.loanAmount} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField label="Installment Amount" value={form.installmentAmount} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField label="Period From" value={form.periodFrom} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField label="Period To" value={form.periodTo} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField label="Pending Late Fee" value={form.pendingLateFee} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField label="Current Balance" value={form.balance} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Payment Input Section */}
            <Typography variant="h6" mb={2}>Record Payment</Typography>
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} sm={6} md={4}>
                <DateTimePicker
                  label="Payment Date & Time"
                  value={form.date}
                  onChange={(newDate) => setForm(prev => ({ ...prev, date: newDate }))}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                  ampm={false} // Optional: use 24-hour format
                />
              </Grid>

              {/* Display selected date & time */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Selected Payment Date & Time"
                  value={form.date?.isValid() ? form.date.format("DD-MM-YYYY HH:mm") : "-"}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Amount Paid"
                  value={form.amountPaid}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    amountPaid: e.target.value.replace(/[^0-9]/g, "")
                  }))}
                  fullWidth
                  size="small"
                  placeholder="Enter payment amount"
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>

            <Box display="flex" alignItems="center" gap={3} mb={4}>
              <FormControlLabel
                control={<Checkbox checked={printReceipt} onChange={(e) => setPrintReceipt(e.target.checked)} />}
                label="Print Receipt"
              />
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handlePay}
                disabled={loading || !form.amountPaid || !form.date?.isValid()}
              >
                {loading ? "Processing..." : "Pay Now"}
              </Button>
            </Box>

            {/* Installments Table */}
            <TableContainer component={Paper} elevation={3}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
                  <TableRow>
                    <TableCell><strong>Inst. No</strong></TableCell>
                    <TableCell><strong>Due Date</strong></TableCell>
                    <TableCell><strong>Late Fee Date</strong></TableCell>
                    <TableCell><strong>Installment</strong></TableCell>
                    <TableCell><strong>Late Fee</strong></TableCell>
                    <TableCell><strong>Total</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {form.installmentDetailsList.map((row, idx) => {
                    const total = (row.installmentAmount || 0) + (row.lateFee || 0);
                    return (
                      <TableRow key={idx} hover>
                        <TableCell>{row.installmentNumber}</TableCell>
                        <TableCell>{row.dueDate || "-"}</TableCell>
                        <TableCell>{row.lateFeeDate || "-"}</TableCell>
                        <TableCell>₹{row.installmentAmount}</TableCell>
                        <TableCell>₹{row.lateFee || 0}</TableCell>
                        <TableCell><strong>₹{total}</strong></TableCell>
                        <TableCell>
                          <Typography color={row.paid ? "success.main" : "error.main"} fontWeight="medium">
                            {row.paid ? "Paid" : "Pending"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Business_MonthlyFinance;