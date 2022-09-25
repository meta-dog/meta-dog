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
  title: string;
  text: string;
}

export default function ActionConfirmDialog({
  open,
  setOpen,
  handleAccept,
  title,
  text,
}: Props) {
  const { t: tCommon } = useTranslation("common");

  const handleClose = () => setOpen(false);
  const handleAcceptClick = () => {
    handleAccept();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle variant="h5" fontWeight={600} textAlign="center">
        {title}
      </DialogTitle>
      <DialogContent
        sx={{ paddingBottom: 0, maxWidth: "750px", margin: "auto" }}
      >
        <Typography variant="body1">{text}</Typography>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          className="flex w-full items-center justify-evenly py-4"
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
