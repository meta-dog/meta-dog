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

  let titleText = t("tooltip.no-advocate-id");
  if (noAdvocateId) titleText = t("tooltip.no-advocate-id");
  else if (appIdWasSaved) titleText = t("tooltip.app-id-was-saved");

  return (
    <Tooltip
      open={open}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onTouchEnd={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      title={
        <div className="whitespace-pre-line text-center max-w-[30vw]">
          {titleText}
        </div>
      }
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
