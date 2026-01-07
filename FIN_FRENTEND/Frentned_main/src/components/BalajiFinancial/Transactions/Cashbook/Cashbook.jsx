import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  Grid,
  Divider,
  Tabs,
  Tab,
  AppBar,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Payments as PaymentsIcon,
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cashbook-tabpanel-${index}`}
      aria-labelledby={`cashbook-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Cashbook = () => {
  const [tabValue, setTabValue] = useState(0);
  const [transactionDate, setTransactionDate] = useState('2025-12-31');
  const [accountCode, setAccountCode] = useState('VEHICLE');
  const [name, setName] = useState('');
  const [particulars, setParticulars] = useState('');
  const [transactionType, setTransactionType] = useState('Debit');
  const [amount, setAmount] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send data to your backend
    console.log({
      date: transactionDate,
      accountCode,
      name,
      particulars,
      type: transactionType,
      amount,
    });
    alert('Transaction recorded successfully!');
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Cash Book
        </Typography>
       
      </Box>

      {/* Tabs - Top Navigation (like your bottom tabs but moved to top for better UX) */}
      <AppBar position="static" color="default" elevation={1}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Cash Book" icon={<PaymentsIcon />} iconPosition="start" />
          <Tab label="Advances" />
          <Tab label="Assets" />
          <Tab label="Bank Accounts" />
          <Tab label="C.D. Interest" />
          <Tab label="Capital" />
          <Tab label="Chits" />
          <Tab label="Dividends" />
          <Tab label="Extra Income" />
          <Tab label="Hand Loan" />
          {/* ... more tabs can be added */}
        </Tabs>
      </AppBar>

      {/* Main Form - only shown when Cash Book tab is active */}
      <TabPanel value={tabValue} index={0}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
            New Transaction Entry
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Transaction Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Transaction Date"
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>

              {/* Account Code */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Account Code</InputLabel>
                  <Select
                    value={accountCode}
                    label="Account Code"
                    onChange={(e) => setAccountCode(e.target.value)}
                  >
                    <MenuItem value="VEHICLE">VEHICLE</MenuItem>
                    <MenuItem value="OFFICE">OFFICE EXPENSES</MenuItem>
                    <MenuItem value="SALARY">SALARIES</MenuItem>
                    <MenuItem value="INTEREST">INTEREST</MenuItem>
                    <MenuItem value="BANK">BANK ACCOUNTS</MenuItem>
                    {/* Add more account codes from your sidebar */}
                  </Select>
                </FormControl>
              </Grid>

              {/* Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter payer / receiver name"
                />
              </Grid>

              {/* Particulars */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Particulars"
                  value={particulars}
                  onChange={(e) => setParticulars(e.target.value)}
                  placeholder="Description of transaction"
                  multiline
                  rows={2}
                />
              </Grid>

              {/* Transaction Type - Radio Buttons */}
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Transaction Type</FormLabel>
                  <RadioGroup
                    row
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                  >
                    <FormControlLabel value="Credit" control={<Radio />} label="Credit" />
                    <FormControlLabel value="Debit" control={<Radio color="error" />} label="Debit" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Amount */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  InputProps={{
                    startAdornment: <Typography sx={{ color: 'text.secondary', mr: 1 }}>₹</Typography>,
                  }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    color="success"
                    startIcon={<PaymentsIcon />}
                    sx={{ minWidth: 180 }}
                  >
                    Pay / Record
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </TabPanel>

      {/* Other tab panels can be added later */}
      <TabPanel value={tabValue} index={1}>
        <Typography>Advances section coming soon...</Typography>
      </TabPanel>
      {/* ... more tab panels ... */}
    </Box>
  );
};

export default Cashbook;