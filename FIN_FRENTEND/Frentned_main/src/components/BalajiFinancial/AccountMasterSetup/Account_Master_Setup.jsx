// src/pages/AccountMasterSetup/Account_Master_Setup.jsx
import React, { useState, useEffect } from 'react';
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
  Chip,
  Tooltip,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,MenuItem 
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import { toast } from 'react-toastify';

import { API_BASE } from 'lib/config';
import { getSession } from 'src/utils/session';

const AccountMasterSetup = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [currentItem, setCurrentItem] = useState({
    id: null,
    type: '',
    masterCode: '',
    code: '',
    visibility: true,
    masterIcon: '', // will store relative path e.g. /uploads/icons/xxx.png
    personType: '',
    transType: '',
  });

  const [previewImage, setPreviewImage] = useState(null); // for preview in form

  const token = getSession('token') || '';
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Fetch all records
  const fetchAccountMasters = async () => {
    try {
      setLoading(true);
      // Assuming you have a GET endpoint for list
      const response = await axios.get(`${API_BASE}/api/account-master-setup/list`, { headers });
      setRows(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load account masters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountMasters();
  }, []);

  const handleOpenDialog = (item = null) => {
    if (item) {
      setIsEditMode(true);
      setCurrentItem(item);
      setPreviewImage(item.masterIcon ? `${API_BASE}${item.masterIcon}` : null);
    } else {
      setIsEditMode(false);
      setCurrentItem({
        id: null,
        type: '',
        masterCode: '',
        code: '',
        visibility: true,
        masterIcon: '',
        personType: '',
        transType: '',
      });
      setPreviewImage(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditMode(false);
    setPreviewImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setCurrentItem((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle image selection + preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Store file for upload
    setCurrentItem((prev) => ({ ...prev, iconFile: file }));
  };

  // Upload icon and get path
  const uploadIcon = async (file) => {
    if (!file) return null;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('icon', file);

      const res = await axios.post(
        `${API_BASE}/api/account-master/upload-icon`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Backend should return { path: "/uploads/icons/xxx.png" }
      return res.data.path;
    } catch (err) {
      console.error('Icon upload failed:', err);
      toast.error('Failed to upload icon');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      let iconPath = currentItem.masterIcon;

      // Upload new icon if selected
      if (currentItem.iconFile) {
        const uploadedPath = await uploadIcon(currentItem.iconFile);
        if (uploadedPath) {
          iconPath = uploadedPath;
        } else {
          throw new Error('Icon upload failed');
        }
      }

      const payload = {
        ...currentItem,
        masterIcon: iconPath,
      };
      delete payload.iconFile; // cleanup

      if (isEditMode) {
        await axios.post(
          `${API_BASE}/api/account-master/UpdateAccountMaster`,
          payload,
          { headers }
        );
        toast.success('Account Master updated successfully');
      } else {
        await axios.post(
          `${API_BASE}/api/account-master/saveAccountMaster`,
          payload,
          { headers }
        );
        toast.success('Account Master created successfully');
      }

      handleCloseDialog();
      fetchAccountMasters();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await axios.get(`${API_BASE}/api/account-master/deleteAccountMasterById/${id}`, { headers });
      toast.success('Deleted successfully');
      fetchAccountMasters();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'type', headerName: 'Type', width: 130 },
    { field: 'masterCode', headerName: 'Master Code', width: 160 },
    { field: 'code', headerName: 'Code/Name', flex: 1, minWidth: 180 },
    {
      field: 'masterIcon',
      headerName: 'Icon',
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <img
            src={`${API_BASE}${params.value}`}
            alt="icon"
            style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 4 }}
          />
        ) : (
          '-'
        ),
    },
    {
      field: 'visibility',
      headerName: 'Visible',
      width: 90,
      renderCell: (params) =>
        params.value ? <VisibilityIcon color="success" /> : <VisibilityOffIcon color="error" />,
    },
    {
      field: 'personType',
      headerName: 'Person Types',
      width: 220,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {params.value?.split(',').map((t, i) => (
            <Chip key={i} label={t.trim()} size="small" color="primary" variant="outlined" />
          ))}
        </Box>
      ),
    },
    {
      field: 'transType',
      headerName: 'Trans Type',
      width: 130,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      renderCell: ({ row }) => (
        <>
          <Tooltip title="Edit">
            <IconButton color="primary" onClick={() => handleOpenDialog(row)}>
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

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Account Master Setup
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Add New
          </Button>
        </Box>

        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 15 } } }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } },
            }}
          />
        </div>
      </Paper>

      {/* Create / Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditMode ? 'Edit Account Master' : 'Create Account Master'}</DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Left column - main fields */}
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'grid', gap: 2.5 }}>
                <TextField
                  select
                  label="Type"
                  name="type"
                  value={currentItem.type}
                  onChange={handleInputChange}
                  fullWidth
                  required
                >
                  {['ASSETS', 'LIABILITIES', 'EXPENSES', 'REVENUES'].map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Master Code"
                  name="masterCode"
                  value={currentItem.masterCode}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />

                <TextField
                  label="Code / Name"
                  name="code"
                  value={currentItem.code}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />

                <TextField
                  label="Person Types (comma separated)"
                  name="personType"
                  value={currentItem.personType}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="Employee,Vendor,Customer,Partner"
                />

                <TextField
                  select
                  label="Transaction Type"
                  name="transType"
                  value={currentItem.transType}
                  onChange={handleInputChange}
                  fullWidth
                >
                  <MenuItem value="DEBIT">DEBIT</MenuItem>
                  <MenuItem value="CREDIT">CREDIT</MenuItem>
                  <MenuItem value="BOTH">BOTH</MenuItem>
                </TextField>

                <FormControlLabel
                  control={
                    <Switch
                      checked={currentItem.visibility}
                      onChange={handleInputChange}
                      name="visibility"
                    />
                  }
                  label="Visible in Application"
                />
              </Box>
            </Grid>

            {/* Right column - Icon upload & preview */}
            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" gutterBottom>
                Master Icon
              </Typography>

              <Box sx={{ textAlign: 'center', mb: 2 }}>
                {previewImage ? (
                  <Card variant="outlined">
                    <CardMedia
                      component="img"
                      height="140"
                      image={previewImage}
                      alt="Icon preview"
                      sx={{ objectFit: 'contain', p: 2 }}
                    />
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">
                        Current / Selected Icon
                      </Typography>
                    </CardContent>
                  </Card>
                ) : (
                  <Box
                    sx={{
                      height: 140,
                      border: '2px dashed #ccc',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'action.hover',
                    }}
                  >
                    <Typography color="text.secondary">No icon selected</Typography>
                  </Box>
                )}
              </Box>

              <Button
                component="label"
                variant="outlined"
                startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
                disabled={uploading}
                fullWidth
              >
                {uploading ? 'Uploading...' : 'Upload Icon'}
                <input
                  type="file"
                  hidden
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleImageChange}
                />
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Recommended: 64×64 or 128×128 px PNG / SVG
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              uploading ||
              !currentItem.type ||
              !currentItem.masterCode ||
              !currentItem.code
            }
          >
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountMasterSetup;