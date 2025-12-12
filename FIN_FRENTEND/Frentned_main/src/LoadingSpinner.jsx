import { Box, CircularProgress } from "@mui/material";

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px", // adjust if needed
      }}
    >
      <CircularProgress size={50} thickness={5} />
    </Box>
  );
};

export default LoadingSpinner;
