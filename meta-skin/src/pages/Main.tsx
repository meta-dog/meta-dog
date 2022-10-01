import { Grid } from "@mui/material";

import { AppTable, Footer, Header } from "components";
import { CreateAppDialog } from "components/AppTable";
import DeviceReferral from "components/AppTable/DeviceReferral";
import Quickstart from "components/AppTable/Quickstart";

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
      <Grid
        item
        container
        gridArea="table"
        display="grid"
        gridTemplateRows="auto auto 1fr"
      >
        <DeviceReferral />
        <Quickstart />
        <AppTable />
        <CreateAppDialog />
      </Grid>
      <Grid item gridArea="footer">
        <Footer />
      </Grid>
    </Grid>
  );
}
