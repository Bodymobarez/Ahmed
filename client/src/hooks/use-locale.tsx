import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import arTranslations from "@/locales/ar.json";
import enTranslations from "@/locales/en.json";

type Translations = Record<string, any>;
type LocaleContextType = {
  locale: string;
  dir: "rtl" | "ltr";
  t: (key: string) => string;
  changeLocale: (newLocale: string) => void;
};

const defaultLocale = "ar";
const translations: Record<string, Translations> = {
  ar: arTranslations,
  en: enTranslations,
};

export const LocaleContext = createContext<LocaleContextType>({
  locale: defaultLocale,
  dir: "rtl",
  t: () => "",
  changeLocale: () => {},
});

export const useLocale = () => useContext(LocaleContext);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem("locale") || defaultLocale;
  });

  const dir = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    localStorage.setItem("locale", locale);
  }, [locale, dir]);

  // Function to get a nested translation using dot notation
  const t = (key: string): string => {
    const keys = key.split(".");
    let result: any = translations[locale] || {};
    
    for (const k of keys) {
      if (result[k] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      result = result[k];
    }
    
    return typeof result === "string" ? result : key;
  };

  const changeLocale = (newLocale: string) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, dir, t, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}
