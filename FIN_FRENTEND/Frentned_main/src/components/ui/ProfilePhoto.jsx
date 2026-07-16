import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Box, IconButton, CircularProgress, Tooltip } from "@mui/material";
import { PhotoCameraRounded, PersonRounded } from "@mui/icons-material";
import { API_BASE } from "lib/config";
import { getSession } from "src/utils/session";
import { errorToast, successToast } from "toastify";

const bufferToDataUrl = (buffer, contentType) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return `data:${contentType || "image/jpeg"};base64,${btoa(binary)}`;
};

/**
 * Displays (and optionally lets the user upload) a PersonalInfo profile photo via
 * GET/POST /profile-photo/{personalInfoId}/profile-pic.
 */
export default function ProfilePhotoBox({
  personalInfoId,
  editable = false,
  width = 90,
  height = 100,
  onPhotoLoaded,
  disabledHint = "Select a customer first",
}) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const loadPhoto = async () => {
    if (!personalInfoId) {
      setPhotoUrl(null);
      onPhotoLoaded?.(null);
      return;
    }
    const headers = { Authorization: `Bearer ${getSession("token") || ""}` };
    try {
      const res = await axios.get(
        `${API_BASE}/profile-photo/${personalInfoId}/profile-pic`,
        { headers, responseType: "arraybuffer" }
      );
      const url = bufferToDataUrl(res.data, res.headers?.["content-type"]);
      setPhotoUrl(url);
      onPhotoLoaded?.(url);
    } catch {
      setPhotoUrl(null);
      onPhotoLoaded?.(null);
    }
  };

  useEffect(() => {
    loadPhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalInfoId]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !personalInfoId) return;

    if (!file.type.startsWith("image/")) {
      errorToast("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errorToast("Image must be smaller than 5MB");
      return;
    }

    setUploading(true);
    try {
      const headers = { Authorization: `Bearer ${getSession("token") || ""}` };
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(
        `${API_BASE}/profile-photo/${personalInfoId}/profile-pic`,
        formData,
        { headers }
      );
      successToast("Photo uploaded");
      await loadPhoto();
    } catch (err) {
      errorToast(err.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ position: "relative", width, height }}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          border: "1px solid #cbd5e1",
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          bgcolor: "#f8fafc",
        }}
      >
        {photoUrl ? (
          <Box
            component="img"
            src={photoUrl}
            alt="Profile"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <PersonRounded sx={{ fontSize: Math.min(width, height) * 0.45, color: "#94a3b8" }} />
        )}
      </Box>

      {uploading && (
        <Box
          sx={{
            position: "absolute", inset: 0, borderRadius: 1,
            bgcolor: "rgba(0,0,0,0.4)", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <CircularProgress size={Math.min(width, height) * 0.3} sx={{ color: "#fff" }} />
        </Box>
      )}

      {editable && (
        <>
          <Tooltip title={personalInfoId ? "Change photo" : disabledHint}>
            <span>
              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={!personalInfoId || uploading}
                sx={{
                  position: "absolute", bottom: -8, right: -8,
                  bgcolor: "primary.main", color: "white",
                  width: 26, height: 26,
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <PhotoCameraRounded sx={{ fontSize: 15 }} />
              </IconButton>
            </span>
          </Tooltip>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </>
      )}
    </Box>
  );
}
