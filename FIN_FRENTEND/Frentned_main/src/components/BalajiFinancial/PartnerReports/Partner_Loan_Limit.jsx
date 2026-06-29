import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
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
} from "src/components/ui";

const Partner_Loan_Limit = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

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
      <PageHeader title="Partner Loan Limit Report" />

      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Company Header */}

        <Box textAlign="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            SRI BALAJI ENTERPRISES
          </Typography>

          <Typography variant="subtitle1">
            Yella Reddy Guda, Hyderabad
          </Typography>

          <Typography sx={{ mt: 1 }}>
            Date : {dayjs().format("DD-MMM-YYYY")}
          </Typography>

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mt: 2 }}
          >
            Partner Loan Limit Information
          </Typography>
        </Box>

        {/* Generate Button */}

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          mb={2}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={getPartnerLoanLimits}
            disabled={loading}
          >
            {loading ? "Loading..." : "Generate"}
          </Button>
        </Stack>

        {/* Data Table */}

        <DataTable
          rows={rows}
          columns={columns}
          loading={loading}
          autoHeight
          disableRowSelectionOnClick
        />
      </Paper>
    </>
  );
};

export default Partner_Loan_Limit;