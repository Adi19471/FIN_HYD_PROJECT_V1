import React from "react";
import BusinessFinancePayment from "../BusinessFinancePayment";

const BusinessMonthlyFinance = () => (
  <BusinessFinancePayment
    mode="Monthly"
    title="Monthly Finance - Customer Payment"
    loanType="MONTHLY_FINANCE"
    loadEndpoint="loadMFLoanInformation"
    saveEndpoint="saveMFLoanInformation"
  />
);

export default BusinessMonthlyFinance;
