import { ReactNode, useState } from "react";

import { Hail } from "@mui/icons-material";
import { Button, Stack, Tooltip, Typography } from "@mui/material";

import { AppVM } from "api";

import { HandleIdClick } from "./types";
import { getSavedAppIds } from "./utils";

export default function ReferralCellRenderer(
  params: { row: any },
  handleRequestClick: HandleIdClick,
) {
  const [open, setOpen] = useState(false);

  const { row } = params;
  const { id } = row as AppVM;
  const disabled = getSavedAppIds("received-app-ids").includes(id);
  let title: string | ReactNode = "";
  if (disabled) {
    title = (
      <div onMouseEnter={() => setOpen(true)}>
        <Stack direction="column">
          <Typography>
            You have already gotten this one. If you still want it nevertheless,
            use the reset icon on this column.
          </Typography>
        </Stack>
      </div>
    );
  }
  return (
    <Tooltip
      open={open}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onTouchStart={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      title={title}
      arrow
    >
      <div className="flex items-center justify-center w-full h-full">
        <Button
          onClick={() => handleRequestClick(id)}
          color="secondary"
          disabled={disabled}
        >
          <Hail />
        </Button>
      </div>
    </Tooltip>
  );
}
