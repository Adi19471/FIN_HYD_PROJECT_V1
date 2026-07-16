import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AccountBalanceWalletRounded, PaymentsRounded, ReceiptLongRounded } from "@mui/icons-material";
import dayjs from "dayjs";
import axios from "axios";
import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { AppDatePicker, DataTable } from "src/components/ui";

const money = (value) => Number(value || 0).toLocaleString("en-IN");
const numericInput = (value) => String(value || "").replace(/[^0-9]/g, "");

const defaultForm = () => ({
  accountNo: "",
  partnerName: "",
  guarantorName: "",
  loanAmount: 0,
  installmentAmount: 0,
  periodFrom: "",
  periodTo: "",
  date: dayjs(),
  balance: 0,
  paid: 0,
  amountPaid: "",
  lateFeePaid: "",
  installmentDetailsList: [],
});

export default function BusinessFinancePayment({
  mode,
  title,
  loanType,
  loadEndpoint,
  saveEndpoint,
}) {
  const token = getSession("token");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token || ""}` }), [token]);
  const heading = title || `${mode} Finance Collection`;
  const [accountList, setAccountList] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [printReceipt, setPrintReceipt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const rows = useMemo(
    () =>
      (form.installmentDetailsList || []).map((row, index) => ({
        id: `${row.installmentNumber || index}-${row.dueDate || index}`,
        ...row,
      })),
    [form.installmentDetailsList]
  );

  const fetchAccounts = useCallback(
    async (query = "") => {
      setLoadingAccounts(true);
      try {
        const res = await axios.get(`${API_BASE}/BusinessMember/loanDetailsAutoComplete/${loanType}`, {
          headers,
          params: { q: query },
        });
        setAccountList(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setAccountList([]);
        errorToast("Failed to load account dropdown data");
      } finally {
        setLoadingAccounts(false);
      }
    },
    [headers, loanType]
  );

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    const timer = setTimeout(() => fetchAccounts(searchInput), 350);
    return () => clearTimeout(timer);
  }, [fetchAccounts, searchInput]);

  const loadLoanInfo = async (loanId) => {
    if (!loanId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/${loadEndpoint}/${loanId}`, { headers });
      const data = res.data || {};
      setSelectedLoanId(loanId);
      setForm({
        ...defaultForm(),
        accountNo: data.accountNo || "",
        partnerName: data.partnerName || "",
        guarantorName: data.guarantorName || "",
        loanAmount: Number(data.loanAmount || 0),
        installmentAmount: Number(data.installmentAmount || 0),
        periodFrom: data.periodFrom || "",
        periodTo: data.periodTo || "",
        balance: Number(data.balance || 0),
        paid: Number(data.paid || 0),
        installmentDetailsList: Array.isArray(data.installmentDetailsList) ? data.installmentDetailsList : [],
      });
      successToast("Loan details loaded");
    } catch (err) {
      setSelectedLoanId(null);
      setForm(defaultForm());
      errorToast(err.response?.data?.message || "Failed to load loan information");
    } finally {
      setLoading(false);
    }
  };

  const printReceiptWindow = (principal, lateFee) => {
    const receipt = window.open("", "", "width=720,height=780");
    if (!receipt) return;
    const total = principal + lateFee;
    receipt.document.write(`
      <html><head><title>${heading} Receipt</title><style>
      body{font-family:Arial,sans-serif;padding:24px;color:#111827}
      .box{border:1px solid #cbd5e1;padding:22px;border-radius:10px}
      h1{margin:0 0 6px;text-align:center;font-size:22px} p{text-align:center;margin:4px 0 20px;color:#475569}
      table{width:100%;border-collapse:collapse;margin-top:14px} td{padding:10px;border-bottom:1px solid #e5e7eb}
      td:last-child{text-align:right;font-weight:700}.total td{font-size:18px;border-top:2px solid #111827}
      </style></head><body><div class="box">
      <h1>SRI BALAJI ENTERPRISES</h1><p>Amerpeta, Hyderabad.</p>
      <h2>${heading}</h2><table>
      <tr><td>Account No</td><td>${form.accountNo}</td></tr>
      <tr><td>Partner</td><td>${form.partnerName || "-"}</td></tr>
      <tr><td>Guarantor</td><td>${form.guarantorName || "-"}</td></tr>
      <tr><td>Payment Date</td><td>${form.date.format("DD-MMM-YYYY")}</td></tr>
      <tr><td>Principal Paid</td><td>Rs ${money(principal)}</td></tr>
      <tr><td>Late Fee Paid</td><td>Rs ${money(lateFee)}</td></tr>
      <tr class="total"><td>Total</td><td>Rs ${money(total)}</td></tr>
      </table></div></body></html>
    `);
    receipt.document.close();
    receipt.focus();
    receipt.print();
  };

  const handlePay = async () => {
    if (!selectedLoanId) return errorToast("Select a loan first");
    if (!form.date?.isValid()) return errorToast("Select a valid payment date");

    const principal = Number(form.amountPaid) || 0;
    const lateFee = Number(form.lateFeePaid) || 0;
    const total = principal + lateFee;
    if (total <= 0) return errorToast("Enter payment amount");

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
        date: form.date.format("YYYY-MM-DD"),
        balance: form.balance,
        paid: form.paid,
        amountPaid: principal,
        lateFee,
        dueAmount: 0,
        installmentDetailsList: rows.map((inst) => ({
          installmentNumber: inst.installmentNumber,
          principleAmount: inst.principleAmount,
          interestAmount: inst.interestAmount,
          paidAmount: inst.paidAmount,
          totalAmount: inst.totalAmount,
          installmentAmount: inst.installmentAmount,
          dueDate: inst.dueDate,
          lateFeeDate: inst.lateFeeDate,
          lateFee: inst.lateFee,
          status: inst.status,
        })),
      };

      await axios.post(`${API_BASE}/${saveEndpoint}/${selectedLoanId}`, payload, { headers });
      successToast(`Payment recorded Rs ${money(total)}`);
      if (printReceipt) printReceiptWindow(principal, lateFee);
      setForm((prev) => ({ ...prev, amountPaid: "", lateFeePaid: "" }));
      await loadLoanInfo(selectedLoanId);
    } catch (err) {
      errorToast(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "installmentNumber", headerName: "Inst No", width: 100 },
    { field: "principleAmount", headerName: "Principal", width: 130, valueFormatter: (value) => money(value) },
    { field: "interestAmount", headerName: "Interest", width: 130, valueFormatter: (value) => money(value) },
    { field: "totalAmount", headerName: "EMI", width: 130, valueFormatter: (value) => money(value) },
    { field: "paidAmount", headerName: "Paid", width: 130, valueFormatter: (value) => money(value) },
    { field: "dueDate", headerName: "Due Date", width: 140 },
    { field: "lateFeeDate", headerName: "Late From", width: 140 },
    { field: "installmentAmount", headerName: "Pending", width: 130, valueFormatter: (value) => money(value) },
    { field: "lateFee", headerName: "Late Fee", width: 120, valueFormatter: (value) => money(value) },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          size="small"
          label={value || "PENDING"}
          color={value === "PAID" ? "success" : "warning"}
          variant="outlined"
        />
      ),
    },
  ];

  return (
    <Stack spacing={2}>
      <Paper className="enterprise-card" elevation={0} sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
          <PaymentsRounded color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
            Customer
          </Typography>
          <Chip label={mode} size="small" color="primary" variant="outlined" />
          <Box sx={{ flexGrow: 1 }} />
          {loading && <CircularProgress size={22} />}
        </Stack>
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              md: 5
            }}>
            <Autocomplete
              openOnFocus
              filterOptions={(x) => x}
              fullWidth

          options={accountList}
              getOptionLabel={(option) => (typeof option === "string" ? option : option.displayString || option.loanId || "")}
              inputValue={searchInput}
              onInputChange={(_, value) => setSearchInput(value)}
              onOpen={() => fetchAccounts("")}
              onChange={(_, value) => {
                if (value) {
                  const loanId = typeof value === "string" ? value : value.loanId;
                  setSearchInput(typeof value === "string" ? value : value.displayString || value.loanId || "");
                  loadLoanInfo(loanId);
                }
              }}
              loading={loadingAccounts}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Customer / Account"
                  placeholder="Type customer name or account number"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingAccounts && <CircularProgress size={18} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 4,
              md: 2.2
            }}>
            <TextField label="Account No" value={form.accountNo} fullWidth InputProps={{ readOnly: true }} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 4,
              md: 2.4
            }}>
            <TextField label="Partner Name" value={form.partnerName} fullWidth InputProps={{ readOnly: true }} />
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 4,
              md: 2.4
            }}>
            <TextField label="Guarantor" value={form.guarantorName} fullWidth InputProps={{ readOnly: true }} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Loan Details */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <AccountBalanceWalletRounded color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Loan Details</Typography>
        </Stack>
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 6,
              sm: 3
            }}>
            <TextField label="Loan Amount" value={money(form.loanAmount)} fullWidth InputProps={{ readOnly: true }} />
          </Grid>
          <Grid
            size={{
              xs: 6,
              sm: 3
            }}>
            <TextField label="Installment" value={money(form.installmentAmount)} fullWidth InputProps={{ readOnly: true }} />
          </Grid>
          <Grid
            size={{
              xs: 6,
              sm: 3
            }}>
            <TextField label="Period From" value={form.periodFrom || "-"} fullWidth InputProps={{ readOnly: true }} />
          </Grid>
          <Grid
            size={{
              xs: 6,
              sm: 3
            }}>
            <TextField label="Period To" value={form.periodTo || "-"} fullWidth InputProps={{ readOnly: true }} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Record Payment */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <ReceiptLongRounded color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Record Payment</Typography>
        </Stack>
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 2.4
            }}>
            <AppDatePicker label="Payment Date" value={form.date} onChange={(value) => setForm((prev) => ({ ...prev, date: dayjs(value) }))} />
          </Grid>
          <Grid
            size={{
              xs: 6,
              sm: 6,
              md: 2.4
            }}>
            <TextField label="Paid So Far" value={money(form.paid)} fullWidth InputProps={{ readOnly: true }} />
          </Grid>
          <Grid
            size={{
              xs: 6,
              sm: 6,
              md: 2.4
            }}>
            <TextField label="Balance" value={money(form.balance)} fullWidth InputProps={{ readOnly: true }} />
          </Grid>
          <Grid
            size={{
              xs: 6,
              sm: 6,
              md: 2.4
            }}>
            <TextField
              label="Amount Paid"
              value={form.amountPaid ? money(form.amountPaid) : ""}
              onChange={(event) => setForm((prev) => ({ ...prev, amountPaid: numericInput(event.target.value) }))}
              fullWidth
            />
          </Grid>
          <Grid
            size={{
              xs: 6,
              sm: 6,
              md: 2.4
            }}>
            <TextField
              label="Late Fee"
              value={form.lateFeePaid ? money(form.lateFeePaid) : ""}
              onChange={(event) => setForm((prev) => ({ ...prev, lateFeePaid: numericInput(event.target.value) }))}
              fullWidth
            />
          </Grid>
        </Grid>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }} justifyContent="flex-end" sx={{ mt: 2.5 }}>
          <FormControlLabel
            control={<Checkbox checked={printReceipt} onChange={(event) => setPrintReceipt(event.target.checked)} />}
            label="Print receipt after save"
          />
          <Button variant="contained" onClick={handlePay} disabled={loading || !selectedLoanId}>
            {loading ? "Processing..." : "Record Payment"}
          </Button>
        </Stack>
      </Paper>
      <DataTable
        title={`${heading} - Installment Schedule`}
        rows={rows}
        columns={columns}
        loading={loading}
        height={520}
        pageSize={10}
        getRowId={(row) => row.id}
      />
    </Stack>
  );
}
