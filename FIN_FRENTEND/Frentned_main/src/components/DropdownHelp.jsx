import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import EmailIcon from "@mui/icons-material/Email";
import { Link } from "react-router-dom";

export default function DropdownHelp() {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box>
      {/* Help Icon */}
      <IconButton color="inherit" onClick={handleClick}>
        <HelpOutlineIcon sx={{ fontSize: 24 }} />
      </IconButton>

      {/* MUI Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 6,
          sx: { width: 250, borderRadius: 3 },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1 }}>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color="text.secondary"
          >
            Need Help?
          </Typography>
        </Box>

        <Divider />

        {/* Help Menu Items */}
        <Paper elevation={0}>
          {/* Documentation */}
          <MenuItem component={Link} to="/documentation" onClick={handleClose}>
            <ListItemIcon>
              <DescriptionIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Documentation"
              secondary="Guides & tutorials"
            />
          </MenuItem>

          <Divider />

          {/* Support */}
          <MenuItem component={Link} to="/support" onClick={handleClose}>
            <ListItemIcon>
              <SupportAgentIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Support Center"
              secondary="Get technical help"
            />
          </MenuItem>

          <Divider />

          {/* Contact */}
          <MenuItem component={Link} to="/contact" onClick={handleClose}>
            <ListItemIcon>
              <EmailIcon color="action" />
            </ListItemIcon>
            <ListItemText primary="Contact Us" secondary="Send us a message" />
          </MenuItem>
        </Paper>
      </Menu>
    </Box>
  );
}
