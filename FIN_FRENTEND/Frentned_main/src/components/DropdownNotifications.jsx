import React, { useState } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function DropdownNotifications() {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box>
      {/* Notification Button */}
      <IconButton color="inherit" onClick={handleClick}>
        <Badge color="error" variant="dot">
          <NotificationsIcon sx={{ fontSize: 24 }} />
        </Badge>
      </IconButton>

      {/* MUI Notification Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 6,
          sx: { width: 350, maxWidth: "100%", borderRadius: 3 },
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
            Finance Notifications
          </Typography>
        </Box>

        <Divider />

        {/* Notification Items */}
        <Paper elevation={0} sx={{ maxHeight: 300, overflowY: "auto" }}>
          {/* Loan Applications */}
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AssignmentIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="5 Loan Applications Pending"
              secondary="10 minutes ago"
            />
          </MenuItem>

          <Divider />

          {/* Today's Collections */}
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <MonetizationOnIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Today's Collections Updated"
              secondary="1 hour ago"
            />
          </MenuItem>

          <Divider />

          {/* EMI Overdue */}
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <WarningAmberIcon color="warning" />
            </ListItemIcon>
            <ListItemText
              primary="12 Customers Have EMI Overdue"
              secondary="Today"
            />
          </MenuItem>

          <Divider />

          {/* Monthly Report */}
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AccessTimeIcon color="action" />
            </ListItemIcon>
            <ListItemText
              primary="Monthly Financial Report Generated"
              secondary="Yesterday"
            />
          </MenuItem>
        </Paper>
      </Menu>
    </Box>
  );
}
