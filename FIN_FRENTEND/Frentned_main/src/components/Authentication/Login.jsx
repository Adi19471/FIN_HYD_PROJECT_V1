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
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  AccountCircle as AccountCircleIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { successToast, errorToast } from "../../toastify";
import { API_BASE } from "../../lib/config";
import { setSession } from "../../utils/session";

// Optional: Keep your images or remove if using pure animated bg
import LoginBg from "@react-login-page/page10/bg.png";
import InnerBg from "@react-login-page/page10/inner-bg.jpg";

const theme = createTheme({
  palette: { primary: { main: "#ffd700" } },
  typography: { fontFamily: '"Inter", "SF Pro Display", sans-serif' },
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

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

      let data = {};
      const contentType = resp.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await resp.json();
      } else {
        const text = await resp.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }

      if (resp.ok && (data.token || data.accessToken || data.user)) {
        const token = data.token || data.accessToken;
        const username = data.name || data.user?.name || formData.username;

        if (token) setSession("token", token);
        setSession("username", username);

        login({ name: username, token, role: data.role || "user" });
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
      {/* Animated Background Container */}
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          background: "#0a0e27",
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(19, 83, 68, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 40%)
          `,
          position: "relative",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {/* Animated Floating Particles */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              radial-gradient(circle, #ffeb3b 1px, transparent 1px),
              radial-gradient(circle, #ff6b35 1px, transparent 1px),
              radial-gradient(circle, #00bcd4 1px, transparent 1px),
              radial-gradient(circle, #673ab7 1px, transparent 1px),
              radial-gradient(circle, #e91e63 1px, transparent 1px),
              radial-gradient(circle, #00d4ff 1px, transparent 1px),
              radial-gradient(circle, #ff9800 1px, transparent 1px),
              radial-gradient(circle, #ffd700 1px, transparent 1px)
            `,
            backgroundSize: `
              350% 350%, 280% 280%, 420% 420%, 310% 310%,
              360% 360%, 390% 390%, 330% 330%, 370% 370%
            `,
            backgroundPosition: `
              0% 0%, 20% 80%, 80% 20%, 50% 50%,
              10% 90%, 90% 10%, 30% 70%, 70% 30%
            `,
            animation: "float 40s ease-in-out infinite",
            opacity: 0.4,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Keyframes */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              background-position: 0% 0%, 20% 80%, 80% 20%, 50% 50%, 10% 90%,
                90% 10%, 30% 70%, 70% 30%;
            }
            25% {
              background-position: 30% 20%, 50% 60%, 70% 40%, 40% 70%, 60% 50%,
                80% 30%, 50% 50%, 60% 40%;
            }
            50% {
              background-position: 50% 50%, 70% 30%, 40% 70%, 80% 20%, 90% 10%,
                60% 40%, 70% 30%, 40% 60%;
            }
            75% {
              background-position: 20% 80%, 40% 40%, 80% 60%, 30% 50%, 20% 70%,
                80% 20%, 40% 70%, 80% 20%;
            }
          }
        `}</style>

        {/* Main Content */}
        <Grid
          container
          sx={{ height: "100%", zIndex: 10, position: "relative" }}
        >
          {/* Left Side - Glass Login Form */}
          <Grid
            item
            xs={12}
            md={6}
            lg={5}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: { xs: 3, md: 6 },
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: 480,
                bgcolor: "rgba(20, 25, 50, 0.45)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderRadius: "28px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                p: { xs: 4, md: 7 },
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Inner Glow Border Effect */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "28px",
                  padding: "2px",
                  background:
                    "linear-gradient(135deg, rgba(255,215,0,0.3), transparent 50%, rgba(83,227,166,0.3))",
                  mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                  maskComposite: "exclude",
                  WebkitMaskComposite: "xor",
                }}
              />

              <Box sx={{ position: "relative", zIndex: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: "#fff",
                    fontWeight: 800,
                    textAlign: "center",
                    mb: 1,
                    background: "linear-gradient(90deg, #ffd700, #53e3a6)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Balaji Finance
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#ffd700",
                    textAlign: "center",
                    mb: 4,
                    fontWeight: 600,
                  }}
                >
                  Welcome Back
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    fullWidth
                    placeholder="Username or Email"
                    value={formData.username}
                    onChange={handleChange("username")}
                    error={!!errors.username}
                    helperText={errors.username}
                    variant="filled"
                    sx={{
                      mb: 3,
                      "& .MuiFilledInput-root": {
                        bgcolor: "rgba(255,255,255,0.1)",
                        borderRadius: "16px",
                        border: "1px solid rgba(255,215,0,0.3)",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                        "&.Mui-focused": {
                          bgcolor: "rgba(255,255,255,0.2)",
                          borderColor: "#ffd700",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255,255,255,0.7)",
                      },
                      "& .MuiFilledInput-input": { color: "#fff" },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircleIcon sx={{ color: "#ffd700" }} />
                        </InputAdornment>
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
                    variant="filled"
                    sx={{
                      mb: 4,
                      "& .MuiFilledInput-root": {
                        bgcolor: "rgba(255,255,255,0.1)",
                        borderRadius: "16px",
                        border: "1px solid rgba(255,215,0,0.3)",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                        "&.Mui-focused": {
                          bgcolor: "rgba(255,255,255,0.2)",
                          borderColor: "#ffd700",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255,255,255,0.7)",
                      },
                      "& .MuiFilledInput-input": { color: "#fff" },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#ffd700" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            sx={{ color: "#ffd700" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    fullWidth
                    type="submit"
                    disabled={loading}
                    sx={{
                      height: 58,
                      borderRadius: "18px",
                      bgcolor: "#ffd700",
                      color: "#000",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      textTransform: "none",
                      boxShadow: "0 10px 30px rgba(255,215,0,0.4)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "#ffed4e",
                        transform: "translateY(-4px)",
                        boxShadow: "0 20px 40px rgba(255,215,0,0.5)",
                      },
                      "&:active": {
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={28} color="inherit" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Live Clock & Branding */}
          <Grid
            item
            xs={12}
            md={6}
            lg={7}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              px: { xs: 4, md: 8 },
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "5rem", md: "7.5rem" },
                  fontWeight: 900,
                  letterSpacing: "0.05em",
                  lineHeight: 1,
                  background:
                    "linear-gradient(90deg, #ffd700, #53e3a6, #00d4ff)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
              >
                {formatTime(currentTime)}
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mt: 2,
                  opacity: 0.9,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  color: "#ffd700",
                }}
              >
                {formatDate(currentTime)}
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  mt: 8,
                  fontWeight: 800,
                  fontSize: { xs: "2.8rem", md: "4rem" },
                  background: "linear-gradient(90deg, #ffd700, #fff)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {/* Balaji Finance */} BALAJI FINANCE
              </Typography>

              <Typography
                sx={{
                  mt: 3,
                  opacity: 0.85,
                  maxWidth: 600,
                  mx: "auto",
                  fontSize: "1.3rem",
                }}
              >
                Secure • Modern • Lightning Fast
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
