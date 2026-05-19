import React, { useEffect, useState, useCallback } from "react";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from "axios";
import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import LoadingSpinner from "src/LoadingSpinner";
import { getSession } from "src/utils/session";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Autocomplete,
  CircularProgress,
  IconButton,
  Chip,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";
import ReportToolbar from "../../../ReportsAll/ReportToolbar";
import { AppDatePicker } from "src/components/ui";


const FIXED_DURATION_MONTHS = 10;
const BASE_PROCESSING_FEE = 200;
const BASE_INTEREST_RATE = 3;

const MonthlyFinance = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentLoanId, setCurrentLoanId] = useState(null);


  const [filters, setFilters] = useState({
    id: "",
    customerName: "",
    amount: "",
    interestRate: "",
    installment: "",
    interestAmount: "",
    startDate: "",
    endDate: "",
    g1Name: "",
    g2Name: "",
    g3Name: "",
    partnerId: ""
  });


  const filteredRows = rows.filter((row) =>
    Object.keys(filters).every((key) => {
      const value = row[key] ?? "";   // 🔥 handle null
      return value
        .toString()
        .toLowerCase()
        .includes(filters[key].toLowerCase());
    })
  );

  const getHeader = (label, field) => (
    <div style={{ width: "100%", paddingTop: 2 }}>

      {/* Header Label (bigger & clear) */}
      <div
        style={{
          fontWeight: 600,
          fontSize: "14px",
          marginBottom: 4,
          lineHeight: 1.2
        }}
      >
        {label}
      </div>

      {/* Compact Filter Box */}
      <TextField
        variant="outlined"
        size="small"
        value={filters[field]}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            [field]: e.target.value,
          }))
        }
        placeholder="Filter"
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            height: 26,              // 🔥 reduce height
            fontSize: "12px",
          },
          "& .MuiOutlinedInput-input": {
            padding: "4px 8px",     // 🔥 tighter padding
          }
        }}
      />
    </div>
  );

  const clearFilters = () => {
    setFilters({
      id: "",
      customerName: "",
      amount: "",
      interestRate: "",
      installment: "",
      interestAmount: "",
      startDate: "",
      endDate: "",
      g1Name: "",
      g2Name: "",
      g3Name: "",
      partnerId: ""
    });
  };



  const [formData, setFormData] = useState({
    id: null,
    customerId: null,
    guarantor1: null,
    guarantor2: null,
    guarantor3: null,
    partnerId: null,
    startDate: dayjs(),
    endDate: dayjs().add(FIXED_DURATION_MONTHS, "month"),
    amount: "",
    interestRate: BASE_INTEREST_RATE,
    interestAmount: "",
    installment: "",
    processingFee: BASE_PROCESSING_FEE,
    security: "",
    duration: FIXED_DURATION_MONTHS,
  });

  const [options, setOptions] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const headers = {
    Authorization: `Bearer ${getSession("token") || ""}`,
  };

  const LOAN_TYPE = { MONTHLY_FINANCE: "MONTHLY_FINANCE" };

  // FETCH ALL LOANS
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/BusinessMember/findAll/${LOAN_TYPE.MONTHLY_FINANCE}`,
        {
          headers,
        }
      );

      const loans = Array.isArray(res.data) ? res.data : [];

      const memberIds = new Set();
      loans.forEach((l) => {
        l.customerId && memberIds.add(l.customerId);
        l.customerId && memberIds.add(l.partnerId);
        [l.guarantor1, l.guarantor2, l.guarantor3].forEach(
          (g) => g && memberIds.add(g)
        );
      });

      const memberMap = {};
      if (memberIds.size > 0) {
        try {
          const mRes = await axios.get(`${API_BASE}/PersonalInfo/byIds`, {
            headers,
            params: { ids: Array.from(memberIds).join(",") },
          });
          mRes.data.forEach((m) => {
            memberMap[m.id] =
              `${m.id || ""} ${m.firstname || ""} ${m.lastname || ""}`.trim() ||
              `ID: ${m.id}`;
          });
        } catch (e) {
          console.warn("Failed to fetch member names");
        }
      }

      const enriched = loans.map((loan) => ({
        id: loan.id || "N/A",
        customerName: memberMap[loan.customerId] || `ID: ${loan.customerId || "N/A"}`,
        amount: loan.amount || 0,
        interestRate: loan.interestRate || 0,
        installment: loan.installment || 0,
        interestAmount: loan.interest || 0,
        startDate: loan.startDate || null,
        endDate: loan.endDate || null,
        g1Name: loan.guarantor1
          ? memberMap[loan.guarantor1] || `G1: ${loan.guarantor1}`
          : "-",
        g2Name: loan.guarantor2
          ? memberMap[loan.guarantor2] || `G2: ${loan.guarantor2}`
          : "-",
        g3Name: loan.guarantor3
          ? memberMap[loan.guarantor3] || `G3: ${loan.guarantor3}`
          : "-",
        partnerId: loan.partnerId
          ? memberMap[loan.partnerId] || `G4: ${loan.partnerId}`
          : "-",
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

  // Auto update end date (10 months from start date)
  useEffect(() => {
    if (formData.startDate) {
      setFormData((prev) => ({
        ...prev,
        endDate: prev.startDate.add(formData.duration, "month"),
      }));
    }
  }, [formData.startDate, formData.duration]);

  useEffect(() => {
    const amount = Number(formData.amount);
    const rate = Number(formData.interestRate);
    const duration = Number(formData.duration);


    let interestAmount = "";
    let installment = "";

    // ✅ EMI + Interest
    if (amount > 0 && rate > 0) {
      const interest = amount * duration * (rate / 100);
      const total = amount + interest;

      interestAmount = interest.toFixed(2);
      installment = Math.round(total / duration);
    }

    // ✅ Processing Fee
    let extraFee = 0;
    if (amount > 20000) {
      extraFee = Math.ceil((amount - 20000) / 10000) * 100;
    }
    const processingFee = BASE_PROCESSING_FEE + extraFee;

    // ✅ SINGLE STATE UPDATE (VERY IMPORTANT)
    setFormData(prev => ({
      ...prev,
      interestAmount,
      installment,
      processingFee
    }));

  }, [formData.amount, formData.interestRate]);



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
          label: `${item.id || ""} ${item.firstname || ""} ${item.lastname || ""} - ${item.mobile || "No Mobile"
            }`.trim(),
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

  const searchPartners = useCallback(
    async (query) => {
      if (!query || query.trim().length < 2) {
        setOptions([]);
        return;
      }

      setLoadingSearch(true);

      try {
        const res = await axios.get(
          `${API_BASE}/PersonalInfo/personInfoAutoCompleteByCategory/PARTNER`,
          {
            headers,
            params: { q: query.trim() }, // maps to @RequestParam String q
          }
        );

        const list = (res.data || []).map((item) => ({
          id: item.id,
          label: `${item.id || ""} ${item.firstname || ""} ${item.lastname || ""} - ${item.mobile || "No Mobile"
            }`,
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
      id: null,
      customerId: null,
      guarantor1: null,
      guarantor2: null,
      guarantor3: null,
      partnerId: null,
      startDate: dayjs(),
      endDate: dayjs().add(FIXED_DURATION_MONTHS, "month"),
      amount: "",
      interestRate: BASE_INTEREST_RATE,
      installment: "",
      processingFee: BASE_PROCESSING_FEE,
      security: "",
      duration: FIXED_DURATION_MONTHS,
    });
    setIsEditMode(false);
    setCurrentLoanId(null);
  };



  const handleNewButton = async () => {
    try {
      const res = await axios.get(`${API_BASE}/BusinessMember/createLoan/${LOAN_TYPE.MONTHLY_FINANCE}`, {
        headers,
      });

      const l = res.data;

      setFormData({
        id: l.id,
        customerId: null,
        guarantor1: null,
        guarantor2: null,
        guarantor3: null,
        partnerId: null,
        startDate: dayjs(),
        endDate: dayjs().add(FIXED_DURATION_MONTHS, "month"),
        amount: "",
        interestRate: BASE_INTEREST_RATE,
        installment: "",
        processingFee: BASE_PROCESSING_FEE,
        security: "",
        duration: FIXED_DURATION_MONTHS,
      });

      setIsEditMode(false);
      setCurrentLoanId(l.id);
      setOpen(true);

    } catch (err) {
      console.log("err", err);
      errorToast("Failed to load loan");
    }
  };



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
        l.partnerId,
      ].filter(Boolean);

      let map = {};

      if (idsToFetch.length > 0) {
        const mRes = await axios.get(`${API_BASE}/PersonalInfo/byIds`, {
          headers,
          params: { ids: idsToFetch.join(",") },
        });

        mRes.data.forEach((m) => {
          map[m.id] = {
            id: m.id,
            label: `${m.id || ""} ${m.firstname || ""} ${m.lastname || ""} - ${m.mobile || ""}`,
          };
        });
      }

      setFormData({
        id: l.id,
        customerId: map[l.customerId] || null,
        guarantor1: map[l.guarantor1] || null,
        guarantor2: map[l.guarantor2] || null,
        guarantor3: map[l.guarantor3] || null,

        partnerId: map[l.partnerId] || null,

        startDate: l.startDate ? dayjs(l.startDate) : dayjs(),
        endDate: l.endDate ? dayjs(l.endDate) : dayjs().add(FIXED_DURATION_MONTHS, "month"),

        amount: l.amount?.toString() || "",
        duration: l.duration?.toString() || FIXED_DURATION_MONTHS,
        interestRate: l.interestRate?.toString() || BASE_INTEREST_RATE,

        interestAmount: l.interest?.toString() || "",

        installment: l.installment?.toString() || "",

        processingFee: l.processingFee?.toString() || BASE_PROCESSING_FEE,

        security: l.security || "",
      });

      setCurrentLoanId(id);
      setIsEditMode(true);
      setOpen(true);
    } catch (err) {
      console.log("err", err);
      errorToast("Failed to load loan");
    }
  };



  const handleSave = async () => {
    if (!formData.customerId?.id) return errorToast("Customer is required");

    const payload = {
      id: formData.id,
      customerId: formData.customerId.id,
      guarantor1: formData.guarantor1?.id || "",
      guarantor2: formData.guarantor2?.id || "",
      guarantor3: formData.guarantor3?.id || "",
      partnerId: formData.partnerId?.id || "",
      startDate: formData.startDate.format("YYYY-MM-DD"),
      endDate: formData.endDate.format("YYYY-MM-DD"),
      amount: Number(formData.amount),
      interestRate: Number(formData.interestRate),
      interest: Number(formData.interestAmount),
      installment: Number(formData.installment), // Send calculated EMI
      processingFee: Number(formData.processingFee) || 0,
      security: formData.security,
      duration: formData.duration,
    };

    try {
      setLoading(true); // 🔥 START LOADING


      try {
        const response = await axios.post(
          `${API_BASE}/BusinessMember/update/${LOAN_TYPE.MONTHLY_FINANCE}`,
          payload,
          { headers }
        );

        successToast(response.data || "Loan updated successfully!");

      } catch (error) {

        const message =
          error.response?.data?.message ||
          error.response?.data ||
          "Something went wrong";

        errorToast(message);
      }

      handleClose();
      fetchData();
      console.log("fetchData", fetchData);
    } catch (err) {
      errorToast(err.response?.data?.message || "Save failed");
    }
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(params.row.id)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },

    {
      field: "id",
      width: 100,
      renderHeader: () => getHeader("Acc No", "id"),
    },
    {
      field: "customerName",
      width: 260,
      renderHeader: () => getHeader("Customer Name", "customerName"),
    },
    {
      field: "amount",
      width: 140,
      renderHeader: () => getHeader("Loan Amount", "amount"),
    },
    {
      field: "interestRate",
      width: 100,
      renderHeader: () => getHeader("Interest %", "interestRate"),
    },
    {
      field: "installment",
      width: 150,
      renderHeader: () => getHeader("Monthly EMI", "installment"),
    },
    {
      field: "interestAmount",
      width: 150,
      renderHeader: () => getHeader("Interest Amount", "interestAmount"),
    },
    {
      field: "startDate",
      width: 140,
      renderHeader: () => getHeader("Loan Date", "startDate"),
    },
    {
      field: "endDate",
      width: 140,
      renderHeader: () => getHeader("Maturity Date", "endDate"),
    },
    {
      field: "g1Name",
      width: 200,
      renderHeader: () => getHeader("Guarantor 1", "g1Name"),
    },
    {
      field: "g2Name",
      width: 200,
      renderHeader: () => getHeader("Guarantor 2", "g2Name"),
    },
    {
      field: "g3Name",
      width: 200,
      renderHeader: () => getHeader("Guarantor 3", "g3Name"),
    },
    {
      field: "partnerId",
      width: 150,
      renderHeader: () => getHeader("Partner/Agent", "partnerId"),
    },
  ];

  return (
    <>
   <ReportToolbar
  data={filteredRows}
  columns={[
    "id",
    "customerName",
    "amount",
    "interestRate",
    "interestAmount",
    "installment",
    "startDate",
    "endDate",
    "g1Name",
    "g2Name",
    "g3Name",
    "partnerId",
  ]}
  fileName="Monthly_Finance_Report"
  tableId="monthlyFinanceTable"
/>
      <Box sx={{ p: 3 }}>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight={600} color="#1e293b">
            Monthly Finance
          </Typography>


        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >

          <Button
            variant="contained"
            onClick={clearFilters}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Clear Filters
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => {
              handleNewButton();
            }}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            New Loan
          </Button>
        </Box>

        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          getRowId={(r) => r.id}
          autoHeight
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pagination
          headerHeight={70}
        />



        {/* Loading Spinner Overlay */}
        {loading && rows.length === 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
            <LoadingSpinner />
          </Box>
        )}
      </Box>

      {/* MODAL DIALOG */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, overflow: "hidden" },
        }}
      >
        <AppBar position="relative" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" sx={{ flex: 1, fontWeight: 700 }}>
              {isEditMode
                ? "Edit Monthly Finance Loan"
                : "New Monthly Finance Loan"}
            </Typography>
            <IconButton edge="end" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent dividers sx={{ bgcolor: "#f8fafc" }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {`Account No: ${currentLoanId}`}
          </Typography>

          {/* Customer & Dates */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6} sm={4}>
              <Autocomplete
                sx={{ width: "220px" }}
                options={options}
                loading={loadingSearch}
                value={formData.customerId}
                onChange={(e, v) =>
                  setFormData((p) => ({ ...p, customerId: v }))
                }
                onInputChange={(e, v) => v && searchMembers(v)}
                getOptionLabel={(o) => o?.label || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Customer Name *"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <AppDatePicker
                label="Loan Date *"
                value={formData.startDate}
                onChange={(value) => setFormData((p) => ({ ...p, startDate: dayjs(value) }))}
                size="medium"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <AppDatePicker
                label="Maturity Date"
                value={formData.endDate}
                onChange={() => {}}
                disabled
                size="medium"
              />
            </Grid>
          </Grid>

          {/* Loan Details */}
          <Box sx={{ mt: 4 }}>
            <Chip
              label="LOAN DETAILS"
              sx={{ bgcolor: "#14b8a6", color: "white", fontWeight: 600 }}
            />
          </Box>

          <Grid container spacing={3} sx={{ mt: 1 }}>


            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Loan Amount *"
                type="text"                    // Changed to text for better control
                value={formData.amount
                  ? Number(formData.amount).toLocaleString('en-IN')
                  : ""
                }
                onChange={(e) => {
                  // Remove commas and non-numeric characters
                  const rawValue = e.target.value.replace(/[^0-9]/g, '');
                  setFormData((p) => ({
                    ...p,
                    amount: rawValue
                  }));
                }}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>,
                }}
                placeholder="0"
              />
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Interest %"
                type="number"
                variant="outlined"
                value={formData.interestRate}
                inputProps={{ min: 0, max: 100, step: 0.1 }}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    interestRate: Number(e.target.value)
                  }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Interest Amount"
                type="text"
                value={
                  formData.interestAmount
                    ? `${Number(formData.interestAmount).toLocaleString("en-IN")}`
                    : ""
                }
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <Typography sx={{ mr: 1, color: 'text.secondary' }}>₹</Typography>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Monthly EMI"
                value={
                  formData.installment
                    ? `₹${Number(formData.installment).toLocaleString("en-IN")}`
                    : ""
                }
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                type="number"
                variant="outlined"
                value={formData.duration}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, duration: e.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Processing Fee"
                type="text"
                value={
                  formData.processingFee
                    ? Number(formData.processingFee).toLocaleString("en-IN")
                    : ""
                }
                onChange={(e) => {
                  // Remove commas before saving
                  const rawValue = e.target.value.replace(/,/g, "");

                  // Allow only numbers
                  if (!isNaN(rawValue)) {
                    setFormData((p) => ({
                      ...p,
                      processingFee: rawValue,
                    }));
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Security / Remarks"
                variant="outlined"
                value={formData.security}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, security: e.target.value }))
                }
              />
            </Grid>
          </Grid>

          {/* Guarantors */}
          <Box sx={{ mt: 4 }}>
            <Chip
              label="GUARANTORS"
              sx={{ bgcolor: "#8b5cf6", color: "white", fontWeight: 600 }}
            />
          </Box>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            {["guarantor1", "guarantor2", "guarantor3"].map((field, i) => (
              <Grid item xs={12} key={field}>
                <Grid container>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      fullWidth
                      sx={{ width: "220px" }}
                      options={options}
                      loading={loadingSearch}
                      value={formData[field]}
                      onChange={(e, v) =>
                        setFormData((p) => ({ ...p, [field]: v }))
                      }
                      onInputChange={(e, v) => v && searchMembers(v)}
                      getOptionLabel={(o) => o?.label || ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={`Guarantor ${i + 1}${i === 0 ? " *" : ""}`}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>

          {/* PARTNER */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                fullWidth
                sx={{ width: "230px" }}
                options={options}
                loading={loadingSearch}
                value={formData.partnerId}
                onInputChange={(e, v) => searchPartners(v)}
                onChange={(e, v) =>
                  setFormData((p) => ({ ...p, partnerId: v }))
                }
                getOptionLabel={(o) => o?.label || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Partner / Agent *" fullWidth />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: "#f1f5f9" }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading
              ? "Processing..."
              : isEditMode
                ? "Update Loan"
                : "Create Loan"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MonthlyFinance;
