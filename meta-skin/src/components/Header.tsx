import { Help } from "@mui/icons-material";
import { AppBar, Avatar, IconButton, Toolbar, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { useAppStateContext } from "contexts";

import { ReactComponent as Logo } from "res/logo.svg";

import HelpDialog from "./HelpDialog";

export default function Header() {
  const { setOpenHelpDialog } = useAppStateContext();

  const { t } = useTranslation("header");

  return (
    <AppBar position="static">
      <Toolbar className="gap-4 justify-center">
        <Avatar>
          <Logo />
        </Avatar>
        <Typography variant="h6">{t("title")}</Typography>
        <IconButton
          aria-label={t("button.open-help.aria-label")}
          color="secondary"
          onClick={() => setOpenHelpDialog(true)}
        >
          <Help />
        </IconButton>
      </Toolbar>
      <HelpDialog />
    </AppBar>
  );
}
