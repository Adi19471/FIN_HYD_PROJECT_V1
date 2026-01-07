import React, { useState, useMemo, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  Alert,
  Divider,
  Autocomplete,
  CircularProgress,
  IconButton,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import { Save, Delete } from "@mui/icons-material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const QuickCashBook = () => {
  const [transactionDate, setTransactionDate] = useState(dayjs());
  const [collectionRows, setCollectionRows] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [alertMsg, setAlertMsg] = useState({ text: "", severity: "info" });
  const [loading, setLoading] = useState(false);
  const [fetchingAccount, setFetchingAccount] = useState(null);

  const token = getSession("token");

  /* ------------------ Auto Complete ------------------ */
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.length < 2 && inputValue !== "*") return;

      try {
        const res = await axios.get(
          `${API_BASE}/BusinessMember/allLoanDetailsAutoComplete`,
          {
            params: { q: inputValue || "*" },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (Array.isArray(res.data)) {
          setAccountOptions(res.data);
        }
      } catch {
        errorToast("Failed to load account suggestions");
      }
    };

    fetchSuggestions();
  }, [inputValue, token]);

  /* ------------------ Add Row ------------------ */
  const addRow = useCallback(
    async (selectedOption = null) => {
      const loanId = selectedOption?.loanId || inputValue.trim();
      if (!loanId) return;

      if (collectionRows.some((r) => r.accountNo === loanId)) {
        setAlertMsg({
          text: `Account ${loanId} already added`,
          severity: "warning",
        });
        return;
      }

      const tempId = Date.now();

      setCollectionRows((prev) => [
        ...prev,
        {
          id: tempId,
          accountNo: loanId,
          name: "Loading...",
          installment: 0,
          dueAmount: 0,
          lateFee: 0,
          paidAmount: 0,
          paidLateFee: 0,
        },
      ]);

      setFetchingAccount(loanId);
      setInputValue("");
      setSelectedAccount(null);

      try {
        const res = await axios.get(
          `${API_BASE}/retriveQuickCashBookRecord/${loanId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data) {
          setCollectionRows((prev) =>
            prev.map((row) =>
              row.id === tempId
                ? {
                    ...row,
                    name: res.data.name,
                    installment: Number(res.data.installment || 0),
                    dueAmount: Number(res.data.dueAmount || 0),
                    lateFee: Number(res.data.lateFee || 0),
                  }
                : row
            )
          );
        }
      } catch {
        setAlertMsg({
          text: `No previous record for ${loanId}`,
          severity: "info",
        });
      } finally {
        setFetchingAccount(null);
      }
    },
    [inputValue, collectionRows, token]
  );

  /* ------------------ DataGrid Edit Fix ------------------ */
  const processRowUpdate = useCallback((newRow) => {
    setCollectionRows((prev) =>
      prev.map((row) => (row.id === newRow.id ? newRow : row))
    );
    return newRow;
  }, []);

  /* ------------------ Delete Row ------------------ */
  const handleDeleteRow = useCallback((id) => {
    setCollectionRows((prev) => prev.filter((row) => row.id !== id));
  }, []);

  /* ------------------ Save ------------------ */
  const handleSaveAll = async () => {
    if (!collectionRows.length) {
      errorToast("No records to save");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        transactionDate: transactionDate.format("YYYY-MM-DD HH:mm:ss"),
        quickCashBookRows: collectionRows.map((r) => ({
          accountNo: r.accountNo,
          name: r.name,
          installment: Number(r.installment || 0),
          dueAmount: Number(r.dueAmount || 0),
          lateFee: Number(r.lateFee || 0),
          paidAmount: Number(r.paidAmount || 0),
          paidLateFee: Number(r.paidLateFee || 0),
        })),
      };

      await axios.post(`${API_BASE}/saveQuickCashBookRecords`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      successToast("Saved successfully");
      setCollectionRows([]);
    } catch {
      errorToast("Save failed");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Columns ------------------ */
  const columns = [
    { field: "accountNo", headerName: "Loan / A/c", width: 160 },
    {
      field: "name",
      headerName: "Customer",
      width: 260,
      renderCell: (params) =>
        fetchingAccount === params.row.accountNo ? (
          <Box display="flex" gap={1}>
            <CircularProgress size={16} />
            Loading...
          </Box>
        ) : (
          params.value
        ),
    },
    { field: "installment", headerName: "Installment", width: 120 },
    { field: "dueAmount", headerName: "Due", width: 120 },
    { field: "lateFee", headerName: "Late Fee", width: 120 },
    {
      field: "paidAmount",
      headerName: "Paid Amount",
      width: 150,
      editable: true,
      type: "number",
    },
    {
      field: "paidLateFee",
      headerName: "Paid Late Fee",
      width: 150,
      editable: true,
      type: "number",
    },
    {
      field: "actions",
      headerName: "Action",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          color="error"
          size="small"
          onClick={() => handleDeleteRow(params.row.id)}
        >
          <Delete fontSize="small" />
        </IconButton>
      ),
    },
  ];

  const totalCollected = useMemo(
    () => collectionRows.reduce((s, r) => s + Number(r.paidAmount || 0), 0),
    [collectionRows]
  );

  /* ------------------ UI ------------------ */
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ p: 3 }}>
      

       

<Paper
  elevation={2}
  sx={{
    p: 2,
    mb: 2,
    borderRadius: 2,
    background: "linear-gradient(180deg, #ffffff 0%, #f9fbff 100%)",
  }}
>
  <Stack
    direction={{ xs: "column", md: "row" }}
    spacing={2}
    alignItems="center"
    justifyContent="space-between"
  >
    {/* Title */}
    <Typography
      variant="h5"
      fontWeight={700}
      sx={{
        color: "primary.main",
        whiteSpace: "nowrap",
      }}
    >
      Quick Business Cash Book
    </Typography>

    {/* Inputs */}
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{ flexWrap: "wrap" }}
    >
      <DateTimePicker
        label="Transaction Date"
        value={transactionDate}
        onChange={setTransactionDate}
        ampm={false}
        slotProps={{
          textField: {
            size: "small",
            sx: { width: 220 },
          },
        }}
      />

      <Autocomplete
        freeSolo
        sx={{ width: 260 }}
        options={accountOptions}
        value={selectedAccount}
        inputValue={inputValue}
        getOptionLabel={(o) => o.displayString || o.loanId || ""}
        onInputChange={(e, v) => setInputValue(v)}
        onChange={(e, v) => v && addRow(v)}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Loan / Account No"
            placeholder="Type or scan account"
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputValue.trim()) {
                addRow();
              }
            }}
          />
        )}
      />
    </Stack>

    {/* Save Button */}
    <Button
      variant="contained"
      color="success"
      startIcon={<Save />}
      onClick={handleSaveAll}
      sx={{
        px: 3,
        height: 40,
        fontWeight: 600,
        boxShadow: 2,
        textTransform: "none",
      }}
    >
      Save
    </Button>
  </Stack>
</Paper>

 <Divider sx={{ my: 2 }} />
        {alertMsg.text && (
          <Alert severity={alertMsg.severity}>{alertMsg.text}</Alert>
        )}

        <Paper sx={{ height: 520, mt: 2 }}>
          <DataGrid
            rows={collectionRows}
            columns={columns}
            editMode="cell"
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={() =>
              errorToast("Edit failed")
            }
          />
        </Paper>

        <Typography mt={2} fontWeight="bold">
          Total Collected: ₹{totalCollected}
        </Typography>
      </Paper>
    </LocalizationProvider>
  );
};

export default QuickCashBook;
