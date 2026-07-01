import React from "react";
import ReportCompanyHeader from "./ReportCompanyHeader";

/**
 * CompanyInfo - canonical company banner for every report screen.
 * Thin wrapper over ReportCompanyHeader so screens can import either name.
 * Shows: company name, address, current date, and the report title.
 */
const CompanyInfo = (props) => <ReportCompanyHeader {...props} />;

export default CompanyInfo;
