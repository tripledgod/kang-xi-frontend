import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  locale: string;
  setLocale: (locale: string) => void;
  isChinese: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [locale, setLocaleState] = useState<string>('en');

  // Sync with i18n language
  useEffect(() => {
    const currentLang = i18n.language;
    setLocaleState(currentLang === 'zh' ? 'zh-CN' : 'en');
  }, [i18n.language]);

  const setLocale = (newLocale: string) => {
    const lang = newLocale === 'zh-CN' ? 'zh' : 'en';
    i18n.changeLanguage(lang);
    setLocaleState(newLocale);
  };

  const isChinese = locale === 'zh-CN';

  const value: LanguageContextType = {
    locale,
    setLocale,
    isChinese,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
