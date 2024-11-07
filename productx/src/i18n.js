import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import zh from './locales/zh/translation.json';
import fr from './locales/fr/translation.json';
import es from './locales/es/translation.json';
import de from './locales/de/translation.json';
import it from './locales/it/translation.json';
import ja from './locales/ja/translation.json';
import ru from './locales/ru/translation.json';
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
    fr: { translation: fr },
    es: { translation: es },
    de: { translation: de },
    it: { translation: it },
    ja: { translation: ja },
    ru: { translation: ru },
  },
  lng: 'zh', // 默认语言
  fallbackLng: 'en', // 备用语言
  interpolation: {
    escapeValue: false // React 自动防止 XSS，不需要转义
  }
});

export default i18n;
