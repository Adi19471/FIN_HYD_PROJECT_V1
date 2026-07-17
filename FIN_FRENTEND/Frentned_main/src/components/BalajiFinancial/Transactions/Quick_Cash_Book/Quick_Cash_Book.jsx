import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { successToast, errorToast, warningToast, infoToast } from "toastify";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { AppDatePicker, TableExportMenu } from "src/components/ui";
import { COMPANY_ADDRESS, COMPANY_NAME } from "src/lib/company";

import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add, ArticleRounded, Delete, DescriptionRounded, PrintRounded, Save, TableViewRounded } from "@mui/icons-material";
import { Autocomplete as MuiAutocomplete } from "@mui/material";

const blankRow = (accountNo = "") => ({
  id: Date.now() + Math.random(),
  accountNo,
  name: "",
  installment: 0,
  dueAmount: 0,
  lateFee: 0,
  paidAmount: 0,
  paidLateFee: 0,
});

const formatNumber = (value) => {
  if (value === "" || value === null || value === undefined) return "";
  return Number(value || 0).toLocaleString("en-IN");
};

const parseNumber = (value) => String(value || "").replace(/,/g, "");

// Default account prefix for a brand-new row, e.g. "MF2026-" (current year).
// Fully editable - typing over it (e.g. "MF2025-") works since it's just a starting value.
const defaultAccountPrefix = () => `MF${dayjs().format("YYYY")}-`;

// A row whose account field still holds only the untouched default prefix (no digits
// typed after it) isn't a real entry yet - keep it out of records/save counts.
const isBareAccountPrefix = (value) => /^[A-Za-z]+\d{4}-$/.test((value || "").trim());

// Show alert messages as toastify toasts based on severity
const notify = ({ text, severity = "info" }) => {
  const toastBySeverity = {
    success: successToast,
    error: errorToast,
    warning: warningToast,
    info: infoToast,
  };
  (toastBySeverity[severity] || infoToast)(text);
};

const QuickCashBook = () => {
  const [transactionDate, setTransactionDate] = useState(dayjs());
  const [rows, setRows] = useState([blankRow(defaultAccountPrefix())]);
  const [accountSuggestions, setAccountSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingAccount, setFetchingAccount] = useState(null);
  const [isAddingRow, setIsAddingRow] = useState(false);

  const token = getSession("token");
  const inputRefs = useRef({});

  const setFieldRef = (rowId, field) => (element) => {
    if (!inputRefs.current[rowId]) inputRefs.current[rowId] = {};
    inputRefs.current[rowId][field] = element;
  };

  const focusField = (rowId, field) => {
    const element = inputRefs.current[rowId]?.[field];
    if (!element) return;
    element.focus();
    if (typeof element.setSelectionRange === "function") {
      const length = element.value?.length ?? 0;
      element.setSelectionRange(length, length);
    }
  };

  const filledRows = useMemo(
    () => rows.filter((row) => {
      const value = row.accountNo?.trim();
      return value && !isBareAccountPrefix(value);
    }),
    [rows]
  );
  const usedAccounts = useMemo(() => new Set(filledRows.map((row) => row.accountNo.trim())), [filledRows]);
  const totalCollected = useMemo(() => rows.reduce((sum, row) => sum + Number(row.paidAmount || 0), 0), [rows]);
  const totalLateFeeCollected = useMemo(() => rows.reduce((sum, row) => sum + Number(row.paidLateFee || 0), 0), [rows]);

  useEffect(() => {
    if (rows.length === 0) setRows([blankRow(defaultAccountPrefix())]);
  }, [rows.length]);

  const addNewRowWithPrefix = (basePrefix = "") => {
    if (isAddingRow) return;
    setIsAddingRow(true);
    const newRow = blankRow(basePrefix);
    setRows((prev) => [...prev, newRow]);
    setTimeout(() => {
      focusField(newRow.id, "accountNo");
      setIsAddingRow(false);
    }, 150);
  };

  const updateRow = (rowId, field, newValue) => {
    setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, [field]: newValue } : row)));
  };

  const deleteRow = (rowId) => {
    setRows((prev) => (prev.length === 1 ? [blankRow(defaultAccountPrefix())] : prev.filter((row) => row.id !== rowId)));
  };

  const fetchSuggestions = useCallback(
    async (searchText, currentRowId) => {
      const query = (searchText || "").trim();
      if (query.length === 1) {
        setAccountSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/BusinessMember/allLoanDetailsAutoComplete`, {
          params: { q: query },
          headers: { Authorization: `Bearer ${token || ""}` },
        });
        const currentAccount = rows.find((row) => row.id === currentRowId)?.accountNo?.trim();
        const filtered = Array.isArray(res.data)
          ? res.data.filter((option) => {
            const accountNo = String(option.loanId || option.displayString || "").trim();
            return accountNo === currentAccount || !usedAccounts.has(accountNo);
          })
          : [];
        setAccountSuggestions(filtered);
      } catch (err) {
        setAccountSuggestions([]);
        notify({ text: "Account dropdown data could not be loaded.", severity: "warning" });
      }
    },
    [rows, token, usedAccounts]
  );

  const fetchAccountRecord = async (loanId, rowId) => {
    const accountNo = loanId?.trim();
    if (!accountNo) return;

    setFetchingAccount(accountNo);
    try {
      const res = await axios.get(`${API_BASE}/retriveQuickCashBookRecord/${accountNo}`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });

      if (!res.data) throw new Error("No record returned");

      setRows((prev) =>
        prev.map((row) =>
          row.id === rowId
            ? {
              ...row,
              accountNo,
              name: res.data.name || "Unknown",
              installment: Number(res.data.installment || 0),
              dueAmount: Number(res.data.dueAmount || 0),
              lateFee: Number(res.data.lateFee || 0),
              paidAmount: 0,
              paidLateFee: 0,
            }
            : row
        )
      );
      notify({ text: `Loaded ${accountNo}.`, severity: "success" });
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || `No record found for ${accountNo}`;
      notify({ text: message, severity: "warning" });
    } finally {
      setFetchingAccount(null);
    }
  };

  const handleAccountCommit = (rowId, value) => {
    const finalValue = value?.trim();
    if (!finalValue || isBareAccountPrefix(finalValue)) return;
    updateRow(rowId, "accountNo", finalValue);
    return fetchAccountRecord(finalValue, rowId);
  };

  const payableRows = useMemo(
    () => filledRows.filter((row) => Number(row.paidAmount || 0) > 0 || Number(row.paidLateFee || 0) > 0),
    [filledRows]
  );

  const handleSaveAll = async () => {
    if (!filledRows.length) return errorToast("No valid records to save");
    if (!payableRows.length) {
      notify({ text: "Enter Paid Amount or Paid Late Fee for at least one account before saving.", severity: "warning" });
      return errorToast("No payment amount entered");
    }

    setLoading(true);
    try {
      const payload = {
        transactionDate: dayjs(transactionDate).format("YYYY-MM-DD"),
        quickCashBookRows: payableRows.map((row) => ({
          accountNo: row.accountNo,
          name: row.name,
          installment: Number(row.installment || 0),
          dueAmount: Number(row.dueAmount || 0),
          lateFee: Number(row.lateFee || 0),
          paidAmount: Number(row.paidAmount || 0),
          paidLateFee: Number(row.paidLateFee || 0),
        })),
      };

      await axios.post(`${API_BASE}/saveQuickCashBookRecords`, payload, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });

      successToast("Saved successfully");
      notify({ text: `${payableRows.length} quick cash rows saved successfully.`, severity: "success" });
      setRows([blankRow(defaultAccountPrefix())]);
    } catch (error) {
      const responseData = error.response?.data;
      const message =
        (typeof responseData === "string" && responseData) ||
        responseData?.message ||
        responseData?.error ||
        error.message ||
        "Save failed. Check account number, payment date, and paid amount.";
      console.error("Quick Cash Book save failed", error);
      notify({ text: message, severity: "error" });
      errorToast(message);
    } finally {
      setLoading(false);
    }
  };

  const exportRows = useMemo(
    () =>
      filledRows.map((row, index) => ({
        "S No": index + 1,
        Date: dayjs(transactionDate).format("DD-MMM-YYYY"),
        "Loan / A/c": row.accountNo,
        Customer: row.name || "-",
        Installment: row.installment || 0,
        Due: row.dueAmount || 0,
        "Late Fee": row.lateFee || 0,
        "Paid Amount": row.paidAmount || 0,
        "Paid Late Fee": row.paidLateFee || 0,
      })),
    [filledRows, transactionDate]
  );

  const exportFileName = `quick-cash-book-${dayjs(transactionDate).format("YYYY-MM-DD")}`;

  const handleExcel = () => {
    if (!exportRows.length) return errorToast("No data to export");
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quick Cash Book");
    XLSX.writeFile(workbook, `${exportFileName}.xlsx`);
  };

  const handlePdf = () => {
    if (!exportRows.length) return errorToast("No data to export");
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFontSize(18);
    doc.text(COMPANY_NAME, 14, 14);
    doc.setFontSize(10);
    doc.text(COMPANY_ADDRESS, 14, 20);
    doc.text(`Quick Cash Book - ${dayjs(transactionDate).format("DD-MMM-YYYY")}`, 14, 27);
    autoTable(doc, {
      startY: 34,
      head: [Object.keys(exportRows[0])],
      body: exportRows.map((row) => Object.values(row)),
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [15, 98, 254], textColor: 255 },
    });
    doc.save(`${exportFileName}.pdf`);
  };

  const tableHtml = () => {
    const headers = Object.keys(exportRows[0] || {});
    const rowsHtml = exportRows
      .map((row) => `<tr>${headers.map((header) => `<td>${row[header]}</td>`).join("")}</tr>`)
      .join("");
    return `<table><thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
  };

  const handleWord = () => {
    if (!exportRows.length) return errorToast("No data to export");
    const html = `<html><head><meta charset="utf-8"><style>
      body{font-family:Arial;padding:20px;color:#111827} h1{margin:0} p{color:#475569}
      table{width:100%;border-collapse:collapse} th,td{border:1px solid #cbd5e1;padding:8px;font-size:12px;text-align:left}
      th{background:#0f62fe;color:#fff}
      </style></head><body><h1>${COMPANY_NAME}</h1><p>${COMPANY_ADDRESS}</p><h2>Quick Cash Book - ${dayjs(transactionDate).format("DD-MMM-YYYY")}</h2>${tableHtml()}</body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exportFileName}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!exportRows.length) return errorToast("No data to print");
    const printWindow = window.open("", "", "width=1200,height=760");
    if (!printWindow) return;
    printWindow.document.write(`<html><head><title>Quick Cash Book</title><style>
      body{font-family:Arial;padding:20px;color:#111827} h1{text-align:center;margin:0} p{text-align:center;color:#475569}
      table{width:100%;border-collapse:collapse} th,td{border:1px solid #cbd5e1;padding:8px;font-size:12px;text-align:left}
      th{background:#0f62fe;color:white}
    </style></head><body><h1>${COMPANY_NAME}</h1><p>${COMPANY_ADDRESS}</p><h2>Quick Cash Book - ${dayjs(transactionDate).format("DD-MMM-YYYY")}</h2>${tableHtml()}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Box >
      <Paper className="enterprise-card" elevation={0} sx={{ p: { xs: 2, md: 2.5 } }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
        >
          <Typography variant="h5">Quick Cash Book</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="flex-end">
            <TableExportMenu rows={exportRows} columns={Object.keys(exportRows[0] || {})} fileName={exportFileName} />
            <Button variant="contained" startIcon={<Save />} onClick={handleSaveAll} disabled={loading}>
              {loading ? "Saving..." : "Save All"}
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Summary */}
        <Grid container spacing={2} alignItems="center">
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <AppDatePicker label="Date" value={transactionDate} onChange={(value) => setTransactionDate(dayjs(value))} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <TextField label="Records" size="small" value={filledRows.length} InputProps={{ readOnly: true }} fullWidth />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <TextField
                label="Paid Total"
                size="small"
                value={`Rs ${totalCollected.toLocaleString("en-IN")}`}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <TextField
                label="Late Fee Total"
                size="small"
                value={`Rs ${totalLateFeeCollected.toLocaleString("en-IN")}`}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Table */}
        <TableContainer sx={{ overflow: "auto" }}>
          <Table
            size="small"
            sx={{
              minWidth: 960,
              "& .MuiTableCell-root": {
                border: "1px solid",
                borderColor: "divider",
              },
              "& .MuiTableCell-head": {
                backgroundColor: "#f8fafc",
                fontWeight: 800,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell align="center">Action</TableCell>
                <TableCell>Loan / A/c</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Installment</TableCell>
                <TableCell>Due</TableCell>
                <TableCell>LateFee</TableCell>
                <TableCell>Paid Amount</TableCell>
                <TableCell>Paid Late Fee</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => deleteRow(row.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={{ minWidth: 290 }}>
                    <MuiAutocomplete
                      openOnFocus
                      filterOptions={(x) => x}
                      freeSolo
                      fullWidth
                      size="small"
                      options={accountSuggestions}
                      value={row.accountNo || ""}
                      inputValue={row.accountNo || ""}
                      getOptionLabel={(option) => (typeof option === "string" ? option : option.displayString || option.loanId || "")}
                      onOpen={() => fetchSuggestions(row.accountNo || "", row.id)}
                      onInputChange={(_, newInput) => {
                        fetchSuggestions(newInput, row.id);
                        updateRow(row.id, "accountNo", newInput);
                      }}
                      onChange={(_, newValue) => {
                        const selected = typeof newValue === "string" ? newValue : newValue?.loanId || newValue?.displayString || "";
                        handleAccountCommit(row.id, selected);
                      }}
                      onBlur={() => handleAccountCommit(row.id, row.accountNo)}
                      onKeyDown={async (event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          await handleAccountCommit(row.id, row.accountNo);
                          focusField(row.id, "paidAmount");
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Enter Account No"
                          inputRef={setFieldRef(row.id, "accountNo")}
                          size="small"
                          helperText={fetchingAccount === row.accountNo ? "Loading..." : " "}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 170 }}>{row.name || "-"}</TableCell>
                  <TableCell>{formatNumber(row.installment)}</TableCell>
                  <TableCell>{formatNumber(row.dueAmount)}</TableCell>
                  <TableCell>{formatNumber(row.lateFee)}</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>
                    <TextField
                      size="small"
                      value={formatNumber(row.paidAmount)}
                      onFocus={() => row.paidAmount === 0 && updateRow(row.id, "paidAmount", "")}
                      onChange={(event) => {
                        const value = parseNumber(event.target.value);
                        if (/^\d*$/.test(value)) updateRow(row.id, "paidAmount", value === "" ? "" : Number(value));
                      }}
                      onBlur={(event) => event.target.value === "" && updateRow(row.id, "paidAmount", 0)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          focusField(row.id, "paidLateFee");
                        }
                      }}
                      inputRef={setFieldRef(row.id, "paidAmount")}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: 150 }}>
                    <TextField
                      size="small"
                      value={formatNumber(row.paidLateFee)}
                      onFocus={() => row.paidLateFee === 0 && updateRow(row.id, "paidLateFee", "")}
                      onChange={(event) => {
                        const value = parseNumber(event.target.value);
                        if (/^\d*$/.test(value)) updateRow(row.id, "paidLateFee", value === "" ? "" : Number(value));
                      }}
                      onBlur={(event) => event.target.value === "" && updateRow(row.id, "paidLateFee", 0)}
                      onKeyDown={(event) => {
                        if ((event.key === "Enter" || event.key === "Tab") && !event.shiftKey && Number(row.paidAmount || 0) > 0) {
                          event.preventDefault();
                          addNewRowWithPrefix(row.accountNo.trim().replace(/\d+$/, ""));
                        }
                      }}
                      inputRef={setFieldRef(row.id, "paidLateFee")}
                      fullWidth
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 2 }} />

        {/* Footer */}
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
          <Button variant="outlined" startIcon={<Add />} onClick={() => addNewRowWithPrefix(defaultAccountPrefix())}>
            Add New Row
          </Button>
          <Typography fontWeight={900}>
            Total Collected: Rs {totalCollected.toLocaleString("en-IN")} | Late Fee: Rs {totalLateFeeCollected.toLocaleString("en-IN")}
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default QuickCashBook;
