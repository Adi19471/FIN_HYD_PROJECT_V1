import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

const Registration_creation = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
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
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleOpen(params.row)}
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
    { field: "id", headerName: "ID", width: 120 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
   {
  field: "role",
  headerName: "Role",
  flex: 1,
  minWidth: 140,
}
  ];

  return (
    <Box sx={{ height: 640, width: "100%", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">User Management</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          disabled={loading || saving}
        >
          Add New User
        </Button>
      </Box>

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
        // ── Show grid lines / borders ──
        showCellVerticalBorder
        showColumnVerticalBorder
        sx={{
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f8f9fa",
            borderBottom: "2px solid #ccc",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #e0e0e0 !important",
          },
          "& .MuiDataGrid-row": {
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          },
          "& .MuiDataGrid-virtualScroller": {
            overflowX: "auto",
          },
        }}
      />

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{form.id ? "Edit User" : "Create New User"}</DialogTitle>

        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="Name *"
            fullWidth
            variant="outlined"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <TextField
            margin="dense"
            label={form.id ? "New Password (optional)" : "Password *"}
            type="password"
            fullWidth
            variant="outlined"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            helperText={
              form.id
                ? "Leave blank to keep current password"
                : "Required for new users"
            }
          />

          <TextField
            margin="dense"
            label="Role"
            fullWidth
            variant="outlined"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            helperText="e.g. admin, user, developer, read-only, read"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {saving ? "Saving..." : form.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Registration_creation;