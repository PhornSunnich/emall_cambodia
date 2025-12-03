import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      home: 'Home',
      stores: 'Stores',
      products: 'Products',
      realEstate: 'Real Estate',
      searchPlaceholder: 'Search...',
      cart: 'Cart',
      favorites: 'Favorites',
      login: 'Login',
      register: 'Register',
      profile: 'My Profile',
      logout: 'Logout',
    },
  },
  km: {
    translation: {
      home: 'ទំព័រដើម',
      stores: 'ហាង',
      products: 'ផលិតផល',
      realEstate: 'អចលនទ្រព្យ',
      searchPlaceholder: 'ស្វែងរក...',
      cart: 'រទេះ',
      favorites: 'ចូលចិត្ត',
      login: 'ចូលគណនី',
      register: 'ចុះឈ្មោះ',
      profile: 'ប្រវត្តិរូប',
      logout: 'ចាកចេញ',
    },
  },
  zh: {
    translation: {
      home: '首页',
      stores: '商店',
      products: '产品',
      realEstate: '房地产',
      searchPlaceholder: '搜索...',
      cart: '购物车',
      favorites: '收藏',
      login: '登录',
      register: '注册',
      profile: '我的资料',
      logout: '退出',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;