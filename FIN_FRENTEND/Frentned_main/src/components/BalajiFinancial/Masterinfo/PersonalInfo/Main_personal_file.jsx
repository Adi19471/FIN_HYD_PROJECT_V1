import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { BadgeRounded, ContactsRounded, HandshakeRounded, StoreRounded } from "@mui/icons-material";

import LoadingSpinner from "../../../../LoadingSpinner";
import { useAuth } from "src/utils/authStore";
import { hasPermissionAccess } from "src/utils/permissions";
import { ScreenHeader } from "src/components/ui";
import { navIcons } from "src/lib/icons";


// Lazy load each tab's component for faster initial page load
const Customer = lazy(() => import("./Custmer/Custmer"));
const PartnerComponent = lazy(() => import("./Partner/Partner"));
const Employee = lazy(() => import("./Employe/Employe"));
const Vendor = lazy(() => import("./Vender/Vender"));

const MainPersonalFile = () => {
  const { user } = useAuth();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tabs = useMemo(
    () =>
      [
        { label: "Customer", icon: <ContactsRounded fontSize="small" />, component: Customer, type: "CUSTOMER", permissionCodes: ["CUSTOMER_VIEW"] },
        { label: "Employee", icon: <BadgeRounded fontSize="small" />, component: Employee, type: "EMPLOYEE", permissionCodes: ["EMPLOYEE_VIEW"] },
        { label: "Partner", icon: <HandshakeRounded fontSize="small" />, component: PartnerComponent, type: "PARTNER", permissionCodes: ["PARTNER_VIEW"] },
        { label: "Vendor", icon: <StoreRounded fontSize="small" />, component: Vendor, type: "VENDOR", permissionCodes: ["VENDOR_VIEW"] },
      ].filter((tab) => hasPermissionAccess(user, tab.permissionCodes)),
    [user]
  );

  useEffect(() => {
    if (value >= tabs.length) setValue(0);
  }, [tabs.length, value]);

  const SelectedComponent = tabs[value]?.component || (() => null);

  // The CFS list layout: the header card names the screen and carries the
  // four kinds of person as quick tabs; the list card of the chosen kind
  // follows under it.
  return (
    <div className="scr-page">
      <ScreenHeader
        icon={navIcons.personalInformation}
        title="Personal Information"
        subtitle="Customers, employees, partners and vendors, with their contact and ID details."
      >
        <Tabs
          value={value}
          onChange={handleChange}
          className="scr-switch"
          variant="scrollable"
          scrollButtons={false}
          aria-label="Kind of person"
        >
          {tabs.map((tab) => (
            <Tab key={tab.label} icon={tab.icon} iconPosition="start" label={tab.label} />
          ))}
        </Tabs>
      </ScreenHeader>

      {tabs[value] && (
        <Suspense
          fallback={
            <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
              <LoadingSpinner />
            </Box>
          }
        >
          <SelectedComponent personType={tabs[value].type} />
        </Suspense>
      )}
    </div>
  );
};

export default MainPersonalFile;
