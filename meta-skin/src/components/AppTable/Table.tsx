import { useEffect, useState } from "react";

import { Box, Stack, SxProps, Theme } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridSortModel,
} from "@mui/x-data-grid";

import { AppVM, createReferral, readReferral } from "api";
import { useAppStateContext } from "contexts";

import AppNameRenderer from "./AppNameRenderer";
import CreateCellRenderer from "./CreateCellRenderer";
import CustomToolbar from "./CustomToolbar";
import ReferralCellRenderer from "./ReferralCellRenderer";
import ReferralHeaderRenderer from "./ReferralHeaderRenderer";
import { HandleIdClick } from "./types";
import { appendSavedAppIds, getSavedAppIds, resetSavedAppIds } from "./utils";

const getColumns = (
  handleRequestClick: HandleIdClick,
  handleCreateClick: HandleIdClick,
  handleResetClick: () => void,
) =>
  [
    {
      field: "referral",
      renderHeader: () => ReferralHeaderRenderer(handleResetClick),
      headerAlign: "center",
      headerClassName: "text-center",
      width: 70,
      renderCell: (params) => ReferralCellRenderer(params, handleRequestClick),
      disableReorder: true,
      disableColumnMenu: true,
      disableExport: true,
      sortable: false,
    },
    {
      field: "name",
      headerName: "App Name",
      flex: 1,
      renderCell: AppNameRenderer,
    },
    {
      field: "create",
      headerName: "Create",
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
  const { apps } = useAppStateContext();

  const [savedAppIds, setSavedAppIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<GridFilterModel>();
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "name", sort: "asc" },
  ]);

  useEffect(() => {
    setSavedAppIds(getSavedAppIds("saved-app-ids"));
  }, []);

  const handleRequestClick = (id: AppVM["id"]) => {
    appendSavedAppIds("received-app-ids", [id]);

    readReferral(id).then(({ advocateId }) => {
      window.open(
        `https://www.oculus.com/appreferrals/${advocateId}/${id}`,
        "_blank",
        "noreferrer",
      );
    });
  };
  const handleCreateClick = (appId: AppVM["id"]) => {
    const advocateId = localStorage.getItem("advocate-id");
    if (advocateId === null) return;
    createReferral({ advocateId, appId });
  };
  const handleResetClick = () => resetSavedAppIds("received-app-ids");

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
  };

  const columns = getColumns(
    handleRequestClick,
    handleCreateClick,
    handleResetClick,
  );

  return (
    <Stack
      direction="column"
      className="h-full w-full flex justify-center items-center"
    >
      <Box className="w-full h-full p-6 max-w-[800px]">
        <DataGrid
          rows={apps}
          columns={columns}
          rowsPerPageOptions={[]}
          filterMode="client"
          hideFooter
          components={{ Toolbar: CustomToolbar }}
          disableColumnFilter
          disableColumnMenu
          sortingMode="client"
          sortModel={sortModel}
          onSortModelChange={onSortChange}
          filterModel={filter}
          onFilterModelChange={onFilterChange}
          sx={dataGridSx}
          disableSelectionOnClick
          isRowSelectable={({ row }) =>
            !savedAppIds.includes((row as AppVM).id)
          }
        />
      </Box>
    </Stack>
  );
}
