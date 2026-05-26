import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControlLabel,
  Checkbox,
  IconButton,
  TablePagination,
} from "@mui/material";
import dayjs from "dayjs";
import axios from "axios";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import LoadingSpinner from "src/LoadingSpinner";
import { useReactToPrint } from "react-to-print";
import { AppDatePicker, ReportCompanyHeader, TableExportMenu } from "src/components/ui";

const token = getSession()?.token || getSession("token") || "";

const CustomerOutstanding = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs("2026-04-08"));
  const [mfChecked, setMfChecked] = useState(true);
  const [dfChecked, setDfChecked] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Ref for printing
  const printRef = useRef(null);

  const fetchOutstanding = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE}/customerOutstanding`,
        {
          selectedDate: selectedDate.format("YYYY-MM-DD"),
          loadMonthlyFinanceTransactions: mfChecked,
          loadDailyFinanceTransactions: dfChecked,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(response.data || []);
      setPage(0);
    } catch (error) {
      console.error("Error fetching customer outstanding:", error);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutstanding();
  }, [selectedDate, mfChecked, dfChecked]);

  // Fixed Print Handler using contentRef
  const handlePrint = useReactToPrint({
    contentRef: () => printRef.current,   // ← This fixes the error
    documentTitle: `Customer_Outstanding_${selectedDate.format("DD-MMM-YYYY")}`,
    removeAfterPrint: true,
  });

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const totalLoans = useMemo(() => 
    data.reduce((sum, row) => sum + (row.noOfLoans || 0), 0), [data]
  );

  const totalLoanAmount = useMemo(() => 
    data.reduce((sum, row) => sum + (row.totalLoansAmount || 0), 0), [data]
  );

  const totalPaidAmount = useMemo(() => 
    data.reduce((sum, row) => sum + (row.totalPaidAmount || 0), 0), [data]
  );

  const totalBalance = useMemo(() => 
    data.reduce((sum, row) => sum + (row.balanceOutstanding || 0), 0), [data]
  );

  const totalDueOutstanding = useMemo(() => 
    data.reduce((sum, row) => sum + (row.dueDateOutstanding || 0), 0), [data]
  );

  const formattedDate = selectedDate.format("ddd DD-MMM-YYYY");

  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const exportColumns = [
    "sNo",
    "customerId",
    "customerName",
    "noOfLoans",
    "totalLoansAmount",
    "totalPaidAmount",
    "balanceOutstanding",
    "dueDateOutstanding",
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Customer Outstanding
        </Typography>

        <Box display="flex" gap={2} alignItems="center">
          <AppDatePicker
            label="Date"
            value={selectedDate}
            onChange={(value) => setSelectedDate(dayjs(value))}
            sx={{ width: 180 }}
          />

          <FormControlLabel
            control={<Checkbox checked={mfChecked} onChange={(e) => setMfChecked(e.target.checked)} />}
            label="MF"
          />
          <FormControlLabel
            control={<Checkbox checked={dfChecked} onChange={(e) => setDfChecked(e.target.checked)} />}
            label="DF"
          />

          <Button variant="contained" onClick={fetchOutstanding} disabled={loading}>
            Generate
          </Button>

          <TableExportMenu rows={data} columns={exportColumns} fileName="Customer_Outstanding" />
        </Box>
      </Box>

      {/* Printable Area */}
      <Paper ref={printRef} elevation={3} sx={{ p: 4 }}>
        <ReportCompanyHeader
          title={`Customer Outstanding As On ${selectedDate.format("DD-MMM-YYYY")}`}
          subtitle={`${mfChecked ? "MF" : ""}${mfChecked && dfChecked ? " and " : ""}${dfChecked ? "DF" : ""} Loans`}
          date={selectedDate}
        />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <TableContainer sx={{ border: "1px solid #ccc", borderRadius: 1, overflow: "auto" }}>
              <Table size="small" sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#1976d2" }}>
                    {["S.No", "Customer ID", "Customer Name", "Loans", "Total Loans Amount", 
                      "Total Paid Amount", "Balance Outstanding", "Due Date Outstanding"].map((head, i) => (
                      <TableCell 
                        key={i}
                        align={i >= 4 ? "right" : i === 3 ? "center" : "left"}
                        sx={{ 
                          color: "white", 
                          fontWeight: "bold", 
                          border: "1px solid #ccc",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((row, index) => (
                    <TableRow 
                      key={index} 
                      hover 
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' },
                        '& td': { border: "1px solid #ccc" }
                      }}
                    >
                      <TableCell>{row.sNo}</TableCell>
                      <TableCell>{row.customerId}</TableCell>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell align="center">{row.noOfLoans}</TableCell>
                      <TableCell align="right">{Number(row.totalLoansAmount).toLocaleString("en-IN")}</TableCell>
                      <TableCell align="right">{Number(row.totalPaidAmount).toLocaleString("en-IN")}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold", color: "#d32f2f" }}>
                        {Number(row.balanceOutstanding).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell align="right">{Number(row.dueDateOutstanding).toLocaleString("en-IN")}</TableCell>
                    </TableRow>
                  ))}

                  {data.length > 0 && (
                    <TableRow sx={{ backgroundColor: "#e3f2fd", fontWeight: "bold" }}>
                      <TableCell colSpan={3} align="right" sx={{ border: "1px solid #ccc" }}>
                        <strong>Total</strong>
                      </TableCell>
                      <TableCell align="center" sx={{ border: "1px solid #ccc" }}><strong>{totalLoans}</strong></TableCell>
                      <TableCell align="right" sx={{ border: "1px solid #ccc" }}>
                        <strong>{totalLoanAmount.toLocaleString("en-IN")}</strong>
                      </TableCell>
                      <TableCell align="right" sx={{ border: "1px solid #ccc" }}>
                        <strong>{totalPaidAmount.toLocaleString("en-IN")}</strong>
                      </TableCell>
                      <TableCell align="right" sx={{ border: "1px solid #ccc" }}>
                        <strong>{totalBalance.toLocaleString("en-IN")}</strong>
                      </TableCell>
                      <TableCell align="right" sx={{ border: "1px solid #ccc" }}>
                        <strong>{totalDueOutstanding.toLocaleString("en-IN")}</strong>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 20]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ mt: 2 }}
            />
          </>
        )}

        <Box mt={4} textAlign="center">
          <Typography variant="caption" color="text.secondary">
            Page 1 of 4
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomerOutstanding;
