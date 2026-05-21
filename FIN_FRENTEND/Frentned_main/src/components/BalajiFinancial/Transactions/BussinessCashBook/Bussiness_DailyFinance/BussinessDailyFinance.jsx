import React from "react";
import BusinessFinancePayment from "../BusinessFinancePayment";

const BussinessDailyFinance = () => (
  <BusinessFinancePayment
    mode="Daily"
    title="Daily Finance Collection"
    subtitle="Daily customer collection screen with the same layout, dropdown width, row count, and exports as monthly finance."
    loanType="DAILY_FINANCE"
    loadEndpoint="loadDFLoanInformation"
    saveEndpoint="saveDFLoanInformation"
  />
);

export default BussinessDailyFinance;
