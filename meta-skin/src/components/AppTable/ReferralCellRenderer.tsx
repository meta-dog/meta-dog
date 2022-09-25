import { ReactNode } from "react";

import { Hail } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

import { AppVM } from "api";

import { HandleAppClick } from "./types";
import { getStoredArray } from "./utils";

export default function ReferralCellRenderer(
  params: { row: any },
  handleRequestClick: HandleAppClick,
) {
  const { t } = useTranslation("appTableReferralCell");

  const { row } = params;
  const app = row as AppVM;

  const disabled = getStoredArray("received-app-ids").includes(app.id);
  let title: string | ReactNode = "";
  if (disabled) {
    title = (
      <div className="whitespace-pre-line text-center max-w-[30vw]">
        {t("tooltip.title.got-it-already")}
      </div>
    );
  }

  return (
    <Tooltip title={title} arrow placement="right">
      <div className="flex items-center justify-center w-full h-full">
        <Button
          onClick={() => handleRequestClick(app)}
          color={disabled ? "primary" : "secondary"}
          aria-label={t("button.request.aria-label")}
          sx={{ padding: 0, width: "100%", height: "100%" }}
        >
          <Hail />
        </Button>
      </div>
    </Tooltip>
  );
}
