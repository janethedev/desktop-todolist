import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';

// 从配置文件读取语言，默认英文
const getAppLanguage = async () => {
  try {
    const savedLang = await window.electronAPI.loadLanguage();
    return savedLang || 'en-US';
  } catch (error) {
    console.error('加载语言配置失败:', error);
    return 'en-US';
  }
};

// 同步初始化 i18n，先使用默认语言
i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': { translation: zhCN },
      'en-US': { translation: enUS }
    },
    lng: 'en-US', // 先使用默认语言
    fallbackLng: 'en-US',
    supportedLngs: ['zh-CN', 'en-US'],
    interpolation: {
      escapeValue: false
    }
  });

// 异步加载保存的语言设置并切换
getAppLanguage().then(language => {
  if (i18n.language !== language) {
    i18n.changeLanguage(language);
  }
});

export default i18n;
