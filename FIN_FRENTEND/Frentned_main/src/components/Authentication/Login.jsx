import React, { useEffect, useState } from "react";
import { useAuth } from "../../utils/authStore";
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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccountBalanceRounded,
  AutoAwesomeRounded,
  BoltRounded,
  InsightsRounded,
  LockRounded,
  PersonRounded,
  ShieldRounded,
  VerifiedUserRounded,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { setSession } from "src/utils/session";
import { setAuthToken, setRefreshToken } from "src/utils/authToken";
import { getDefaultAuthorizedPath, normalizePermissionCodes, normalizeRoles } from "src/utils/permissions";
import ThemeToggle from "../ThemeToggle";
import { COMPANY_ADDRESS, COMPANY_APP_NAME } from "src/lib/company";
import "./Login.css";

const ROTATING_WORDS = ["clarity.", "automation.", "intelligence.", "control."];

const FEATURES = [
  { icon: ShieldRounded, title: "Secure Access", text: "Token-based authentication" },
  { icon: InsightsRounded, title: "Live Insights", text: "Collections & portfolio KPIs" },
  { icon: BoltRounded, title: "AI Assisted", text: "Smart reports & ledgers" },
];

const STATS = [
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Monitoring" },
  { value: "Real-time", label: "Insights" },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);

  // Prefill a previously remembered username.
  useEffect(() => {
    const remembered = localStorage.getItem("remembered-user");
    if (remembered) setFormData((prev) => ({ ...prev, username: remembered }));
  }, []);

  // Rotate the headline word for a living, "AI" feel.
  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % ROTATING_WORDS.length), 2600);
    return () => clearInterval(id);
  }, []);

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
        setRefreshToken(data.refreshToken);
        const name = data.name || data.username || formData.username;
        const user = {
          name,
          token,
          roles: normalizeRoles(data),
          permissions: normalizePermissionCodes(data),
        };

        setSession("username", name);
        if (rememberMe) localStorage.setItem("remembered-user", formData.username.trim());
        else localStorage.removeItem("remembered-user");
        login(user);
        successToast("Login successful");
        navigate(getDefaultAuthorizedPath(user), { replace: true });
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
    <Box className="auth-root">
      {/* ---------------- Left visual ---------------- */}
      <Box className="auth-visual">
        <Box className="auth-grid" />
        <Box className="auth-orb one" />
        <Box className="auth-orb two" />
        <Box className="auth-orb three" />

        <motion.div
          className="auth-visual-inner"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Box className="auth-brand">
            <Box className="auth-brand-mark">
              <AccountBalanceRounded />
            </Box>
            <Box>
              <Box className="auth-brand-name">{COMPANY_APP_NAME}</Box>
              <Box className="auth-brand-sub">{COMPANY_ADDRESS}</Box>
            </Box>
          </Box>

          <Box className="auth-chip">
            <span className="auth-live-dot" />
            <AutoAwesomeRounded />
            AI-powered finance command center
          </Box>

          <h1 className="auth-headline">
            Enterprise finance,
            <br />
            built for{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={ROTATING_WORDS[wordIndex]}
                className="accent"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35 }}
              >
                {ROTATING_WORDS[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </h1>

          <p className="auth-subtext">
            Manage cashbooks, ledgers, loans, dues, approvals, and reports with a modern,
            intelligent banking workspace.
          </p>

          <Box className="auth-features">
            {FEATURES.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  className="auth-feature"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                >
                  <Box className="auth-feature-icon">
                    <Icon fontSize="small" />
                  </Box>
                  <Box className="auth-feature-title">{item.title}</Box>
                  <Box className="auth-feature-text">{item.text}</Box>
                </motion.div>
              );
            })}
          </Box>

          <Box className="auth-stats">
            {STATS.map((stat) => (
              <Box key={stat.label}>
                <Box className="auth-stat-value">{stat.value}</Box>
                <Box className="auth-stat-label">{stat.label}</Box>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Box>

      {/* ---------------- Right form ---------------- */}
      <Box className="auth-form-side">
        <Box className="auth-theme-toggle">
          <ThemeToggle />
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ width: "100%", maxWidth: 440 }}
        >
          <Box className="auth-card">
            <Stack spacing={0.5} sx={{ mb: 3 }}>
              <Typography className="auth-card-title">Welcome back</Typography>
              <Typography className="auth-card-sub">
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
                  autoFocus
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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={!loading && <ShieldRounded />}
                  sx={{ py: 1.4, fontWeight: 700, fontSize: "0.98rem" }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Sign in securely"}
                </Button>
              </Stack>
            </form>

            <Divider sx={{ my: 3 }} />

            <Box className="auth-secure-note">
              <VerifiedUserRounded />
              <span>
                Protected workspace for authorized finance users. Activity may be logged for
                audit and compliance.
              </span>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Login;
