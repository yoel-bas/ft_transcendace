import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import EnLang  from "./public/locales/en/translation.json";
import FrLang  from "./public/locales/fr/translation.json";
import EsLang  from "./public/locales/es/translation.json";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: EnLang,
      },
      fr: {
        translation: FrLang,
      },
      es: {
        translation: EsLang,
      },
    },
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language if translation not found
    interpolation: {
      escapeValue: false, // react already safe from xss
    },
  });

export default i18n;