import { useState } from "react";

import { SpeakerNotes, SpeakerNotesOff } from "@mui/icons-material";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";

import { BooleanKeys, getStoredBoolean } from "./utils";

export default function HeaderConfirmRendererRenderer(
  name: string,
  key: BooleanKeys,
  handleDialogChangeOn: (newOn: boolean) => void,
  titleOn: string,
  titleOff: string,
) {
  const [currentOn, setCurrentOn] = useState(getStoredBoolean(key));

  const handleDialogChangeOnClick = () => {
    handleDialogChangeOn(!currentOn);
    setCurrentOn(!currentOn);
  };

  const title = currentOn ? titleOn : titleOff;

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
