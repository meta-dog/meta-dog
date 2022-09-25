import { Dispatch, SetStateAction, useState } from "react";

import { Cancel, Check, Person, Widgets } from "@mui/icons-material";
import { Stack, TextField } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";

import { AppVM } from "api";

import ActionConfirmDialog from "./ActionConfirmDialog";
import { storeAdvocateId } from "./utils";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleAccept: () => void;
  app: AppVM | null;
  advocateId: string | null;
}

export default function CreateReferralCellDialog({
  open,
  setOpen,
  handleAccept,
  app,
  advocateId,
}: Props) {
  const { t } = useTranslation("appTableCreateReferralCellDialog");
  const [currentAdvocateId, setCurrentAdvocateId] = useState(advocateId);
  const handleAcceptClick = () => {
    if (currentAdvocateId === null) return;
    storeAdvocateId(currentAdvocateId);
    handleAccept();
  };

  if (app === null) return null;
  const title = t("title");
  const disableAdvocateTextField = advocateId !== null;
  const validAdvocateId = currentAdvocateId !== null;
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
              value={currentAdvocateId}
              onChange={({ target }) => setCurrentAdvocateId(target.value)}
              sx={{
                "& input": { textAlign: "center" },
                margin: "auto",
                width: "100%",
              }}
              InputProps={{
                readOnly: disableAdvocateTextField,
                startAdornment: <Person className="mr-4" />,
                endAdornment: validAdvocateId ? (
                  <Check className="ml-4" color="secondary" />
                ) : (
                  <Cancel className="ml-4" color="error" />
                ),
              }}
            />
          ),
        }}
      />
    </Stack>
  );
  return (
    <ActionConfirmDialog
      open={open}
      setOpen={setOpen}
      handleAccept={handleAcceptClick}
      title={title}
      content={content}
      disableAccept={currentAdvocateId === null}
    />
  );
}
