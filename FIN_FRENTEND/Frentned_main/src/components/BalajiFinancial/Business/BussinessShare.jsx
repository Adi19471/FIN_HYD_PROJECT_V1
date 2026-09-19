import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
} from "@mui/material";

import { actionIcons } from "src/lib/icons";
import dayjs from "dayjs";
import axios from "axios";

import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import LoadingSpinner from "src/LoadingSpinner";

import {
  AppDatePicker,
  ReportCompanyHeader,
  ReportToolbar,
  TableExportMenu,
} from "src/components/ui";

import { useTheme } from "@mui/material/styles";

const GenerateIcon = actionIcons.generate;

/* ============================================================
   TABLE SCROLL STYLE
   ============================================================ */

const scrollTableSx = {
  height: {
    xs: "min(62vh, 420px)",
    sm: "min(58vh, 460px)",
    md: "min(56vh, 520px)",
    lg: "calc(100vh - 390px)",
    xl: "calc(100vh - 410px)",
  },

  minHeight: {
    xs: 300,
    sm: 340,
    md: 380,
    lg: 420,
  },

  maxHeight: {
    xs: 480,
    sm: 560,
    md: 640,
    lg: 720,
    xl: 860,
  },

  overflow: "auto",
  overscrollBehavior: "contain",
  WebkitOverflowScrolling: "touch",

  scrollbarWidth: "thin",
  scrollbarColor: "#64748b #e2e8f0",

  "&::-webkit-scrollbar": {
    width: 12,
    height: 12,
  },

  "&::-webkit-scrollbar-track": {
    backgroundColor: "#e2e8f0",
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#64748b",
    border: "2px solid #e2e8f0",
  },
};

/* ============================================================
   COMMON HELPERS
   ============================================================ */

const money = (value) =>
  Number(Math.abs(Number(value || 0))).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

const amountValue = (value) =>
  Math.abs(Number(value || 0));

const rowName = (row) =>
  row.code ||
  row.description ||
  row.accountName ||
  row.name ||
  row.accountCode ||
  "-";

const normalizeType = (type = "") => {
  const value = String(type)
    .trim()
    .toUpperCase();

  return value.includes("LIABIL")
    ? "LIABILITIES"
    : "ASSETS";
};

/* ============================================================
   EXPORT / PRINT COLUMNS
   ============================================================ */

const exportColumns = [
  {
    field: "section",
    headerName: "Section",
    width: 130,
  },

  {
    field: "masterCode",
    headerName: "Group",
    width: 180,
  },

  {
    field: "code",
    headerName: "Account",
    width: 300,
  },

  {
    field: "amount",
    headerName: "Amount",
    width: 160,
    align: "right",
    valueFormatter: (value) =>
      money(value),
  },
];

/* ============================================================
   COMPONENT
   ============================================================ */

const BalanceSheet = () => {
  const theme = useTheme();

  /* ==========================================================
     STATE
     ========================================================== */

  const [toDate, setToDate] = useState(dayjs());

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [generatedDate, setGeneratedDate] =
    useState(null);

  const token =
    getSession()?.token ||
    getSession("token") ||
    "";

  /* ============================================================
     NORMALIZE BACKEND RESPONSE
     ============================================================ */

  const normalizedRows = useMemo(
    () =>
      data.map((row, index) => ({
        id: `${normalizeType(row.type)}-${
          row.masterCode ||
          row.accountMasterCode ||
          "OTHERS"
        }-${rowName(row)}-${index}`,

        serial: index + 1,

        section: normalizeType(row.type),

        masterCode:
          row.masterCode ||
          row.accountMasterCode ||
          "OTHERS",

        code: rowName(row),

        displayAmount:
          amountValue(row.amount),

        originalAmount:
          Number(row.amount || 0),

        raw: row,
      })),
    [data]
  );

  /* ============================================================
     GROUP DATA

     ASSETS
       group
         account
         account

     LIABILITIES
       group
         account
         account
     ============================================================ */

  const groupedData = useMemo(() => {
    const result = {
      ASSETS: {},
      LIABILITIES: {},
    };

    normalizedRows.forEach((item) => {
      if (
        !result[item.section][item.masterCode]
      ) {
        result[item.section][
          item.masterCode
        ] = [];
      }

      result[item.section][
        item.masterCode
      ].push(item);
    });

    return result;
  }, [normalizedRows]);

  /* ============================================================
     GROUP SUBTOTAL
     ============================================================ */

  const getSubTotal = (items = []) =>
    items.reduce(
      (sum, item) =>
        sum +
        amountValue(
          item.displayAmount ??
            item.amount
        ),
      0
    );

  /* ============================================================
     SECTION TOTAL
     ============================================================ */

  const getMainTotal = (group = {}) =>
    Object.values(group)
      .flat()
      .reduce(
        (sum, item) =>
          sum +
          amountValue(
            item.displayAmount ??
              item.amount
          ),
        0
      );

  /* ============================================================
     TOTALS
     ============================================================ */

  const totalAssets =
    getMainTotal(
      groupedData.ASSETS
    );

  const totalLiabilities =
    getMainTotal(
      groupedData.LIABILITIES
    );

  const netBusiness =
    totalAssets -
    totalLiabilities;

  const difference =
    Math.abs(netBusiness);

  /* ============================================================
     EXPORT / PRINT ROWS

     These rows are used by TableExportMenu.

     Order:

     ASSETS
       Group Total
       Account
       Account
       ...

     TOTAL ASSETS

     LIABILITIES
       Group Total
       Account
       Account
       ...

     TOTAL LIABILITIES

     SUMMARY
       NET BUSINESS
       DIFFERENCE
     ============================================================ */

  const exportRows = useMemo(() => {
    const rows = [];

    const addSection = (
      sectionName,
      groups
    ) => {
      /* --------------------------------------------------------
         SECTION HEADER
         -------------------------------------------------------- */

      rows.push({
        id: `section-${sectionName}`,

        rowType: "SECTION",

        section: sectionName,

        masterCode: "",

        code: sectionName,

        amount:
          getMainTotal(groups),
      });

      /* --------------------------------------------------------
         GROUPS
         -------------------------------------------------------- */

      Object.entries(groups).forEach(
        ([masterCode, items]) => {
          /* ----------------------------------------------------
             GROUP TOTAL
             ---------------------------------------------------- */

          rows.push({
            id: `group-${sectionName}-${masterCode}`,

            rowType: "GROUP",

            section: sectionName,

            masterCode,

            code: `${String(
              masterCode
            ).toUpperCase()} TOTAL`,

            amount:
              getSubTotal(items),
          });

          /* ----------------------------------------------------
             ACCOUNT ROWS
             ---------------------------------------------------- */

          items.forEach(
            (item, index) => {
              rows.push({
                id: `account-${sectionName}-${masterCode}-${index}`,

                rowType: "ACCOUNT",

                section: sectionName,

                masterCode,

                code: item.code,

                amount:
                  amountValue(
                    item.displayAmount
                  ),
              });
            }
          );
        }
      );

      /* --------------------------------------------------------
         SECTION TOTAL
         -------------------------------------------------------- */

      rows.push({
        id: `total-${sectionName}`,

        rowType: "TOTAL",

        section: sectionName,

        masterCode: "",

        code: `TOTAL ${sectionName}`,

        amount:
          getMainTotal(groups),
      });
    };

    /* ----------------------------------------------------------
       ASSETS
       ---------------------------------------------------------- */

    addSection(
      "ASSETS",
      groupedData.ASSETS
    );

    /* ----------------------------------------------------------
       LIABILITIES
       ---------------------------------------------------------- */

    addSection(
      "LIABILITIES",
      groupedData.LIABILITIES
    );

    /* ----------------------------------------------------------
       NET BUSINESS
       ---------------------------------------------------------- */

    rows.push({
      id: "net-business",

      rowType: "SUMMARY",

      section: "",

      masterCode: "",

      code: "NET BUSINESS",

      amount: netBusiness,
    });

    /* ----------------------------------------------------------
       DIFFERENCE
       ---------------------------------------------------------- */

    rows.push({
      id: "difference",

      rowType: "SUMMARY",

      section: "",

      masterCode: "",

      code: "DIFFERENCE",

      amount: difference,
    });

    return rows;
  }, [
    groupedData,
    netBusiness,
    difference,
  ]);

  /* ============================================================
     REPORT OPTIONS

     TableExportMenu uses this for the generated report.

     This is the same pattern as Business Share.
     ============================================================ */

  const reportOptions = useMemo(
    () => ({
      period: {
        fromDate:
          generatedDate || toDate,

        label:
          "Balance Sheet As On",
      },

      summary: [
        {
          label: "Total Assets",

          value:
            totalAssets,
        },

        {
          label:
            "Total Liabilities",

          value:
            totalLiabilities,
        },

        {
          label:
            "Net Business",

          value:
            netBusiness,
        },

        {
          label:
            "Difference",

          value:
            difference,
        },
      ],

      orientation: "landscape",
    }),
    [
      generatedDate,
      toDate,
      totalAssets,
      totalLiabilities,
      netBusiness,
      difference,
    ]
  );

  /* ============================================================
     FETCH BALANCE SHEET
     ============================================================ */

  const fetchData = async () => {
    if (!toDate) {
      alert(
        "Please select a date"
      );

      return;
    }

    if (!token) {
      alert(
        "Authentication token not found. Please login again."
      );

      return;
    }

    try {
      setLoading(true);

      const reportDate =
        dayjs(toDate).format(
          "YYYY-MM-DD"
        );

      const res =
        await axios.get(
          `${API_BASE}/balanceSheet/${reportDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );

      const rows =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(
              res.data?.data
            )
          ? res.data.data
          : Array.isArray(
              res.data?.result
            )
          ? res.data.result
          : [];

      setData(rows);

      setGeneratedDate(
        toDate
      );
    } catch (err) {
      console.error(
        "Error fetching balance sheet:",
        err
      );

      alert(
        err.response?.data
          ?.message ||
          "Failed to fetch balance sheet"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     RENDER ASSETS / LIABILITIES
     ============================================================ */

  const renderSection = (
    title,
    group,
    color
  ) => {
    const onColor =
      theme.palette.getContrastText(
        color
      );

    const groups =
      Object.entries(
        group || {}
      );

    return (
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",

          borderColor:
            "divider",

          borderRadius: 0,

          overflow: "hidden",

          bgcolor:
            "background.paper",

          boxShadow:
            "0 14px 30px rgba(15, 23, 42, 0.06)",

          height: "100%",

          display: "flex",

          flexDirection:
            "column",

          minHeight: 0,

          width: "100%",
        }}
      >
        {/* ======================================================
            SECTION HEADER
            ====================================================== */}

        <Box
          sx={{
            px: 1.5,

            py: 1,

            bgcolor: color,

            color: onColor,

            display: "flex",

            flexDirection: {
              xs: "column",
              sm: "row",
            },

            justifyContent:
              "space-between",

            alignItems: {
              xs: "stretch",
              sm: "center",
            },

            gap: 0.75,
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,

              fontSize: {
                xs: 14,
                md: 15,
              },
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontWeight: 900,

              fontSize: {
                xs: 14,
                md: 15,
              },

              textAlign: {
                xs: "left",
                sm: "right",
              },
            }}
          >
            Total:{" "}
            {money(
              getMainTotal(group)
            )}
          </Typography>
        </Box>

        {/* ======================================================
            TABLE
            ====================================================== */}

        <TableContainer
          sx={{
            ...scrollTableSx,

            overflowX: "auto",
          }}
        >
          <Table
            size="small"
            stickyHeader
            sx={{
              minWidth: 460,

              borderCollapse:
                "collapse",
            }}
          >
            <TableHead>
              <TableRow>
                {/* No */}

                <TableCell
                  sx={{
                    border:
                      "1px solid",

                    borderColor:
                      "divider",

                    bgcolor:
                      "action.hover",

                    fontWeight: 900,

                    width: {
                      xs: 44,
                      sm: 52,
                    },

                    py: 0.75,

                    px: {
                      xs: 0.75,
                      sm: 1,
                    },

                    fontSize: {
                      xs: 12,
                      sm: 13,
                    },
                  }}
                >
                  No
                </TableCell>

                {/* Account */}

                <TableCell
                  sx={{
                    border:
                      "1px solid",

                    borderColor:
                      "divider",

                    bgcolor:
                      "action.hover",

                    fontWeight: 900,

                    py: 0.75,

                    px: {
                      xs: 0.75,
                      sm: 1,
                    },

                    fontSize: {
                      xs: 12,
                      sm: 13,
                    },
                  }}
                >
                  Account
                </TableCell>

                {/* Amount */}

                <TableCell
                  align="right"
                  sx={{
                    border:
                      "1px solid",

                    borderColor:
                      "divider",

                    bgcolor:
                      "action.hover",

                    fontWeight: 900,

                    width: {
                      xs: 126,
                      sm: 150,
                    },

                    py: 0.75,

                    px: {
                      xs: 0.75,
                      sm: 1,
                    },

                    fontSize: {
                      xs: 12,
                      sm: 13,
                    },
                  }}
                >
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {groups.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{
                      border:
                        "1px solid",

                      borderColor:
                        "divider",

                      py: 2.5,

                      color:
                        "text.secondary",
                    }}
                  >
                    No records
                  </TableCell>
                </TableRow>
              ) : (
                groups.map(
                  ([
                    masterCode,
                    rows,
                  ]) => (
                    <React.Fragment
                      key={`${title}-${masterCode}`}
                    >
                      {/* ======================================
                          GROUP TOTAL
                          ====================================== */}

                      <TableRow>
                        <TableCell
                          colSpan={2}
                          sx={{
                            border:
                              "1px solid",

                            borderColor:
                              "divider",

                            py: 0.65,

                            px: {
                              xs: 0.75,
                              sm: 1,
                            },

                            bgcolor:
                              alpha(
                                color,
                                0.11
                              ),

                            fontWeight: 900,

                            fontSize: {
                              xs: 12,
                              sm: 13,
                            },

                            overflowWrap:
                              "anywhere",
                          }}
                        >
                          {String(
                            masterCode
                          ).toUpperCase()}
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            border:
                              "1px solid",

                            borderColor:
                              "divider",

                            py: 0.65,

                            px: {
                              xs: 0.75,
                              sm: 1,
                            },

                            bgcolor:
                              alpha(
                                color,
                                0.11
                              ),

                            fontWeight: 900,

                            width: {
                              xs: 126,
                              sm: 150,
                            },

                            fontSize: {
                              xs: 12,
                              sm: 13,
                            },
                          }}
                        >
                          {money(
                            getSubTotal(
                              rows
                            )
                          )}
                        </TableCell>
                      </TableRow>

                      {/* ======================================
                          ACCOUNT ROWS
                          ====================================== */}

                      {rows.map(
                        (
                          row,
                          index
                        ) => (
                          <TableRow
                            key={`${masterCode}-${index}`}
                            hover
                            sx={{
                              "&:nth-of-type(even) td":
                                {
                                  bgcolor:
                                    "action.hover",
                                },
                            }}
                          >
                            {/* No */}

                            <TableCell
                              sx={{
                                border:
                                  "1px solid",

                                borderColor:
                                  "divider",

                                width: {
                                  xs: 44,
                                  sm: 52,
                                },

                                py: 0.65,

                                px: {
                                  xs: 0.75,
                                  sm: 1,
                                },

                                color:
                                  "text.secondary",

                                fontSize: {
                                  xs: 12,
                                  sm: 13,
                                },
                              }}
                            >
                              {index +
                                1}
                            </TableCell>

                            {/* Account */}

                            <TableCell
                              sx={{
                                border:
                                  "1px solid",

                                borderColor:
                                  "divider",

                                py: 0.65,

                                px: {
                                  xs: 0.75,
                                  sm: 1,
                                },

                                fontWeight: 600,

                                fontSize: {
                                  xs: 12,
                                  sm: 13,
                                },

                                overflowWrap:
                                  "anywhere",
                              }}
                            >
                              {row.code ||
                                rowName(
                                  row
                                ) ||
                                "—"}
                            </TableCell>

                            {/* Amount */}

                            <TableCell
                              align="right"
                              sx={{
                                border:
                                  "1px solid",

                                borderColor:
                                  "divider",

                                py: 0.65,

                                px: {
                                  xs: 0.75,
                                  sm: 1,
                                },

                                fontWeight: 800,

                                fontSize: {
                                  xs: 12,
                                  sm: 13,
                                },

                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {money(
                                row.displayAmount ??
                                  row.amount
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </React.Fragment>
                  )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  /* ============================================================
     RETURN
     ============================================================ */

  return (
    <>
      {/* ======================================================
          TOOLBAR
          ====================================================== */}

      <ReportToolbar
        onRefresh={
          fetchData
        }
        loading={loading}
      >
        <TableExportMenu
          rows={exportRows}
          columns={exportColumns}
          fileName="Balance_Sheet"
          reportOptions={
            reportOptions
          }
        />
      </ReportToolbar>

      {/* ======================================================
          MAIN REPORT
          ====================================================== */}

      <Paper
        sx={{
          p: {
            xs: 1.5,
            md: 3,
          },

          mt: 2,
        }}
      >
        {/* ====================================================
            COMPANY HEADER
            ==================================================== */}

        <ReportCompanyHeader
          title="Balance Sheet"
          subtitle="Assets, liabilities and the balance difference"
          date={
            generatedDate ||
            toDate
          }
        />

        <Box sx={{ mt: 2 }}>
          {/* ==================================================
              DATE + GENERATE
              ================================================== */}

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={1.5}
            alignItems={{
              xs: "stretch",
              md: "center",
            }}
            flexWrap="wrap"
            sx={{
              mb: 2,
            }}
          >
            <AppDatePicker
              label="Date"
              value={toDate}
              onChange={
                setToDate
              }
              sx={{
                width: {
                  xs: "100%",
                  md: 240,
                  xl: 280,
                },
              }}
            />

            <Button
              variant="contained"
              onClick={
                fetchData
              }
              disabled={loading}
              startIcon={
                <GenerateIcon />
              }
              sx={{
                height: 40,

                fontWeight: 800,

                width: {
                  xs: "100%",
                  md: "auto",
                },

                minWidth: {
                  md: 132,
                },
              }}
            >
              {loading
                ? "Generating..."
                : "Generate"}
            </Button>

            <Chip
              label={`Report Date: ${dayjs(
                generatedDate ||
                  toDate
              ).format(
                "DD-MMM-YYYY"
              )}`}
              variant="outlined"
              color="primary"
              sx={{
                fontWeight: 800,

                alignSelf: {
                  xs: "stretch",
                  sm: "flex-start",
                  md: "center",
                },

                justifyContent:
                  "center",

                maxWidth: "100%",
              }}
            />
          </Stack>

          {/* ==================================================
              LOADING
              ================================================== */}

          {loading ? (
            <Box
              sx={{
                display: "grid",

                placeItems:
                  "center",

                minHeight: 360,
              }}
            >
              <LoadingSpinner />
            </Box>
          ) : data.length === 0 ? (
            <Alert severity="info">
              Select a date and
              generate the balance
              sheet.
            </Alert>
          ) : (
            <Stack spacing={2}>
              {/* ==============================================
                  ASSETS + LIABILITIES
                  ============================================== */}

              <Grid
                container
                spacing={{
                  xs: 1.5,
                  md: 2,
                }}
                alignItems="stretch"
              >
                {/* ============================================
                    ASSETS
                    ============================================ */}

                <Grid
                  sx={{
                    minHeight: 0,
                    display: "flex",
                  }}
                  size={{
                    xs: 12,
                    xl: 6,
                  }}
                >
                  {renderSection(
                    "ASSETS",
                    groupedData.ASSETS,
                    theme.palette
                      .primary
                      .main
                  )}
                </Grid>

                {/* ============================================
                    LIABILITIES
                    ============================================ */}

                <Grid
                  sx={{
                    minHeight: 0,
                    display: "flex",
                  }}
                  size={{
                    xs: 12,
                    xl: 6,
                  }}
                >
                  {renderSection(
                    "LIABILITIES",
                    groupedData.LIABILITIES,
                    theme.palette
                      .secondary
                      .main
                  )}
                </Grid>
              </Grid>

              {/* =================================================
                  BALANCE SHEET SUMMARY
                  ================================================= */}

              <Paper
                sx={{
                  p: {
                    xs: 1.5,
                    md: 3,
                  },

                  mt: 2,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 900,

                    fontSize: 16,

                    mb: 1.5,
                  }}
                >
                  BALANCE SHEET SUMMARY
                </Typography>

                <Stack spacing={1}>
                  {/* Total Assets */}

                  <Box
                    sx={{
                      display: "flex",

                      justifyContent:
                        "space-between",

                      borderBottom:
                        "1px solid",

                      borderColor:
                        "divider",

                      pb: 1,
                    }}
                  >
                    <Typography
                      fontWeight={700}
                    >
                      Total Assets
                    </Typography>

                    <Typography
                      fontWeight={900}
                      color="primary.main"
                    >
                      {money(
                        totalAssets
                      )}
                    </Typography>
                  </Box>

                  {/* Total Liabilities */}

                  <Box
                    sx={{
                      display: "flex",

                      justifyContent:
                        "space-between",

                      borderBottom:
                        "1px solid",

                      borderColor:
                        "divider",

                      pb: 1,
                    }}
                  >
                    <Typography
                      fontWeight={700}
                    >
                      Total Liabilities
                    </Typography>

                    <Typography
                      fontWeight={900}
                      color="secondary.main"
                    >
                      {money(
                        totalLiabilities
                      )}
                    </Typography>
                  </Box>

                  {/* Net Business */}

                  <Box
                    sx={{
                      display: "flex",

                      justifyContent:
                        "space-between",

                      borderBottom:
                        "1px solid",

                      borderColor:
                        "divider",

                      pb: 1,
                    }}
                  >
                    <Typography
                      fontWeight={700}
                    >
                      Net Business
                    </Typography>

                    <Typography
                      fontWeight={900}
                      color={
                        netBusiness >= 0
                          ? "success.main"
                          : "error.main"
                      }
                    >
                      {money(
                        netBusiness
                      )}
                    </Typography>
                  </Box>

                  {/* Difference */}

                  <Box
                    sx={{
                      display: "flex",

                      justifyContent:
                        "space-between",

                      pt: 0.5,
                    }}
                  >
                    <Typography
                      fontWeight={700}
                    >
                      Difference
                    </Typography>

                    <Typography
                      fontWeight={900}
                    >
                      {money(
                        difference
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          )}
        </Box>
      </Paper>
    </>
  );
};

export default BalanceSheet;