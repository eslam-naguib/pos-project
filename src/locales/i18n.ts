import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from './ar/translation.json';
import en from './en/translation.json';
import nl from './nl/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      nl: { translation: nl }
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
