import { ReactNode } from "react";

import { RecordVoiceOver } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

import { AppVM } from "api";

import { HandleAppClick } from "./types";
import { getStoredArray } from "./utils";

export default function CreateCellRenderer(
  params: { row: any },
  handleCreateClick: HandleAppClick,
) {
  const { t } = useTranslation("appTableCreateCell");

  const { row } = params;
  const app = row as AppVM;

  const appIdWasSaved = getStoredArray("saved-app-ids").includes(app.id);
  const appIdWasBlacklisted = getStoredArray("blacklist-ids").includes(app.id);

  let title: string | ReactNode = "";
  if (appIdWasSaved)
    title = (
      <div className="whitespace-pre-line text-center max-w-[30vw]">
        {t("tooltip.app-id-was-saved")}
      </div>
    );
  if (appIdWasBlacklisted)
    title = (
      <div className="whitespace-pre-line text-center max-w-[30vw]">
        {t("tooltip.app-id-was-blacklisted")}
      </div>
    );

  return (
    <Tooltip title={title} arrow placement="left">
      <div className="flex items-center justify-center w-full h-full">
        <Button
          onClick={() => !appIdWasSaved && handleCreateClick(app)}
          disabled={appIdWasSaved}
          color="secondary"
          aria-label={t("button.create.aria-label")}
          sx={{ padding: 0, width: "100%", height: "100%" }}
        >
          <RecordVoiceOver />
        </Button>
      </div>
    </Tooltip>
  );
}
