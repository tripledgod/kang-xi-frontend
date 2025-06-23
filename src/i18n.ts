import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        BROWSE: 'BROWSE',
        ARTICLES: 'ARTICLES',
        'ABOUT US': 'ABOUT US',
        'CONTACT US': 'CONTACT US',
        'TERMS & CONDITIONS': 'TERMS & CONDITIONS',
        'VIEW ALL COLLECTION': 'VIEW ALL COLLECTION',
        'VIEW ALL ARTICLES': 'VIEW ALL ARTICLES',
        'VIEW ALL': 'VIEW ALL',
        'LEARN MORE': 'LEARN MORE',
        SUBSCRIBE: 'SUBSCRIBE',
        'ACQUIRE THIS ITEM': 'ACQUIRE THIS ITEM',
        'READ MORE': 'Read more',
        'READ LESS': 'Read less',
      },
    },
    zh: {
      translation: {
        BROWSE: '浏览',
        ARTICLES: '文章',
        'ABOUT US': '关于我们',
        'CONTACT US': '联系我们',
        'TERMS & CONDITIONS': '条款与条件',
        'VIEW ALL COLLECTION': '查看全部收藏',
        'VIEW ALL ARTICLES': '查看全部文章',
        'VIEW ALL': '查看全部',
        'LEARN MORE': '了解更多',
        SUBSCRIBE: '订阅',
        'ACQUIRE THIS ITEM': '获取此物品',
        'READ MORE': '阅读更多',
        'READ LESS': '收起',
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
