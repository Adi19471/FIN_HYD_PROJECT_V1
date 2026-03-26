import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  Tooltip,
  Grid,
  MenuItem,
  CircularProgress,
  Select,
  Checkbox,
  Chip,
  InputLabel,
  FormControl,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  AccountTree as AccountTreeIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-toastify";

import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

const PERSON_TYPES = ["CUSTOMER", "PARTNER", "EMPLOYEE", "VENDOR"];
const TRANS_TYPES = ["CREDIT", "DEBIT"];

const AccountMasterSetup = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: 0,
    type: "",
    masterCode: "",
    code: "",
    visibility: true,
    masterIcon: "",
    personType: [],
    transType: [],
  });

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${getSession()?.token || getSession("token") || ""}`,
      "Content-Type": "application/json",
    },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/account-master-setup/findAll`, getHeaders());
      setAccounts(res.data || []);
    } catch (err) {
      toast.error("Failed to load account masters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (row = null) => {
    if (row) {
      setIsEdit(true);
      setForm({
        ...row,
        personType: row.personType ? row.personType.split(",").map((v) => v.trim()) : [],
        transType: row.transType ? row.transType.split(",").map((v) => v.trim()) : [],
      });
    } else {
      setIsEdit(false);
      setForm({
        id: 0,
        type: "",
        masterCode: "",
        code: "",
        visibility: true,
        masterIcon: "",
        personType: [],
        transType: [],
      });
    }
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.type.trim() || !form.masterCode.trim() || !form.code.trim()) {
      toast.warn("Type, Master Code and Code are required fields");
      return;
    }

    const payload = {
      ...form,
      personType: form.personType.join(","),
      transType: form.transType.join(","),
    };

    try {
      const url = isEdit
        ? "/account-master-setup/UpdateAccountMaster"
        : "/account-master-setup/saveAccountMaster";

      await axios.post(`${API_BASE}${url}`, payload, getHeaders());
      toast.success(isEdit ? "Updated successfully" : "Created successfully");
      handleClose();
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.get(`${API_BASE}/account-master-setup/deleteAccountMasterById/${id}`, getHeaders());
      toast.success("Deleted successfully");
      fetchData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70, align: "center", headerAlign: "center" },
    { field: "type", headerName: "Type", flex: 1, minWidth: 130 },
    { field: "masterCode", headerName: "Master Code", width: 140 },
    { field: "code", headerName: "Code", width: 110 },
    {
      field: "personType",
      headerName: "Person Type",
      width: 240,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {params.value?.split(",").map((pt, i) =>
            pt.trim() && <Chip key={i} label={pt.trim()} size="small" color="primary" variant="outlined" />
          )}
        </Box>
      ),
    },
    {
      field: "transType",
      headerName: "Transaction",
      width: 160,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {params.value?.split(",").map((tt, i) =>
            tt.trim() && (
              <Chip
                key={i}
                label={tt.trim()}
                size="small"
                color={tt.trim() === "CREDIT" ? "success" : "error"}
              />
            )
          )}
        </Box>
      ),
    },
    {
      field: "visibility",
      headerName: "Visible",
      width: 90,
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) =>
        value ? <Visibility color="success" /> : <VisibilityOff color="disabled" />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      renderCell: ({ row }) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleOpen(row)} color="primary" size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(row.id)} color="error" size="small">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <AccountTreeIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight={600}>
              Account Master Setup
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Add New
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ height: 620, borderRadius: 2, overflow: "hidden", boxShadow: 1 }}>
        {loading ? (
          <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={accounts}
            columns={columns}
            getRowId={(row) => row.id}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } },
            }}
            pageSizeOptions={[10, 25, 50]}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "primary.main",
                color: "white",           // Changed to white for better contrast
                fontWeight: 600,
              },
              "& .MuiDataGrid-cell": { borderBottom: "1px solid #eee" },
            }}
          />
        )}
      </Paper>

      {/* Modal Popup */}
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            boxShadow: 2,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <AccountTreeIcon color="primary" />
          {isEdit ? "Edit Account Master" : "Create New Account Master"}
          <IconButton
            onClick={handleClose}
            sx={{ ml: "auto" }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Type"
                name="type"
                value={form.type}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Master Code"
                name="masterCode"
                value={form.masterCode}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Code"
                name="code"
                value={form.code}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Master Icon (optional)"
                name="masterIcon"
                value={form.masterIcon}
                onChange={handleChange}
                variant="outlined"
                placeholder="e.g., AccountBalance, CreditCard, etc."
              />
            </Grid>

            {/* Person Type - Multi Select */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Person Type</InputLabel>
                <Select
                  multiple
                  value={form.personType}
                  label="Person Type"
                  sx={{width:200}}
                  onChange={(e) => setForm((p) => ({ ...p, personType: e.target.value }))}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" color="primary" />
                      ))}
                    </Box>
                  )}
                >
                  {PERSON_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      <Checkbox checked={form.personType.includes(type)} />
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Transaction Type - Multi Select */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  multiple
                  value={form.transType}
                  label="Transaction Type"    sx={{width:200}}
                  onChange={(e) => setForm((p) => ({ ...p, transType: e.target.value }))}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          size="small"
                          color={value === "CREDIT" ? "success" : "error"}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {TRANS_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      <Checkbox checked={form.transType.includes(type)} />
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.visibility}
                    onChange={(e) => setForm((p) => ({ ...p, visibility: e.target.checked }))}
                    color="success"
                  />
                }
                label={
                  <Typography variant="body1">
                    {form.visibility ? "Visible in lists" : "Hidden from lists"}
                  </Typography>
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button variant="outlined" onClick={handleClose} sx={{ px: 4 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            sx={{ px: 4 }}
          >
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountMasterSetup;