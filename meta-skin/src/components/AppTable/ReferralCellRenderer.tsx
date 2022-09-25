import { ReactNode } from "react";

import { Hail } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";

import { AppVM } from "api";

import { HandleIdClick } from "./types";
import { getSavedAppIds } from "./utils";

export default function ReferralCellRenderer(
  params: { row: any },
  handleRequestClick: HandleIdClick,
) {
  const { t } = useTranslation("appTableReferralCell");

  const { row } = params;
  const { id } = row as AppVM;

  const disabled = getSavedAppIds("received-app-ids").includes(id);
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
          onClick={() => handleRequestClick(id)}
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
