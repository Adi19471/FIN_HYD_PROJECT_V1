import React, { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import { CalendarMonthRounded, TodayRounded } from "@mui/icons-material";
import { navIcons } from "src/lib/icons";
import { ScreenHeader } from "src/components/ui";

import BussinessDailyFinance from "./Bussiness_DailyFinance/BussinessDailyFinance";
import BussinessMonthlyFinance from "./Bussiness_MonthlyFinance/Bussiness_MonthlyFinance";

const tabs = [
  { label: "Daily", icon: <TodayRounded fontSize="small" /> },
  { label: "Monthly", icon: <CalendarMonthRounded fontSize="small" /> },
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

      {value === 0 && <BussinessDailyFinance />}
      {value === 1 && <BussinessMonthlyFinance />}
    </div>
  );
};

export default BussinessCashbook_Main;
