import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  Badge,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";

const formatINR = (value) =>
  `Rs ${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const getPaidAmount = (row) =>
  Number(row.credit || row.creditAmount || row.paidAmount || row.amountPaid || row.collectionAmount || row.receivedAmount || 0);

const getDebitAmount = (row) => Number(row.debit || row.debitAmount || 0);

const getCustomerName = (row) =>
  row.customerName || row.name || row.accountName || row.firstname || row.accountNumber || "Customer";

// accountMastercode on each cash book row tells us exactly what kind of entry it is -
// use it to label Daily/Monthly Finance payments clearly instead of a generic "paid".
const PAYMENT_LABELS = {
  "DF LOAN INSTALLMENT": "Daily Finance installment",
  "DF LATE FEE": "Daily Finance late fee",
  "MF LOAN INSTALLMENT": "Monthly Finance installment",
  "MF INTEREST": "Monthly Finance interest",
  "MF LATE FEE": "Monthly Finance late fee",
};
const getPaymentLabel = (row) => {
  const code = (row.accountMastercode || row.accountMasterCode || "").toUpperCase();
  return PAYMENT_LABELS[code] || null;
};

const timeLabel = (date) => {
  if (!date) return "Today";
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format("DD-MMM hh:mm A") : "Today";
};

// AuthContext already tracks lastActivity (mouse/keyboard/scroll/touch) for its
// inactivity-logout timer - reuse it so polling pauses when the user has genuinely
// stepped away, not just when the tab is backgrounded.
const IDLE_THRESHOLD_MS = 5 * 60 * 1000;
const isUserIdle = () => {
  const lastActivity = parseInt(getSession("lastActivity") || "0", 10);
  return Date.now() - lastActivity > IDLE_THRESHOLD_MS;
};

export default function DropdownNotifications() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const open = Boolean(anchorEl);
  const token = getSession("token") || "";
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const fetchNotifications = useCallback(async () => {
    if (!token) {
      setNotifications([]);
      return;
    }

    setLoading(true);
    const today = dayjs().format("YYYY-MM-DD");

    try {
      const [dailySummaryRes, loansRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/loadAllDayWiseTransactionsSummary/${today}`, { headers }),
        axios.get(`${API_BASE}/disbursedList`, {
          headers,
          params: { fromDate: today, toDate: today },
        }),
      ]);

      const dailySummary = dailySummaryRes.status === "fulfilled" ? dailySummaryRes.value.data || {} : {};
      const dailyRows = Array.isArray(dailySummary.cashBookSumaryViewPojoList)
        ? dailySummary.cashBookSumaryViewPojoList
        : [];
      const loanRows = loansRes.status === "fulfilled" && Array.isArray(loansRes.value.data) ? loansRes.value.data : [];

      const relevantDailyRows = dailyRows.filter((row) => getPaidAmount(row) > 0 || getDebitAmount(row) > 0);

      // Daily/Monthly Finance loan payments first (what this notification is mainly for),
      // then any other cash book activity (capital, expenses, etc.) after.
      const loanPaymentRows = relevantDailyRows.filter((row) => getPaymentLabel(row));
      const otherCashBookRows = relevantDailyRows.filter((row) => !getPaymentLabel(row));

      const buildPaymentNotification = (row, index) => {
        const paidAmount = getPaidAmount(row);
        const debitAmount = getDebitAmount(row);
        const amount = paidAmount || debitAmount;
        const label = getPaymentLabel(row);

        return {
          id: `payment-${row.transactionId || index}`,
          icon: MonetizationOnIcon,
          color: paidAmount ? "success" : "warning",
          primary: `${getCustomerName(row)} ${paidAmount ? "paid" : "debited"} ${formatINR(amount)}`,
          secondary: `${label || row.transactionType || row.accountMastercode || "Daily Book"} • ${timeLabel(row.transactionDate || row.date)}`,
        };
      };

      const paymentNotifications = [
        ...loanPaymentRows.slice(0, 8).map(buildPaymentNotification),
        ...otherCashBookRows.slice(0, 4).map(buildPaymentNotification),
      ];

      const loanNotifications = loanRows.slice(0, 6).map((row, index) => ({
        id: `loan-${row.loanId || index}`,
        icon: AssignmentIcon,
        color: "primary",
        primary: `${getCustomerName(row)} took new loan ${formatINR(row.amount || row.loanAmount)}`,
        secondary: `${row.loanId || "New loan"} • ${timeLabel(row.startDate || row.createdDate)}`,
      }));

      setNotifications([...paymentNotifications, ...loanNotifications].slice(0, 12));
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [headers, token]);

  useEffect(() => {
    fetchNotifications();
    // Skip polling while this tab is backgrounded or the user has been idle for a
    // while - avoids piling up backend calls from tabs left open and untouched.
    const refreshTimer = window.setInterval(() => {
      if (document.visibilityState === "visible" && !isUserIdle()) fetchNotifications();
    }, 30000);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchNotifications();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearInterval(refreshTimer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchNotifications]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <Box>
      <IconButton color="inherit" onClick={handleClick} aria-label="Finance notifications">
        <Badge color="error" badgeContent={notifications.length || null}>
          <NotificationsIcon sx={{ fontSize: 24 }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 6,
          sx: { width: 380, maxWidth: "calc(100vw - 24px)", borderRadius: 2 },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ px: 2, py: 1.25 }}>
          <Typography variant="subtitle2" fontWeight={900} color="text.primary">
            Finance Notifications
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Paid amounts and new loans from today
          </Typography>
        </Box>

        <Divider />

        <Paper elevation={0} sx={{ maxHeight: 360, overflowY: "auto" }}>
          {loading && (
            <MenuItem disabled>
              <ListItemIcon>
                <CircularProgress size={20} />
              </ListItemIcon>
              <ListItemText primary="Loading finance activity..." />
            </MenuItem>
          )}

          {!loading && notifications.length === 0 && (
            <MenuItem disabled>
              <ListItemIcon>
                <InfoOutlinedIcon color="action" />
              </ListItemIcon>
              <ListItemText primary="No paid amounts or new loans today" secondary={dayjs().format("DD-MMM-YYYY")} />
            </MenuItem>
          )}

          {!loading &&
            notifications.map((item, index) => {
              const Icon = item.icon;
              return (
                <React.Fragment key={item.id}>
                  {index > 0 && <Divider />}
                  <MenuItem onClick={handleClose} sx={{ alignItems: "flex-start", py: 1.25 }}>
                    <ListItemIcon sx={{ mt: 0.4 }}>
                      <Icon color={item.color} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.primary}
                      secondary={item.secondary}
                      primaryTypographyProps={{ fontWeight: 800, fontSize: "0.9rem" }}
                      secondaryTypographyProps={{ fontSize: "0.78rem" }}
                    />
                  </MenuItem>
                </React.Fragment>
              );
            })}
        </Paper>
      </Menu>
    </Box>
  );
}
