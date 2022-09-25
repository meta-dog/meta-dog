import { Dispatch, SetStateAction } from "react";

import { Cancel, CheckCircle } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleAccept: () => void;
}

export default function ReferralModal({ open, setOpen, handleAccept }: Props) {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("appTableReferralDialog");

  const handleClose = () => setOpen(false);
  const handleAcceptClick = () => {
    handleAccept();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle variant="h5" fontWeight={600} textAlign="center">
        {t("title")}
      </DialogTitle>
      <DialogContent
        sx={{ paddingBottom: 0, maxWidth: "750px", margin: "auto" }}
      >
        <Typography variant="body1">{t("text")}</Typography>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          className="flex w-full items-center justify-between py-4"
        >
          <Button
            startIcon={<Cancel />}
            variant="contained"
            color="primary"
            onClick={handleClose}
            aria-label="accepted terms"
          >
            <Typography variant="button">{tCommon("button.cancel")}</Typography>
          </Button>
          <Button
            startIcon={<CheckCircle />}
            variant="contained"
            color="secondary"
            onClick={handleAcceptClick}
            aria-label="accepted terms"
          >
            <Typography variant="button">
              {tCommon("button.continue")}
            </Typography>
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
