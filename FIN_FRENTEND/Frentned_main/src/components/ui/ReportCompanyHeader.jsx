import React from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { COMPANY_ADDRESS, COMPANY_NAME } from "src/lib/company";

const formatReportDate = (value) => dayjs(value || undefined).format("DD-MMM-YYYY");

const ReportCompanyHeader = ({
  title,
  subtitle,
  date = dayjs(),
  align = "center",
  dense = false,
  sx,
}) => (
  <Box sx={{ mb: dense ? 2 : 3, textAlign: align, ...sx }}>
    <Typography variant={dense ? "h6" : "h5"} fontWeight={900} letterSpacing={0}>
      {COMPANY_NAME}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontWeight: 700 }}>
      {COMPANY_ADDRESS}
    </Typography>
    <Typography variant="body2" sx={{ mt: 0.75, fontWeight: 800 }}>
      Date: {formatReportDate(date)}
    </Typography>

    {(title || subtitle) && (
      <>
        <Divider sx={{ my: dense ? 1.5 : 2 }} />
        <Stack spacing={0.5} alignItems={align === "center" ? "center" : "stretch"}>
          {title && (
            <Typography variant={dense ? "subtitle1" : "h6"} fontWeight={900}>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary" fontWeight={700}>
              {subtitle}
            </Typography>
          )}
        </Stack>
      </>
    )}
  </Box>
);

export default ReportCompanyHeader;
