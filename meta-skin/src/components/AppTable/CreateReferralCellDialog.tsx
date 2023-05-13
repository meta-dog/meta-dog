import { Dispatch, SetStateAction, useEffect, useState } from "react";

import {
  Cancel,
  Check,
  Link as LinkIcon,
  Person,
  Widgets,
} from "@mui/icons-material";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { AppVM } from "api";

import ActionConfirmDialog from "./ActionConfirmDialog";
import {
  extractReferral,
  extractUrls,
  getStoredAdvocateId,
  getUrlAndCopyToClipboard,
  storeAdvocateId,
  validateAdvocateId,
} from "./utils";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleAccept: () => void;
  app: AppVM | null;
}

export default function CreateReferralCellDialog({
  open,
  setOpen,
  handleAccept,
  app,
}: Props) {
  const { t } = useTranslation("appTableCreateReferralCellDialog");

  const [currentAdvocateId, setCurrentAdvocateId] = useState<string | null>(
    null,
  );
  const [advocateIdReadOnly, setAdvocateIdReadOnly] = useState(true);
  const [helperText, setHelperText] = useState("");

  useEffect(() => {
    setHelperText("");
    const initialAdvocateId = getStoredAdvocateId();
    setCurrentAdvocateId(initialAdvocateId);
    setAdvocateIdReadOnly(initialAdvocateId !== null);
  }, [open]);

  const errorText = t("toast.error.invalid-advocate-id");

  const handleAcceptClick = () => {
    if (currentAdvocateId === null) return;
    if (helperText !== "") return;
    if (!validateAdvocateId(currentAdvocateId)) {
      toast.error(errorText);
      setHelperText(errorText);
      return;
    }
    storeAdvocateId(currentAdvocateId);
    handleAccept();
  };

  const clearHelperTextIfValid = (nextAdvocateId: string) => {
    if (
      helperText !== "" &&
      nextAdvocateId !== null &&
      validateAdvocateId(nextAdvocateId)
    ) {
      setHelperText("");
    }
  };

  const setHelperTextIfInvalid = (nextAdvocateId: string | null) => {
    setHelperText(validateAdvocateId(nextAdvocateId) ? "" : errorText);
  };

  if (app === null) return null;
  const title = t("title");
  const validAdvocateId = validateAdvocateId(currentAdvocateId);
  const content = (
    <Stack className="gap-4 text-center" justifyContent="center">
      <Trans
        ns="appTableCreateReferralCellDialog"
        i18nKey="text"
        components={{
          appName: (
            <TextField
              value={app.name}
              sx={{
                "& input": { textAlign: "center" },
                margin: "auto",
                width: "100%",
              }}
              InputProps={{
                readOnly: true,
                startAdornment: <Widgets className="mr-4" />,
                endAdornment: <Check className="ml-4" color="secondary" />,
              }}
            />
          ),
          advocateId: (
            <TextField
              autoComplete="off"
              value={currentAdvocateId || ""}
              onPaste={(event) => {
                const text = event.clipboardData.getData("text");
                const urls = extractUrls(text);
                if (urls.length === 0) {
                  setCurrentAdvocateId(text);
                  const isTextAValidAdvocateId = validateAdvocateId(text);
                  if (!isTextAValidAdvocateId) {
                    setHelperText(errorText);
                    toast.error(t("toast.error.pasted-invalid-advocate-id"));
                  } else {
                    setHelperText("");
                  }
                  event.preventDefault();
                  return;
                }
                if (urls.length > 1) {
                  setCurrentAdvocateId(null);
                  setHelperText(errorText);
                  toast.error(t("toast.error.pasted-too-many-urls"));
                  event.preventDefault();
                  return;
                }
                const [url] = urls;
                const data = extractReferral(url);
                if (data === false) {
                  setCurrentAdvocateId(null);
                  setHelperText(errorText);
                  toast.error(t("toast.error.pasted-invalid-urls"));
                  event.preventDefault();
                  return;
                }
                const { advocateId } = data;
                setCurrentAdvocateId(advocateId);
                setHelperTextIfInvalid(advocateId);
                event.preventDefault();
              }}
              onChange={({ target }) => {
                const newAdvocateId = target.value;
                clearHelperTextIfValid(newAdvocateId);
                setCurrentAdvocateId(newAdvocateId);
              }}
              onBlur={() => setHelperTextIfInvalid(currentAdvocateId)}
              helperText={helperText}
              error={helperText !== ""}
              sx={{
                "& input": { textAlign: "center" },
                margin: "auto",
                width: "100%",
              }}
              InputProps={{
                readOnly: advocateIdReadOnly,
                startAdornment: <Person className="mr-4" />,
                endAdornment: validAdvocateId ? (
                  <Check className="ml-4" color="secondary" />
                ) : (
                  <Cancel className="ml-4" color="error" />
                ),
              }}
              placeholder={t("advocate-id.placeholder")}
            />
          ),
        }}
      />
      <Button
        variant="contained"
        color="secondary"
        className="w-auto"
        startIcon={<LinkIcon />}
        onClick={() => {
          getUrlAndCopyToClipboard("app", currentAdvocateId, app.id);
          toast.success(t("toast.openAndCopyToClipboard"));
        }}
        disabled={!validAdvocateId}
        aria-label={t("check-link.button.aria-label")}
      >
        <Typography>{t("check-link.text")}</Typography>
      </Button>
    </Stack>
  );
  return (
    <ActionConfirmDialog
      open={open}
      setOpen={setOpen}
      handleAccept={handleAcceptClick}
      title={title}
      content={content}
      disableAccept={!validAdvocateId}
    />
  );
}
