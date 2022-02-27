import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./langs/en.json";
import translationFR from "./langs/fr.json";
import { NativeModules, Platform } from "react-native";

const resources = {
  en: {
    translation: translationEN,
  },
  fr: {
    translation: translationFR,
  },
};
const locale =
  Platform.OS === "ios"
    ? NativeModules.SettingsManager.settings.AppleLocale
    : NativeModules.I18nManager.localeIdentifier;
i18n

  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    compatibilityJSON: "v3",
    lng: locale.substring(0, 2),
    fallbackLng: "en", // use en if detected lng is not available

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
