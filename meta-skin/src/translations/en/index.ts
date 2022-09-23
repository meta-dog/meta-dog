import appTableCreateAppModal from "./AppTable/createAppModal.json";
import appTableCreateCell from "./AppTable/createCell.json";
import appTableReferralCell from "./AppTable/referralCell.json";
import appTableReferralHeader from "./AppTable/referralHeader.json";
import appTableTable from "./AppTable/table.json";
import appTableToolbar from "./AppTable/toolbar.json";
import appStateContext from "./appStateContext.json";
import common from "./common.json";
import footer from "./footer.json";
import header from "./header.json";
import helpModal from "./helpModal.json";
import languageSelector from "./languageSelector.json";

const translations = {
  appStateContext,
  appTableCreateAppModal,
  appTableCreateCell,
  appTableReferralCell,
  appTableReferralHeader,
  appTableToolbar,
  appTableTable,
  common,
  footer,
  header,
  helpModal,
  languageSelector,
};

type TranslationType = typeof translations;
interface Language {
  name: string;
  translations: TranslationType;
}

const language: Language = {
  name: "English",
  translations,
};

export default language;
export type { TranslationType, Language };
