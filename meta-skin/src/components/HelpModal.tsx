import { useEffect, useState } from "react";

import { CheckCircle, Close, Email, ThumbUpAlt } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
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
import { toast } from "react-toastify";

import { useAppStateContext } from "contexts";

import LanguageSelector from "./LanguageSelector";

function getHasAcceptedTerms() {
  return localStorage.getItem("accepted-terms") === "true";
}

export default function HelpModal() {
  const { openHelpModal, setOpenHelpModal } = useAppStateContext();

  const [hasAccepted, setHasAccepted] = useState(getHasAcceptedTerms());

  const { t } = useTranslation("helpModal");

  useEffect(() => {
    if (!hasAccepted) {
      setOpenHelpModal(true);
    }
  }, [hasAccepted, setOpenHelpModal]);

  const handleAcceptTerms = () => {
    localStorage.setItem("accepted-terms", "true");
    setHasAccepted(true);
    setOpenHelpModal(false);
  };

  const handleCloseAttempt = () => {
    if (!getHasAcceptedTerms()) {
      toast.info(t("toast.must-accept"));
      return;
    }
    setOpenHelpModal(false);
  };

  return (
    <Dialog
      open={openHelpModal}
      onClose={handleCloseAttempt}
      sx={{ "& .MuiPaper-root": { width: "95vw", maxWidth: "850px" } }}
    >
      <DialogTitle>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems="center"
          gap={2}
        >
          <LanguageSelector sx={{ textAlign: "center" }} />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="w-full"
          >
            <Typography variant="h5" fontWeight={600} textAlign="center">
              {t("title")}
            </Typography>
            {hasAccepted && (
              <IconButton
                onClick={handleCloseAttempt}
                aria-label={t("button.close.aria-label")}
              >
                <Close />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent
        sx={{ paddingBottom: 0, maxWidth: "750px", margin: "auto" }}
      >
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="start"
          className="gap-2 w-full overflow-auto"
        >
          <Trans
            ns="helpModal"
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
      <DialogActions>
        <Stack
          direction="row"
          className="flex w-full items-center justify-center py-4"
        >
          <Button
            startIcon={hasAccepted ? <CheckCircle /> : <ThumbUpAlt />}
            variant="contained"
            color="secondary"
            onClick={handleAcceptTerms}
            disabled={getHasAcceptedTerms()}
            aria-label="accepted terms"
          >
            <Typography variant="button">
              {hasAccepted ? t("button.accepted") : t("button.pending")}
            </Typography>
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
