import "react-i18next";

import { TranslationType } from "./translations";

declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: TranslationType;
  }
}
