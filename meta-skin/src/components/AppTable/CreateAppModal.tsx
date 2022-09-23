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
import { toast } from "react-toastify";

import { CreateReferralVM, createReferral } from "api";
import { useAppStateContext } from "contexts";

import {
  appendSavedAppIds,
  extractReferral,
  extractUrls,
  getSavedAdvocateId,
  getSavedAppIds,
  saveAdvocateId,
} from "./utils";

const LIMIT = 10 as const;
const INITIAL_TEXT_FIELD_TEXT = `Paste here (${LIMIT} MAX)`;

export default function CreateAppModal() {
  const { openCreateModal, setOpenCreateModal } = useAppStateContext();

  const [currAdvocateId, setCurrAdvocateId] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [validUrls, setValidUrls] = useState<CreateReferralVM[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setCurrAdvocateId(getSavedAdvocateId());
    setHasError(false);
    setValidUrls([]);

    // StrictMode React autoFocus fix: https://github.com/mui/material-ui/issues/33004
    const timeout = setTimeout(() => {
      if (openCreateModal && inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [openCreateModal]);

  let validationIcon = <Verified color="success" />;
  if (validUrls.length === 0) validationIcon = <Pending />;
  if (hasError) validationIcon = <Error color="error" />;
  const disabled = validUrls.length === 0;

  const validateText = (text: string) => {
    const urls = extractUrls(text);
    if (urls.length === 0) {
      toast.warn("No App URLs were found in the pasted text!");
      setValidUrls([]);
      setHasError(true);
      return;
    }
    if (urls.length >= LIMIT) {
      toast.error(
        `The limit of App Referrals to be pasted at once is ${LIMIT}`,
      );
      setValidUrls([]);
      setHasError(true);
      return;
    }
    const newValidUrls = urls.map(extractReferral);
    const singular = newValidUrls.length === 1;
    if (newValidUrls.some((isValid) => isValid === false)) {
      let message =
        "At least one of the provided App referral link is invalid. Please review them and paste them again.";
      if (singular) {
        message =
          "The provided App referral link is invalid. Please review it and paste it again.";
      }
      setHasError(true);
      toast.error(message, { icon: "😥" });
      setValidUrls([]);
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
      setHasError(true);
      setValidUrls([]);
      return;
    }
    const uniqueAppIdsArray = Array.from(uniqueAppIds);
    if (uniqueAppIdsArray.length < newValidUrls.length) {
      toast.error("At least one of the Referral App links is repeated");
      setHasError(true);
      setValidUrls([]);
      return;
    }

    const pastedAdvocateId = uniqueAdvocateIdsArray[0];
    const savedAdvocateId = getSavedAdvocateId();
    if (savedAdvocateId !== null && savedAdvocateId !== pastedAdvocateId) {
      toast.error(
        `You sent a link from the user "${savedAdvocateId}" in the past, but you pasted a link from the user "${pastedAdvocateId}" now. Only one user is allowed.`,
      );
      setHasError(true);
      setValidUrls([]);
      return;
    }

    const repeatedAppIds = getSavedAppIds("saved-app-ids").filter(
      (savedAppId) => uniqueAppIdsArray.includes(savedAppId),
    );

    if (repeatedAppIds.length > 0) {
      toast.warn(
        `You have already saved the Apps: "${repeatedAppIds.reduce(
          (prev, appId, idx) => (idx === 0 ? appId : `${prev}, ${appId}`),
          "",
        )}" in the past, but you pasted links that included them again, and have been removed.`,
      );
      const nonRepeatedAppIds = uniqueAppIdsArray.filter(
        (appId) => !repeatedAppIds.includes(appId),
      );
      if (nonRepeatedAppIds.length === 0) {
        setValidUrls([]);
        setHasError(true);
      } else {
        setValidUrls(
          nonRepeatedAppIds.map((appId) => ({
            advocateId: pastedAdvocateId,
            appId,
          })),
        );
        setHasError(false);
      }
      return;
    }

    let message = `All of the ${newValidUrls.length} detected App referral links seem valid! Please click on the button to try to save them.`;
    if (singular) {
      message =
        "The provided App referral link seems valid! Please click on the button to try to save it.";
    }
    toast.info(message);
    setHasError(false);
    if (addButtonRef.current) {
      // StrictMode React autoFocus fix: https://github.com/mui/material-ui/issues/33004
      setTimeout(() => {
        if (openCreateModal && addButtonRef.current) {
          addButtonRef.current.focus();
        }
      }, 0);
    }
    const createReferralVM = newValidUrls as CreateReferralVM[];
    setValidUrls(createReferralVM);
    setCurrAdvocateId(pastedAdvocateId);
  };

  const handlePaste: ClipboardEventHandler<HTMLDivElement> = ({
    clipboardData,
  }) => {
    const clipboardText = clipboardData.getData("text");
    validateText(clipboardText);
  };

  const handleSaveClick = () => {
    const numValidUrls = validUrls.length;
    if (numValidUrls === 0) return;
    const singular = numValidUrls === 1;
    const promises = validUrls.map(createReferral);
    Promise.allSettled(promises).then((results) => {
      saveAdvocateId(validUrls[0].advocateId);
      const fulfilled = results.filter(
        (result) => result.status === "fulfilled",
      );
      const rejected = results.filter((result) => result.status === "rejected");
      if (fulfilled.length === 0) {
        let message = `None of the ${numValidUrls} App referral were created successfully. Please review them and try again`;
        if (singular) {
          message =
            "The App referral could not be created. Please review it and try again.";
        }
        toast.error(message, { icon: "🥺" });
        setHasError(true);
        return;
      }
      const fulfilledAppIds = (
        fulfilled as PromiseFulfilledResult<string>[]
      ).map(({ value }) => value);
      appendSavedAppIds("saved-app-ids", fulfilledAppIds);
      if (rejected.length === 0) {
        let message = `All of the ${validUrls.length} App referrals were created successfully!`;
        if (singular) {
          message = "The App referral was created successfully!";
        }
        toast.success(message, { icon: "🎉" });
        setValidUrls([]);
        setHasError(false);
        return;
      }
      const message = `${fulfilled.length} App referrals were created successfully, but ${rejected.length} could not be created. Please review them and try again`;
      toast.error(message, { icon: "🤔" });
      setValidUrls((prevValidUrls) =>
        prevValidUrls.filter(({ appId }) => !fulfilledAppIds.includes(appId)),
      );
      setHasError(false);
    });
  };

  const value = validUrls.reduce(
    (prev, { appId }, idx) => (idx === 0 ? appId : `${prev}\r\n${appId}`),
    "",
  );

  return (
    <Dialog
      open={openCreateModal}
      onClose={() => setOpenCreateModal(false)}
      sx={{ "& .MuiPaper-root": { width: "95vw", maxWidth: "650px" } }}
    >
      <DialogTitle textAlign="center">
        Add your link(s)
        {currAdvocateId === null ? "" : `: ${currAdvocateId}`}
      </DialogTitle>
      <DialogContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          className="gap-4"
        >
          <ContentPasteGo />
          <TextField
            inputRef={inputRef}
            value={value}
            sx={{
              "& textarea": { textAlign: "center", caretColor: "transparent" },
            }}
            fullWidth
            onPaste={handlePaste}
            placeholder={
              hasError ? "Please try again" : INITIAL_TEXT_FIELD_TEXT
            }
            type="url"
            multiline
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
            aria-label="save"
          >
            <Typography variant="button">Save</Typography>
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
