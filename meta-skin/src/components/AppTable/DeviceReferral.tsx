import { Dispatch, SetStateAction, useEffect, useState } from "react";

import {
  Cancel,
  Check,
  Hail,
  Link as LinkIcon,
  Person,
  RecordVoiceOver,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { REGIONS, Region, RegionVM } from "api/viewModel";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { createDeviceReferral, readDeviceReferral, readRegions } from "api";

import {
  extractReferral,
  extractUrls,
  getStoredAdvocateId,
  getUrlAndCopyToClipboard,
  validateAdvocateId,
} from "./utils";

interface AdvocateIdTextFieldProps {
  helperText: string;
  setHelperText: Dispatch<SetStateAction<string>>;
  currentAdvocateId: string | null;
  setCurrentAdvocateId: Dispatch<SetStateAction<string | null>>;
  advocateIdReadOnly: boolean;
}

function AdvocateIdTextField({
  helperText,
  setHelperText,
  currentAdvocateId,
  setCurrentAdvocateId,
  advocateIdReadOnly,
}: AdvocateIdTextFieldProps) {
  const { t } = useTranslation("appTableCreateReferralCellDialog");

  const errorText = t("toast.error.invalid-advocate-id");
  const validAdvocateId = validateAdvocateId(currentAdvocateId);

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
  return (
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
  );
}

interface DialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface GetDialogProps extends DialogProps {
  handleAction: (region: Region) => void;
}

function GetDialog({ open, setOpen, handleAction }: GetDialogProps) {
  const { t } = useTranslation("appTableDeviceReferral");

  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [regions, setRegions] = useState<RegionVM[]>([]);

  useEffect(() => {
    setCurrentRegion(null);
    readRegions()
      .then(setRegions)
      .catch(() => {
        toast.error(t("regions.error"));
      })
      .finally(() => setCurrentRegion(null));
  }, [open, t]);

  const validRegion = currentRegion !== null;
  const isValid = validRegion;
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{ "& .MuiPaper-root": { width: "95vw", maxWidth: "650px" } }}
    >
      <DialogTitle textAlign="center">{t("dialog.get.title")}</DialogTitle>
      <DialogContent>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          className="gap-4"
        >
          <Select
            fullWidth
            onChange={({ target }) =>
              setCurrentRegion(target.value as Region | null)
            }
            error={!validRegion}
          >
            {regions.map(({ region }) => (
              <MenuItem key={region} value={region}>
                {t("region", { context: region })}
              </MenuItem>
            ))}
          </Select>
          <Typography className="pt-4">{t("dialog.get.subtitle")}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          className="flex w-full items-center justify-center pb-4"
        >
          <Button
            startIcon={<Hail />}
            variant="contained"
            color="secondary"
            disabled={!isValid}
            onClick={() => isValid && handleAction(currentRegion)}
            aria-label={t("button.get")}
          >
            <Typography variant="button">{t("button.get")}</Typography>
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

interface GiveDialogProps extends DialogProps {
  handleAction: (region: Region, advocateId: string) => void;
}

function GiveDialog({ open, setOpen, handleAction }: GiveDialogProps) {
  const { t } = useTranslation("appTableDeviceReferral");

  const [advocateIdReadOnly, setAdvocateIdReadOnly] = useState(true);
  const [helperText, setHelperText] = useState("");
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [currentAdvocateId, setCurrentAdvocateId] = useState<string | null>(
    getStoredAdvocateId(),
  );

  useEffect(() => {
    setHelperText("");
    setCurrentRegion(null);
    const initialAdvocateId = getStoredAdvocateId();
    setCurrentAdvocateId(initialAdvocateId);
    setAdvocateIdReadOnly(initialAdvocateId !== null);
  }, [open]);

  const validRegion = currentRegion !== null;
  const validAdvocateId = currentAdvocateId !== null;
  const isValid = validRegion && validAdvocateId;
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      sx={{ "& .MuiPaper-root": { width: "95vw", maxWidth: "650px" } }}
    >
      <DialogTitle textAlign="center">{t("dialog.give.title")}</DialogTitle>
      <DialogContent>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          className="gap-4"
        >
          <Select
            fullWidth
            onChange={({ target }) =>
              setCurrentRegion(target.value as Region | null)
            }
            error={!validRegion}
          >
            {REGIONS.map((region) => (
              <MenuItem key={region} value={region}>
                {t("region", { context: region })}
              </MenuItem>
            ))}
          </Select>
          <AdvocateIdTextField
            advocateIdReadOnly={advocateIdReadOnly}
            currentAdvocateId={currentAdvocateId}
            helperText={helperText}
            setCurrentAdvocateId={setCurrentAdvocateId}
            setHelperText={setHelperText}
          />
          <Typography className="pt-4">{t("dialog.give.subtitle")}</Typography>
          <Button
            variant="contained"
            color="secondary"
            className="w-full"
            startIcon={<LinkIcon />}
            onClick={() => {
              getUrlAndCopyToClipboard("device", currentAdvocateId);
              toast.success(t("toast.openAndCopyToClipboard"));
            }}
            disabled={!validAdvocateId}
            aria-label={t("check-link.button.aria-label")}
          >
            <Typography>{t("check-link.text")}</Typography>
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          className="flex w-full items-center justify-center pb-4"
        >
          <Button
            startIcon={<RecordVoiceOver />}
            variant="contained"
            color="secondary"
            disabled={!isValid}
            onClick={() =>
              isValid && handleAction(currentRegion, currentAdvocateId)
            }
            aria-label={t("button.give")}
          >
            <Typography variant="button">{t("button.give")}</Typography>
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default function DeviceReferral() {
  const { t } = useTranslation("appTableDeviceReferral");

  const [openGet, setOpenGet] = useState(false);
  const [openGive, setOpenGive] = useState(false);

  const handleGetClick = (region: Region) => {
    readDeviceReferral(region)
      .then((readDeviceReferralResponse) => {
        const { advocateId } = readDeviceReferralResponse;
        getUrlAndCopyToClipboard("device", advocateId);
        toast.success(t("toast.openAndCopyToClipboard"));
      })
      .catch((error) => {
        toast.error(t("toast.get.error", { context: error.message }));
      });
  };

  const handleGiveClick = (region: Region, advocateId: string) => {
    createDeviceReferral({ region, advocateId })
      .then(() => {
        toast.success(t("toast.give.success"));
      })
      .catch((error) => {
        toast.error(t("toast.give.error", { context: error.message }));
      });
  };

  return (
    <div className="w-full pt-6">
      <Paper className="w-full m-auto max-w-[800px] p-2" elevation={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="w-full p-2"
        >
          <Typography variant="h6" className="w-full">
            {t("title")}
          </Typography>
          <Stack
            direction="row"
            justifyContent="end"
            alignItems="center"
            className="w-full"
            gap={2}
          >
            <Button
              variant="contained"
              color="secondary"
              aria-label={t("button.get")}
              onClick={() => setOpenGet(true)}
              startIcon={<Hail />}
            >
              {t("button.get")}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              aria-label={t("button.give")}
              onClick={() => setOpenGive(true)}
              startIcon={<RecordVoiceOver />}
            >
              {t("button.give")}
            </Button>
          </Stack>
        </Stack>
      </Paper>
      <GetDialog
        open={openGet}
        setOpen={setOpenGet}
        handleAction={handleGetClick}
      />
      <GiveDialog
        open={openGive}
        setOpen={setOpenGive}
        handleAction={handleGiveClick}
      />
    </div>
  );
}
