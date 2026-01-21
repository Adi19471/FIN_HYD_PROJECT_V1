import React, { useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, AccountCircle, Lock } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { setSession } from "src/utils/session";
import "./Login.css"

import backgroundImg from "../../../public/images/four.png"; 

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    background: { default: "#f5f7fa" },
  },
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        setSession("token", data.token);
        setSession("username", data.name || formData.username);
        login({ name: data.name || formData.username, token: data.token });
        successToast("Login successful");
        navigate("/", { replace: true });
      } else {
        errorToast(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      errorToast("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        {/* Background Image – shown on md+ screens */}
        <Grid
          item
          xs={false}
          md={7}
          sx={{
            backgroundImage: `url(${backgroundImg})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            display: { xs: "none", md: "block" },
          }}
        >
          {/* Optional overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(25,118,210,0.18) 0%, rgba(0,0,0,0.42) 100%)",
            }}
          />
        </Grid>

        {/* Form – always centered */}
        <Grid
          item
          xs={12}
          md={5}
          component={Box}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{
            px: { xs: 3, sm: 6, md: 8, lg: 10 },
            py: { xs: 4, md: 6 },
            bgcolor: "background.default",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 1000,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              fontWeight={700}
              color="primary.main"
              gutterBottom
              sx={{ mb: 5, letterSpacing: "-0.4px" }}
            >
              Balaji Finance
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: "100%" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username / Email"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange("username")}
                error={!!errors.username}
                helperText={errors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange("password")}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.6,
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                {loading ? <CircularProgress size={26} color="inherit" /> : "Sign In"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Login;