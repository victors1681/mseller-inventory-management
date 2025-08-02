import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import en from "../locales/en.json";
import es from "../locales/es.json";

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.getLocales()[0]?.languageCode || "en", // Default to device language or English
  fallbackLng: "en",

  interpolation: {
    escapeValue: false, // React already does escaping
  },

  // Cache translations
  saveMissing: true,

  // Debug mode (disable in production)
  debug: __DEV__,

  // React options
  react: {
    useSuspense: false,
  },
});

export default i18n;
