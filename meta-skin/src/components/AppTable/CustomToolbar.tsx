import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";

export default function CustomToolbar() {
  return (
    <GridToolbarContainer
      className="flex items-center gap-4 w-full"
      sx={{ width: "100%" }}
    >
      <GridToolbarQuickFilter
        debounceMs={50}
        fullWidth
        sx={{ width: "100%" }}
        autoFocus
        placeholder="Search App by name..."
      />
    </GridToolbarContainer>
  );
}
