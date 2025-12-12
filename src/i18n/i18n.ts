import * as Localization from 'react-native-localize';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en/translation.json';
import de from './de/translation.json';

const fallback = { languageTag: 'en', isRTL: false };

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    de: { translation: de },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
