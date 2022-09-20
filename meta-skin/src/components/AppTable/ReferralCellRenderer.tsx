import { Hail } from "@mui/icons-material";
import { Button } from "@mui/material";

import { AppVM } from "api";

import HandleRequestClick from "./types";

export default function ReferralCellRenderer(
  params: { row: any },
  idsClicked: Set<string>,
  handleRequestClick: HandleRequestClick,
) {
  const { row } = params;
  const { id } = row as AppVM;
  // eslint-disable-next-line react/destructuring-assignment
  const wasClicked = idsClicked.has(id);
  return (
    <Button
      className="flex items-center justify-center w-full h-full"
      onClick={() => handleRequestClick(id)}
      color={wasClicked ? "primary" : "secondary"}
    >
      <Hail />
    </Button>
  );
}
