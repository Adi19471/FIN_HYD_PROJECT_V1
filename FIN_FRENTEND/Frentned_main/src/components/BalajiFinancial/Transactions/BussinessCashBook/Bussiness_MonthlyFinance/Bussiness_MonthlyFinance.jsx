import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import axios from "axios";
import { successToast, errorToast } from "toastify"; // assuming this exists
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

const BusinessMonthlyFinance = () => {
  const token = getSession("token");
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token || ""}`,
    }),
    [token]
  );

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
    date: dayjs(),
    balance: 0,
    paid: "",
    amountPaid: "",
    lateFeePaid: "",
    installmentDetailsList: [],
  });

  const fetchAccounts = useCallback(
    async (query = "") => {
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
        setAccountList([]);
      } finally {
        setLoadingAccounts(false);
      }
    },
    [headers]
  );

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAccounts(searchInput);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, fetchAccounts]);

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
        date: dayjs(),
        balance: data.balance || 0,
        paid: data.paid || "",
        amountPaid: "",
        lateFeePaid: "",
        installmentDetailsList: (data.installmentDetailsList || []).map((inst) => ({
          ...inst,
          paid: !!inst.paid,
        })),
      });

      successToast("Loan details loaded");
    } catch (err) {
      errorToast("Failed to load loan information");
      setSelectedLoanId(null);
      setForm((prev) => ({
        ...prev,
        accountNo: "",
        partnerName: "",
        guarantorName: "",
        balance: 0,
        paid: "",
        installmentDetailsList: [],
      }));
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!selectedLoanId) {
      errorToast("Please select a loan account first");
      return;
    }

    const principal = Number(form.amountPaid) || 0;
    const lateFee = Number(form.lateFeePaid) || 0;
    const total = principal + lateFee;

    if (total <= 0) {
      errorToast("Please enter at least one payment amount");
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
        date: form.date.format("YYYY-MM-DD HH:mm:ss"),
        balance: form.balance,
        paid: form.paid,
        amountPaid: principal,
        lateFee,
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

      await axios.post(`${API_BASE}/saveMFLoanInformation/${selectedLoanId}`, payload, { headers });

      let msg = `Payment of ₹${total.toLocaleString()} recorded`;
      if (principal > 0 && lateFee > 0) {
        msg = `₹${principal.toLocaleString()} (principal) + ₹${lateFee.toLocaleString()} (late fee)`;
      } else if (lateFee > 0) {
        msg = `Late fee ₹${lateFee.toLocaleString()} collected`;
      } else {
        msg = `Installment ₹${principal.toLocaleString()} paid`;
      }

      successToast(msg);

      if (printReceipt) {
        successToast("Receipt printing triggered...");
        // → here you can call window.print() or open receipt modal/window
      }

      setForm((prev) => ({ ...prev, amountPaid: "", lateFeePaid: "" }));
      await loadLoanInfo(selectedLoanId);
    } catch (err) {
      errorToast("Payment failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f8fafc", minHeight: "100vh" }}>
        <Typography variant="h5" component="h1" fontWeight={600} color="primary.dark" gutterBottom>
          Monthly Finance – Customer Payment
        </Typography>

        {/* Search & Basic Info */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={2.5} alignItems="flex-end">
            <Grid item xs={12} md={5}>
              <Autocomplete
                fullWidth
                options={accountList}
                getOptionLabel={(option) => option.displayString || ""}
                inputValue={searchInput}
                onInputChange={(_, value, reason) => {
                  if (reason === "input" || reason === "reset") {
                    setSearchInput(value);
                  }
                }}
                onChange={(_, value) => {
                  if (value) {
                    loadLoanInfo(value.loanId);
                    setSearchInput(value.displayString || "");
                  } else {
                    setSelectedLoanId(null);
                    setForm((p) => ({
                      ...p,
                      accountNo: "",
                      partnerName: "",
                      guarantorName: "",
                      balance: 0,
                      paid: "",
                      installmentDetailsList: [],
                    }));
                  }
                }}
                loading={loadingAccounts}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Customer / Account"
                    placeholder="Name or Account Number..."
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingAccounts && <CircularProgress size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6} sm={4} md={2.5}>
              <TextField label="Account No" value={form.accountNo} size="small" fullWidth InputProps={{ readOnly: true }} />
            </Grid>

            <Grid item xs={6} sm={4} md={2.5}>
              <TextField label="Partner Name" value={form.partnerName} size="small" fullWidth InputProps={{ readOnly: true }} />
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <TextField label="Guarantor" value={form.guarantorName} size="small" fullWidth InputProps={{ readOnly: true }} />
            </Grid>
          </Grid>
        </Paper>

        {/* Loan Summary */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary" gutterBottom>
            Loan Details
          </Typography>
          <Grid container spacing={2.5}>
            <Grid item xs={6} sm={3}>
              <TextField label="Loan Amount" value={form.loanAmount?.toLocaleString() || 0} size="small" fullWidth InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="Installment" value={form.installmentAmount?.toLocaleString() || 0} size="small" fullWidth InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="From" value={form.periodFrom || "-"} size="small" fullWidth InputProps={{ readOnly: true }} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="To" value={form.periodTo || "-"} size="small" fullWidth InputProps={{ readOnly: true }} />
            </Grid>
          </Grid>
        </Paper>

        {/* Payment Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 5, borderRadius: 2, bgcolor: "#fff8e1" }}>
          <Typography variant="h6" fontWeight={600} color="warning.dark" gutterBottom>
            Record Payment
          </Typography>

          <Grid container spacing={2.5} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={4}>
              <DateTimePicker
                label="Payment Date & Time"
                value={form.date}
                onChange={(newValue) => setForm((p) => ({ ...p, date: newValue }))}
                slotProps={{ textField: { size: "small", fullWidth: true } }}
                ampm={false}
              />
            </Grid>

            <Grid item xs={6} sm={3} md={2}>
              <TextField label="Paid So Far" value={form.paid || 0} size="small" fullWidth InputProps={{ readOnly: true }} />
            </Grid>

            <Grid item xs={6} sm={3} md={2}>
              <TextField label="Balance" value={form.balance?.toLocaleString() || 0} size="small" fullWidth InputProps={{ readOnly: true }} />
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                label="Principal Paid"
                value={form.amountPaid}
                onChange={(e) => setForm((p) => ({ ...p, amountPaid: e.target.value.replace(/[^0-9]/g, "") }))}
                placeholder="0"
                size="small"
                fullWidth
              />
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                label="Late Fee"
                value={form.lateFeePaid}
                onChange={(e) => setForm((p) => ({ ...p, lateFeePaid: e.target.value.replace(/[^0-9]/g, "") }))}
                placeholder="0"
                size="small"
                fullWidth
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
            <FormControlLabel
              control={<Checkbox checked={printReceipt} onChange={(e) => setPrintReceipt(e.target.checked)} />}
              label="Print Receipt"
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handlePay}
              disabled={loading || (!form.amountPaid && !form.lateFeePaid) || !form.date?.isValid() || !selectedLoanId}
              sx={{ minWidth: 200, py: 1.3 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Record Payment"}
            </Button>
          </Box>
        </Paper>

        {/* Installment Table */}
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4 }}>
          Installment Schedule
        </Typography>

        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: "primary.light" }}>
              <TableRow>
                <TableCell>Inst. No</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Late From</TableCell>
                <TableCell align="right">Installment</TableCell>
                <TableCell align="right">Late Fee</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {form.installmentDetailsList.map((row, index) => {
                const total = (row.installmentAmount || 0) + (row.lateFee || 0);
                return (
                  <TableRow key={index} hover>
                    <TableCell>{row.installmentNumber}</TableCell>
                    <TableCell>{row.dueDate || "-"}</TableCell>
                    <TableCell>{row.lateFeeDate || "-"}</TableCell>
                    <TableCell align="right">₹{(row.installmentAmount || 0).toLocaleString()}</TableCell>
                    <TableCell align="right">₹{(row.lateFee || 0).toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <strong>₹{total.toLocaleString()}</strong>
                    </TableCell>
                    <TableCell align="center">
                      <Typography color={row.paid ? "success.main" : "error.main"} fontWeight="medium">
                        {row.paid ? "Paid" : "Pending"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
              {form.installmentDetailsList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No installments loaded — select a loan account
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </LocalizationProvider>
  );
};

export default BusinessMonthlyFinance;