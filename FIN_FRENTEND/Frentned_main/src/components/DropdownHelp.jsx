import React, { useState } from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Chip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const companyDetails = {
  name: "AK Technology",
  phone: "8341553216",
  city: "Hyderabad",
  email: "accadamic.info2023@gmail.com",
};

export default function DropdownHelp() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const openDetails = () => {
    handleClose();
    setDetailsOpen(true);
  };
  const closeDetails = () => setDetailsOpen(false);

  return (
    <Box>
      <IconButton color="inherit" onClick={handleClick} aria-label="Open help">
        <HelpOutlineIcon sx={{ fontSize: 24 }} />
      </IconButton>

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
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
            Help & Support
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {companyDetails.name}
          </Typography>
        </Box>

        <Divider />

        <Paper elevation={0}>
          <MenuItem onClick={openDetails}>
            <ListItemIcon>
              <BusinessIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Company Details" secondary="AK Technology" />
          </MenuItem>

          <Divider />

          <MenuItem component="a" href={`tel:${companyDetails.phone}`} onClick={handleClose}>
            <ListItemIcon>
              <PhoneIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Call Support" secondary={companyDetails.phone} />
          </MenuItem>

          <Divider />

          <MenuItem component="a" href={`mailto:${companyDetails.email}`} onClick={handleClose}>
            <ListItemIcon>
              <EmailIcon color="action" />
            </ListItemIcon>
            <ListItemText primary="Email Support" secondary={companyDetails.email} />
          </MenuItem>
        </Paper>
      </Menu>

      <Dialog open={detailsOpen} onClose={closeDetails} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <BusinessIcon color="primary" />
            <Box>
              <Typography variant="h6">{companyDetails.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                Application support and client service
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <PhoneIcon color="success" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography variant="subtitle2">{companyDetails.phone}</Typography>
                </Box>
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <EmailIcon color="primary" />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography variant="subtitle2" sx={{ overflowWrap: "anywhere" }}>{companyDetails.email}</Typography>
                </Box>
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <LocationOnIcon color="error" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Location</Typography>
                  <Typography variant="subtitle2">{companyDetails.city}</Typography>
                </Box>
              </Stack>
            </Paper>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip icon={<SupportAgentIcon />} label="Client Support" variant="outlined" />
              <Chip icon={<InfoOutlinedIcon />} label="Software Assistance" variant="outlined" />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button component="a" href={`tel:${companyDetails.phone}`} startIcon={<PhoneIcon />} variant="contained">
            Call
          </Button>
          <Button component="a" href={`mailto:${companyDetails.email}`} startIcon={<EmailIcon />} variant="outlined">
            Email
          </Button>
          <Button onClick={closeDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
