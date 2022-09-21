import { Add, Refresh } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";

import { useAppStateContext } from "contexts";

export default function CustomToolbar() {
  const { reloadApps, setOpenCreateModal } = useAppStateContext();
  return (
    <GridToolbarContainer>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        className="w-full gap-4"
      >
        <GridToolbarQuickFilter
          debounceMs={50}
          fullWidth
          sx={{ width: "stretch" }}
          autoFocus
          placeholder="Search by name..."
        />
        <IconButton onClick={() => reloadApps()} color="secondary">
          <Refresh />
        </IconButton>
        <IconButton onClick={() => setOpenCreateModal(true)} color="secondary">
          <Add />
        </IconButton>
      </Stack>
    </GridToolbarContainer>
  );
}
