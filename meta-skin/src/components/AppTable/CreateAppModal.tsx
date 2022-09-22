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
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

import { CreateReferralVM, createReferral } from "api";
import { useAppStateContext } from "contexts";

import { extractReferral, extractUrls } from "./utils";

const LIMIT = 10 as const;
const INITIAL_TEXT_FIELD_TEXT = `Paste here (${LIMIT} MAX)`;
const INITIAL_VALID_URL = null;

export default function CreateAppModal() {
  const { openCreateModal, setOpenCreateModal } = useAppStateContext();

  const [textFieldText, setTextFieldText] = useState(INITIAL_TEXT_FIELD_TEXT);
  const [validUrl, setValidUrl] = useState<null | false | CreateReferralVM[]>(
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

  const validateText = (text: string) => {
    const urls = extractUrls(text);
    if (urls.length === 0) {
      toast.warn("No App URLs were found in the pasted text!");
      setTextFieldText(INITIAL_TEXT_FIELD_TEXT);
      return;
    }
    if (urls.length >= LIMIT) {
      toast.error(
        `The limit of App Referrals to be pasted at once is ${LIMIT}`,
      );
      setTextFieldText(INITIAL_TEXT_FIELD_TEXT);
      return;
    }
    const newValidUrls = urls.map(extractReferral);
    const singular = newValidUrls.length === 1;
    if (newValidUrls.some((isValid) => isValid === false)) {
      let message =
        "At least one of the provided App referral link is invalid. Please review them and paste them again.";
      let newTextFieldText = "Invalid links";
      if (singular) {
        message =
          "The provided App referral link is invalid. Please review it and paste it again.";
        newTextFieldText = "Invalid link";
      }
      setTextFieldText(newTextFieldText);
      toast.error(message, { icon: "😥" });
      setValidUrl(false);
      return;
    }
    const uniqueAdvocateIds = new Set<string>();
    const uniqueAppIds = new Set<string>();
    newValidUrls.forEach((createReferralVM) => {
      const { advocateId, appId } = createReferralVM as CreateReferralVM;
      uniqueAdvocateIds.add(advocateId);
      uniqueAppIds.add(appId);
    });

    const uniqueAdvocateIdsArray = Array.from(uniqueAdvocateIds);
    if (uniqueAdvocateIdsArray.length > 1) {
      toast.error("You can only send referral links from one user");
      setValidUrl(false);
      return;
    }
    const uniqueAppIdsArray = Array.from(uniqueAppIds);
    if (uniqueAppIdsArray.length < newValidUrls.length) {
      toast.error("At least one of the Referral App links is repeated");
      setValidUrl(false);
      return;
    }

    const pastedAdvocateId = uniqueAdvocateIdsArray[0];
    const savedAdvocateId = localStorage.getItem("advocate-id");
    if (savedAdvocateId !== null && savedAdvocateId !== pastedAdvocateId) {
      toast.error(
        `You sent a link from the user "${savedAdvocateId}" in the past, but you pasted a link from the user "${pastedAdvocateId}" now. Only one user is allowed.`,
      );
      setValidUrl(false);
      return;
    }

    let message = `All of the ${newValidUrls.length} detected App referral links seem valid! Please click on the button to try to save them.`;
    let newTextFieldText = `${newValidUrls.length} Valid links`;
    if (singular) {
      message =
        "The provided App referral link seems valid! Please click on the button to try to save it.";
      newTextFieldText = "Valid link";
    }
    toast.info(message);
    setTextFieldText(newTextFieldText);
    if (addButtonRef.current) {
      // StrictMode React autoFocus fix: https://github.com/mui/material-ui/issues/33004
      setTimeout(() => {
        if (openCreateModal && addButtonRef.current) {
          addButtonRef.current.focus();
        }
      }, 0);
    }
    setValidUrl(newValidUrls as CreateReferralVM[]);
  };

  const handlePaste: ClipboardEventHandler<HTMLDivElement> = ({
    clipboardData,
  }) => {
    const clipboardText = clipboardData.getData("text");
    validateText(clipboardText);
  };

  const handleSaveClick = () => {
    if (validUrl === null || validUrl === false) return;
    const singular = validUrl.length === 1;
    const promises = validUrl.map(createReferral);
    Promise.allSettled(promises).then((results) => {
      const fulfilled = results.filter(
        (result) => result.status === "fulfilled",
      );
      const rejected = results.filter((result) => result.status === "rejected");
      if (rejected.length === 0) {
        let message = `All of the ${validUrl.length} App referrals were created successfully!`;
        if (singular) {
          message = "The App referral was created successfully!";
        }
        toast.success(message, { icon: "🎉" });
        setValidUrl(INITIAL_VALID_URL);
        setTextFieldText(INITIAL_TEXT_FIELD_TEXT);
        localStorage.setItem("advocate-id", validUrl[0].advocateId);
        return;
      }
      if (fulfilled.length === 0) {
        let message = `None of the ${validUrl.length} App referral were created successfully`;
        if (singular) {
          message = "The App referral could not be created";
        }
        toast.error(message, { icon: "🥺" });
        setValidUrl(false);
        setTextFieldText(INITIAL_TEXT_FIELD_TEXT);
        localStorage.setItem("advocate-id", validUrl[0].advocateId);
        return;
      }
      const message = `${fulfilled.length} App referrals were created successfully, but ${rejected.length} could not be created`;
      toast.error(message, { icon: "🤔" });
      setValidUrl(INITIAL_VALID_URL);
      setTextFieldText(INITIAL_TEXT_FIELD_TEXT);
      localStorage.setItem("advocate-id", validUrl[0].advocateId);
    });
  };

  return (
    <Dialog
      open={openCreateModal}
      onClose={() => setOpenCreateModal(false)}
      sx={{ "& .MuiPaper-root": { width: "95vw", maxWidth: "650px" } }}
    >
      <DialogTitle textAlign="center">Add your referral</DialogTitle>
      <DialogContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          className="gap-4"
        >
          <IconButton
            onClick={() => navigator.clipboard.readText().then(validateText)}
          >
            <ContentPasteGo />
          </IconButton>
          <TextField
            inputRef={inputRef}
            value=""
            sx={{
              "& input": { textAlign: "center", caretColor: "transparent" },
            }}
            fullWidth
            onPaste={handlePaste}
            placeholder={textFieldText}
            type="url"
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
