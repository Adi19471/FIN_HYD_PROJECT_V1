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

import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

const BussinessDailyFinance = () => {
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
        const loanType = "DAILY_FINANCE";

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
      } finally {
        setLoadingAccounts(false);
      }
    },
    [headers]
  );

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAccounts(searchInput);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadLoanInfo = async (loanId) => {
    if (!loanId) return;

    setLoading(true);

    try {
      const res = await axios.get(
        `${API_BASE}/loadDFLoanInformation/${loanId}`,
        { headers }
      );

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
        installmentDetailsList: (data.installmentDetailsList || []).map(
          (inst) => ({
            ...inst,
            paid: !!inst.paid,
          })
        ),
      });

      successToast("Loan details loaded successfully");
    } catch (err) {
      errorToast("Failed to load loan information");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!selectedLoanId) {
      errorToast("Select a loan first");
      return;
    }

    const principalAmount = Number(form.amountPaid) || 0;
    const lateFeeAmount = Number(form.lateFeePaid) || 0;
    const totalPaid = principalAmount + lateFeeAmount;

    if (totalPaid <= 0) {
      errorToast("Enter payment amount");
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
        amountPaid: principalAmount,
        lateFee: lateFeeAmount,
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
        `${API_BASE}/saveDFLoanInformation/${selectedLoanId}`,
        payload,
        { headers }
      );

      successToast(`Payment recorded ₹${totalPaid}`);

      setForm((prev) => ({
        ...prev,
        amountPaid: "",
        lateFeePaid: "",
      }));

      await loadLoanInfo(selectedLoanId);
    } catch (err) {
      errorToast("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f4f6f8", p: 3 }}>
        <Paper sx={{ maxWidth: 1400, margin: "0 auto", p: 3 }}>

          <Typography variant="h5" fontWeight="bold" mb={3}>
            Daily Finance Collection
          </Typography>

          {/* CUSTOMER DETAILS */}

          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" mb={2}>
              Customer Details
            </Typography>

            <Grid container spacing={2}>

              <Grid item xs={12} md={4}>
                <Autocomplete
                  options={accountList}
                  getOptionLabel={(option) => option.displayString || ""}
                  inputValue={searchInput}
                  onInputChange={(e, value) => setSearchInput(value)}
                  onChange={(e, value) =>
                    value ? loadLoanInfo(value.loanId) : null
                  }
                  loading={loadingAccounts}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Customer"
                      size="small"
                      sx={{width:300}}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingAccounts && (
                              <CircularProgress size={20} />
                            )}
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
                  size="small"
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Partner Name"
                  value={form.partnerName}
                  size="small"
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Guarantor"
                  value={form.guarantorName}
                  size="small"
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>

            </Grid>
          </Paper>

          {/* LOAN DETAILS */}

          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" mb={2}>
              Loan Details
            </Typography>

            <Grid container spacing={2}>

<Grid item xs={12} md={4}>
  <TextField
    label="Loan Amount"
    value={
      form.loanAmount
        ? Number(form.loanAmount).toLocaleString('en-IN')
        : ''
    }
    size="small"
    fullWidth
    InputProps={{ readOnly: true }}
  />
</Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Installment"
                  value={form.installmentAmount}
                  size="small"
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Period From"
                  value={form.periodFrom}
                  size="small"
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Period To"
                  value={form.periodTo}
                  size="small"
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>

            </Grid>
          </Paper>

          {/* PAYMENT */}

          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" mb={2}>
              Payment
            </Typography>

            <Grid container spacing={2}>

              <Grid item xs={12} md={4}>
                <DateTimePicker
                  label="Payment Date"
                  value={form.date}
                  onChange={(newDate) =>
                    setForm((prev) => ({ ...prev, date: newDate }))
                  }
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Paid"
                  value={form.paid}
                  fullWidth
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>

            
            <Grid item xs={12} sm={6} md={3}>
  <TextField
    label="Current Balance"
    value={
      form.balance
        ? Number(form.balance).toLocaleString('en-IN')
        : ''
    }
    fullWidth
    size="small"
    InputProps={{ readOnly: true }}
  />
</Grid>

           
           <Grid item xs={12} md={4}>
  <TextField
    label="Amount Paid"
    value={
      form.amountPaid
        ? Number(form.amountPaid).toLocaleString('en-IN')
        : ''
    }
    size="small"
    fullWidth
    onChange={(e) => {
      const rawValue = e.target.value.replace(/[^0-9]/g, "");
      setForm({
        ...form,
        amountPaid: rawValue,
      });
    }}
  />
</Grid>

            
            <Grid item xs={12} md={4}>
  <TextField
    label="Late Fee"
    value={
      form.lateFeePaid
        ? Number(form.lateFeePaid).toLocaleString('en-IN')
        : ''
    }
    size="small"
    fullWidth
    onChange={(e) => {
      const rawValue = e.target.value.replace(/[^0-9]/g, "");
      setForm({
        ...form,
        lateFeePaid: rawValue,
      });
    }}
  />
</Grid>

            </Grid>

            <Box mt={2} display="flex" gap={3} alignItems="center">

              <FormControlLabel
                control={
                  <Checkbox
                    checked={printReceipt}
                    onChange={(e) => setPrintReceipt(e.target.checked)}
                  />
                }
                label="Print Receipt"
              />

              <Button
                variant="contained"
                size="large"
                onClick={handlePay}
                disabled={loading}
              >
                {loading ? "Processing..." : "Record Payment"}
              </Button>

            </Box>
          </Paper>

          {/* INSTALLMENT TABLE */}

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Installment Details
            </Typography>

            <TableContainer
              sx={{
                maxHeight: 350,
                border: "1px solid #e0e0e0",
              }}
            >
              <Table stickyHeader size="small">

                {/* TABLE HEADER */}
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: "#1976d2", color: "#fff", fontWeight: "bold" }}>
                      Inst No
                    </TableCell>

                    <TableCell sx={{ backgroundColor: "#1976d2", color: "#fff", fontWeight: "bold" }}>
                      Due Date
                    </TableCell>

                    <TableCell sx={{ backgroundColor: "#1976d2", color: "#fff", fontWeight: "bold" }}>
                      Late Fee Date
                    </TableCell>

                    <TableCell sx={{ backgroundColor: "#1976d2", color: "#fff", fontWeight: "bold" }}>
                      Installment
                    </TableCell>

                    <TableCell sx={{ backgroundColor: "#1976d2", color: "#fff", fontWeight: "bold" }}>
                      Late Fee
                    </TableCell>

                    <TableCell sx={{ backgroundColor: "#1976d2", color: "#fff", fontWeight: "bold" }}>
                      Total
                    </TableCell>

                    <TableCell sx={{ backgroundColor: "#1976d2", color: "#fff", fontWeight: "bold" }}>
                      Paid
                    </TableCell>

                    <TableCell sx={{ backgroundColor: "#1976d2", color: "#fff", fontWeight: "bold" }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>

                {/* TABLE BODY */}
                <TableBody>
                  {form.installmentDetailsList.map((row, idx) => {


                    return (
                      <TableRow key={idx} hover>

                        <TableCell>{row.installmentNumber}</TableCell>

                        <TableCell>{row.dueDate || "-"}</TableCell>

                        <TableCell>{row.lateFeeDate || "-"}</TableCell>

                        <TableCell>₹{row.installmentAmount || 0}</TableCell>

                        <TableCell>₹{row.lateFee || 0}</TableCell>

                        <TableCell>₹{row.total || 0}</TableCell>

                        <TableCell> ₹{row.paid} </TableCell>

                        <TableCell>
                          <Typography
                            fontWeight="bold"
                            color={
                              row.paid === row.total
                                ? "success.main"
                                : row.paid > 0
                                  ? "warning.main"
                                  : "error.main"
                            }
                          >
                            {row.paid === row.total
                              ? "Completed"
                              : row.paid > 0
                                ? "Partial"
                                : "Pending"}
                          </Typography>
                        </TableCell>

                      </TableRow>
                    );

                  })}
                </TableBody>

              </Table>
            </TableContainer>
          </Paper>

        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default BussinessDailyFinance;

