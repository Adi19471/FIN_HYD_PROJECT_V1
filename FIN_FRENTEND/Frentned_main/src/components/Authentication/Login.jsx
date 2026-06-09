import React, { useState } from "react";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccountBalanceRounded,
  LockRounded,
  PersonRounded,
  ShieldRounded,
  TrendingUpRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { setSession } from "src/utils/session";
import { setAuthToken } from "src/utils/authToken";
import ThemeToggle from "../ThemeToggle";
import { COMPANY_ADDRESS, COMPANY_APP_NAME } from "src/lib/company";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.username.trim(),
          password: formData.password,
        }),
      });

      const data = await resp.json();

      if (resp.ok && data.token) {
        const token = setAuthToken(data.token);
        setSession("username", data.name || formData.username);
        if (rememberMe) localStorage.setItem("remembered-user", formData.username.trim());
        login({ name: data.name || formData.username, token });
        successToast("Login successful");
        navigate("/", { replace: true });
      } else {
        errorToast(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      errorToast("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-enterprise">
      <Box className="login-visual">
        <Box className="login-visual-overlay" />
        <Stack spacing={4} sx={{ position: "relative", zIndex: 2, maxWidth: 720 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box className="login-brand-mark">
              <AccountBalanceRounded />
            </Box>
            <Box>
              <Typography variant="h5" color="white">
                {COMPANY_APP_NAME}
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.72)" }}>
                {COMPANY_ADDRESS}
              </Typography>
            </Box>
          </Stack>

          <Box>
            <Typography variant="h2" sx={{ color: "white", maxWidth: 680 }}>
              Enterprise-grade finance operations, built for clarity.
            </Typography>
            <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.72)", mt: 2, fontWeight: 500 }}>
              Manage cashbooks, ledgers, loans, dues, approvals, and reports with a modern banking interface.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {[
              { icon: ShieldRounded, title: "Secure Access", text: "Token based authentication" },
              { icon: TrendingUpRounded, title: "Live Insights", text: "Collections and portfolio KPIs" },
              { icon: AccountBalanceRounded, title: "ERP Ready", text: "Reports, ledgers, audit flows" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Paper key={item.title} className="login-feature" elevation={0}>
                  <Icon />
                  <Typography variant="subtitle2" color="white">
                    {item.title}
                  </Typography>
                  <Typography variant="caption">{item.text}</Typography>
                </Paper>
              );
            })}
          </Stack>
        </Stack>
      </Box>

      <Box className="login-panel-wrap">
        <Box sx={{ position: "absolute", top: 22, right: 24 }}>
          <ThemeToggle />
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: 460 }}
        >
          <Paper className="enterprise-card login-panel" elevation={0}>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="h4">Welcome back</Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to continue to the enterprise finance command center.
              </Typography>
            </Stack>

            <form onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.2}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={handleChange("username")}
                  error={!!errors.username}
                  helperText={errors.username}
                  autoComplete="username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonRounded color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange("password")}
                  error={!!errors.password}
                  helperText={errors.password}
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRounded color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end" aria-label="Toggle password">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <FormControlLabel
                    control={<Checkbox checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />}
                    label="Remember me"
                  />
                  <Link component="button" type="button" underline="hover" variant="body2">
                    Forgot password?
                  </Link>
                </Stack>

                <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ py: 1.35 }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Sign in securely"}
                </Button>
              </Stack>
            </form>

            <Divider sx={{ my: 3 }} />

            <Typography variant="caption" color="text.secondary">
              Protected workspace for authorized finance users. Activity may be logged for audit and compliance.
            </Typography>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Login;
