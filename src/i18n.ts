import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        BROWSE: 'BROWSE',
        ARTICLES: 'ARTICLES',
        ABOUT_US: 'ABOUT US',
        CONTACT_US: 'CONTACT US',
        TERMS_AND_CONDITIONS: 'TERMS & CONDITIONS',
        VIEW_ALL_COLLECTION: 'VIEW ALL COLLECTIONS',
        VIEW_ALL_ARTICLES: 'VIEW ALL ARTICLES',
        VIEW_ALL: 'VIEW ALL',
        LEARN_MORE: 'LEARN MORE',
        SUBSCRIBE: 'SUBSCRIBE',
        ACQUIRE_THIS_ITEM: 'ACQUIRE THIS ITEM',
        READ_MORE: 'Read more',
        READ_LESS: 'Read less',
        SUBMIT_FORM: 'SUBMIT FORM',
        SUBMITTING: 'SUBMITTING...',
      },
    },
    zh: {
      translation: {
        BROWSE: '浏览',
        ARTICLES: '文章',
        ABOUT_US: '关于我们',
        CONTACT_US: '联系我们',
        TERMS_AND_CONDITIONS: '条款与条件',
        VIEW_ALL_COLLECTION: '查看全部收藏',
        VIEW_ALL_ARTICLES: '查看全部文章',
        VIEW_ALL: '查看全部',
        LEARN_MORE: '了解更多',
        SUBSCRIBE: '订阅',
        ACQUIRE_THIS_ITEM: '获取此物品',
        READ_MORE: '阅读更多',
        READ_LESS: '收起',
        SUBMIT_FORM: '提交表单',
        SUBMITTING: '提交中...',
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
