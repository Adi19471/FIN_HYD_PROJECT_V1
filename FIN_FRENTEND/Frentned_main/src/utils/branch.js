// The branch the app is working in.
//
// Each user is given a list of branches and works in exactly one at a time.
// Login stores that list; with more than one the user picks a branch in a
// popup, and can switch later from the top bar. Every API call sends the
// chosen branch as the X-Branch header (see src/lib/axiosConfig.js) and the
// server checks it against the user's list, whatever this file holds.
import { getSession, removeSession, setSession } from "src/utils/session";

const KEY_CURRENT = "branch";
const KEY_INFO = "branchInfo";

const emptyInfo = () => ({ branches: [] });

const canOpen = (code, info) => Boolean(code) && info.branches.some((branch) => branch.code === code);

/**
 * Save the user's branches from /auth/login (or /auth/refresh). Keeps the
 * branch already chosen if the user still has it; with exactly one branch
 * that one is chosen; otherwise nothing is chosen until the user picks.
 */
export const saveBranchInfo = (data = {}) => {
  const info = { branches: Array.isArray(data.branches) ? data.branches : [] };
  setSession(KEY_INFO, info);
  if (!canOpen(getSession(KEY_CURRENT), info)) {
    if (info.branches.length === 1) setSession(KEY_CURRENT, info.branches[0].code);
    else removeSession(KEY_CURRENT);
  }
  return info;
};

export const getBranchInfo = () => {
  const info = getSession(KEY_INFO);
  return info && typeof info === "object" && Array.isArray(info.branches) ? info : emptyInfo();
};

/** More than one branch: the user picks one after signing in. */
export const hasBranchChoice = (info = getBranchInfo()) => info.branches.length > 1;

/** The branch code sent as X-Branch ("" until one is chosen). */
export const getCurrentBranch = () => {
  const current = getSession(KEY_CURRENT);
  return current ? String(current) : "";
};

/** Choose one of the user's branches (the server checks it again). */
export const setCurrentBranch = (code) => {
  if (canOpen(code, getBranchInfo())) setSession(KEY_CURRENT, code);
};

export const branchLabel = (code = getCurrentBranch()) => {
  if (!code) return "";
  const branch = getBranchInfo().branches.find((item) => item.code === code);
  return branch?.name || code;
};

/** Back to the user's first branch (used when the server refuses one). */
export const resetToFirstBranch = () => {
  const first = getBranchInfo().branches[0];
  if (first) setSession(KEY_CURRENT, first.code);
  else removeSession(KEY_CURRENT);
};

export const clearBranch = () => {
  removeSession(KEY_CURRENT);
  removeSession(KEY_INFO);
};
