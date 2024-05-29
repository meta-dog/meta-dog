import { Email } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { Trans, useTranslation } from "react-i18next";

import LanguageSelector from "./LanguageSelector";

export default function HelpDialog() {
  const { t } = useTranslation("maintenanceDialog");

  return (
    <Dialog
      open
      onClose={() => {}}
      sx={{ "& .MuiPaper-root": { width: "95vw", maxWidth: "850px" } }}
    >
      <DialogTitle>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          gap={2}
        >
          <LanguageSelector />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="w-full"
          >
            <Typography variant="h5" fontWeight={600} textAlign="center">
              {t("title")}
            </Typography>
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent
        sx={{ paddingBottom: 4, maxWidth: "750px", margin: "auto" }}
      >
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="start"
          className="gap-2 w-full overflow-auto"
        >
          <Trans
            ns="maintenanceDialog"
            i18nKey="text"
            components={{
              bold: <strong />,
              h6: <Typography variant="h6" />,
              ul: <List />,
              li: <ListItem />,
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              a: <Link />,
              button: <IconButton />,
              email: <Email />,
            }}
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
