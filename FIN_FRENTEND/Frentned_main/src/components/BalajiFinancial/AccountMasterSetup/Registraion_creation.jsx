import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BadgeIcon from "@mui/icons-material/Badge";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";
import { DataTable, PageHeader } from "src/components/ui";
import registrationService from "src/services/registrationService";
import ReportToolbar from "../ReportsAll/ReportToolbar";

const emptyForm = {
  id: "",
  name: "",
  password: "",
  role: "",
  permissionIds: [],
};

const normalizeRole = (role) => (role && role !== "-" ? role : "");

const Registration_creation = () => {
  const [rows, setRows] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const [userRows, permissionRows] = await Promise.all([
        registrationService.loadUsers(),
        registrationService.loadPermissions(),
      ]);

      setRows(userRows);
      setPermissions(permissionRows);
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

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;

    return rows.filter((row) =>
      [row.id, row.name, row.role]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(term))
    );
  }, [rows, search]);

  const selectedRoleTitle = form.name ? `Assigned Roles of ${form.name}` : "Assigned Roles";

  const handleOpen = (row = null) => {
    setForm(
      row
        ? {
          id: row.id ?? "",
          name: row.name ?? "",
          password: "",
          role: normalizeRole(row.role),
          permissionIds: row.permissionIds || [],
        }
        : emptyForm
    );
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setForm(emptyForm);
  };

  const handlePermissionsOpen = (row) => {
    setForm({
      id: row.id ?? "",
      name: row.name ?? "",
      password: "",
      role: normalizeRole(row.role),
      permissionIds: row.permissionIds || [],
    });
    setPermissionsOpen(true);
  };

  const handlePermissionsClose = () => {
    setPermissionsOpen(false);
    setForm(emptyForm);
  };

  const togglePermission = (permissionId) => {
    setForm((current) => ({
      ...current,
      permissionIds: current.permissionIds.includes(permissionId)
        ? current.permissionIds.filter((id) => id !== permissionId)
        : [...current.permissionIds, permissionId],
    }));
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
        await registrationService.updateUser(form);

      } else {
        await registrationService.saveUser(form);
      }
      toast.success(form.id ? "User updated successfully" : "User created successfully");
      handleClose();
      await loadUsers();

    } catch (err) {
      console.error("Save failed:", err);
      toast.error(err?.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePermissionsSave = async () => {
    if (!form.id) {
      toast.warning("Please select a user");
      return;
    }

    setSaving(true);
    try {
      await registrationService.updateUser(form);
      toast.success("Menu permissions saved successfully");
      handlePermissionsClose();
      await loadUsers();
    } catch (err) {
      console.error("Permission save failed:", err);
      toast.error(err?.response?.data?.message || "Permission save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await registrationService.deleteUser(id);
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
      width: 170,
      sortable: false,
      align: "center",
      headerAlign: "center",
      headerClassName: "header-cell",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary" onClick={() => handleOpen(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Menu Permissions">
            <IconButton
              size="small"
              color="secondary"
              onClick={() => handlePermissionsOpen(params.row)}
            >
              <AdminPanelSettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)}>
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
      headerClassName: "header-cell",
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
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 140,
      headerClassName: "header-cell",
      renderCell: (params) => {
        const isAdmin = params.value?.toString().toUpperCase() === "ADMIN";
        return (
          <Chip
            size="small"
            color={isAdmin ? "primary" : "default"}
            label={params.value}
            sx={{ fontWeight: 700 }}
          />
        );
      },
    },
    {
      field: "permissionIds",
      headerName: "Permissions",
      width: 140,
      align: "center",
      headerAlign: "center",
      headerClassName: "header-cell",
      renderCell: (params) => (
        <Chip
          size="small"
          color={params.value?.length ? "success" : "default"}
          label={`${params.value?.length || 0} assigned`}
          variant={params.value?.length ? "filled" : "outlined"}
        />
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="User Management"
        subtitle="Create users, update roles, assign menu permissions, search records, and export the current register."
        searchPlaceholder="Search user, role, or ID..."
        searchValue={search}
        onSearchChange={setSearch}
        onAddClick={() => handleOpen()}
        addButtonLabel="Add New User"
        totalCount={filteredRows.length}
        loading={loading || saving}
        onRefresh={loadUsers}
      />
      <ReportToolbar
        data={filteredRows}
        columns={["id", "name", "role"]}
        fileName="User_Management_Report"
        tableId="userManagementTable"
      />
      <DataTable
        rows={filteredRows}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        height="calc(100vh - 310px)"
        title="User register"
        subtitle="Use the shield action to assign API menu permissions to a user."
      />
      <Box sx={{ display: "none" }}>
        <table id="userManagementTable">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.role}</td>
                <td>{row.permissionIds?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
      <Dialog open={modalOpen} onClose={handleClose} maxWidth="sm" fullWidth>
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
            <Grid size={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter user name"
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label={form.id ? "New Password (optional)" : "Password"}
                name="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required={!form.id}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                helperText={form.id ? "Leave blank to keep current password" : "Required for new users"}
                placeholder={form.id ? "Enter new password" : "Enter password"}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Role"
                name="role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                placeholder="e.g. ADMIN, USER"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Button onClick={handleClose} variant="outlined" startIcon={<CloseIcon />} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          >
            {saving ? "Saving..." : form.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={permissionsOpen} onClose={handlePermissionsClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <AdminPanelSettingsIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
            {selectedRoleTitle}
          </Typography>
          <IconButton onClick={handlePermissionsClose} sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              Roles:
            </Typography>
            <Chip size="small" label={`${form.permissionIds.length} assigned`} color="primary" />
          </Stack>

          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 470 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 70, fontWeight: 800 }}>S.No</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Role</TableCell>
                  <TableCell align="center" sx={{ width: 110, fontWeight: 800 }}>
                    Assigned
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {permissions.map((permission, index) => (
                  <TableRow key={permission.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{permission.rolePath}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={form.permissionIds.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {!permissions.length && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                        No permissions found from API.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Button onClick={handlePermissionsClose} variant="outlined" disabled={saving}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handlePermissionsSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Registration_creation;
