import React, { useState } from "react";
import {
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";

import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import {
  successToast,
  errorToast,
} from "toastify";

import {
  DataTable,
  PageHeader,
  ReportCompanyHeader,
  ReportToolbar,
  useReportZoom,
} from "src/components/ui";

// Whole rupees - no decimal point on any figure in this report.
const formatAmount = (value) =>
  Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

// The two limit columns the report adds up at the foot.
const TOTAL_FIELDS = ["authLimit", "currentLimit"];

// TOTAL caption sits in the Partner Name cell, right before the figures.
const TOTAL_LABEL_CELL = { partnerName: "TOTAL" };

const Partner_Loan_Limit = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const zoom = useReportZoom();

  const headers = {
    Authorization: `Bearer ${getSession("token") || ""}`,
    "Content-Type": "application/json",
  };

  const getPartnerLoanLimits = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE}/partners/loan-limits`,
        {
          headers,
        }
      );

      const data = response.data || [];

      const formattedData = data.map((item, index) => ({
        id: index + 1,
        sno: item.sno,
        account: item.account,
        partnerName: item.partnerName,
        authLimit: item.authLimit || 0,
        currentLimit: item.currentLimit || 0,
      }));

      setRows(formattedData);

      successToast("Partner Loan Limit Report Generated Successfully");
    } catch (error) {
      console.error(error);

      errorToast(
        error?.response?.data?.message ||
          "Failed to fetch Partner Loan Limit Data"
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "sno",
      headerName: "S.No",
      width: 80,
    },
    {
      field: "account",
      headerName: "Account",
      width: 120,
    },
    {
      field: "partnerName",
      headerName: "Partner Name",
      flex: 1,
      minWidth: 300,
    },
    {
      field: "authLimit",
      headerName: "Auth Limit",
      width: 150,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => formatAmount(row.authLimit),
    },
    {
      field: "currentLimit",
      headerName: "Current Limit",
      width: 170,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => formatAmount(row.currentLimit),
    },
  ];

  return (
    <>
      <PageHeader
        title="Partner Loan Limit Report"
        subtitle="Authorised vs current loan limits per partner."
        totalCount={rows.length}
        onRefresh={getPartnerLoanLimits}
        loading={loading}
      />

      <ReportToolbar
        onGenerate={getPartnerLoanLimits}
        onRefresh={getPartnerLoanLimits}
        loading={loading}
        rows={rows}
        columns={columns}
        fileName="Partner-Loan-Limit"
        zoom={zoom}
      />

      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <ReportCompanyHeader title="Partner Loan Limit Information" />

        <Box ref={zoom.targetRef}>
          <DataTable
            rows={rows}
            columns={columns}
            loading={loading}
            // Names the screen on the printed / downloaded report.
            title="Partner Loan Limit Report"
            totalFields={TOTAL_FIELDS}
            totalLabelCell={TOTAL_LABEL_CELL}
            pageSize={25}
            disableRowSelectionOnClick
          />
        </Box>
      </Paper>
    </>
  );
};

export default Partner_Loan_Limit;