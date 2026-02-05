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
  FormControlLabel,
  Switch,
  Typography,
  Paper,
  Tooltip,
  Grid,
  MenuItem,
  CircularProgress,
  Select,
  Checkbox,
  ListItemText,
  Chip,
  InputLabel,
  FormControl,
} from "@mui/material";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { toast } from "react-toastify";

import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

/* ---------------- CONSTANTS ---------------- */
const PERSON_TYPES = ["CUSTOMER", "PARTNER", "EMPLOYEE", "VENDOR"];
const TRANS_TYPES = ["CREDIT", "DEBIT"];

const AccountMasterSetup = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
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

  /* ---------------- HEADERS ---------------- */
  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${
        getSession()?.token || getSession("token") || ""
      }`,
      "Content-Type": "application/json",
    },
  });

  /* ---------------- FETCH DATA ---------------- */
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/account-master-setup/findAll`,
        getHeaders()
      );
      setAccounts(res.data || []);
    } catch {
      toast.error("Failed to load account masters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- OPEN / CLOSE ---------------- */
  const handleOpen = (row = null) => {
    if (row) {
      setIsEdit(true);
      setForm({
        ...row,
        personType: row.personType?.split(",") || [],
        transType: row.transType?.split(",") || [],
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
    setOpenDialog(true);
  };

  const handleClose = () => setOpenDialog(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ---------------- SAVE ---------------- */
  const handleSubmit = async () => {
    if (!form.type || !form.masterCode || !form.code) {
      toast.warn("Type, Master Code and Code are required");
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
    } catch {
      toast.error("Save failed");
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await axios.get(
        `${API_BASE}/account-master-setup/deleteAccountMasterById/${id}`,
        getHeaders()
      );
      toast.success("Deleted successfully");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------------- GRID ---------------- */
  const columns = [
    { field: "id", headerName: "ID", width: 70, align: "center", headerAlign: "center" },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "masterCode", headerName: "Master Code", width: 150 },
    { field: "code", headerName: "Code", width: 120 },
    { field: "personType", headerName: "Person Type", width: 220 },
    { field: "transType", headerName: "Transaction", width: 160 },
    {
      field: "visibility",
      headerName: "Visible",
      width: 90,
      align: "center",
      headerAlign: "center",
      renderCell: ({ value }) => (value ? "Yes" : "No"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: ({ row }) => (
        <>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleOpen(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => handleDelete(row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  /* ---------------- UI ---------------- */
  return (
    <Box p={3}>
      <Paper className="card" sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5">Account Master Setup</Typography>
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => handleOpen()}>
            Add New
          </Button>
        </Box>
      </Paper>

      <Paper className="card" sx={{ height: 600 }}>
        {loading ? (
          <Box height="100%" display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={accounts}
            columns={columns}
            getRowId={(r) => r.id}
            slots={{ toolbar: GridToolbar }}
          />
        )}
      </Paper>

      {/* ---------------- DIALOG ---------------- */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pr: 5 }}>
          {isEdit ? "Edit Account Master" : "Create Account Master"}
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Type" name="type" value={form.type} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Master Code" name="masterCode" value={form.masterCode} onChange={handleChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Code" name="code" value={form.code} onChange={handleChange} />
            </Grid>

            {/* PERSON TYPE */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Person Type</InputLabel>
                <Select
                  multiple
                  value={form.personType}
                  label="Person Type"
                  onChange={(e) =>
                    setForm((p) => ({ ...p, personType: e.target.value }))
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((v) => (
                        <Chip key={v} label={v} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {PERSON_TYPES.map((p) => (
                    <MenuItem key={p} value={p}>
                      <Checkbox checked={form.personType.includes(p)} />
                      <ListItemText primary={p} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* TRANSACTION TYPE */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  multiple
                  value={form.transType}
                  label="Transaction Type"
                  onChange={(e) =>
                    setForm((p) => ({ ...p, transType: e.target.value }))
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((v) => (
                        <Chip key={v} label={v} size="small" color="primary" />
                      ))}
                    </Box>
                  )}
                >
                  {TRANS_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>
                      <Checkbox checked={form.transType.includes(t)} />
                      <ListItemText primary={t} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Master Icon" name="masterIcon" value={form.masterIcon} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.visibility}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, visibility: e.target.checked }))
                    }
                  />
                }
                label="Visible"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSubmit}>
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountMasterSetup;
