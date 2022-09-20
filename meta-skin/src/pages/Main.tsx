import { Grid } from "@mui/material";

import { AppTable, Footer, Header } from "components";

export default function Main() {
  return (
    <Grid
      container
      display="grid"
      gridTemplateAreas={`"header" "table" "footer"`}
      gridTemplateRows="auto 1fr auto"
      className="w-full h-full"
    >
      <Grid item gridArea="header">
        <Header />
      </Grid>
      <Grid item gridArea="table">
        <AppTable />
      </Grid>
      <Grid item gridArea="footer">
        <Footer />
      </Grid>
    </Grid>
  );
}
