import React from "react";
import { Box, LinearProgress, Typography, Tooltip } from "@mui/material";
import { useTransferQueue, TransferTask } from "./app/transferQueue";

function getActiveTasks(queue: TransferTask[]) {
  return queue.filter(q => ["pending", "in-progress"].includes(q.status));
}

export default function MiniProgressDialog() {
  const queue = useTransferQueue();
  const activeTasks = getActiveTasks(queue);
  if (activeTasks.length === 0) return null;

  // Show summary of uploads/downloads
  const uploads = activeTasks.filter(t => t.type === "upload");
  const downloads = activeTasks.filter(t => t.type === "download");

  return (
    <Box sx={{
      position: "fixed",
      bottom: 24,
      left: 24,
      zIndex: 9999,
      minWidth: 220,
      bgcolor: "background.paper",
      boxShadow: 3,
      borderRadius: 2,
      p: 2,
      display: "flex",
      flexDirection: "column",
      gap: 1,
    }}>
      {uploads.length > 0 && (
        <Tooltip title={uploads.map(u => u.name).join(", ") || "Uploading..."}>
          <Box>
            <Typography variant="body2">Uploading ({uploads.length})</Typography>
            <LinearProgress variant="indeterminate" />
          </Box>
        </Tooltip>
      )}
      {downloads.length > 0 && (
        <Tooltip title={downloads.map(d => d.name).join(", ") || "Downloading..."}>
          <Box>
            <Typography variant="body2">Downloading ({downloads.length})</Typography>
            <LinearProgress variant="indeterminate" color="secondary" />
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}
