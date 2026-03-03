import React from "react";
import { Box, Button, Tooltip, IconButton } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

/**
 * ActionButtonGroup - Consistent action buttons
 * @param {object} props
 * @param {boolean} props.showEdit - Show edit button
 * @param {boolean} props.showDelete - Show delete button
 * @param {boolean} props.showView - Show view button
 * @param {function} props.onEdit - Edit click handler
 * @param {function} props.onDelete - Delete click handler
 * @param {function} props.onView - View click handler
 * @param {boolean} props.editLabel - Edit button label
 * @param {boolean} props.deleteLabel - Delete button label
 * @param {string} props.variant - Button variant ('contained', 'outlined', 'text')
 * @param {string} props.size - Button size ('small', 'medium', 'large')
 * @param {boolean} props.iconOnly - Use icon only mode
 * @param {boolean} props.loading - Loading state
 */
const ActionButtonGroup = ({
  showEdit = true,
  showDelete = false,
  showView = false,
  onEdit,
  onDelete,
  onView,
  editLabel = "Edit",
  deleteLabel = "Delete",
  viewLabel = "View",
  variant = "contained",
  size = "small",
  iconOnly = false,
  loading = false,
}) => {
  const buttonProps = {
    variant,
    size,
    disabled: loading,
  };

  if (iconOnly) {
    return (
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {showEdit && (
          <Tooltip title={editLabel}>
            <IconButton color="primary" onClick={onEdit} disabled={loading}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
        {showView && (
          <Tooltip title={viewLabel}>
            <IconButton color="info" onClick={onView} disabled={loading}>
              <ViewIcon />
            </IconButton>
          </Tooltip>
        )}
        {showDelete && (
          <Tooltip title={deleteLabel}>
            <IconButton color="error" onClick={onDelete} disabled={loading}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {showEdit && (
        <Button
          {...buttonProps}
          color="primary"
          startIcon={<EditIcon />}
          onClick={onEdit}
        >
          {editLabel}
        </Button>
      )}
      {showView && (
        <Button
          {...buttonProps}
          color="info"
          startIcon={<ViewIcon />}
          onClick={onView}
        >
          {viewLabel}
        </Button>
      )}
      {showDelete && (
        <Button
          {...buttonProps}
          color="error"
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={onDelete}
        >
          {deleteLabel}
        </Button>
      )}
    </Box>
  );
};

/**
 * FormButtons - Consistent form action buttons
 */
export const FormButtons = ({
  onSave,
  onCancel,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  saving = false,
  showReset = false,
  onReset,
  resetLabel = "Reset",
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
        mt: 4,
        pt: 3,
        borderTop: "1px solid #e0e0e0",
      }}
    >
      {showReset && (
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onReset}
          disabled={saving}
        >
          {resetLabel}
        </Button>
      )}
      <Button
        variant="outlined"
        startIcon={<CloseIcon />}
        onClick={onCancel}
        disabled={saving}
      >
        {cancelLabel}
      </Button>
      <Button
        variant="contained"
        startIcon={saving ? null : <SaveIcon />}
        onClick={onSave}
        disabled={saving}
        sx={{
          minWidth: 120,
          backgroundColor: "#4caf50",
          "&:hover": {
            backgroundColor: "#43a047",
          },
        }}
      >
        {saving ? "Saving..." : saveLabel}
      </Button>
    </Box>
  );
};

/**
 * PageActions - Header action buttons
 */
export const PageActions = ({
  onAdd,
  addLabel = "Add New",
  onRefresh,
  refreshLabel = "Refresh",
  showAdd = true,
  showRefresh = false,
  loading = false,
}) => {
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {showRefresh && (
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          disabled={loading}
        >
          {refreshLabel}
        </Button>
      )}
      {showAdd && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          disabled={loading}
          sx={{
            backgroundColor: "#4caf50",
            "&:hover": {
              backgroundColor: "#43a047",
            },
          }}
        >
          {addLabel}
        </Button>
      )}
    </Box>
  );
};

export default ActionButtonGroup;

