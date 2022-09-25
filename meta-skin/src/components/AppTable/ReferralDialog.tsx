import { Dispatch, SetStateAction } from "react";

import { useTranslation } from "react-i18next";

import ActionConfirmDialog from "./ActionConfirmDialog";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleAccept: () => void;
}

export default function ReferralDialog({ open, setOpen, handleAccept }: Props) {
  const { t } = useTranslation("appTableReferralDialog");

  const title = t("title");
  const text = t("text");

  return (
    <ActionConfirmDialog
      open={open}
      setOpen={setOpen}
      handleAccept={handleAccept}
      title={title}
      text={text}
    />
  );
}
