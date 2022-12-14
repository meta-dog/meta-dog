import { useTranslation } from "react-i18next";

import HeaderConfirmRendererRenderer from "./HeaderConfirmRenderer";

export default function ReferralHeaderRenderer(
  name: string,
  handleDialogChangeOn: (newOn: boolean) => void,
) {
  const { t } = useTranslation("appTableReferralHeader");

  const titleOn = t("tooltip.deactivate-dialog");
  const titleOff = t("tooltip.activate-dialog");

  return HeaderConfirmRendererRenderer(
    name,
    "referral-dialog-on",
    handleDialogChangeOn,
    titleOn,
    titleOff,
  );
}
