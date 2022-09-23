import { useState } from "react";

import { RecordVoiceOver } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

import { AppVM } from "api";

import { HandleIdClick } from "./types";
import { getSavedAdvocateId, getSavedAppIds } from "./utils";

export default function CreateCellRenderer(
  params: { row: any },
  handleCreateClick: HandleIdClick,
) {
  const { t } = useTranslation("appTableCreateCell");

  const [open, setOpen] = useState(false);

  const { row } = params;
  const { id } = row as AppVM;

  const savedAppIds = getSavedAppIds("saved-app-ids");
  const appIdWasSaved = savedAppIds.includes(id);

  const advocateId = getSavedAdvocateId();
  const noAdvocateId = advocateId === null;

  let title = "";
  if (noAdvocateId) title = t("tooltip.no-advocate-id");
  else if (appIdWasSaved) title = t("tooltip.app-id-was-saved");

  return (
    <Tooltip
      open={open}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onTouchEnd={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      title={title}
      arrow
      placement="left"
    >
      <div className="flex items-center justify-center w-full h-full">
        <Button
          onClick={() => !appIdWasSaved && handleCreateClick(id)}
          disabled={noAdvocateId || appIdWasSaved}
          color="secondary"
          aria-label={t("button.create.aria-label")}
        >
          <RecordVoiceOver />
        </Button>
      </div>
    </Tooltip>
  );
}
