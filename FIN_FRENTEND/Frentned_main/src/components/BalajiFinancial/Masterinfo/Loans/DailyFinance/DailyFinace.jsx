import React, { useEffect, useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Autocomplete,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import dayjs from "dayjs";

const LOAN_TYPE = { DAILY_FINANCE: "DAILY_FINANCE" };
const FIXED_DURATION_DAYS = 100;

const DailyFinance = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentLoanId, setCurrentLoanId] = useState(null);

  // ------------------------------
  // FORM STATE (with Interest default = 3%)
  // ------------------------------
  const [formData, setFormData] = useState({
    customerId: null,
    guarantor1: null,
    guarantor2: null,
    guarantor3: null,
    partnerId: "",
    startDate: dayjs(),
    endDate: dayjs().add(FIXED_DURATION_DAYS, "day"),
    amount: "",
    interestRatePerMonth: "3",
    interestAmountForAllDays: 0,
    installment: "",
    processingFee: "",
    security: "",
  });

  const [options, setOptions] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const headers = {
    Authorization: `Bearer ${getSession("token") || ""}`,
  };

  // LOAD ALL LOANS
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/BusinessMember/findAll/${LOAN_TYPE.DAILY_FINANCE}`,
        {
          headers,
        }
      );
      const loans = Array.isArray(res.data) ? res.data : [];

      // Collect all member IDs
      const memberIds = new Set();
      loans.forEach((l) => {
        if (l.customerId) memberIds.add(l.customerId);
        [l.guarantor1, l.guarantor2, l.guarantor3].forEach(
          (g) => g && memberIds.add(g)
        );
      });

      // Fetch member names
      const memberMap = {};
      if (memberIds.size > 0) {
        try {
          const mRes = await axios.get(`${API_BASE}/PersonalInfo/byIds`, {
            headers,
            params: { ids: Array.from(memberIds).join(",") },
          });
          mRes.data.forEach((m) => {
            memberMap[m.id] =
              `${m.firstname || ""} ${m.lastname || ""}`.trim() ||
              `ID: ${m.id}`;
          });
        } catch (e) {
          console.warn("Name fetch failed", e);
        }
      }

      const enriched = loans.map((loan) => ({
        id: loan.id || "N/A",
        customerName:
          memberMap[loan.customerId] || `ID: ${loan.customerId || "N/A"}`,
        amount: loan.amount || 0,
        interestRatePerMonth: loan.interest || 0,
        installment: loan.installment || 0,
        startDate: loan.startDate,
        endDate: loan.endDate,
        g1Name: loan.guarantor1
          ? memberMap[loan.guarantor1] || `G1: ${loan.guarantor1}`
          : "-",
        g2Name: loan.guarantor2
          ? memberMap[loan.guarantor2] || `G2: ${loan.guarantor2}`
          : "-",
        g3Name: loan.guarantor3
          ? memberMap[loan.guarantor3] || `G3: ${loan.guarantor3}`
          : "-",
        partnerId: loan.partnerId || "-",
      }));

      setRows(enriched);
    } catch (err) {
      errorToast("Failed to load loans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // UPDATE END DATE ON START DATE CHANGE
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      endDate: formData.startDate.add(FIXED_DURATION_DAYS, "day"),
    }));
  }, [formData.startDate]);

  useEffect(() => {
    // Reset fields if required inputs are missing
    if (!formData.amount || !formData.interestRatePerMonth) {
      setFormData((prev) => ({
        ...prev,
        installment: "",
        interestAmountForAllDays: "",
      }));
      return;
    }

    const principal = Number(formData.amount);
    const monthlyInterestRate = Number(formData.interestRatePerMonth) / 100;
    const dailyInterestRate = monthlyInterestRate / 30;

   
    const totalInterest = principal * dailyInterestRate * FIXED_DURATION_DAYS;
    const dailyInstallment = Math.round(principal / FIXED_DURATION_DAYS);
    
    setFormData((prev) => ({
      ...prev,
      installment: dailyInstallment.toString(),
      interestAmountForAllDays: totalInterest.toFixed(2), 
    }));
  }, [formData.amount, formData.interestRatePerMonth]);




  // MEMBER AUTOCOMPLETE SEARCH
  const searchMembers = useCallback(
    async (query) => {
      if (!query || query.trim().length < 2) {
        setOptions([]);
        return;
      }
      setLoadingSearch(true);
      try {
        const res = await axios.get(`${API_BASE}/PersonalInfo/autocomplete`, {
          headers,
          params: { q: query.trim() },
        });

        const list = (res.data || []).map((item) => ({
          id: item.id,
          label: `${item.firstname || ""} ${item.lastname || ""} - ${
            item.mobile || "No Mobile"
          } (${item.id})`,
        }));

        setOptions(list);
      } catch (err) {
        errorToast("Search failed");
        setOptions([]);
      } finally {
        setLoadingSearch(false);
      }
    },
    [headers]
  );

  const resetForm = () => {
    setFormData({
      customerId: null,
      guarantor1: null,
      guarantor2: null,
      guarantor3: null,
      partnerId: "",
      startDate: dayjs(),
      endDate: dayjs().add(FIXED_DURATION_DAYS, "day"),
      amount: "",
      interestRatePerMonth: "3",
      interestAmountForAllDays: 0,
      installment: "",
      processingFee: "",
      security: "",
    });
    setIsEditMode(false);
    setCurrentLoanId(null);
  };

  // EDIT LOAN
  const handleEdit = async (id) => {
    try {
      const res = await axios.get(`${API_BASE}/BusinessMember/findById/${id}`, {
        headers,
      });

      const l = res.data;

      // Fetch labels for customer & guarantors
      const idsToFetch = [
        l.customerId,
        l.guarantor1,
        l.guarantor2,
        l.guarantor3,
      ].filter(Boolean);

      const map = {};
      if (idsToFetch.length > 0) {
        const mRes = await axios.get(`${API_BASE}/PersonalInfo/byIds`, {
          headers,
          params: { ids: idsToFetch.join(",") },
        });

        mRes.data.forEach((m) => {
          map[m.id] = {
            id: m.id,
            label: `${m.firstname || ""} ${m.lastname || ""} - ${
              m.mobile || ""
            }`,
          };
        });
      }

      setFormData({
        customerId: map[l.customerId] || null,
        guarantor1: map[l.guarantor1] || null,
        guarantor2: map[l.guarantor2] || null,
        guarantor3: map[l.guarantor3] || null,
        partnerId: l.partnerId,
        startDate: dayjs(l.startDate),
        endDate: dayjs(l.endDate),
        amount: l.amount.toString(),
        interestRatePerMonth: l.interest.toString(),
        installment: l.installment?.toString() || "",
        processingFee: l.processingFee?.toString() || "",
        security: l.security || "",
      });

      setCurrentLoanId(id);
      setIsEditMode(true);
      setOpen(true);
    } catch (err) {
      errorToast("Failed to load loan");
    }
  };

  // DELETE LOAN
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this loan permanently?")) return;

    try {
      await axios.delete(`${API_BASE}/BusinessMember/delete/${id}`, {
        headers,
      });
      successToast("Loan deleted!");
      fetchData();
    } catch (err) {
      errorToast("Delete failed");
    }
  };

  // SAVE / UPDATE LOAN
  const handleSave = async () => {
    if (!formData.customerId?.id) return errorToast("Customer is required");

    const payload = {
      customerId: formData.customerId.id,
      guarantor1: formData.guarantor1?.id || "",
      guarantor2: formData.guarantor2?.id || "",
      guarantor3: formData.guarantor3?.id || "",
      partnerId: formData.partnerId,
      startDate: formData.startDate.format("YYYY-MM-DD HH:mm:ss"),
      endDate: formData.endDate.format("YYYY-MM-DD HH:mm:ss"),
      amount: Number(formData.amount),
      interest: Number(formData.interestRatePerMonth),
      processingFee: Number(formData.processingFee) || 0,
      security: formData.security,
      duration: FIXED_DURATION_DAYS,
    };

    try {
      if (isEditMode) {
        await axios.put(
          `${API_BASE}/BusinessMember/update/${currentLoanId}`,
          payload,
          { headers }
        );
        successToast("Loan updated!");
      } else {
        await axios.post(
          `${API_BASE}/BusinessMember/update/${LOAN_TYPE.DAILY_FINANCE}`,
          payload,
          { headers }
        );
        successToast("Loan created!");
      }

      setOpen(false);
      fetchData();
      resetForm();
    } catch (err) {
      errorToast(err.response?.data?.message || "Save failed");
    }
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // TABLE COLUMNS
  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(params.row.id)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
    { field: "id", headerName: "Acc No", width: 100 },
    { field: "customerName", headerName: "Customer Name", width: 260 },
    {
      field: "amount",
      headerName: "Amount",
      width: 140,
    },
    {
      field: "interestRatePerMonth",
      headerName: "Interest %",
      width: 100,
    },
    {
      field: "installment",
      headerName: "Installment",
      width: 150,
    },
    {
      field: "startDate",
      headerName: "Loan Date",
      width: 140,
      valueFormatter: (v) => dayjs(v.value).format("DD-MMM-YYYY"),
    },
    {
      field: "endDate",
      headerName: "Maturity Date",
      width: 140,
      valueFormatter: (v) => dayjs(v.value).format("DD-MMM-YYYY"),
    },
    { field: "g1Name", headerName: "Guarantor 1", width: 200 },
    { field: "g2Name", headerName: "Guarantor 2", width: 200 },
    { field: "g3Name", headerName: "Guarantor 3", width: 200 },
    { field: "partnerId", headerName: "Partner", width: 150 },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* MAIN PAGE */}
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h5" fontWeight={600}>
            DAILY FINANCE
          </Typography>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
          >
            New Loan
          </Button>
        </Box>

        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          autoHeight
          getRowId={(r) => r.id}
        />
      </Box>

      {/* DIALOG MODAL */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <AppBar position="relative" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flex: 1 }}>
              {isEditMode ? "Edit Loan" : "New Daily Finance Loan"}
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent sx={{ mt: 2 }}>
          {/* BASIC INFO */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                fullWidth
                sx={{ width: "230px" }}
                options={options}
                loading={loadingSearch}
                value={formData.customerId}
                onInputChange={(e, v) => searchMembers(v)}
                onChange={(e, v) =>
                  setFormData((p) => ({ ...p, customerId: v }))
                }
                getOptionLabel={(o) => o?.label || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Customer *" />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="Loan Date"
                value={formData.startDate}
                onChange={(v) => setFormData((p) => ({ ...p, startDate: v }))}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DateTimePicker
                label="Maturity Date"
                value={formData.endDate}
                readOnly
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
          </Grid>

          {/* LOAN DETAILS */}
          <Chip label="LOAN DETAILS" sx={{ mt: 3, mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount *"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, amount: e.target.value }))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Interest %"
                type="number"
                value={formData.interestRatePerMonth}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    interestRatePerMonth: e.target.value,
                  }))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Intrest Amount %"
                type="number"
                value={formData.interestAmountForAllDays}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    interestAmountForAllDays: e.target.value,
                  }))
                }
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Daily Installment"
                value={
                  formData.installment
                    ? `₹${Number(formData.installment).toLocaleString("en-IN")}`
                    : ""
                }
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Duration"
                value="100 Days Fixed"
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Processing Fee"
                type="number"
                value={formData.processingFee}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, processingFee: e.target.value }))
                }
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                label="Security / Remarks"
                value={formData.security}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, security: e.target.value }))
                }
              />
            </Grid>
          </Grid>

          {/* GUARANTORS */}
          <Chip label="GUARANTORS" sx={{ mt: 3, mb: 2 }} />

          <Grid container spacing={2}>
            {["guarantor1", "guarantor2", "guarantor3"].map((field, idx) => (
              <Grid item xs={12} key={field}>
                <Autocomplete
                  fullWidth
                  sx={{ width: "230px" }}
                  options={options}
                  value={formData[field]}
                  onInputChange={(e, v) => searchMembers(v)}
                  onChange={(e, v) =>
                    setFormData((p) => ({ ...p, [field]: v }))
                  }
                  getOptionLabel={(o) => o?.label || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={`Guarantor ${idx + 1}${idx === 0 ? " *" : ""}`}
                    />
                  )}
                />
              </Grid>
            ))}
          </Grid>

          <TextField
            fullWidth
            label="Partner / Agent"
            sx={{ mt: 3 }}
            value={formData.partnerId}
            onChange={(e) =>
              setFormData((p) => ({ ...p, partnerId: e.target.value }))
            }
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            {isEditMode ? "Update Loan" : "Create Loan"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default DailyFinance;
