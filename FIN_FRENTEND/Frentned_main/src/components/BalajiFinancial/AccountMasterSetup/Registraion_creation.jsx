
import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";

import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

const getHeaders = () => {
  const token =
    getSession()?.token ||
    getSession("token") ||
    localStorage.getItem("token") ||
    "";

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
};

const DRAWER_WIDTH = 400;

const Registration_creation = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    id: "",
    name: "",
    password: "",
    role: "",
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/users`, getHeaders());

      // Handle different possible response shapes
      const userList = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.users || res.data?.result || [];

      const normalizedRows = userList.map((user, index) => ({
        id: user.id ?? user._id ?? user.userId ?? `row-${index}`,
        name: user.name ?? user.username ?? user.email ?? "—",
        role: user.role || "—",
      }));

      setRows(normalizedRows);
    } catch (err) {
      console.error("Load users failed:", err);
      toast.error(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpen = (row = null) => {
    if (row) {
      setForm({
        id: row.id ?? "",
        name: row.name ?? "",
        password: "", // never pre-fill password
        role: row.role === "—" ? "" : row.role ?? "",
      });
    } else {
      setForm({ id: "", name: "", password: "", role: "" });
    }
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setForm({ id: "", name: "", password: "", role: "" });
  };

  const handleSave = async () => {
    if (!form.name?.trim()) {
      toast.warning("Name is required");
      return;
    }

    if (!form.id && !form.password?.trim()) {
      toast.warning("Password is required for new users");
      return;
    }

    setSaving(true);

    try {
      if (form.id) {
        // Update
        const payload = {
          id: form.id,
          name: form.name.trim(),
        };
        if (form.role?.trim()) payload.role = form.role.trim();
        if (form.password?.trim()) payload.password = form.password.trim();

        await axios.put(`${API_BASE}/users`, payload, getHeaders());
        toast.success("User updated successfully");
      } else {
        // Create
        await axios.post(
          `${API_BASE}/users`,
          {
            name: form.name.trim(),
            password: form.password.trim(),
            role: form.role?.trim() || null,
          },
          getHeaders()
        );
        toast.success("User created successfully");
      }

      handleClose();
      await loadUsers();
    } catch (err) {
      console.error("Save failed:", err);
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${API_BASE}/users/${id}`, getHeaders());
      toast.success("User deleted successfully");
      await loadUsers();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      align: "center",
      headerAlign: "center",
      headerClassName: "header-cell",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpen(params.row)}
              sx={{
                "&:hover": { backgroundColor: "primary.light", color: "primary.contrastText" }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
              sx={{
                "&:hover": { backgroundColor: "error.light", color: "error.contrastText" }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    { 
      field: "id", 
      headerName: "ID", 
      width: 120,
      headerClassName: "header-cell"
    },
    { 
      field: "name", 
      headerName: "Name", 
      flex: 1, 
      minWidth: 180,
      headerClassName: "header-cell",
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonIcon sx={{ color: "primary.main", fontSize: 20 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 140,
      headerClassName: "header-cell",
      renderCell: (params) => (
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            bgcolor: params.value === "admin" ? "primary.light" : "grey.100",
            color: params.value === "admin" ? "primary.contrastText" : "text.primary",
            fontWeight: 500,
            fontSize: "0.75rem",
          }}
        >
          {params.value}
        </Box>
      )
    }
  ];

  return (
    <Box p={3}>
      {/* Header Card */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 2, 
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          background: "linear-gradient(135deg, #f8f9fa 0%, #fff 100%)"
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <PersonAddIcon sx={{ color: "primary.main", fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
              User Management
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            disabled={loading || saving}
            sx={{ 
              borderRadius: 2,
              textTransform: "none",
              px: 2,
              boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)"
            }}
          >
            Add New User
          </Button>
        </Box>
      </Paper>

      {/* Data Grid Card */}
      <Paper 
        elevation={0}
        sx={{ 
          height: 640, 
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden"
        }}
      >
        {loading ? (
          <Box height="100%" display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            loading={loading}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 15, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            showCellVerticalBorder
            showColumnVerticalBorder
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "primary.main",
                color: "black",
                borderBottom: "2px solid primary.dark",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600,
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f0f0f0",
              },
              "& .MuiDataGrid-row": {
                "&:hover": {
                  backgroundColor: "action.hover",
                },
                "&.Mui-selected": {
                  backgroundColor: "action.selected",
                },
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "2px solid primary.light",
              },
              "& .header-cell": {
                fontWeight: 600,
              },
            }}
          />
        )}
      </Paper>

      {/* Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 3,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
            {form.id ? "Edit User" : "Create New User"}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
                placeholder="Enter user name"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={form.id ? "New Password (optional)" : "Password"}
                name="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!form.id}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
                helperText={
                  form.id
                    ? "Leave blank to keep current password"
                    : "Required for new users"
                }
                placeholder={form.id ? "Enter new password" : "Enter password"}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Role"
                name="role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
                placeholder="e.g. admin, user, developer"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            startIcon={<CloseIcon />}
            disabled={saving}
            sx={{ 
              borderRadius: 1.5,
              textTransform: "none",
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />
            }
            sx={{ 
              borderRadius: 1.5,
              textTransform: "none",
              px: 3,
              boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)"
            }}
          >
            {saving ? "Saving..." : form.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Registration_creation;

