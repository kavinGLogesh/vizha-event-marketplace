// i18n.js — Internationalization setup for Tamil and English
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ta from './ta.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ta: { translation: ta }
    },
    // Default to saved language or English
    lng: localStorage.getItem('lang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
