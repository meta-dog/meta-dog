import { useState } from "react";

import { RecordVoiceOver } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";

import { AppVM } from "api";

import { HandleIdClick } from "./types";
import { getSavedAppIds } from "./utils";

export default function CreateCellRenderer(
  params: { row: any },
  handleCreateClick: HandleIdClick,
) {
  const [open, setOpen] = useState(false);
  const { row } = params;
  const { id } = row as AppVM;
  const advocateId = localStorage.getItem("advocate-id");
  const savedAppIds = getSavedAppIds("saved-app-ids");
  const appIdWasSaved = savedAppIds.includes(id);
  const noAdvocateId = advocateId === null;
  let title = "";
  if (noAdvocateId) title = "You must create a link with the + icon first";
  else if (appIdWasSaved) title = "You have already uploaded this App referral";
  return (
    <Tooltip
      open={open}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onTouchEnd={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      title={title}
      arrow
    >
      <div className="flex items-center justify-center w-full h-full">
        <Button
          onClick={() => !appIdWasSaved && handleCreateClick(id)}
          disabled={noAdvocateId || appIdWasSaved}
          color="secondary"
        >
          <RecordVoiceOver />
        </Button>
      </div>
    </Tooltip>
  );
}
