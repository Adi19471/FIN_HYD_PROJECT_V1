import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AccountBalanceRounded,
  CalendarMonthRounded,
  FactCheckRounded,
  PaidRounded,
  ReceiptLongRounded,
  TrendingUpRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AppDatePicker, DataTable, PageHeader } from "src/components/ui";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const modules = [
  { title: "Daily Book", path: "/AccountsModules/DailyBook", icon: CalendarMonthRounded,},
  { title: "CB Ledger", path: "/AccountsModules/Cbledger", icon: ReceiptLongRounded,  },
  { title: "Account Ledger", path: "/AccountsModules/AccountLedger", icon: AccountBalanceRounded,  },
  { title: "Account Master Ledger", path: "/AccountsModules/AccountMasterLedger", icon: FactCheckRounded, },
  { title: "User Collection Ledger", path: "/AccountsModules/Usercollectionledger", icon: PaidRounded,  },
  { title: "Receipt Ledger", path: "/AccountsModules/ReciptLedger", icon: ReceiptLongRounded,  },
  { title: "Distributed Loans", path: "/Loans/Distubuted", icon: TrendingUpRounded,  },
  { title: "Instalment Dues", path: "/Loans/InstalmentDues", icon: FactCheckRounded,  },
];


function StatCard({ title, value, icon: Icon, tone = "primary" }) {
  return (
    <Paper className="enterprise-card" elevation={0} sx={{ p: 2, height: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h5" sx={{ mt: 0.5 }}>{value}</Typography>
        </Box>
        <Box className="dashboard-module-icon" color={`${tone}.main`}>
          <Icon />
        </Box>
      </Stack>
    </Paper>
  );
}

export default function Loans() {
  const navigate = useNavigate();
  const [loanType, setLoanType] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

 

 

  return (
    <Stack spacing={2.5}>
      <Grid container spacing={4}>
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Grid
              key={module.path}
              size={{
                xs: 12,
                md: 6,
                lg: 3
              }}>
              <Paper className="enterprise-card dashboard-module" elevation={0}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Box className="dashboard-module-icon"><Icon /></Box>
                    <Typography variant="subtitle1">{module.title}</Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">{module.note}</Typography>
                
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
}
