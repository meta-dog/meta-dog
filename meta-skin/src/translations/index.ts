import en, { TranslationType } from "./en";
import es from "./es";

const resources = {
  es: es.translations,
  en: en.translations,
} as const;

type AvailableLanguages = keyof typeof resources;

export const fallbackLng: AvailableLanguages[] = ["en", "es"];

type LanguageNameMap = {
  [key in AvailableLanguages]: string;
};

export const languageNameMap: LanguageNameMap = {
  en: en.name,
  es: es.name,
};

export const availableLanguages: AvailableLanguages[] = Object.keys(
  resources,
) as AvailableLanguages[];

export { resources };
export type { TranslationType, AvailableLanguages };
