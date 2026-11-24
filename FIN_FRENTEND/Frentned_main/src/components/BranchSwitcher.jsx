import React, { useState } from "react";
import { Chip, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import { ApartmentRounded, CheckRounded, ExpandMoreRounded } from "@mui/icons-material";
import { branchLabel, getBranchInfo, getCurrentBranch, hasBranchChoice, setCurrentBranch } from "src/utils/branch";

/**
 * The branch the app is working in, in the top bar.
 *
 * A user with one branch sees it as a plain label. A user with several gets a
 * menu of their branches; picking another reloads the page so every screen
 * fetches its data again for that branch.
 */
export default function BranchSwitcher() {
  const info = getBranchInfo();
  const current = getCurrentBranch();
  const [anchor, setAnchor] = useState(null);

  if (!current) return null;

  const label = branchLabel(current);

  if (!hasBranchChoice(info)) {
    return (
      <Tooltip title="Your branch">
        <Chip
          size="small"
          icon={<ApartmentRounded fontSize="small" />}
          label={label}
          variant="outlined"
          sx={{ fontWeight: 600, maxWidth: 200, display: { xs: "none", sm: "inline-flex" } }}
        />
      </Tooltip>
    );
  }

  const choose = (code) => {
    setAnchor(null);
    if (code === current) return;
    setCurrentBranch(code);
    window.location.reload();
  };

  return (
    <>
      <Tooltip title="Switch branch">
        <Chip
          size="small"
          color="primary"
          icon={<ApartmentRounded fontSize="small" />}
          deleteIcon={<ExpandMoreRounded />}
          onDelete={(event) => setAnchor(event.currentTarget.closest(".MuiChip-root"))}
          onClick={(event) => setAnchor(event.currentTarget)}
          label={label}
          aria-haspopup="menu"
          aria-label={`Branch: ${label}. Switch branch`}
          sx={{ fontWeight: 600, maxWidth: 220 }}
        />
      </Tooltip>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {info.branches.map((branch) => (
          <MenuItem key={branch.code} selected={branch.code === current} onClick={() => choose(branch.code)}>
            <ListItemText primary={branch.name} secondary={branch.location || null} />
            {branch.code === current && <CheckRounded fontSize="small" sx={{ ml: 2 }} />}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
