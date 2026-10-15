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
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import { toast } from "react-toastify";
import { actionIcons, navIcons } from "src/lib/icons";
import { DataTable, ScreenHeader } from "src/components/ui";
import registrationService from "src/services/registrationService";

// Action marks, from the shared icon language.
const AddIcon = actionIcons.add;
const CloseIcon = actionIcons.close;
const DeleteIcon = actionIcons.delete;
const EditIcon = actionIcons.edit;
const SaveIcon = actionIcons.save;
const SearchIcon = actionIcons.search;

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
  // narrows the long menu list inside the permissions dialog
  const [permissionSearch, setPermissionSearch] = useState("");
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
    setPermissionSearch("");
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

  const visiblePermissions = useMemo(() => {
    const term = permissionSearch.trim().toLowerCase();
    if (!term) return permissions;
    return permissions.filter((permission) =>
      String(permission.rolePath || "").toLowerCase().includes(term)
    );
  }, [permissions, permissionSearch]);

  const allVisibleAssigned =
    visiblePermissions.length > 0 &&
    visiblePermissions.every((permission) => form.permissionIds.includes(permission.id));

  // Tick or clear everything in the list as it is filtered right now.
  const toggleVisiblePermissions = () => {
    const visibleIds = visiblePermissions.map((permission) => permission.id);
    setForm((current) => ({
      ...current,
      permissionIds: allVisibleAssigned
        ? current.permissionIds.filter((id) => !visibleIds.includes(id))
        : [...new Set([...current.permissionIds, ...visibleIds])],
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
      filterable: false,
      // buttons, not data: left out of every download / print
      disableExport: true,
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
      // what a download / print shows in place of the chip
      valueFormatter: (value) => `${value?.length || 0} assigned`,
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
    <div className="scr-page">
      <ScreenHeader
        icon={navIcons.userRegistration}
        title="User Registration"
        subtitle="Who can sign in, their role and the menus they may open."
      >
        <TextField
          className="scr-head-search"
          size="small"
          placeholder="Search user, role or ID..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          disabled={loading || saving}
        >
          Add User
        </Button>
      </ScreenHeader>

      {/* Download / Print live on the grid's own toolbar, as on every screen. */}
      <DataTable
        rows={filteredRows}
        columns={columns}
        getRowId={(row) => row.id}
        loading={loading}
        title="Users"
        subtitle="Use the shield action to choose the menus a user may open."
        fileName="User_Management_Report"
        pageSize={25}
        disableRowSelectionOnClick
      />
      <Dialog open={modalOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography component="span" variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
            {form.id ? "Edit User" : "Create New User"}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
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
          <Typography component="span" variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
            {selectedRoleTitle}
          </Typography>
          <IconButton onClick={handlePermissionsClose} sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 2 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{ mb: 1.5 }}
          >
            <TextField
              size="small"
              placeholder="Search menus..."
              value={permissionSearch}
              onChange={(event) => setPermissionSearch(event.target.value)}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Chip
              size="small"
              color="primary"
              label={`${form.permissionIds.length} of ${permissions.length} assigned`}
            />
            <Button
              size="small"
              variant="outlined"
              onClick={toggleVisiblePermissions}
              disabled={!visiblePermissions.length}
            >
              {allVisibleAssigned ? "Clear all" : "Select all"}
            </Button>
          </Stack>

          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: { xs: 300, sm: 380, md: 470 }, overflow: "auto" }}>
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
                {visiblePermissions.map((permission, index) => (
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
                {!visiblePermissions.length && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                        {permissions.length ? "No menu matches the search." : "No permissions found from API."}
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
    </div>
  );
};

export default Registration_creation;
