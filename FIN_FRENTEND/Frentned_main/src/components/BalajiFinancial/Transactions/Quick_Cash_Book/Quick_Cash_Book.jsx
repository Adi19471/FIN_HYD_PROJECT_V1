import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Save, Calculate } from '@mui/icons-material';

const Quick_Cash_Book = () => {
  const [transactionDate, setTransactionDate] = useState('2025-12-22');
  const [collectionRows, setCollectionRows] = useState([]);
  const [newAccountNo, setNewAccountNo] = useState('');
  const [alertMsg, setAlertMsg] = useState('');

  const addNewRow = () => {
    if (!newAccountNo.trim()) {
      setAlertMsg('Please enter Account No');
      return;
    }
    setCollectionRows([
      ...collectionRows,
      {
        id: Date.now(),
        accountNo: newAccountNo.trim(),
        name: '',
        installment: 0,
        dueAmount: 0,
        lateFee: 0,
        paidAmount: 0,
        paidLate: 0,
      },
    ]);
    setNewAccountNo('');
    setAlertMsg('Account added successfully');
  };

const columns = [
  {
    field: 'accountNo',
    headerName: 'Account No',
    width: 140,
    editable: true,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 240,
    editable: true,
  },
  {
    field: 'installment',
    headerName: 'Installment',
    width: 130,
    type: 'number',
    align: 'right',
    editable: true,
  },
  {
    field: 'dueAmount',
    headerName: 'Due',
    width: 120,
    type: 'number',
    align: 'right',
    editable: true,
  },
  {
    field: 'lateFee',
    headerName: 'Late Fee',
    width: 120,
    type: 'number',
    align: 'right',
    editable: true,
  },
  {
    field: 'paidAmount',
    headerName: 'Paid Amount',
    width: 140,
    type: 'number',
    editable: true,
  },
  {
    field: 'paidLate',
    headerName: 'Paid Late',
    width: 140,
    type: 'number',
    editable: true,
  },
];


  const totalPaid = useMemo(
    () => collectionRows.reduce((s, r) => s + (r.paidAmount || 0), 0),
    [collectionRows]
  );

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Business Cash Book
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Daily Collection Entry
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* CONTROLS */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={3}
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        {/* Left side */}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Transaction Date"
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 200 }}
          />

          <TextField
            label="Account No"
            value={newAccountNo}
            onChange={(e) => setNewAccountNo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addNewRow()}
            sx={{ width: 260 }}
          />

          <Button variant="contained" onClick={addNewRow}>
            Add
          </Button>
        </Stack>

        {/* Right side */}
        <Stack direction="row" spacing={2}>
          <Button variant="contained" startIcon={<Calculate />}>
            Calculate
          </Button>
          <Button variant="contained" color="info" startIcon={<Save />}>
            Save All
          </Button>
        </Stack>
      </Stack>

      {/* ALERT */}
      {alertMsg && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {alertMsg}
        </Alert>
      )}

      {/* TABLE */}
      <Paper elevation={1} sx={{ height: 520 }}>
        <DataGrid
          rows={collectionRows}
          columns={columns}
          pageSizeOptions={[10, 20, 50]}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* TOTAL */}
      <Box sx={{ textAlign: 'right', mt: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="success.main">
          Total Collected: ₹{totalPaid.toLocaleString('en-IN')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default Quick_Cash_Book;
