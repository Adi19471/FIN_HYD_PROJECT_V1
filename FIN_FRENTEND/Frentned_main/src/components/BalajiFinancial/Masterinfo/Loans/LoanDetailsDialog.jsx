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
import { DataTable, ProfilePhotoBox, printReport } from "src/components/ui";

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

  // Print hands the statement to the shared report preview - the same viewer
  // the report screens use, with zoom, paper size, page navigation and a single
  // Print button - instead of firing the browser print dialog at a hand-built
  // page. The grid's own columns are reused so the printed schedule matches
  // what the dialog shows.
  const handlePrint = () => {
    if (!data) return;

    printReport(rows, columns, `Loan Statement - ${data.accountNo || accountNo || ""}`, {
      photo: photoSrc,
      details: [
        {
          title: "CUSTOMER / PARTNER",
          color: "#0ea5e9",
          columns: 3,
          fields: [
            { label: "Account No", value: data.accountNo },
            { label: "Partner Name", value: data.partnerName },
            { label: "Guarantor Name", value: data.guarantorName },
          ],
        },
        {
          title: "LOAN DETAILS",
          color: "#14b8a6",
          fields: [
            { label: "Loan Amount", value: money(data.loanAmount) },
            { label: "Installment", value: money(data.installmentAmount) },
            { label: "Interest(%)", value: data.interestRate },
            { label: "Processing Fee", value: money(data.processingFee) },
            { label: "Duration", value: data.duration },
            { label: "Late Fee", value: money(data.lateFee) },
            { label: "Period From", value: fmtDate(data.periodFrom) },
            { label: "Period To", value: fmtDate(data.periodTo) },
            { label: "Paid", value: money(data.paid) },
            { label: "Paid Installments", value: money(data.completedInstallments) },
            { label: "Balance", value: money(data.balance) },
            { label: "Pending Installments", value: money(data.pendingInstallments) },
            { label: "Due Amount", value: money(data.dueAmount) },
            { label: "Pending Late Fee", value: money(data.pendingLateFee) },
          ],
        },
      ],
    });
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
