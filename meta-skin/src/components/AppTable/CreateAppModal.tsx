import { ClipboardEventHandler, useEffect, useRef, useState } from "react";

import {
  Add,
  ContentPasteGo,
  Error,
  Pending,
  Verified,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";

import { CreateReferralVM, createReferral } from "api";
import { useAppStateContext } from "contexts";

import validateReferralUrl from "./utils";

const INITIAL_TEXT_FIELD_TEXT = "Paste your App referral link here";
const INITIAL_VALID_URL = null;

export default function CreateAppModal() {
  const { openCreateModal, setOpenCreateModal } = useAppStateContext();

  const [textFieldText, setTextFieldText] = useState(INITIAL_TEXT_FIELD_TEXT);
  const [validUrl, setValidUrl] = useState<null | false | CreateReferralVM>(
    INITIAL_VALID_URL,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<any>(null);

  useEffect(() => {
    setTextFieldText(INITIAL_TEXT_FIELD_TEXT);
    setValidUrl(INITIAL_VALID_URL);

    // StrictMode React autoFocus fix: https://github.com/mui/material-ui/issues/33004
    const timeout = setTimeout(() => {
      if (openCreateModal && inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [openCreateModal]);

  let validationIcon = <Verified color="success" />;
  if (validUrl === null) validationIcon = <Pending />;
  if (validUrl === false) validationIcon = <Error color="error" />;
  const disabled = validUrl === null || validUrl === false;

  const handlePaste: ClipboardEventHandler<HTMLDivElement> = ({
    clipboardData,
  }) => {
    const url = clipboardData.getData("text");
    const newValidUrl = validateReferralUrl(url);
    if (newValidUrl === false) {
      toast.error(
        "The provided App referral link is invalid. Please review it and paste it again.",
        { icon: "😥" },
      );
      setTextFieldText("Invalid App Referral link");
    } else {
      toast.info(
        "The provided App referral link seems valid! Please click on the button to try to save it.",
      );
      setTextFieldText("Valid App Referral link");
      if (addButtonRef.current) {
        // StrictMode React autoFocus fix: https://github.com/mui/material-ui/issues/33004
        setTimeout(() => {
          if (openCreateModal && addButtonRef.current) {
            addButtonRef.current.focus();
          }
        }, 0);
      }
    }
    setValidUrl(newValidUrl);
  };

  const handleSaveClick = () => {
    if (validUrl === null || validUrl === false) return;
    createReferral(validUrl)
      .then(() => {
        toast.success("The App referral was created successfully!", {
          icon: "🎉",
        });
        setValidUrl(INITIAL_VALID_URL);
        setTextFieldText("You can paste more App referral links");
      })
      .catch((code) => {
        if (code === StatusCodes.CONFLICT) {
          toast.error("This App referral is already registered", {
            icon: "🤔",
          });
          setValidUrl(false);
          setTextFieldText(INITIAL_TEXT_FIELD_TEXT);
        }
        if (code === StatusCodes.NOT_FOUND) {
          toast.error("The App link does not lead to a valid referral", {
            icon: "🥺",
          });
          setValidUrl(false);
          setTextFieldText(INITIAL_TEXT_FIELD_TEXT);
        }
      });
  };

  return (
    <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
      <DialogTitle textAlign="center">Add your referral</DialogTitle>
      <DialogContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          className="gap-4 min-w-[500px]"
        >
          <ContentPasteGo />
          <TextField
            inputRef={inputRef}
            value=""
            sx={{ "& input": { textAlign: "center" } }}
            fullWidth
            InputProps={{ readOnly: true }}
            onPaste={handlePaste}
            placeholder={textFieldText}
          />
          {validationIcon}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          className="flex w-full items-center justify-center pb-4"
        >
          <Button
            ref={addButtonRef}
            startIcon={<Add />}
            variant="contained"
            color="secondary"
            disabled={disabled}
            onClick={handleSaveClick}
          >
            <Typography variant="button">Save</Typography>
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
