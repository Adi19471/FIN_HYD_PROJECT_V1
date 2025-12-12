// SidebarLinkGroup.jsx
import React, { useState, useEffect } from "react";

function SidebarLinkGroup({ children, activeCondition }) {
  const [open, setOpen] = useState(activeCondition);

  // Keep dropdown open if any child route is active
  useEffect(() => {
    setOpen(activeCondition);
  }, [activeCondition]);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <li className="mb-2">
      {children(handleClick, open)}
    </li>
  );
}

export default SidebarLinkGroup;