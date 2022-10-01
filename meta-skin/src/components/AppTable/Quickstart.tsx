import { useState } from "react";

import { Add, Close, Hail, RecordVoiceOver } from "@mui/icons-material";
import {
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { GridSearchIcon } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

import { getStoredBoolean, storeBoolean } from "./utils";

export default function Quickstart() {
  const [visible, setVisible] = useState(getStoredBoolean("quickstart-on"));

  const { t } = useTranslation("appTableQuickstart");

  if (!visible) return <div />;
  return (
    <div className="w-full pt-6">
      <Paper className="w-full m-auto max-w-[800px] p-2" elevation={2}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          className="w-full"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="w-full"
          >
            <Typography variant="h6" className="pl-4">{t("title")}</Typography>
            <Tooltip title={t("tooltip")} open arrow placement="left">
              <IconButton
                aria-label={t("button.aria-label")}
                onClick={() => {
                  storeBoolean("quickstart-on", false);
                  setVisible(false);
                }}
              >
                <Close />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-around"
            gap={1}
            className="w-full"
          >
            <Stack direction="column">
              <Typography variant="h6" textAlign="center">
                {t("table-usage.title")}
              </Typography>
              <List>
                <ListItem
                  alignItems="center"
                  className="flex flex-row gap-2 w-full"
                  sx={{ justifyContent: "center" }}
                >
                  <Typography>{t("table-usage.step-1")}</Typography>
                  <GridSearchIcon fontSize="small" />
                </ListItem>
                <ListItem className="flex flex-row">
                  <Hail color="secondary" fontSize="small" />
                  <Typography>{t("table-usage.step-2")}</Typography>
                </ListItem>
                <ListItem className="flex flex-row">
                  <RecordVoiceOver color="secondary" fontSize="small" />
                  <Typography>{t("table-usage.step-3")}</Typography>
                </ListItem>
              </List>
            </Stack>
            <Stack direction="column">
              <Typography variant="h6" textAlign="center">
                {t("add-links.title")}
              </Typography>
              <List>
                <ListItem className="flex flex-row gap-1">
                  <Typography>{t("add-links.step-1")}</Typography>
                  <Add color="secondary" fontSize="small" />
                </ListItem>
                <ListItem className="flex flex-row gap-1">
                  <Typography>{t("add-links.step-2")}</Typography>
                </ListItem>
                <ListItem className="flex flex-row gap-1">
                  <Typography>{t("add-links.step-3")}</Typography>
                </ListItem>
              </List>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </div>
  );
}
