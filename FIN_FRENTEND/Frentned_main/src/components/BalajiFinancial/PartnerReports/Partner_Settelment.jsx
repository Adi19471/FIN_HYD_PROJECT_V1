import React, { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";

import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { errorToast } from "toastify";
import {
  DataTable,
  isTotalRow,
  PageHeader,
  ReportCompanyHeader,
  ReportToolbar,
  useReportZoom,
} from "src/components/ui";

// Whole rupees - no decimal point on the printed report.
const formatAmount = (amount) =>
  Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const formatDate = (date) =>
  date ? dayjs(date).format("DD-MMM-YYYY") : "-";

// Figures the report adds up at the foot. Duration is left out - a sum of loan
// durations means nothing.
const TOTAL_FIELDS = [
  "amount",
  "installmentAmount",
  "installmentPaid",
  "noofInstallmentsPaid",
  "noOfInstallmentsPending",
  "balanceAmount",
  "excemption",
  "settledAmount",
];

// TOTAL caption sits in the End Date cell, immediately before Amount.
const TOTAL_LABEL_CELL = { endDate: "TOTAL" };

const Partner_Settelment = () => {
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [targetDate, setTargetDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [rows, setRows] = useState([]);

  const zoom = useReportZoom();

  // TOKEN
  const token = getSession()?.token || getSession("token") || "";

  // HEADERS
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  // LOAD PARTNERS
  const loadPartners = async (query = "") => {
    try {
      const res = await axios.get(
        `${API_BASE}/PersonalInfo/personInfoAutoCompleteByCategory/PARTNER`,
        {
          headers,
          params: { q: query.trim() },
        }
      );

      setPartners(
        (res.data || []).map((item) => ({
          id: item.id,
          label: `${item.id || ""} - ${item.firstname || ""} ${
            item.lastname || ""
          } - ${item.mobile || "No Mobile"}`,
          firstname: item.firstname,
          lastname: item.lastname,
          mobile: item.mobile,
        }))
      );
    } catch (error) {
      console.error("Partner Load Error : ", error);
    }
  };

  // LOAD SETTLEMENT DATA
  const getSettlementData = async () => {
    if (!selectedPartner?.id || !targetDate) {
      errorToast("Please select partner and date");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE}/partner-settlement/${selectedPartner.id}/${targetDate}`,
        { headers }
      );

      // A partner can hold the same loan id twice over, so the row key is the
      // loan id paired with its position - the grid needs one that is unique.
      setRows(
        (response?.data || []).map((row, index) => ({
          ...row,
          id: `${row.loanId || "row"}-${index + 1}`,
        }))
      );
    } catch (error) {
      console.error(error);
      errorToast("Failed to load settlement data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  // TABLE COLUMNS
  const columns = [
    {
      field: "partnerName",
      headerName: "Partner",
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: "loanType",
      headerName: "Loan Type",
      flex: 1.2,
      minWidth: 150,
      renderCell: ({ row }) =>
        isTotalRow(row) ? (
          ""
        ) : (
          <Chip
            label={row.loanType}
            color={
              row.loanType === "DAILY_FINANCE"
                ? "primary"
                : "secondary"
            }
            size="small"
          />
        ),
    },
    {
      field: "loanId",
      headerName: "Loan ID",
      flex: 1,
      minWidth: 130,
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      flex: 1.6,
      minWidth: 220,
    },
    {
      field: "guarantorName",
      headerName: "Guarantor",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
      minWidth: 130,
      renderCell: ({ row }) => (isTotalRow(row) ? "" : formatDate(row.startDate)),
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 1,
      minWidth: 130,
      // The TOTAL row lends this cell to its caption.
      renderCell: ({ row }) => (isTotalRow(row) ? row.endDate : formatDate(row.endDate)),
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      minWidth: 140,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => `₹ ${formatAmount(row.amount)}`,
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 100,
    },
    {
      field: "installmentAmount",
      headerName: "Installment",
      flex: 1,
      minWidth: 150,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) =>
        `₹ ${formatAmount(row.installmentAmount)}`,
    },
    {
      field: "installmentPaid",
      headerName: "Paid",
      flex: 1,
      minWidth: 140,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) =>
        `₹ ${formatAmount(row.installmentPaid)}`,
    },
    {
      field: "noofInstallmentsPaid",
      headerName: "Paid EMI",
      width: 120,
    },
    {
      field: "noOfInstallmentsPending",
      headerName: "Pending EMI",
      width: 140,
    },
    {
      field: "balanceAmount",
      headerName: "Balance",
      flex: 1,
      minWidth: 140,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) =>
        `₹ ${formatAmount(row.balanceAmount)}`,
    },
    {
      field: "excemption",
      headerName: "Excemption",
      flex: 1,
      minWidth: 130,
      align: "right",
      headerAlign: "right",
      // The TOTAL row always prints its figure, even when it comes to zero.
      renderCell: ({ row }) =>
        row.excemption || isTotalRow(row)
          ? `₹ ${formatAmount(row.excemption)}`
          : "-",
    },
    {
      field: "settledAmount",
      headerName: "Settled Amount",
      flex: 1,
      minWidth: 160,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) =>
        row.settledAmount || isTotalRow(row)
          ? `₹ ${formatAmount(row.settledAmount)}`
          : "-",
    },
  ];

  return (
    <Box p={2}>
      <PageHeader
        title="Partner Settlement"
        subtitle="Loan-wise settlement position for a partner on a target date."
        totalCount={rows.length}
        onRefresh={getSettlementData}
        loading={loading}
      />
      <ReportToolbar
        onGenerate={getSettlementData}
        onRefresh={getSettlementData}
        loading={loading}
        rows={rows}
        columns={columns}
        fileName="Partner-Settlement"
        zoom={zoom}
      />
      {/* FILTERS */}
      <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid
            size={{
              xs: 12,
              md: 5
            }}>
            <Autocomplete
              options={partners}
              value={selectedPartner}
              onChange={(e, value) => setSelectedPartner(value)}
              onInputChange={(e, value) => loadPartners(value)}
              getOptionLabel={(option) => option?.label || ""}
              sx={{width:"220px"}}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Partner"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 3
            }}>
            <TextField
              type="date"
              label="Target Date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 2
            }}>
            <Button
              variant="contained"
              fullWidth
              onClick={getSettlementData}
            >
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {/* TABLE */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <ReportCompanyHeader title="Partner Settlement" />

        {loading ? (
          <Box
            height="300px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box ref={zoom.targetRef}>
            <DataTable
              rows={rows}
              columns={columns}
              title="Partner Settlement"
              subtitle={`Settlement as on ${formatDate(targetDate)}${
                selectedPartner?.label ? ` / ${selectedPartner.label}` : ""
              }`}
              totalFields={TOTAL_FIELDS}
              totalLabelCell={TOTAL_LABEL_CELL}
              // No autoHeight: this report is far wider than the screen, and a
              // grid that grows to fit every row puts its horizontal scrollbar
              // out of reach at the bottom of the page.
              pageSize={25}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Partner_Settelment;