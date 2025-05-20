import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "BROWSE": "BROWSE",
        "ARTICLES": "ARTICLES",
        "ABOUT US": "ABOUT US",
        "CONTACT US": "CONTACT US",
        "TERMS & CONDITIONS": "TERMS & CONDITIONS"
      }
    },
    zh: {
      translation: {
        "BROWSE": "浏览",
        "ARTICLES": "文章",
        "ABOUT US": "关于我们",
        "CONTACT US": "联系我们",
        "TERMS & CONDITIONS": "条款与条件"
      }
    }
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n; 