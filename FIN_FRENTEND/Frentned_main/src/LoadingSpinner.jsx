import { AccountBalanceWalletRounded } from "@mui/icons-material";
import { Box, CircularProgress, LinearProgress, Typography } from "@mui/material";

const LoadingSpinner = () => {
  return (
    <Box
      className="app-loading-spinner"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px", // adjust if needed
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box className="app-loading-pulse" aria-hidden="true">
        <AccountBalanceWalletRounded />
      </Box>
      <Box sx={{ width: "min(360px, 78%)" }}>
        <LinearProgress />
      </Box>
      <CircularProgress size={42} thickness={4.5} />
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>
        Loading finance data...
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
