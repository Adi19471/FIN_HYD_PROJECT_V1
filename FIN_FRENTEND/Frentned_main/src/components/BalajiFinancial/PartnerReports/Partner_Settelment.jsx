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
  PageHeader,
  ReportCompanyHeader,
  ReportToolbar,
  useReportZoom,
} from "src/components/ui";

const formatAmount = (amount) =>
  Number(amount || 0).toLocaleString("en-IN");

const formatDate = (date) =>
  date ? dayjs(date).format("DD-MMM-YYYY") : "-";

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

      setRows(response?.data || []);
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
      renderCell: ({ row }) => (
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
      renderCell: ({ row }) => formatDate(row.startDate),
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 1,
      minWidth: 130,
      renderCell: ({ row }) => formatDate(row.endDate),
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      minWidth: 140,
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
      renderCell: ({ row }) =>
        `₹ ${formatAmount(row.installmentAmount)}`,
    },
    {
      field: "installmentPaid",
      headerName: "Paid",
      flex: 1,
      minWidth: 140,
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
      renderCell: ({ row }) =>
        `₹ ${formatAmount(row.balanceAmount)}`,
    },
    {
      field: "excemption",
      headerName: "Excemption",
      flex: 1,
      minWidth: 130,
      renderCell: ({ row }) =>
        row.excemption
          ? `₹ ${formatAmount(row.excemption)}`
          : "-",
    },
    {
      field: "settledAmount",
      headerName: "Settled Amount",
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) =>
        row.settledAmount
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
              getRowId={(row, index) => `${row.loanId}-${index}`}
              autoHeight
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Partner_Settelment;