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
import { useTranslation } from "react-i18next";
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

export default function CreateAppDialog() {
  const { openCreateDialog, setOpenCreateDialog } = useAppStateContext();

  const { t } = useTranslation("appTableCreateAppDialog");

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
      if (openCreateDialog && inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [openCreateDialog]);

  let validationIcon = <Verified color="success" />;
  if (validUrls.length === 0) validationIcon = <Pending />;
  if (hasError) validationIcon = <Error color="error" />;
  const disabled = validUrls.length === 0;

  const validateText = (text: string) => {
    const urls = extractUrls(text);
    if (urls.length === 0) {
      toast.error(t("toast.error.no-urls-found"));
      setValidUrls([]);
      setHasError(true);
      return;
    }
    if (urls.length > LIMIT) {
      toast.error(t("toast.error.above-limit", { limit: LIMIT }));
      setValidUrls([]);
      setHasError(true);
      return;
    }
    const newValidUrls = urls.map(extractReferral);
    const lenNewValidUrls = newValidUrls.length;
    if (newValidUrls.some((isValid) => isValid === false)) {
      setHasError(true);
      toast.error(t("toast.error.invalid-url", { count: lenNewValidUrls }));
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
      toast.error(t("toast.error.multiple-users"));
      setHasError(true);
      setValidUrls([]);
      return;
    }
    const uniqueAppIdsArray = Array.from(uniqueAppIds);
    if (uniqueAppIdsArray.length < newValidUrls.length) {
      // TODO: Prune repeated and continue
      toast.error(t("toast.error.repeated-urls"));
      setHasError(true);
      setValidUrls([]);
      return;
    }

    const pastedAdvocateId = uniqueAdvocateIdsArray[0];
    const savedAdvocateId = getSavedAdvocateId();
    if (savedAdvocateId !== null && savedAdvocateId !== pastedAdvocateId) {
      toast.error(
        t("toast.error.duplicated-user", { savedAdvocateId, pastedAdvocateId }),
      );
      setHasError(true);
      setValidUrls([]);
      return;
    }

    const repeatedAppIds = getSavedAppIds("saved-app-ids").filter(
      (savedAppId) => uniqueAppIdsArray.includes(savedAppId),
    );

    if (repeatedAppIds.length > 0) {
      const repeatedAppsText = repeatedAppIds.reduce(
        (prev, appId, idx) => (idx === 0 ? appId : `${prev}, ${appId}`),
        "",
      );
      toast.warn(
        t("toast.warn.repeated-saved-apps", {
          repeatedAppsText,
        }),
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

    toast.info(t("toast.info.all_valid", { count: lenNewValidUrls }));
    setHasError(false);
    if (addButtonRef.current) {
      // StrictMode React autoFocus fix: https://github.com/mui/material-ui/issues/33004
      setTimeout(() => {
        if (openCreateDialog && addButtonRef.current) {
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
    const promises = validUrls.map(createReferral);
    Promise.allSettled(promises).then((results) => {
      saveAdvocateId(validUrls[0].advocateId);
      const fulfilled = results.filter(
        (result) => result.status === "fulfilled",
      );
      const rejected = results.filter((result) => result.status === "rejected");
      if (fulfilled.length === 0) {
        toast.error(t("toast.error.all-rejected", { count: rejected.length }), {
          icon: "🥺",
        });
        setHasError(true);
        return;
      }
      const fulfilledAppIds = (
        fulfilled as PromiseFulfilledResult<string>[]
      ).map(({ value }) => value);
      appendSavedAppIds("saved-app-ids", fulfilledAppIds);
      if (rejected.length === 0) {
        toast.success(t("toast.info.all-successful", { count: numValidUrls }), {
          icon: "🎉",
        });
        setValidUrls([]);
        setHasError(false);
        return;
      }
      const numFulfilled = fulfilled.length;
      const numRejected = rejected.length;
      toast.warn(
        t("toast.warn.partial-reject", { numFulfilled, numRejected }),
        { icon: "🤔" },
      );
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

  const context = currAdvocateId === null ? "" : "with-advocate";
  const title = t("title", { context, currAdvocateId });

  return (
    <Dialog
      open={openCreateDialog}
      onClose={() => setOpenCreateDialog(false)}
      sx={{ "& .MuiPaper-root": { width: "95vw", maxWidth: "650px" } }}
    >
      <DialogTitle textAlign="center">{title}</DialogTitle>
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
            placeholder={t("textfield.placeholder", {
              context: String(hasError),
              limit: LIMIT,
            })}
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
            aria-label={t("button.save.aria-label")}
          >
            <Typography variant="button">{t("button.save.label")}</Typography>
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
