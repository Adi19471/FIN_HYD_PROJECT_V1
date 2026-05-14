import React, {
  useState,
  useEffect,
  useMemo,
} from "react";

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
  Grid,
  Divider,
  Autocomplete,
  CircularProgress,
  TablePagination,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

import axios from "axios";
import dayjs from "dayjs";

import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

const Installment_Dues = () => {
  const [loading, setLoading] =
    useState(false);

  const [rows, setRows] = useState([]);

  // PARTNER DROPDOWN
  const [partners, setPartners] =
    useState([]);

  const [selectedPartner, setSelectedPartner] =
    useState(null);

  const [reportType, setReportType] =
    useState("all");

  const [activeLoans, setActiveLoans] =
    useState(true);

  const [lateFee, setLateFee] =
    useState(false);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  // TOKEN
  const token =
    getSession()?.token ||
    getSession("token") ||
    "";

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  // ==========================================
  // LOAD PARTNERS AUTOCOMPLETE
  // ==========================================
  const loadPartners = async (
    query = ""
  ) => {
    try {
      const res = await axios.get(
        `${API_BASE}/PersonalInfo/personInfoAutoCompleteByCategory/PARTNER`,
        {
          headers,
          params: {
            q: query.trim(),
          },
        }
      );

      console.log(
        "PARTNER RESPONSE : ",
        res.data
      );

      const list = (
        res.data || []
      ).map((item) => ({
        id: item.id,

        label: `${item.id || ""} - ${
          item.firstname || ""
        } ${
          item.lastname || ""
        } - ${
          item.mobile || "No Mobile"
        }`,

        firstname: item.firstname,
        lastname: item.lastname,
        mobile: item.mobile,
      }));

      setPartners(list);
    } catch (error) {
      console.error(
        "Partner Load Error : ",
        error
      );
    }
  };

  // INITIAL LOAD
  useEffect(() => {
    loadPartners("");
  }, []);

  // ==========================================
  // GENERATE REPORT
  // ==========================================
  const generateReport = async () => {
    try {
      setLoading(true);

      let url = "";

      if (reportType === "individual") {
        if (!selectedPartner?.id) {
          alert(
            "Please Select Partner"
          );

          setLoading(false);
          return;
        }

        const partnerId =
          selectedPartner.id;

        url = `${API_BASE}/gurantorInstallmentDues/by-guarantor/${partnerId}/${activeLoans}/${lateFee}`;
      } else {
        url = `${API_BASE}/gurantorInstallmentDues/all/${activeLoans}/${lateFee}`;
      }

      console.log(
        "REPORT URL : ",
        url
      );

      const res = await axios.get(
        url,
        {
          headers,
        }
      );

      console.log(
        "REPORT RESPONSE : ",
        res.data
      );

      setRows(res.data || []);
    } catch (error) {
      console.error(
        "Generate Report Error : ",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PAGINATION
  // ==========================================
  const handleChangePage = (
    event,
    newPage
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event
  ) => {
    setRowsPerPage(
      parseInt(
        event.target.value,
        10
      )
    );

    setPage(0);
  };

  return (
    <Box p={2}>
      {/* ========================================== */}
      {/* HEADER */}
      {/* ========================================== */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
        >
          SRI BALAJI ENTERPRISES
        </Typography>

        <Typography align="center">
          Installment Dues Report
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* ========================================== */}
        {/* FILTERS */}
        {/* ========================================== */}
        <Grid
          container
          spacing={2}
          alignItems="center"
        >
          {/* REPORT TYPE */}
          <Grid item xs={12} md={4}>
            <RadioGroup
              row
              value={reportType}
              onChange={(e) =>
                setReportType(
                  e.target.value
                )
              }
            >
              <FormControlLabel
                value="all"
                control={<Radio />}
                label="All Partners"
              />

              <FormControlLabel
                value="individual"
                control={<Radio />}
                label="Individual Partner"
              />
            </RadioGroup>
          </Grid>

          {/* CHECKBOX */}
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    activeLoans
                  }
                  onChange={(e) =>
                    setActiveLoans(
                      e.target.checked
                    )
                  }
                />
              }
              label="Active Loans"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={lateFee}
                  onChange={(e) =>
                    setLateFee(
                      e.target.checked
                    )
                  }
                />
              }
              label="Late Fee"
            />
          </Grid>

          {/* PARTNER AUTOCOMPLETE */}
          {reportType ===
            "individual" && (
            <Grid
              item
              xs={12}
              md={3}
            >
              <Autocomplete
                options={
                  partners || []
                }
                value={
                  selectedPartner
                }
                onChange={(
                  event,
                  newValue
                ) =>
                  setSelectedPartner(
                    newValue
                  )
                }
                onInputChange={(
                  event,
                  value
                ) => {
                  loadPartners(
                    value
                  );
                }}
                fullWidth
                size="small"
                getOptionLabel={(
                  option
                ) =>
                  option?.label ||
                  ""
                }
                isOptionEqualToValue={(
                  option,
                  value
                ) =>
                  option.id ===
                  value.id
                }
                renderInput={(
                  params
                ) => (
                  <TextField
                    {...params}
                    label="Select Partner"
                    placeholder="Search Partner"
                  />
                )}
              />
            </Grid>
          )}

          {/* GENERATE BUTTON */}
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={
                generateReport
              }
              sx={{
                height: 40,
              }}
            >
              Generate
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ========================================== */}
      {/* REPORT TABLE */}
      {/* ========================================== */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
        }}
      >
        <Box p={2}>
          {/* TITLE */}
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Grid item>
              <Typography
                variant="h6"
                fontWeight="bold"
              >
                Installment Dues
                Ledger
              </Typography>
            </Grid>

            <Grid item>
              <Typography>
                Date :
                {" "}
                {dayjs().format(
                  "DD-MMM-YYYY"
                )}
              </Typography>
            </Grid>
          </Grid>

          {/* TABLE */}
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor:
                      "#dbeafe",
                  }}
                >
                  <TableCell>
                    <b>S.No</b>
                  </TableCell>

                  <TableCell>
                    <b>Loan ID</b>
                  </TableCell>

                  <TableCell>
                    <b>Customer Name</b>
                  </TableCell>

                  <TableCell>
                    <b>Guarantor Name</b>
                  </TableCell>

                  <TableCell>
                    <b>Start Date</b>
                  </TableCell>

                  <TableCell>
                    <b>End Date</b>
                  </TableCell>

                  <TableCell align="right">
                    <b>Amount</b>
                  </TableCell>

                  <TableCell align="center">
                    <b>Duration</b>
                  </TableCell>

                  <TableCell align="right">
                    <b>Inst.Amount</b>
                  </TableCell>

                  <TableCell align="center">
                    <b>Paid</b>
                  </TableCell>

                  <TableCell align="center">
                    <b>Pending</b>
                  </TableCell>

                  <TableCell align="right">
                    <b>Balance</b>
                  </TableCell>

                  <TableCell align="center">
                    <b>Due Date</b>
                  </TableCell>

                  <TableCell align="right">
                    <b>Late Fee</b>
                  </TableCell>

                  <TableCell>
                    <b>Loan Type</b>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={15}
                      align="center"
                    >
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : rows.length >
                  0 ? (
                  rows
                    .slice(
                      page *
                        rowsPerPage,
                      page *
                        rowsPerPage +
                        rowsPerPage
                    )
                    .map(
                      (
                        row,
                        index
                      ) => (
                        <TableRow
                          key={index}
                          hover
                        >
                          <TableCell>
                            {index +
                              1}
                          </TableCell>

                          <TableCell>
                            {
                              row.loanId
                            }
                          </TableCell>

                          <TableCell>
                            {
                              row.customerName
                            }
                          </TableCell>

                          <TableCell>
                            {
                              row.guarantorName
                            }
                          </TableCell>

                          <TableCell>
                            {row.startDate
                              ? dayjs(
                                  row.startDate
                                ).format(
                                  "DD/MM/YYYY"
                                )
                              : "-"}
                          </TableCell>

                          <TableCell>
                            {row.endDate
                              ? dayjs(
                                  row.endDate
                                ).format(
                                  "DD/MM/YYYY"
                                )
                              : "-"}
                          </TableCell>

                          <TableCell align="right">
                            {Number(
                              row.amount ||
                                0
                            ).toLocaleString()}
                          </TableCell>

                          <TableCell align="center">
                            {
                              row.duration
                            }
                          </TableCell>

                          <TableCell align="right">
                            {Number(
                              row.installmentAmount ||
                                0
                            ).toLocaleString()}
                          </TableCell>

                          <TableCell align="center">
                            {
                              row.noOfInstallmentsPaid
                            }
                          </TableCell>

                          <TableCell align="center">
                            {
                              row.noOfInstallmentsPending
                            }
                          </TableCell>

                          <TableCell align="right">
                            {Number(
                              row.balanceAmount ||
                                0
                            ).toLocaleString()}
                          </TableCell>

                          <TableCell align="center">
                            {row.dueDate
                              ? dayjs(
                                  row.dueDate
                                ).format(
                                  "DD/MM/YYYY"
                                )
                              : "-"}
                          </TableCell>

                          <TableCell align="right">
                            {Number(
                              row.lateFee ||
                                0
                            ).toLocaleString()}
                          </TableCell>

                          <TableCell>
                            {
                              row.loanType
                            }
                          </TableCell>
                        </TableRow>
                      )
                    )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={15}
                      align="center"
                    >
                      No Data Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* PAGINATION */}
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={
              handleChangePage
            }
            rowsPerPage={
              rowsPerPage
            }
            onRowsPerPageChange={
              handleChangeRowsPerPage
            }
            rowsPerPageOptions={[
              10,
              25,
              50,
              100,
            ]}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Installment_Dues;