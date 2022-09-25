import { Add, Refresh } from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import { GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

import { useAppStateContext } from "contexts";

export default function Toolbar() {
  const { reloadApps, setOpenCreateDialog } = useAppStateContext();

  const { t } = useTranslation("appTableToolbar");

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
          placeholder={t("search.placeholder")}
        />
        <IconButton
          aria-label={t("button.reload.aria-label")}
          onClick={() => reloadApps()}
          color="secondary"
        >
          <Refresh />
        </IconButton>
        <IconButton
          aria-label={t("button.create.aria-label")}
          onClick={() => setOpenCreateDialog(true)}
          color="secondary"
        >
          <Add />
        </IconButton>
      </Stack>
    </GridToolbarContainer>
  );
}
