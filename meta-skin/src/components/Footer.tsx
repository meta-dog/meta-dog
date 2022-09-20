import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Footer() {
  return (
    <AppBar position="static">
      <Toolbar className="gap-4 justify-center">
        <Typography variant="h6">Made with 💖 in Alicante</Typography>
      </Toolbar>
    </AppBar>
  );
}
