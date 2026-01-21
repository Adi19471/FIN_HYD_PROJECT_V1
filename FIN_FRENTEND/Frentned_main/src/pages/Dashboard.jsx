import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";

// Import carousel images (ensure these files exist and are high resolution)
import banner1 from "../images/two.png";
import banner2 from "../images/two.png";
import banner3 from "../images/four.png";

const carouselImages = [banner1, banner2, banner3];

function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000); // change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "45vh", sm: "55vh", md: "65vh", lg: "70vh" }, // much taller → full feel
        width: "100%",
        overflow: "hidden",
    
        boxShadow: 6,

        backgroundColor: "#000", // fallback if image fails to load
      }}
    >
      {carouselImages.map((src, index) => (
        <Box
          key={index}
          component="img"
          src={src}
          alt={`Finance Banner ${index + 1}`}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",     // keeps full image visible, crops edges if needed
            // objectFit: "contain", // ← use this instead if you NEVER want cropping
            position: "absolute",
            top: 0,
            left: 0,
            opacity: index === currentIndex ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
          }}
        />
      ))}

      {/* Navigation Dots – moved lower for better visibility on tall carousel */}
      <Stack
        direction="row"
        spacing={2.5}
        sx={{
          position: "absolute",
          bottom: { xs: 16, sm: 24, md: 32 },
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      >
        {carouselImages.map((_, index) => (
          <Box
            key={index}
            onClick={() => handleDotClick(index)}
            sx={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: index === currentIndex ? "primary.main" : "rgba(255, 255, 255, 0.55)",
              border: index === currentIndex ? "3px solid white" : "2px solid white",
              boxShadow: index === currentIndex ? "0 0 12px rgba(25, 118, 210, 0.7)" : "none",
              transition: "all 0.35s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.3)",
                backgroundColor: "primary.light",
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout from Sri Balaji Finance Dashboard?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Top Navigation Bar – removed Filters & DatePicker */}
      <AppBar
        position="static"
        color="default"
        elevation={3}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 }, py: 1.5 }}>
          <Typography
            variant="h5"
            component="div"
            fontWeight="bold"
            color="primary.main"
            sx={{ letterSpacing: 0.5 }}
          >
      Welcome to Sri Balaji Finance Dashboard
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
         

            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

   
      
      

     
      

        <ImageCarousel />

        {/* ← Add your cards, charts, tables here later */}

    </Box>
  );
}

export default Dashboard;