import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  InputAdornment,
  FormHelperText,
  Alert,
  Chip,
} from '@mui/material';
import {
  DeleteForever as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Mock data - replace with your API later
const mockTransactions = [
  { id: '42522', transId: '42522', account: 'P056', name: 'LAXMAN RAO ANNAPUREDDY', type: 'PARTNERS DIVIDENDS', particulars: 'DRAWING...', credit: 0, debit: 5000, deleted: false },
  { id: '42530', transId: '42530', account: 'P083', name: 'SRINIVASULU N', type: 'PARTNERS DIVIDENDS', particulars: 'DRAWING...', credit: 0, debit: 5400, deleted: false },
  { id: '42541', transId: '42541', account: 'MF25-141', name: 'C1182 - RAVI KUMAR S', type: 'MF Installment', particulars: 'MF Installm...', credit: 58600, debit: 5000, deleted: false },
  // Add more entries as needed...
];

const DeleteTransactions = () => {
  const [date, setDate] = useState('2025-12-28');
  const [showDeleted, setShowDeleted] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter transactions
  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch =
      tx.name.toLowerCase().includes(search.toLowerCase()) ||
      tx.transId.includes(search) ||
      tx.account.includes(search);
    const matchesDeleted = showDeleted || !tx.deleted;
    return matchesSearch && matchesDeleted;
  });

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = filteredTransactions
        .filter((tx) => !tx.deleted)
        .map((tx) => tx.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleDelete = () => {
    if (selected.length === 0) {
      setError('Please select at least one transaction');
      return;
    }
    if (!comments.trim()) {
      setError('Comments are required for deletion');
      return;
    }

    if (!window.confirm(`Delete ${selected.length} selected transaction(s)?`)) {
      return;
    }

    // Here you would call your API to delete
    alert(`Deleted ${selected.length} transactions with comment: "${comments}"`);

    // Reset form
    setSelected([]);
    setComments('');
    setError('');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Delete Transactions
        </Typography>
       
      </Box>

      {/* Controls + Search */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-end' }}>
          <TextField
            label="Transaction Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ViewIcon />}
              onClick={() => alert(`Viewing transactions for ${date}`)}
            >
              View
            </Button>

            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={selected.length === 0}
            >
              Delete
            </Button>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
              />
            }
            label="Show Deleted Transactions"
          />
        </Box>

        {/* Search & Comments */}
        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, trans id, account..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Comments"
            required
            multiline
            rows={2}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            error={!!error}
            helperText={error}
            placeholder="Enter reason for deletion..."
          />
        </Box>
      </Paper>

      {/* Table */}
      <Paper elevation={2}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredTransactions.length}
                    checked={selected.length === filteredTransactions.filter(t => !t.deleted).length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Trans Id</TableCell>
                <TableCell>Account No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Trans Type</TableCell>
                <TableCell>Particulars</TableCell>
                <TableCell align="right">Credit</TableCell>
                <TableCell align="right">Debit</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredTransactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const isItemSelected = isSelected(row.id);
                  return (
                    <TableRow
                      key={row.id}
                      hover
                      selected={isItemSelected}
                      sx={{
                        ...(row.deleted && {
                          bgcolor: 'action.disabledBackground',
                          textDecoration: 'line-through',
                          opacity: 0.7,
                        }),
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={() => handleSelect(row.id)}
                          disabled={row.deleted}
                        />
                      </TableCell>
                      <TableCell>{row.transId}</TableCell>
                      <TableCell>{row.account}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.type}</TableCell>
                      <TableCell>{row.particulars}</TableCell>
                      <TableCell align="right">{row.credit.toLocaleString()}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                        {row.debit.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {filteredTransactions.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          No transactions found for the selected criteria
        </Alert>
      )}
    </Box>
  );
};

export default DeleteTransactions;