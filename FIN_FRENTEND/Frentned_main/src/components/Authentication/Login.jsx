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
  Fade,
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


const backgroundImages = [

  // ----- Finance Charts & Stock Market -----
  "https://images.unsplash.com/photo-1640161704729-cbe966a08476?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&q=80&w=2000",

  // ----- Investment & Money -----
  "https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1604594849809-dfedbc827105?auto=format&fit=crop&q=80&w=2000",

  // ----- Business Meeting / Corporate -----
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000",

  // ----- Banking & Fintech -----
  "https://images.unsplash.com/photo-1565514158740-064f34bd6cfd?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1611971260890-8d52fdf3a21a?auto=format&fit=crop&q=80&w=2000",

  // ----- Daily Business Work / Planning -----
  "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2000",

  // ----- Money Saving / Growth Concept -----
  "https://images.unsplash.com/photo-1565372919476-6c3c5fbe8b7b?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=2000",

  // ----- Lord Venkateswara (Balaji) -----
  "https://upload.wikimedia.org/wikipedia/commons/9/9d/Lord_Venkateswara_Tirumala.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3f/Tirupati_Balaji_Temple_Deity.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/4/4a/Sri_Venkateswara_Swamy.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/0/09/Venkateswara_Tirumala_Deity.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/2c/Lord_Balaji_Tirupati.jpg",

];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate background images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

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
        position: "relative",
        overflow: "hidden",
        bgcolor: "#0a0a0a",
      }}
    >
      {/* Background Image Carousel */}
      <Box sx={{ position: "absolute", inset: 0, zIndex: 1 }}>
        {backgroundImages.map((src, idx) => (
          <Fade
            key={src}
            in={idx === currentImageIndex}
            timeout={{ enter: 1400, exit: 900 }}
            unmountOnExit
          >
            <Box
              component="img"
              src={src}
              alt="background"
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </Fade>
        ))}

        {/* Overlay – dark with subtle red tint for brand feel */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(10,10,10,0.78) 0%, rgba(139,0,0,0.28) 100%)",
            zIndex: 2,
          }}
        />
      </Box>

      {/* Login Form Panel */}
      <Box
        sx={{
          width: { xs: "100%", md: "38%", lg: "35%" },
          minWidth: { md: "400px" },
          height: "100%",
          ml: { md: "auto" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 10,
          px: { xs: 2, sm: 4 },
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: { xs: 4, sm: 5, md: 6 },
            width: "100%",
            maxWidth: 480,
            borderRadius: 4,
            bgcolor: "rgba(255, 255, 255, 0.91)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.35)",
            boxShadow: "0 16px 60px rgba(0,0,0,0.4)",
          }}
        >
          {/* Brand / Title */}
          <Box textAlign="center" mb={5}>
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                color: "#8b0000",
                letterSpacing: 3,
                fontFamily: "'Playfair Display', serif",
                textShadow: "1px 1px 4px rgba(0,0,0,0.2)",
              }}
            >
              SRI BALAJI
            </Typography>
            <Typography
              variant="subtitle1"
              color="#555"
              fontWeight={500}
              mt={1}
              letterSpacing={0.8}
            >
              Chit Funds • Secure Login Portal
            </Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              fullWidth
              label="Username / Email"
              value={formData.username}
              onChange={handleChange("username")}
              error={!!errors.username}
              helperText={errors.username}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle sx={{ color: "#8b0000" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange("password")}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#8b0000" }} />
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
              sx={{ mb: 4 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.8,
                fontSize: "1.18rem",
                fontWeight: 700,
                borderRadius: 3,
                background: "linear-gradient(90deg, #8b0000 0%, #c41e3a 100%)",
                boxShadow: "0 8px 25px rgba(139,0,0,0.4)",
                "&:hover": {
                  background: "linear-gradient(90deg, #a00000 0%, #d32f2f 100%)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 14px 35px rgba(139,0,0,0.5)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {loading ? (
                <CircularProgress size={30} color="inherit" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            mt={5}
            fontSize="0.9rem"
          >
            © {new Date().getFullYear()} Sri Balaji Chit Funds • Hyderabad
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;