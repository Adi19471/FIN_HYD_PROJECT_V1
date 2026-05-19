import React, {
  useEffect,
  useMemo,
  useState,
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
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  CircularProgress,
  Alert,
  Autocomplete,
} from "@mui/material";

import axios from "axios";
import dayjs from "dayjs";

import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

const Group_Bussiness_Details = () => {
  // ==========================================
  // SESSION
  // ==========================================
  const session = getSession();

  console.log("SESSION => ", session);

  // ==========================================
  // TOKEN
  // ==========================================
  const token =
    session?.token ||
    session?.accessToken ||
    session?.jwtToken ||
    localStorage.getItem("token") ||
    "";

  // ==========================================
  // HEADERS
  // ==========================================
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }),
    [token]
  );

  // ==========================================
  // STATES
  // ==========================================
  const [loading, setLoading] =
    useState(false);

  const [rows, setRows] = useState([]);

  const [error, setError] = useState("");

  const [filterType, setFilterType] =
    useState("all");

  const [balancesOnly, setBalancesOnly] =
    useState(false);

  const [fromDate, setFromDate] =
    useState(
      dayjs()
        .startOf("month")
        .format("YYYY-MM-DD")
    );

  const [toDate, setToDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  // ==========================================
  // PARTNER DROPDOWN
  // ==========================================
  const [partnerOptions, setPartnerOptions] =
    useState([]);

  const [selectedPartner, setSelectedPartner] =
    useState(null);

  const [partnerLoading, setPartnerLoading] =
    useState(false);

  // ==========================================
  // FETCH PARTNERS
  // ==========================================
  const fetchPartners = async (
    query = ""
  ) => {
    try {
      setPartnerLoading(true);

      const res = await axios.get(
        `${API_BASE}/PersonalInfo/personInfoAutoCompleteByCategory/PARTNER`,
        {
          headers,
          params: {
            q: query.trim(),
          },
        }
      );

      const list = (res.data || []).map(
        (item) => ({
          id: item.id,

          label: `${item.id || ""} - ${
            item.firstname || ""
          } ${item.lastname || ""}`,

          fullData: item,
        })
      );

      setPartnerOptions(list);
    } catch (err) {
      console.log(err);
    } finally {
      setPartnerLoading(false);
    }
  };

  // ==========================================
  // FETCH REPORT
  // ==========================================
  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      const managerId =
        selectedPartner?.id ||
        session?.userId ||
        session?.partnerId ||
        "P3";

      let url = "";

      if (filterType === "date") {
        url = `${API_BASE}/group-business-details/${managerId}/${fromDate}/${toDate}`;
      } else {
        url = `${API_BASE}/group-business-details/${managerId}`;
      }

      console.log("URL => ", url);
      console.log("TOKEN => ", token);

      const response = await axios.get(
        url,
        {
          headers,
        }
      );

      let data = response?.data || [];

      // ==========================================
      // BALANCES ONLY FILTER
      // ==========================================
      if (balancesOnly) {
        data = data.filter(
          (item) =>
            Number(
              item.balanceOutStandingWithInterest ||
                0
            ) > 0 ||
            Number(
              item.balanceOutStandingWithOutInterest ||
                0
            ) > 0
        );
      }

      setRows(data);
    } catch (err) {
      console.log(err);

      if (
        err?.response?.status === 401
      ) {
        setError(
          "Unauthorized - Token Invalid or Expired"
        );
      } else if (
        err?.response?.status === 403
      ) {
        setError(
          "Forbidden - Access Denied"
        );
      } else {
        setError(
          err?.response?.data?.message ||
            "Something went wrong"
        );
      }

      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================
  useEffect(() => {
    fetchPartners();
  }, []);

  // ==========================================
  // TOTALS
  // ==========================================
  const totals = useMemo(() => {
    return rows.reduce(
      (acc, item) => {
        acc.noOfShares += Number(
          item.noOfShares || 0
        );

        acc.capital += Number(
          item.capital || 0
        );

        acc.noOfLoans += Number(
          item.noOfLoans || 0
        );

        acc.disbursedAmount += Number(
          item.disbursedAmount || 0
        );

        acc.disbursedAmountWithInterest +=
          Number(
            item.disbursedAmountWithInterest ||
              0
          );

        acc.paidAmount += Number(
          item.paidAmount || 0
        );

        acc.balanceOutStandingWithInterest +=
          Number(
            item.balanceOutStandingWithInterest ||
              0
          );

        acc.balanceOutStandingWithOutInterest +=
          Number(
            item.balanceOutStandingWithOutInterest ||
              0
          );

        acc.installmentDuesOutStanding +=
          Number(
            item.installmentDuesOutStanding ||
              0
          );

        return acc;
      },
      {
        noOfShares: 0,
        capital: 0,
        noOfLoans: 0,
        disbursedAmount: 0,
        disbursedAmountWithInterest: 0,
        paidAmount: 0,
        balanceOutStandingWithInterest: 0,
        balanceOutStandingWithOutInterest: 0,
        installmentDuesOutStanding: 0,
      }
    );
  }, [rows]);

  // ==========================================
  // FORMAT AMOUNT
  // ==========================================
  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }
    );
  };

  return (
    <Box p={2}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* ===================================== */}
        {/* FILTER SECTION */}
        {/* ===================================== */}

        <Grid
          container
          spacing={2}
          alignItems="center"
        >
          {/* PARTNER DROPDOWN */}

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={partnerOptions}
              loading={partnerLoading}
              value={selectedPartner}
              onChange={(
                event,
                newValue
              ) => {
                setSelectedPartner(
                  newValue
                );
              }}
              onInputChange={(
                event,
                value
              ) => {
                fetchPartners(value);
              }}
              getOptionLabel={(option) =>
                option?.label || ""
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Partner Group"
                  size="small"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {partnerLoading ? (
                          <CircularProgress
                            color="inherit"
                            size={20}
                          />
                        ) : null}

                        {
                          params.InputProps
                            .endAdornment
                        }
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          {/* RADIO */}

          <Grid item xs={12} md={3}>
            <RadioGroup
              row
              value={filterType}
              onChange={(e) =>
                setFilterType(
                  e.target.value
                )
              }
            >
              <FormControlLabel
                value="all"
                control={<Radio />}
                label="All"
              />

              <FormControlLabel
                value="date"
                control={<Radio />}
                label="Date Range"
              />
            </RadioGroup>
          </Grid>

          {/* FROM DATE */}

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="date"
              size="small"
              label="From Date"
              InputLabelProps={{
                shrink: true,
              }}
              value={fromDate}
              disabled={
                filterType !== "date"
              }
              onChange={(e) =>
                setFromDate(
                  e.target.value
                )
              }
            />
          </Grid>

          {/* TO DATE */}

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="date"
              size="small"
              label="To Date"
              InputLabelProps={{
                shrink: true,
              }}
              value={toDate}
              disabled={
                filterType !== "date"
              }
              onChange={(e) =>
                setToDate(
                  e.target.value
                )
              }
            />
          </Grid>

          {/* BALANCES ONLY */}

          <Grid item xs={12} md={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    balancesOnly
                  }
                  onChange={(e) =>
                    setBalancesOnly(
                      e.target.checked
                    )
                  }
                />
              }
              label="Balances only"
            />
          </Grid>

          {/* BUTTON */}

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={fetchReport}
            >
              Generate
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* ===================================== */}
        {/* ERROR */}
        {/* ===================================== */}

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* ===================================== */}
        {/* REPORT HEADER */}
        {/* ===================================== */}

        <Box
          textAlign="center"
          mb={3}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            SRI BALAJI ENTERPRISES
          </Typography>

          <Typography variant="h6">
            YellaReddy Guda, Hyderabad.
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mt: 3,
              fontWeight: 600,
            }}
          >
            Partner Group Business
            Ledger
          </Typography>
        </Box>

        {/* ===================================== */}
        {/* TABLE */}
        {/* ===================================== */}

        <TableContainer
          component={Paper}
        >
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    "#dceeff",
                }}
              >
                <TableCell>
                  <b>S.No</b>
                </TableCell>

                <TableCell>
                  <b>Partner ID</b>
                </TableCell>

                <TableCell>
                  <b>Name</b>
                </TableCell>

                <TableCell align="right">
                  <b>Shares</b>
                </TableCell>

                <TableCell align="right">
                  <b>Capital</b>
                </TableCell>

                {!balancesOnly && (
                  <>
                    <TableCell align="right">
                      <b>Loans</b>
                    </TableCell>

                    <TableCell align="right">
                      <b>
                        Disbursed
                        Amount
                      </b>
                    </TableCell>

                    <TableCell align="right">
                      <b>
                        Disb. Amt
                        With Int.
                      </b>
                    </TableCell>

                    <TableCell align="right">
                      <b>
                        Paid
                        Amount
                      </b>
                    </TableCell>
                  </>
                )}

                <TableCell align="right">
                  <b>
                    Balance O/S
                    with Int.
                  </b>
                </TableCell>

                <TableCell align="right">
                  <b>
                    Balance O/S
                    without Int.
                  </b>
                </TableCell>

                <TableCell align="right">
                  <b>
                    Installment
                    Dues O/S
                  </b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    align="center"
                    colSpan={20}
                  >
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    align="center"
                    colSpan={20}
                  >
                    No Data Found
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {rows.map(
                    (row, index) => (
                      <TableRow
                        key={index}
                      >
                        <TableCell>
                          {index + 1}
                        </TableCell>

                        <TableCell>
                          {
                            row.partnerId
                          }
                        </TableCell>

                        <TableCell>
                          {row.name}
                        </TableCell>

                        <TableCell align="right">
                          {row.noOfShares ||
                            0}
                        </TableCell>

                        <TableCell align="right">
                          {formatAmount(
                            row.capital
                          )}
                        </TableCell>

                        {!balancesOnly && (
                          <>
                            <TableCell align="right">
                              {row.noOfLoans ||
                                0}
                            </TableCell>

                            <TableCell align="right">
                              {formatAmount(
                                row.disbursedAmount
                              )}
                            </TableCell>

                            <TableCell align="right">
                              {formatAmount(
                                row.disbursedAmountWithInterest
                              )}
                            </TableCell>

                            <TableCell align="right">
                              {formatAmount(
                                row.paidAmount
                              )}
                            </TableCell>
                          </>
                        )}

                        <TableCell align="right">
                          {formatAmount(
                            row.balanceOutStandingWithInterest
                          )}
                        </TableCell>

                        <TableCell align="right">
                          {formatAmount(
                            row.balanceOutStandingWithOutInterest
                          )}
                        </TableCell>

                        <TableCell align="right">
                          {formatAmount(
                            row.installmentDuesOutStanding
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  )}

                  {/* TOTAL ROW */}

                  <TableRow
                    sx={{
                      backgroundColor:
                        "#edf6ff",
                    }}
                  >
                    <TableCell
                      colSpan={3}
                      align="right"
                    >
                      <b>Total</b>
                    </TableCell>

                    <TableCell align="right">
                      <b>
                        {
                          totals.noOfShares
                        }
                      </b>
                    </TableCell>

                    <TableCell align="right">
                      <b>
                        {formatAmount(
                          totals.capital
                        )}
                      </b>
                    </TableCell>

                    {!balancesOnly && (
                      <>
                        <TableCell align="right">
                          <b>
                            {
                              totals.noOfLoans
                            }
                          </b>
                        </TableCell>

                        <TableCell align="right">
                          <b>
                            {formatAmount(
                              totals.disbursedAmount
                            )}
                          </b>
                        </TableCell>

                        <TableCell align="right">
                          <b>
                            {formatAmount(
                              totals.disbursedAmountWithInterest
                            )}
                          </b>
                        </TableCell>

                        <TableCell align="right">
                          <b>
                            {formatAmount(
                              totals.paidAmount
                            )}
                          </b>
                        </TableCell>
                      </>
                    )}

                    <TableCell align="right">
                      <b>
                        {formatAmount(
                          totals.balanceOutStandingWithInterest
                        )}
                      </b>
                    </TableCell>

                    <TableCell align="right">
                      <b>
                        {formatAmount(
                          totals.balanceOutStandingWithOutInterest
                        )}
                      </b>
                    </TableCell>

                    <TableCell align="right">
                      <b>
                        {formatAmount(
                          totals.installmentDuesOutStanding
                        )}
                      </b>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Group_Bussiness_Details;