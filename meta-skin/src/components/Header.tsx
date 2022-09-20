import { AppBar, Avatar, Toolbar, Typography } from "@mui/material";

import { ReactComponent as Logo } from "res/logo.svg";

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar className="gap-4 justify-center">
        <Avatar>
          <Logo />
        </Avatar>
        <Typography variant="h6">Meta App Referrals</Typography>
      </Toolbar>
    </AppBar>
  );
}
