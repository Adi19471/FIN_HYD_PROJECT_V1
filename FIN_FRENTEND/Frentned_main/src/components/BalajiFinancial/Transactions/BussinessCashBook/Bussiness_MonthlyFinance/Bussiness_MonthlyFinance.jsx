import React from "react";
import BusinessFinancePayment from "../BusinessFinancePayment";

const BusinessMonthlyFinance = () => (
  <BusinessFinancePayment
    mode="Monthly"
    title="Monthly Finance - Customer Payment"
    subtitle="Monthly customer payment screen using the same format, controls, exports, and print flow as daily finance."
    loanType="MONTHLY_FINANCE"
    loadEndpoint="loadMFLoanInformation"
    saveEndpoint="saveMFLoanInformation"
  />
);

export default BusinessMonthlyFinance;
