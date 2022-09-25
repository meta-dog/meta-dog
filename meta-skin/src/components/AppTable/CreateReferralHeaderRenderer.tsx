import { useTranslation } from "react-i18next";

import HeaderConfirmRendererRenderer from "./HeaderConfirmRenderer";

export default function CreateReferralHeaderRenderer(
  name: string,
  handleDialogChangeOn: (newOn: boolean) => void,
) {
  const { t } = useTranslation("appTableCreateReferralHeader");

  const titleOn = t("tooltip.deactivate-dialog");
  const titleOff = t("tooltip.activate-dialog");

  return HeaderConfirmRendererRenderer(
    name,
    "create-referral-dialog-on",
    handleDialogChangeOn,
    titleOn,
    titleOff,
  );
}
