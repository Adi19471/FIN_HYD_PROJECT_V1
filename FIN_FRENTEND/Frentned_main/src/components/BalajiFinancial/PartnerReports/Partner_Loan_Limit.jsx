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
      renderCell: ({ row }) =>
        Number(row.authLimit).toLocaleString("en-IN"),
    },
    {
      field: "currentLimit",
      headerName: "Current Limit",
      width: 170,
      renderCell: ({ row }) =>
        Number(row.currentLimit).toLocaleString("en-IN"),
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
            autoHeight
            disableRowSelectionOnClick
          />
        </Box>
      </Paper>
    </>
  );
};

export default Partner_Loan_Limit;