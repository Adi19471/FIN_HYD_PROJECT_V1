import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableContainer,
  Divider,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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
  const [selectedInstallments, setSelectedInstallments] = useState([]);

  const [form, setForm] = useState({
    accountNo: "",
    partnerName: "",
    guarantorName: "",
    loanAmount: 0,
    installmentAmount: 0,
    periodFrom: "",
    periodTo: "",
    date: dayjs(),
    paid: false,
    balance: 0,
    amountPaid: "",
    lateFee: 0,
    pendingLateFee: 0,
    dueAmount: 0,
    installmentDetailsList: [],
  });

  // Fetch accounts with live search
  const fetchAccounts = useCallback(async (query = "") => {
    setLoadingAccounts(true);
    try {
      const loanType = "MONTHLY";
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

  // Initial load
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Debounced search on input change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAccounts(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, fetchAccounts]);

  // Load loan information
  const loadLoanInfo = async (loanId) => {
    if (!loanId) return;

    try {
      const res = await axios.get(`${API_BASE}/loadMFLoanInformation/${loanId}`,{headers});
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
        date: data.date ? dayjs(data.date) : dayjs(),
        paid: !!data.paid,
        balance: data.balance || 0,
        amountPaid: "",
        lateFee: data.lateFee || 0,
        pendingLateFee: data.pendingLateFee || 0,
        dueAmount: 0,
        installmentDetailsList: (data.installmentDetailsList || []).map((inst) => ({
          ...inst,
          paid: !!inst.paid,
        })),
      });

      setSelectedInstallments([]);
      successToast("Loan details loaded successfully");
    } catch (err) {
      errorToast("Failed to load loan information");
      console.error(err);
    }
  };

  // Toggle single installment
  const toggleInstallment = (index) => {
    setSelectedInstallments((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Select all unpaid installments
  const toggleSelectAll = () => {
    const unpaidIndices = form.installmentDetailsList
      .map((inst, idx) => (inst.paid ? null : idx))
      .filter((idx) => idx !== null);

    if (selectedInstallments.length === unpaidIndices.length) {
      setSelectedInstallments([]);
    } else {
      setSelectedInstallments(unpaidIndices);
    }
  };

  // Auto-calculate due amount
  useEffect(() => {
    const total = selectedInstallments.reduce((sum, idx) => {
      const inst = form.installmentDetailsList[idx];
      return sum + (Number(inst?.installmentAmount) || 0) + (Number(inst?.lateFee) || 0);
    }, 0);
    setForm((prev) => ({ ...prev, dueAmount: total }));
  }, [selectedInstallments, form.installmentDetailsList]);

  // Handle Pay
  const handlePay = () => {
    if (selectedInstallments.length === 0) {
      errorToast("Please select at least one installment");
      return;
    }

    const paidAmt = Number(form.amountPaid) || 0;
    if (paidAmt < form.dueAmount) {
      errorToast(`Paid amount ₹${paidAmt} is less than due ₹${form.dueAmount}`);
      return;
    }

    const updatedList = [...form.installmentDetailsList];
    selectedInstallments.forEach((idx) => {
      updatedList[idx] = { ...updatedList[idx], paid: true };
    });

    setForm((prev) => ({
      ...prev,
      installmentDetailsList: updatedList,
      balance: prev.balance - form.dueAmount,
      amountPaid: "",
      dueAmount: 0,
    }));

    setSelectedInstallments([]);
    successToast(`Payment of ₹${form.dueAmount} applied successfully!`);

    if (printReceipt) {
      successToast("Receipt printing triggered...");
    }
  };

  // Save loan info
  const saveLoanInfo = async () => {
    if (!selectedLoanId) {
      errorToast("No loan selected");
      return;
    }

    try {
      const payload = {
        ...form,
        date: form.date.format("YYYY-MM-DD"),
        installmentDetailsList: form.installmentDetailsList.map((inst) => ({
          ...inst,
          paid: inst.paid ? 1 : 0,
        })),
      };

      await axios.post(
        `${API_BASE}/saveMFLoanInformation/${selectedLoanId}`,
        payload,
        { headers }
      );

      successToast("Loan information saved successfully!");
    } catch (err) {
      errorToast("Save failed");
      console.error(err);
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

            {/* Search & Account No */}
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} md={8}>
                <Autocomplete sx={{width:"225px"}}
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
                  noOptionsText="Type to search accounts..."
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Customer / Account Number"
                      placeholder="Type name or account no..."
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
              <Grid item xs={12} md={4}>
                <TextField
                  label="Account No"
                  value={form.accountNo}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            {/* Customer & Loan Details - No disabled, just read-only where needed */}
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField label="Partner Name" value={form.partnerName} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField label="Guarantor Name" value={form.guarantorName} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField label="Loan Amount" value={form.loanAmount} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField label="Installment Amount" value={form.installmentAmount} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField label="Period From" value={form.periodFrom} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField label="Period To" value={form.periodTo} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField label="Pending Late Fee" value={form.pendingLateFee} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Payment Section */}
            <Typography variant="h6" mb={2}>Payment Details</Typography>
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Payment Date"
                  value={form.date}
                  onChange={(date) => setForm({ ...form, date })}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Amount Paid"
                  value={form.amountPaid}
                  onChange={(e) => setForm({ ...form, amountPaid: e.target.value.replace(/[^0-9.]/g, "") })}
                  fullWidth
                  size="small"
                  type="number"
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField label="Current Balance" value={form.balance} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField label="Due Amount" value={form.dueAmount} fullWidth size="small" InputProps={{ readOnly: true }} />
              </Grid>
            </Grid>

            <Box display="flex" alignItems="center" gap={3} mb={4}>
              <FormControlLabel
                control={<Checkbox checked={printReceipt} onChange={(e) => setPrintReceipt(e.target.checked)} />}
                label="Print Receipt"
              />
              <Button variant="contained" color="primary" size="large" onClick={handlePay}>
                Pay Now
              </Button>
            </Box>

            {/* Installments Table */}
            <TableContainer component={Paper} elevation={3}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedInstallments.length > 0 && selectedInstallments.length === form.installmentDetailsList.filter((i) => !i.paid).length}
                        indeterminate={selectedInstallments.length > 0 && selectedInstallments.length < form.installmentDetailsList.filter((i) => !i.paid).length}
                        onChange={toggleSelectAll}
                      />
                    </TableCell>
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
                    const total = (Number(row.installmentAmount) || 0) + (Number(row.lateFee) || 0);
                    return (
                      <TableRow key={idx} hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedInstallments.includes(idx)}
                            onChange={() => toggleInstallment(idx)}
                            disabled={row.paid}
                          />
                        </TableCell>
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

            <Box mt={5} textAlign="right">
              <Button
                variant="contained"
                color="success"
                size="large"
                onClick={saveLoanInfo}
                disabled={!selectedLoanId}
              >
                Save Loan Information
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default Business_MonthlyFinance;