import { AppBar, Stack, Toolbar, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import LanguageSelector from "./LanguageSelector";

export default function Footer() {
  const { t } = useTranslation("footer");

  return (
    <AppBar position="static">
      <Toolbar className="justify-center py-2">
        <Stack direction="column" className="gap-0">
          <Typography variant="h6">{t("made-in")}</Typography>
          <LanguageSelector sx={{ color: "white", textAlign: "center" }} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
