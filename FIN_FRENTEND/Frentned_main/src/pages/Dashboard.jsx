import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/apiClient";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  Skeleton,
} from "@mui/material";

import {
  PeopleAltRounded,
  AutorenewRounded,
  CurrencyRupeeRounded,
  WarningAmberRounded,
  TrendingUpRounded,
  PaymentsRounded,
  MenuBookRounded,
  AccountTreeRounded,
  ReceiptRounded,
  PersonAddRounded,
  ReceiptLongRounded,
  TrendingUp as TrendingUpIcon,
  AccountBalance as LoansIcon,
} from "@mui/icons-material";

import { motion } from "framer-motion";

// Rupee formatter
const formatINR = (num) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);

// ======================
// STAT CARD COMPONENT
// ======================
function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  bgLight,
  trend,
  trendUp = true,
  alert = false,
  loading = false,
  index = 0,
}) {
  if (loading) {
    return (
      <Card sx={{ borderRadius: 2, height: "100%" }}>
        <CardContent>
          <Skeleton height={20} />
          <Skeleton height={40} />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      style={{ width: "100%" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card
        sx={{
          borderRadius: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: `1px solid ${bgLight}`,
          transition: "0.2s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: `0 10px 25px ${bgLight}`,
          },
        }}
      >
        <Box sx={{ height: 4, bgcolor: color }} />

        <CardContent sx={{ flexGrow: 1 }}>
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: alert ? "error.main" : "#1e293b",
                }}
              >
                {value}
              </Typography>

              <Typography variant="caption">
                {subtitle}
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: bgLight,
                color,
                borderRadius: 2,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon />
            </Box>
          </Stack>

          {trend !== undefined && (
            <Chip
              size="small"
              icon={
                <TrendingUpRounded
                  sx={{ transform: trendUp ? "none" : "rotate(180deg)" }}
                />
              }
              label={`${trendUp ? "+" : ""}${trend}%`}
              color={trendUp ? "success" : "error"}
              sx={{ mt: 2 }}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ======================
// QUICK BUTTON
// ======================
function QuickActionButton({ icon: Icon, label, onClick, color }) {
  return (
    <Button
      variant="contained"
      startIcon={<Icon />}
      onClick={onClick}
      sx={{
        bgcolor: color,
        fontSize: "0.75rem",
        textTransform: "none",
        borderRadius: 2,
      }}
    >
      {label}
    </Button>
  );
}

// ======================
// MAIN DASHBOARD
// ======================
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const stats = {
    totalMembers: 1341,
    activeMembers: 928,
    runningChits: 862,
    chitValue: 18700000,
    todayCollection: 318000,
    pendingDues: 684000,
    totalLoans: 245,
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* QUICK ACTIONS */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Quick Actions
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <QuickActionButton
          icon={PersonAddRounded}
          label="Add Member"
          onClick={() => navigate("/Main_personal_file")}
          color="#0ea5e9"
        />
        <QuickActionButton
          icon={AccountTreeRounded}
          label="New Chit"
          onClick={() => navigate("/Loan")}
          color="#8b5cf6"
        />
        <QuickActionButton
          icon={MenuBookRounded}
          label="Cashbook"
          onClick={() => navigate("/Transactions/Cashbook")}
          color="#10b981"
        />

          <QuickActionButton
            icon={PersonAddRounded}
            label="Add Member"
            onClick={() => navigate("/Main_personal_file")}
            color="#0ea5e9"
          />
          <QuickActionButton
            icon={AccountTreeRounded}
            label="New Chit"
            onClick={() => navigate("/Loan")}
            color="#8b5cf6"
          />
          <QuickActionButton
            icon={MenuBookRounded}
            label="Cashbook"
            onClick={() => navigate("/Transactions/Cashbook")}
            color="#10b981"
          />
          <QuickActionButton
            icon={ReceiptLongRounded}
            label="Registration"
            onClick={() => navigate("/AccountMasterSetup/Registraion_creation")}
            color="#f59e0b"
          />
          <QuickActionButton
            icon={ReceiptRounded}
            label="Daily Book"
            onClick={() => navigate("/AccountsModules/DailBook")}
            color="#ec4899"
          />
      </Stack>

      {/* KPI */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        KPI Cards
      </Typography>

      <Grid container spacing={2} alignItems="stretch">
        {[
          {
            title: "Total Members",
            value: stats.totalMembers,
            icon: PeopleAltRounded,
            color: "#0ea5e9",
            bg: "#e0f2fe",
          },
          {
            title: "Running Chits",
            value: stats.runningChits,
            icon: AutorenewRounded,
            color: "#8b5cf6",
            bg: "#ede9fe",
          },
          {
            title: "Chit Value",
            value: formatINR(stats.chitValue),
            icon: CurrencyRupeeRounded,
            color: "#10b981",
            bg: "#d1fae5",
          },
          {
            title: "Today's Collection",
            value: formatINR(stats.todayCollection),
            icon: PaymentsRounded,
            color: "#f59e0b",
            bg: "#fef3c7",
          },
          {
            title: "Pending Dues",
            value: formatINR(stats.pendingDues),
            icon: WarningAmberRounded,
            color: "#ef4444",
            bg: "#fee2e2",
          },
          {
            title: "Total Loans",
            value: stats.totalLoans,
            icon: LoansIcon,
            color: "#059669",
            bg: "#d1fae5",
          },
        ].map((card, i) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={i} sx={{ display: "flex" }}>
            <StatCard
              title={card.title}
              value={card.value}
              subtitle="Overview"
              icon={card.icon}
              color={card.color}
              bgLight={card.bg}
              index={i}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}