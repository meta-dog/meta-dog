import { useState } from "react";

import { Box, Stack, SxProps, Theme } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { TFunction, useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { AppVM, createReferral, readReferral } from "api";
import { useAppStateContext } from "contexts";

import AppNameRenderer from "./AppNameRenderer";
import CreateCellRenderer from "./CreateCellRenderer";
import CreateReferralCellDialog from "./CreateReferralCellDialog";
import CreateReferralHeaderRenderer from "./CreateReferralHeaderRenderer";
import ReferralCellRenderer from "./ReferralCellRenderer";
import ReferralDialog from "./ReferralDialog";
import ReferralHeaderRenderer from "./ReferralHeaderRenderer";
import Toolbar from "./Toolbar";
import { HandleAppClick } from "./types";
import {
  BooleanKeys,
  appendToStoredArray,
  getStoredAdvocateId,
  getStoredArray,
  getStoredBoolean,
  storeBoolean,
} from "./utils";

const getColumns = (
  t: TFunction<"appTableTable", undefined>,
  handleRequestClick: HandleAppClick,
  handleCreateClick: HandleAppClick,
  handleChangeDialogOn: (key: BooleanKeys) => (newOn: boolean) => void,
) =>
  [
    {
      field: "referral",
      headerName: t("columns.referral"),
      renderHeader: ({ colDef }) =>
        ReferralHeaderRenderer(
          colDef.headerName || "",
          handleChangeDialogOn("referral-dialog-on"),
        ),
      headerAlign: "center",
      headerClassName: "text-center",
      width: 90,
      renderCell: (params) => ReferralCellRenderer(params, handleRequestClick),
      disableReorder: true,
      disableColumnMenu: true,
      disableExport: true,
      sortable: false,
    },
    {
      field: "name",
      headerName: t("columns.app-name"),
      flex: 1,
      renderCell: AppNameRenderer,
    },
    {
      field: "create",
      headerName: t("columns.create"),
      renderHeader: ({ colDef }) =>
        CreateReferralHeaderRenderer(
          colDef.headerName || "",
          handleChangeDialogOn("create-referral-dialog-on"),
        ),
      headerAlign: "center",
      headerClassName: "text-center",
      width: 70,
      renderCell: (params) => CreateCellRenderer(params, handleCreateClick),
      disableReorder: true,
      disableColumnMenu: true,
      disableExport: true,
      sortable: false,
    },
  ] as GridColDef[];

export default function Table() {
  const { apps, loadingApps } = useAppStateContext();

  const { t } = useTranslation("appTableTable");

  const [filter, setFilter] = useState<GridFilterModel>();
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "name", sort: "asc" },
  ]);
  const [referralApp, setReferralApp] = useState<AppVM | null>(null);
  const [referralDialogOpen, setReferralDialogOpen] = useState(false);
  const [createReferralDialogOpen, setCreateReferralDialogOpen] =
    useState(false);

  const handleRequest = (app: AppVM | null = referralApp) => {
    if (app === null) return;
    const { id } = app;
    appendToStoredArray("received-app-ids", [id]);

    readReferral(id).then(({ advocateId }) => {
      window.open(
        `https://www.oculus.com/appreferrals/${advocateId}/${id}`,
        "_blank",
        "noreferrer",
      );
    });
  };
  const handleRequestClick = (app: AppVM) => {
    setReferralApp(app);

    const shouldOpenDialog =
      getStoredBoolean("referral-dialog-on") &&
      getStoredArray("received-app-ids").includes(app.id);
    if (shouldOpenDialog) {
      setReferralDialogOpen(true);
      return;
    }
    handleRequest(app);
  };

  const handleCreate = async (app: AppVM | null = referralApp) => {
    const advocateId = getStoredAdvocateId();
    if (advocateId === null) return;
    if (app === null) return;
    try {
      await createReferral({ advocateId, appId: app.id });
      toast.success(t("toast.create.success"));
    } catch (exception: any) {
      toast.error(
        t("toast.create.error", { context: exception.message as string }),
      );
    }
  };
  const handleCreateClick = (app: AppVM) => {
    setReferralApp(app);
    if (getStoredBoolean("create-referral-dialog-on")) {
      setCreateReferralDialogOpen(true);
      return;
    }
    handleCreate(app);
  };
  const handleChangeDialogOn = (key: BooleanKeys) => (newOn: boolean) => {
    storeBoolean(key, newOn);
  };

  const onSortChange = () => {
    setSortModel(([{ field, sort }]) => {
      const newSort = sort === "asc" ? "desc" : "asc";
      return [{ field, sort: newSort }];
    });
  };

  const onFilterChange = (newFilter: GridFilterModel) => {
    setFilter(newFilter);
  };

  const dataGridSx: SxProps<Theme> = {
    padding: 2,
    "& .MuiDataGrid-columnHeader": {
      "&:focus, &:focus-within": {
        outline: "none",
      },
    },
    "& .MuiDataGrid-cellContent": {
      whiteSpace: "normal",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      whiteSpace: "normal",
      lineHeight: "initial",
    },
    "& .MuiDataGrid-cell--withRenderer": {
      padding: 0,
    },
    "& .MuiDataGrid-columnSeparator": {
      display: "none",
    },
  };

  const columns = getColumns(
    t,
    handleRequestClick,
    handleCreateClick,
    handleChangeDialogOn,
  );

  return (
    <Stack
      direction="column"
      className="h-full w-full flex justify-center items-center"
    >
      <Box className="w-full h-full py-6 max-w-[800px]">
        <DataGrid
          rows={apps}
          columns={columns}
          rowsPerPageOptions={[]}
          filterMode="client"
          hideFooter
          components={{ Toolbar }}
          disableColumnFilter
          disableColumnMenu
          sortingMode="client"
          sortModel={sortModel}
          onSortModelChange={onSortChange}
          filterModel={filter}
          onFilterModelChange={onFilterChange}
          sx={dataGridSx}
          disableSelectionOnClick
          loading={loadingApps}
          localeText={{
            noRowsLabel: t("table.no-rows-label"),
            columnHeaderSortIconLabel: t("table.column-header-sort-icon-label"),
            errorOverlayDefaultLabel: t("table.error-overlay-default-label"),
          }}
        />
      </Box>
      <ReferralDialog
        open={referralDialogOpen}
        setOpen={setReferralDialogOpen}
        handleAccept={handleRequest}
      />
      <CreateReferralCellDialog
        open={createReferralDialogOpen}
        setOpen={setCreateReferralDialogOpen}
        handleAccept={handleCreate}
        app={referralApp}
        advocateId={getStoredAdvocateId()}
      />
    </Stack>
  );
}
