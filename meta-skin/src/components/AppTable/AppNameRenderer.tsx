import { Link } from "@mui/material";

import { AppVM } from "api";

export default function AppNameRenderer(params: { row: any }) {
  const { row } = params;
  const { id, name } = row as AppVM;

  return (
    <Link
      className="flex items-center justify-stretch w-full h-full pl-2 pr-2"
      href={`https://www.oculus.com/experiences/quest/${id}`}
      target="_blank"
      rel="noreferrer"
      underline="none"
      textAlign="left"
      variant="body1"
      whiteSpace="pre-line"
      textTransform="capitalize"
      overflow="auto"
    >
      {name}
    </Link>
  );
}
