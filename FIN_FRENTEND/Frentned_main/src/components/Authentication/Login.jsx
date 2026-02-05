import React, { useState, useEffect } from "react";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  Lock,
} from "@mui/icons-material";

import { successToast, errorToast } from "toastify";
import { API_BASE } from "lib/config";
import { setSession } from "src/utils/session";
import "./Login.css"; // you can keep or remove if not needed

const images = [
  "https://tse1.mm.bing.net/th/id/OIP.pRQzkDi4PrxDoTkGb4S4RAAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
  "https://wallpaperaccess.com/full/2113262.jpg",
  "https://wallpaperaccess.com/full/2113304.jpg",
  "https://wallpaperaccess.com/full/5949291.jpg",
  "https://tse2.mm.bing.net/th/id/OIP.MjNhd-gfbcDQqJfNGv0hxgHaJ4?rs=1&pid=ImgDetMain&o=7&rm=3",
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Image carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
        successToast("Login successful 🙏");
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
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ===================== LEFT - IMAGE BACKGROUND (75%) ===================== */}
      <Box
        sx={{
          width: { xs: "100%", md: "85%" },
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {images.map((src, idx) => (
          <Box
            key={idx}
            component="img"
            src={src}
            alt="background"



            sx={{

                  objectFit: "contain",      // 👈 NO CROPPING
    backgroundColor: "#000",   // 👈 fills empty space
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: idx === currentImageIndex ? 1 : 0,
              transition: "opacity 1.2s ease-in-out",
              zIndex: idx === currentImageIndex ? 1 : 0,
            }}
          />
        ))}

        {/* Optional overlay for better text readability */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.35), rgba(0,0,0,0.15))",
            zIndex: 2,
          }}
        />
      </Box>

      {/* ===================== RIGHT - LOGIN FORM (25%) ===================== */}
      <Box
        sx={{
          width: { xs: "100%", md: "25%" },
          minWidth: { md: "340px" },
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(8px)",
          zIndex: 10,
          boxShadow: { md: "-10px 0 25px rgba(0,0,0,0.25)" },
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 4 },
            width: "90%",
            maxWidth: 420,
            borderRadius: 3,
            background: "linear-gradient(145deg, #ffffff 0%, #fffaf0 100%)",
          }}
        >
          {/* Title */}
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                color: "#8b0000",
                letterSpacing: "1.5px",
                fontFamily: "'Georgia', serif",
              }}
            >
              SRI BALAJI
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Secure Access Portal
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              fullWidth
              size="medium"
              label="Username / Email"
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
              fullWidth
              size="medium"
              label="Password"
              type={showPassword ? "text" : "password"}
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
                      onClick={() => setShowPassword((prev) => !prev)}
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
                py: 1.8,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 2,
                background: "linear-gradient(90deg, #8b0000 0%, #c41e3a 100%)",
                "&:hover": {
                  background: "linear-gradient(90deg, #a00000 0%, #d32f2f 100%)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={28} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;