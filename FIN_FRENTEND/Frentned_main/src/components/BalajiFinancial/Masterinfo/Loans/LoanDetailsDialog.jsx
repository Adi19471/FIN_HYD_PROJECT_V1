import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Grid,
  TextField,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon, Print as PrintIcon } from "@mui/icons-material";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { DataTable, ProfilePhotoBox } from "src/components/ui";

const money = (value) => Number(value || 0).toLocaleString("en-IN");

const fmtDate = (value) => (value ? String(value).slice(0, 10) : "-");

const columns = [
  {
    field: "sno",
    headerName: "S.No",
    width: 90,
  },
  {
    field: "id",
    headerName: "ID",
    width: 90,
    valueFormatter: (value) => money(value),
  },
  {
    field: "date",
    headerName: "Date",
    width: 130,
    valueFormatter: (value) => fmtDate(value),
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
    valueFormatter: (value) => fmtDate(value),
  },
  {
    field: "paid",
    headerName: "Paid",
    width: 120,
    valueFormatter: (value) => money(value),
  },
  {
    field: "totalPaid",
    headerName: "Total Paid",
    width: 120,
    valueFormatter: (value) => money(value),
  },
  {
    field: "balance",
    headerName: "Balance",
    width: 120,
    valueFormatter: (value) => money(value),
  },
  {
    field: "lateFee",
    headerName: "Late Fee",
    width: 120,
    valueFormatter: (value) => money(value),
  },
  {
    field: "cashier",
    headerName: "Cashier",
    width: 90,
  }
];


const ReadOnlyField = ({ label, value, sm = 3 }) => (
  <Grid
    size={{
      xs: 12,
      sm: sm
    }}>
    <TextField label={label} value={value ?? "-"} fullWidth size="small" InputProps={{ readOnly: true }} />
  </Grid>
);

export default function LoanDetailsDialog({ open, onClose, accountNo, loadEndpoint, personalInfoId }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [photoSrc, setPhotoSrc] = useState(null);

  const headers = {
    Authorization: `Bearer ${getSession("token") || ""}`,
  };

  useEffect(() => {
    if (!open || !accountNo) return;

    const fetchDetails = async () => {
      setLoading(true);
      setData(null);
      try {
        const res = await axios.get(`${API_BASE}/${loadEndpoint}/${accountNo}`, { headers });
        setData(res.data || {});
      } catch (err) {
        setData({});
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, accountNo, loadEndpoint]);

  const rows = (data?.emiPaymentHistoryList || []);

  const handlePrint = () => {
    if (!data) return;
    const printWindow = window.open("", "", "width=900,height=800");
    if (!printWindow) return;

    const installmentRows = rows
      .map(
        (row) => `
          <tr>
            <td>${row.sno ?? "-"}</td>
            <td>${row.id ?? "-"}</td>
            <td>${fmtDate(row.date)}</td>
            <td>${fmtDate(row.dueDate)}</td>
            <td>${money(row.paid)}</td>
            <td>${money(row.totalPaid)}</td>
            <td>${fmtDate(row.balance)}</td>
            <td>${money(row.lateFee)}</td>
            <td>${row.cashier}</td>
          </tr>`
      )
      .join("");

    printWindow.document.write(`
      <html><head><title>Loan Statement - ${data.accountNo || ""}</title><style>
      body{font-family:Arial,sans-serif;padding:24px;color:#111827}
      .box{border:1px solid #cbd5e1;padding:22px;border-radius:10px}
      h1{margin:0 0 6px;text-align:center;font-size:22px}
      p.sub{text-align:center;margin:4px 0 20px;color:#475569}
      h2{font-size:16px;margin-top:20px;border-bottom:2px solid #111827;padding-bottom:4px}
      table{width:100%;border-collapse:collapse;margin-top:10px;font-size:13px}
      td,th{padding:8px;border-bottom:1px solid #e5e7eb;text-align:left}
      .info td{padding:6px 8px}
      .info td:first-child{font-weight:700;width:180px}
      .header-row{display:flex;justify-content:space-between;align-items:flex-start}
      .photo-box{width:90px;height:100px;border:1px solid #cbd5e1;border-radius:6px;overflow:hidden;flex-shrink:0}
      .photo-box img{width:100%;height:100%;object-fit:cover}
      </style></head><body><div class="box">
      <div class="header-row">
        <div>
          <h1 style="text-align:left">SRI BALAJI ENTERPRISES</h1>
          <p class="sub" style="text-align:left">Amerpeta, Hyderabad.</p>
        </div>
        ${photoSrc ? `<div class="photo-box"><img src="${photoSrc}" alt="Customer" /></div>` : ""}
      </div>
      <h2>Loan Statement</h2>
      <table class="info">
        <tr><td>Account No</td><td>${data.accountNo || "-"}</td></tr>
        <tr><td>Partner Name</td><td>${data.partnerName || "-"}</td></tr>
        <tr><td>Guarantor Name</td><td>${data.guarantorName || "-"}</td></tr>
        <tr><td>Loan Amount</td><td>Rs ${money(data.loanAmount)}</td></tr>
        <tr><td>Installment</td><td>Rs ${money(data.installmentAmount)}</td></tr>
        <tr><td>Period</td><td>${fmtDate(data.periodFrom)} to ${fmtDate(data.periodTo)}</td></tr>
        <tr><td>Paid</td><td>Rs ${money(data.paid)}</td></tr>
        <tr><td>Balance</td><td>Rs ${money(data.balance)}</td></tr>
        <tr><td>Late Fee</td><td>Rs ${money(data.lateFee)}</td></tr>
        <tr><td>Pending Late Fee</td><td>Rs ${money(data.pendingLateFee)}</td></tr>
      </table>
      <h2>Installment Schedule</h2>
      <table>
        <thead><tr>
          <th>Inst No</th><th>Total Amount</th>
          <th>Paid</th><th>Due Date</th><th>Late Fee</th><th>Status</th>
        </tr></thead>
        <tbody>${installmentRows}</tbody>
      </table>
      </div></body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}>
      <AppBar position="relative" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 700 }}>
            {`View Loan :: ${accountNo || ""}`}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ mt: 1 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && data && (
          <>
            <Box sx={{ mb: 1 }}>
              <Chip label="CUSTOMER / PARTNER" sx={{ bgcolor: "#0ea5e9", color: "white", fontWeight: 600 }} />
            </Box>
            <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
              <Grid
                size={{
                  xs: 12,
                  sm: 9
                }}>
                <Grid container spacing={2}>
                  <ReadOnlyField label="Account No" value={data.accountNo} sm={4} />
                  <ReadOnlyField label="Partner Name" value={data.partnerName} sm={4} />
                  <ReadOnlyField label="Guarantor Name" value={data.guarantorName} sm={4} />
                </Grid>
              </Grid>
              <Grid
                sx={{ display: "flex", justifyContent: { xs: "flex-start", sm: "flex-end" } }}
                size={{
                  xs: 12,
                  sm: 3
                }}>
                <ProfilePhotoBox
                  personalInfoId={personalInfoId}
                  editable={false}
                  width={90}
                  height={100}
                  onPhotoLoaded={setPhotoSrc}
                />
              </Grid>
            </Grid>

            <Box sx={{ mb: 1 }}>
              <Chip label="LOAN DETAILS" sx={{ bgcolor: "#14b8a6", color: "white", fontWeight: 600 }} />
            </Box>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <ReadOnlyField label="Loan Amount" value={money(data.loanAmount)} />
              <ReadOnlyField label="Installment" value={money(data.installmentAmount)} />
              <ReadOnlyField label="Interest(%)" value={data.interestRate} />
              <ReadOnlyField label="Processing Fee" value={money(data.processingFee)} />

              <ReadOnlyField label="Duration" value={data.duration} />

              <ReadOnlyField label="Late Fee" value={money(data.lateFee)} />

              <ReadOnlyField label="Period From" value={fmtDate(data.periodFrom)} />
              <ReadOnlyField label="Period To" value={fmtDate(data.periodTo)} />

              <ReadOnlyField label="Paid" value={money(data.paid)} />
              <ReadOnlyField label="Paid Installments" value={money(data.completedInstallments)} />
              <ReadOnlyField label="Balance" value={money(data.balance)} />
              <ReadOnlyField label="Pending Installments" value={money(data.pendingInstallments)} />
              <ReadOnlyField label="Due Amount" value={money(data.dueAmount)} />

            </Grid>

            <Box sx={{ mb: 1 }}>
              <Chip label="INSTALLMENT SCHEDULE" sx={{ bgcolor: "#8b5cf6", color: "white", fontWeight: 600 }} />
            </Box>
            <DataTable
              rows={rows}
              columns={columns}
              loading={loading}
              height={360}
              pageSize={10}
              getRowId={(row) => row.id}
            />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          disabled={loading || !data}
        >
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
}
