import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
//配置中文的配置文件
import translation_zh from './zh.json';
//配置英文的配置文件
import translation_en from './en.json';
//配置越南文的配置文件
import translation_vie from './vie.json';

const resources = {
  en: {
    translation: translation_en
  },
  zh: {
    translation: translation_zh
  },
  vie: {
    translation: translation_vie
  }
};
// console.log((navigator.language) ? navigator.language : navigator.userLanguage)
i18n.use(initReactI18next).init({
  resources,
  lng: 'vie',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
