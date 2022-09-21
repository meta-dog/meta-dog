import { useState } from "react";

import { Box, Stack, SxProps, Theme } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridSortModel,
} from "@mui/x-data-grid";

import { AppVM } from "api";
import { useAppStateContext } from "contexts";

import AppNameRenderer from "./AppNameRenderer";
import CustomToolbar from "./CustomToolbar";
import ReferralCellRenderer from "./ReferralCellRenderer";
import ReferralHeaderRenderer from "./ReferralHeaderRenderer";
import { HandleRequestClick } from "./types";

const getColumns = (
  handleRequestClick: HandleRequestClick,
  handleResetClick: () => void,
  idsClicked: Set<AppVM["id"]>,
) =>
  [
    {
      field: "referral",
      renderHeader: () => ReferralHeaderRenderer(handleResetClick),
      headerName: "Referral",
      headerAlign: "center",
      headerClassName: "text-center",
      width: 100,
      renderCell: (params) =>
        ReferralCellRenderer(params, idsClicked, handleRequestClick),
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
  ] as GridColDef[];

export default function Table() {
  const { apps } = useAppStateContext();

  const [filter, setFilter] = useState<GridFilterModel>();
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "name", sort: "asc" },
  ]);
  const [idsClicked, setIdsClicked] = useState<Set<AppVM["id"]>>(
    new Set<AppVM["id"]>(),
  );

  const handleRequestClick = (id: AppVM["id"]) => {
    setIdsClicked((prev) => prev.add(id));

    // TODO: Add api call to get referral id, compose url and open it
  };
  const handleResetClick = () => setIdsClicked(new Set<AppVM["id"]>());

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

  return (
    <Stack
      direction="column"
      className="h-full w-full flex justify-center items-center"
    >
      <Box className="w-full h-full p-6 max-w-[800px]">
        <DataGrid
          rows={apps}
          columns={getColumns(handleRequestClick, handleResetClick, idsClicked)}
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
        />
      </Box>
    </Stack>
  );
}
