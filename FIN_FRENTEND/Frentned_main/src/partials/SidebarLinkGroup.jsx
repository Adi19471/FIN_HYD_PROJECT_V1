// components/SidebarLinkGroup.jsx
import React, { useState, useEffect } from 'react';
import {
  ListItem,
  Collapse,
  List,
  Box,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

function SidebarLinkGroup({
  children,
  activeCondition,          // boolean: true if this group or any child is currently active
  icon: GroupIcon,          // optional top-level icon
  label,                    // optional top-level label text
  defaultOpen = false,      // fallback if no active condition
}) {
  const [open, setOpen] = useState(activeCondition || defaultOpen);

  // Sync open state when active route changes
  useEffect(() => {
    if (activeCondition !== undefined) {
      setOpen(activeCondition);
    }
  }, [activeCondition]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  // Children render function receives: toggle handler + current open state + optional icon & label props
  return (
    <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
      {children({
        onClick: handleToggle,
        open,
        // Pass these down so child can render header consistently
        icon: GroupIcon,
        label,
        ExpandIcon: open ? ExpandLess : ExpandMore,
      })}
    </ListItem>
  );
}

export default SidebarLinkGroup;