import { Help } from "@mui/icons-material";
import { AppBar, Avatar, IconButton, Toolbar, Typography } from "@mui/material";

import { useAppStateContext } from "contexts";

import { ReactComponent as Logo } from "res/logo.svg";

import HelpModal from "./HelpModal";

export default function Header() {
  const { setOpenHelpModal } = useAppStateContext();
  return (
    <AppBar position="static">
      <Toolbar className="gap-4 justify-center">
        <Avatar>
          <Logo />
        </Avatar>
        <Typography variant="h6">Meta App Referrals</Typography>
        <IconButton color="secondary" onClick={() => setOpenHelpModal(true)}>
          <Help />
        </IconButton>
      </Toolbar>
      <HelpModal />
    </AppBar>
  );
}
