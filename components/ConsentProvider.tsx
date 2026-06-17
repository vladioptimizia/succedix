'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ConsentState, getConsent } from '@/lib/consent';
import ConsentBanner from './ConsentBanner';

const ConsentContext = createContext<ConsentState | null>(null);
export const useConsent = () => useContext(ConsentContext);

export default function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const saved = getConsent();
    if (saved?.decided) {
      setConsent(saved);
    } else {
      setShowBanner(true);
    }
  }, []);

  const handleConsented = (state: ConsentState) => {
    setConsent(state);
    setShowBanner(false);
  };

  return (
    <ConsentContext.Provider value={consent}>
      {children}
      {showBanner && <ConsentBanner onConsented={handleConsented} />}
    </ConsentContext.Provider>
  );
}
