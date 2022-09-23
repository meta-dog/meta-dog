import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { fallbackLng, resources } from "./translations";

i18n.use(initReactI18next).use(LanguageDetector).init({
  resources,
  defaultNS: "common",
  fallbackLng,
});
