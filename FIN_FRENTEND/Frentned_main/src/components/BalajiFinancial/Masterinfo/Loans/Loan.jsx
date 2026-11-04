import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

import { CalendarMonthRounded, TodayRounded } from "@mui/icons-material";
import LoadingSpinner from "src/LoadingSpinner";
import { useAuth } from "src/utils/authStore";
import { hasPermissionAccess } from "src/utils/permissions";
import { ScreenHeader } from "src/components/ui";
import { navIcons } from "src/lib/icons";

const MonthlyFinance = lazy(() => import("./MonthlyFinance/MonthlyFinance"));
const DailyFinance = lazy(() => import("./DailyFinance/DailyFinace"));

const FinanceTabs = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = useMemo(
    () =>
      [
        { label: "Daily", icon: <TodayRounded fontSize="small" />, component: DailyFinance, permissionCodes: ["LOAN_MAIN_VIEW", "DAILY_FINANCE_VIEW"] },
        { label: "Monthly", icon: <CalendarMonthRounded fontSize="small" />, component: MonthlyFinance, permissionCodes: ["LOAN_MAIN_VIEW", "MONTHLY_FINANCE_VIEW"] },
      ].filter((tab) => hasPermissionAccess(user, tab.permissionCodes)),
    [user]
  );

  useEffect(() => {
    if (activeTab >= tabs.length) setActiveTab(0);
  }, [activeTab, tabs.length]);

  const SelectedComponent = tabs[activeTab]?.component;

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // The CFS list layout: the header card names the screen and carries Daily /
  // Monthly as quick tabs; the chosen book's list card follows under it.
  return (
    <div className="scr-page">
      <ScreenHeader
        icon={navIcons.masterLoans}
        title="Loans"
        subtitle="Daily and monthly finance loans: open one, or start a new loan."
      >
        <Tabs
          value={activeTab}
          onChange={handleChange}
          className="scr-switch"
          aria-label="Loan book"
        >
          {tabs.map((tab) => (
            <Tab key={tab.label} icon={tab.icon} iconPosition="start" label={tab.label} />
          ))}
        </Tabs>
      </ScreenHeader>

      <Suspense
        fallback={
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
            <LoadingSpinner />
          </Box>
        }
      >
        <AnimatePresence mode="wait">
          {SelectedComponent && (
            <motion.div
              key={tabs[activeTab]?.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SelectedComponent />
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
};

export default FinanceTabs;
