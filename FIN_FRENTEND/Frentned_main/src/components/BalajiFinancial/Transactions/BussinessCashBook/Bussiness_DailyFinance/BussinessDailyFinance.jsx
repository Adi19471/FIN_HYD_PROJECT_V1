import React from "react";
import BusinessFinancePayment from "../BusinessFinancePayment";

const BussinessDailyFinance = () => (
  <BusinessFinancePayment
    mode="Daily"
    title="Daily Finance Collection"
    loanType="DAILY_FINANCE"
    loadEndpoint="loadDFLoanInformation"
    saveEndpoint="saveDFLoanInformation"
  />
);

export default BussinessDailyFinance;
