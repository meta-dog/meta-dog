import { Language, TranslationType } from "../en";
import appTableCreateAppDialog from "./AppTable/createAppDialog.json";
import appTableCreateCell from "./AppTable/createCell.json";
import appTableCreateReferralCellDialog from "./AppTable/createReferralCellDialog.json";
import appTableCreateReferralHeader from "./AppTable/createReferralHeader.json";
import appTableQuickstart from "./AppTable/quickstart.json";
import appTableReferralCell from "./AppTable/referralCell.json";
import appTableReferralDialog from "./AppTable/referralDialog.json";
import appTableReferralHeader from "./AppTable/referralHeader.json";
import appTableTable from "./AppTable/table.json";
import appTableToolbar from "./AppTable/toolbar.json";
import appStateContext from "./appStateContext.json";
import common from "./common.json";
import footer from "./footer.json";
import header from "./header.json";
import helpDialog from "./helpDialog.json";
import languageSelector from "./languageSelector.json";

const translations: TranslationType = {
  appStateContext,
  appTableCreateAppDialog,
  appTableCreateCell,
  appTableCreateReferralCellDialog,
  appTableCreateReferralHeader,
  appTableTable,
  appTableReferralCell,
  appTableReferralDialog,
  appTableReferralHeader,
  appTableToolbar,
  appTableQuickstart,
  common,
  footer,
  header,
  helpDialog,
  languageSelector,
};

const language: Language = {
  name: "Spanish",
  translations,
};

export default language;
export type { Language };
