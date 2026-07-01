import React, { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { errorToast } from "toastify";
import {
  DataTable,
  PageHeader,
  ReportCompanyHeader,
  ReportToolbar,
  useReportZoom,
} from "src/components/ui";

const formatAmount = (amount) => Number(amount || 0).toLocaleString("en-IN");
const formatDate = (value) => (value ? dayjs(value).format("DD-MMM-YYYY") : "-");

const Installment_Dues = () => {
  const zoom = useReportZoom();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [reportType, setReportType] = useState("all");
  const [activeLoans, setActiveLoans] = useState(true);
  const [lateFee, setLateFee] = useState(false);

  const token = getSession()?.token || getSession("token") || "";
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const loadPartners = async (query = "") => {
    try {
      const res = await axios.get(`${API_BASE}/PersonalInfo/personInfoAutoCompleteByCategory/PARTNER`, {
        headers,
        params: { q: query.trim() },
      });

      setPartners(
        (res.data || []).map((item) => ({
          id: item.id,
          label: `${item.id || ""} - ${item.firstname || ""} ${item.lastname || ""} - ${item.mobile || "No Mobile"}`,
          firstname: item.firstname,
          lastname: item.lastname,
          mobile: item.mobile,
        }))
      );
    } catch (error) {
      console.error("Partner Load Error : ", error);
    }
  };

  useEffect(() => {
    loadPartners("");
  }, []);

  const generateReport = async () => {
    try {
      setLoading(true);
      let url = "";

      if (reportType === "individual") {
        if (!selectedPartner?.id) {
          errorToast("Please select partner");
          return;
        }
        url = `${API_BASE}/gurantorInstallmentDues/by-guarantor/${selectedPartner.id}/${activeLoans}/${lateFee}`;
      } else {
        url = `${API_BASE}/gurantorInstallmentDues/all/${activeLoans}/${lateFee}`;
      }

      const res = await axios.get(url, { headers });
      setRows((res.data || []).map((row, index) => ({ id: row.loanId || index + 1, sno: index + 1, ...row })));
    } catch (error) {
      console.error("Generate Report Error : ", error);
      errorToast("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "sno", headerName: "S.No", width: 80 },
    { field: "loanId", headerName: "Loan ID", width: 120 },
    { field: "customerName", headerName: "Customer Name", minWidth: 190, flex: 1 },
    { field: "guarantorName", headerName: "Guarantor Name", minWidth: 190, flex: 1 },
    { field: "startDate", headerName: "Start Date", width: 140, valueFormatter: (value) => formatDate(value) },
    { field: "endDate", headerName: "End Date", width: 140, valueFormatter: (value) => formatDate(value) },
    { field: "amount", headerName: "Amount", width: 140, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "duration", headerName: "Duration", width: 110, align: "center", headerAlign: "center" },
    { field: "installmentAmount", headerName: "Inst. Amount", width: 150, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "noOfInstallmentsPaid", headerName: "Paid", width: 110, align: "center", headerAlign: "center" },
    { field: "noOfInstallmentsPending", headerName: "Pending", width: 120, align: "center", headerAlign: "center" },
    { field: "balanceAmount", headerName: "Balance", width: 140, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "dueDate", headerName: "Due Date", width: 140, valueFormatter: (value) => formatDate(value) },
    { field: "lateFee", headerName: "Late Fee", width: 130, align: "right", headerAlign: "right", valueFormatter: (value) => formatAmount(value) },
    { field: "loanType", headerName: "Loan Type", width: 160 },
  ];

  return (
    <Stack spacing={2.5}>
      <PageHeader
        title="Partner Installment Dues"
        subtitle="Installment dues report with grid search, sorting, pagination, and Excel/PDF/Word downloads."
        totalCount={rows.length}
        onRefresh={generateReport}
        loading={loading}
      />

      <ReportToolbar
        onGenerate={generateReport}
        onRefresh={generateReport}
        loading={loading}
        rows={rows}
        columns={columns}
        fileName="Installment-Dues"
        zoom={zoom}
      />

      <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField select label="Report Type" size="small" fullWidth value={reportType} onChange={(event) => setReportType(event.target.value)}>
              <MenuItem value="all">All Partners</MenuItem>
              <MenuItem value="individual">Individual Partner</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={3}>
            <Autocomplete
              openOnFocus
              filterOptions={(x) => x}
              options={partners || []}
              value={selectedPartner}
              onChange={(_, newValue) => setSelectedPartner(newValue)}
              onOpen={() => loadPartners("")}
              onInputChange={(_, value) => loadPartners(value)}
              fullWidth
              size="small"
              disabled={reportType !== "individual"}
              getOptionLabel={(option) => option?.label || ""}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => <TextField {...params} label="Select Partner" placeholder="Search Partner" />}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControlLabel control={<Checkbox checked={activeLoans} onChange={(event) => setActiveLoans(event.target.checked)} />} label="Active Loans" />
            <FormControlLabel control={<Checkbox checked={lateFee} onChange={(event) => setLateFee(event.target.checked)} />} label="Late Fee" />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button fullWidth variant="contained" onClick={generateReport} disabled={loading}>
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box ref={zoom.targetRef} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Paper className="enterprise-card" elevation={0} sx={{ p: 2 }}>
          <ReportCompanyHeader title="Installment Dues Report" />
        </Paper>

        <DataTable
          rows={rows}
          columns={columns}
          loading={loading}
          title="Installment Dues Ledger"
          subtitle="MUI grid table with pagination, search, sorting, Excel, PDF, Word, and print downloads."
          height={640}
          pageSize={25}
        />
      </Box>
    </Stack>
  );
};

export default Installment_Dues;
