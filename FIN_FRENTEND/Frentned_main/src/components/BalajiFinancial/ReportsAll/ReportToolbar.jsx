import React from "react";
import { Paper, Stack, Typography } from "@mui/material";
import { TableExportMenu } from "src/components/ui";

const ReportToolbar = ({
  data = [],
  columns = [],
  fileName = "Report",
}) => {
  return (
    <Paper
      className="enterprise-card"
      elevation={0}
      sx={{
        p: { xs: 1.25, sm: 1.5 },
        mb: 2,
        display: "flex",
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        gap: 1.5,
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Stack spacing={0.25}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
          Report actions
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {data.length} filtered rows ready for Excel, PDF, Word, and print.
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <TableExportMenu rows={data} columns={columns} fileName={fileName} />
      </Stack>
    </Paper>
  );
};

export default ReportToolbar;
