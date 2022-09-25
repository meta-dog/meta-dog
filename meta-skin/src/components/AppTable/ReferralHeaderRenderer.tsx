import { useState } from "react";

import { SpeakerNotes, SpeakerNotesOff } from "@mui/icons-material";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { getSavedBoolean } from "./utils";

export default function ReferralHeaderRenderer(
  name: string,
  handleDialogChangeOn: (newOn: boolean) => void,
) {
  const { t } = useTranslation("appTableReferralHeader");

  const [currentOn, setCurrentOn] = useState(
    getSavedBoolean("referral-dialog-on"),
  );

  const handleDialogChangeOnClick = () => {
    handleDialogChangeOn(!currentOn);
    setCurrentOn(!currentOn);
  };

  const title = currentOn
    ? t("tooltip.deactivate-dialog")
    : t("tooltip.activate-dialog");

  return (
    <Stack direction="row" className="flex justify-center items-center">
      <Typography
        variant="body2"
        fontWeight={500}
        sx={{ lineHeight: "initial" }}
      >
        {name}
      </Typography>
      <Box>
        <Tooltip title={title}>
          <IconButton
            aria-label={title}
            size="small"
            sx={{ "& .MuiSvgIcon-root": { fontSize: "initial" } }}
            onClick={handleDialogChangeOnClick}
          >
            {currentOn ? <SpeakerNotes /> : <SpeakerNotesOff />}
          </IconButton>
        </Tooltip>
      </Box>
    </Stack>
  );
}
