'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import de from './de';
import en from './en';

type Locale = 'de' | 'en';
const translations = { de, en } as const;

interface LocaleContextType {
  t: typeof de;
  locale: Locale;
  switchLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType>({
  t: de,
  locale: 'de',
  switchLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('de');

  useEffect(() => {
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('NEXT_LOCALE='));
    const loc = cookie?.split('=')[1]?.trim() as Locale;
    if (loc === 'de' || loc === 'en') setLocale(loc);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    setLocale(newLocale);
  };

  return (
    <LocaleContext.Provider value={{ t: translations[locale], locale, switchLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LocaleContext);
}
