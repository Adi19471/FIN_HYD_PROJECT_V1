import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
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

// Shares are held in halves, so 0.5 keeps its decimal while a whole share
// prints as "1", not "1.0".
const formatShares = (value) =>
  Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });

// Totalled at the foot of the report; the caption sits in the Mobile cell,
// immediately before Investment.
const TOTAL_FIELDS = ["shares", "investment"];
const TOTAL_LABEL_CELL = { mobile: "TOTAL" };

const Partner_Infoamtion = () => {
  const [loading, setLoading] = useState(false);
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

  // FETCH DATA
  const getPartnerInformation = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE}/partners-information`,
        { headers }
      );

      setRows(response?.data || []);
    } catch (error) {
      console.error(error);
      errorToast("Failed to load partner information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPartnerInformation();
  }, []);

  // TABLE COLUMNS
  const columns = [
    {
      field: "sno",
      headerName: "S.No",
      width: 80,
    },
    {
      field: "partnerId",
      headerName: "Partner ID",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "partnerName",
      headerName: "Partner Name",
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: "fatherName",
      headerName: "Father Name",
      flex: 1.5,
      minWidth: 180,
      renderCell: ({ row }) => (isTotalRow(row) ? "" : row?.fatherName || "-"),
    },
    {
      field: "shares",
      headerName: "Shares",
      width: 100,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) =>
        row?.shares == null ? (isTotalRow(row) ? "" : "-") : formatShares(row.shares),
    },
    {
      field: "address",
      headerName: "Address",
      flex: 2,
      minWidth: 250,
      renderCell: ({ row }) =>
        isTotalRow(row) ? (
          ""
        ) : (
          <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-line", py: 1 }}
          >
            {row?.address || "-"}
          </Typography>
        ),
    },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 1,
      minWidth: 140,
      // The TOTAL row lends this cell to its caption.
      renderCell: ({ row }) => (isTotalRow(row) ? row.mobile : row?.mobile || "-"),
    },
    {
      field: "investment",
      headerName: "Investment",
      flex: 1,
      minWidth: 150,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => `₹ ${formatAmount(row?.investment)}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: ({ row }) =>
        isTotalRow(row) ? (
          ""
        ) : (
          <Chip
            label={row?.status || "-"}
            color={
              row?.status?.toLowerCase() === "active" ||
              row?.status?.toLowerCase() === "active"
                ? "success"
                : "default"
            }
            size="small"
          />
        ),
    },
  ];

  return (
    <Box p={2}>
      <PageHeader
        title="Partner Information"
        subtitle="Master list of all partners with shares, investment and status."
        totalCount={rows.length}
        onRefresh={getPartnerInformation}
        loading={loading}
      />

      <ReportToolbar
        onGenerate={getPartnerInformation}
        onRefresh={getPartnerInformation}
        loading={loading}
        rows={rows}
        columns={columns}
        fileName="Partner-Information"
        zoom={zoom}
      />

      <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
        <ReportCompanyHeader title="Partner Information" />

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="300px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box ref={zoom.targetRef}>
            <DataTable
              rows={rows}
              columns={columns}
              // The TOTAL row carries no partnerId, so fall back to its own id.
              getRowId={(row) => row.partnerId ?? row.id}
              title="Partner Information"
              totalFields={TOTAL_FIELDS}
              totalLabelCell={TOTAL_LABEL_CELL}
              // No autoHeight: a grid that grows to fit every row puts its
              // horizontal scrollbar out of reach at the bottom of the page.
              pageSize={25}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Partner_Infoamtion;