import React, { useState, useEffect } from "react";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import {
  AccountCircle as AccountCircleIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { successToast, errorToast } from "../../toastify";
import { API_BASE } from "../../lib/config";
import { setSession } from "../../utils/session";

const theme = createTheme({
  palette: {
    primary: { main: "#000" },
  },
  typography: {
    fontFamily: [
      "Inter",
      "SF Pro Display",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Inter';
          font-style: normal;
          font-weight: 100 900;
          font-display: swap;
          src: url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap') format('woff2');
        }
      `,
    },
  },
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const url = `${API_BASE}/auth/login`;
      const payload = {
        name: formData.username.trim(),
        password: formData.password,
      };

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = resp.headers.get("content-type") || "";
      let data = {};

      if (contentType.includes("application/json")) {
        data = await resp.json();
      } else {
        const text = await resp.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text || "Unknown error" };
        }
      }

      if (resp.ok && (data.token || data.accessToken || data.user)) {
        if (data.token || data.accessToken) {
          setSession("token", data.token || data.accessToken);
        }
        setSession(
          "username",
          data.name || data.user?.name || formData.username
        );

        login({
          name: data.name || data.user?.name || formData.username,
          token: data.token || data.accessToken,
          role: data.role || data.user?.role || "user",
        });

        successToast(data.message || "Login Successful!");
        navigate("/", { replace: true });
      } else {
        errorToast(data.message || "Invalid credentials");
      }
    } catch (err) {
      errorToast("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ height: "100vh", bgcolor: "#fafafa" }}>
        {/* LEFT SIDE - LOGIN FORM */}
        <Grid
          item
          xs={12}
          md={5}
          lg={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 3, md: 5 },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 500 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#000",
                mb: 1,
                textAlign: "center",
              }}
            >
              {/* Balaji Finance */} BALAJI FINANCE
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#000",
                mb: 6,
                fontSize: { xs: "2.8rem", md: "3.4rem" },
                textAlign: "center",
              }}
            >
              Sign in
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                placeholder="Email Address"
                value={formData.username}
                onChange={handleChange("username")}
                error={!!errors.username}
                helperText={errors.username}
                variant="outlined"
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    height: 56,
                    borderRadius: "16px",
                    bgcolor: "white",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <AccountCircleIcon sx={{ color: "#888", ml: 1 }} />
                  ),
                }}
              />

              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange("password")}
                error={!!errors.password}
                helperText={errors.password}
                variant="outlined"
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    height: 56,
                    borderRadius: "16px",
                    bgcolor: "white",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  },
                }}
                InputProps={{
                  startAdornment: <LockIcon sx={{ color: "#888", ml: 1 }} />,
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />

              <FormControlLabel
                control={<Checkbox defaultChecked color="success" />}
                label="Remember me"
                sx={{ mb: 4 }}
              />

              <Button
                fullWidth
                type="submit"
                disabled={loading}
                sx={{
                  height: 56,
                  borderRadius: "16px",
                  bgcolor: "#000",
                  color: "white",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  "&:hover": {
                    bgcolor: "#111",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={26} color="inherit" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* RIGHT SIDE - BLACK PANEL WITH LIVE CLOCK */}
        <Grid
          item
          xs={12}
          md={7}
          lg={8}
          sx={{
            bgcolor: "#000",

            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 4, md: 8, lg: 12 },
          }}
        >
          <Box
            sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.5)" }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              color: "white",
              maxWidth: 700,
              width: "100%",
            }}
          >
            {/* LIVE CLOCK & DATE */}
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "4rem", md: "5.5rem" },
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  lineHeight: 1,
                  textShadow: "0 4px 20px rgba(0,0,0,0.6)",
                }}
              >
                {formatTime(currentTime)}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mt: 2,
                  opacity: 0.8,
                  fontWeight: 500,
                  letterSpacing: "0.05em",
                }}
              >
                {formatDate(currentTime)}
              </Typography>
            </Box>

            <Typography
              variant="subtitle1"
              sx={{ opacity: 0.7, mb: 1, textAlign: "center" }}
            >
              {/* Balaji Finance */} BALAJI FINANCE
            </Typography>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2.4rem", md: "3rem" },
                mb: 3,
                textAlign: "center",
              }}
            >
              Welcome to Balaji Finance
            </Typography>

            <Typography
              sx={{
                opacity: 0.85,
                lineHeight: 1.7,
                mb: 8,
                textAlign: "center",
              }}
            >
              Manage finance, loans, transactions and client dashboards. Enjoy a
              fast, secure and modern dashboard experience.
            </Typography>

            <Box
              sx={{
                bgcolor: "rgba(255,255,255,0.09)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderRadius: "32px",
                border: "1px solid rgba(255,255,255,0.1)",
                p: 5,
                mx: "auto",
                maxWidth: 460,
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Get started Instantly
              </Typography>
              <Typography sx={{ opacity: 0.8 }}>
                Be among the first to experience the easiest way to run finance
                & operations.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Login;
