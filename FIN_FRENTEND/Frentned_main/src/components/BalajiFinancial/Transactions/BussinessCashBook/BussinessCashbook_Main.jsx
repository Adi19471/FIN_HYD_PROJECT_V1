import React, { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { CalendarMonthRounded, TodayRounded } from "@mui/icons-material";
import { navIcons } from "src/lib/icons";
import { ScreenHeader } from "src/components/ui";

import BussinessDailyFinance from "./Bussiness_DailyFinance/BussinessDailyFinance";
import BussinessMonthlyFinance from "./Bussiness_MonthlyFinance/Bussiness_MonthlyFinance";

// Monthly first. Panels are picked by key below, so the order is display only.
const tabs = [
  { key: "MONTHLY", label: "Monthly", icon: <CalendarMonthRounded fontSize="small" /> },
  { key: "DAILY", label: "Daily", icon: <TodayRounded fontSize="small" /> },
];

const BussinessCashbook_Main = () => {
  const [value, setValue] = useState(0);

  return (
    <div className="scr-page">
      <ScreenHeader
        icon={navIcons.businessCashBook}
        title="Business Cash Book"
        subtitle="Collect an instalment against a daily or a monthly finance loan."
      >
        {/* which kind of loan the payment is for */}
        <Tabs value={value} onChange={(_, newValue) => setValue(newValue)} className="scr-switch" aria-label="Loan type">
          {tabs.map((tab) => (
            <Tab key={tab.label} icon={tab.icon} iconPosition="start" label={tab.label} />
          ))}
        </Tabs>
      </ScreenHeader>

      {tabs[value]?.key === "DAILY" && <BussinessDailyFinance />}
      {tabs[value]?.key === "MONTHLY" && <BussinessMonthlyFinance />}
    </div>
  );
};

export default BussinessCashbook_Main;
