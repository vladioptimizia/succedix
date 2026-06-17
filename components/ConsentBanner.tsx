'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LocaleContext';
import { saveConsent, acceptAll, rejectAll, ConsentState } from '@/lib/consent';
import { requestLocationPermission } from '@/lib/geo';

interface Props {
  onConsented: (state: ConsentState) => void;
}

export default function ConsentBanner({ onConsented }: Props) {
  const { t } = useTranslation();
  const c = t.consent;

  const [detailed, setDetailed] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(true);
  const [locationOn, setLocationOn] = useState(false);
  const [marketingOn, setMarketingOn] = useState(false);

  const handleAcceptAll = () => {
    const state = acceptAll();
    requestLocationPermission();
    onConsented(state);
  };

  const handleEssentialOnly = () => {
    const state = rejectAll();
    onConsented(state);
  };

  const handleSave = async () => {
    const state: ConsentState = {
      analytics: analyticsOn,
      location: locationOn,
      marketing: marketingOn,
      decided: true,
    };
    saveConsent(state);
    if (locationOn) await requestLocationPermission();
    onConsented(state);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 text-white border-t border-zinc-700">
      {detailed ? (
        <div className="max-w-2xl mx-auto p-5 space-y-4">
          <h2 className="text-base font-semibold">{c.title}</h2>
          <p className="text-sm text-zinc-400">{c.description}</p>

          {/* Analytics toggle */}
          <div className="flex items-start justify-between gap-4 py-2 border-t border-zinc-700">
            <div>
              <p className="text-sm font-medium">{c.analytics}</p>
              <p className="text-xs text-zinc-400">{c.analyticsDesc}</p>
            </div>
            <button
              onClick={() => setAnalyticsOn(v => !v)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${analyticsOn ? 'bg-emerald-500' : 'bg-zinc-600'}`}
              aria-checked={analyticsOn}
              role="switch"
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${analyticsOn ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Location toggle */}
          <div className="flex items-start justify-between gap-4 py-2 border-t border-zinc-700">
            <div>
              <p className="text-sm font-medium">{c.location}</p>
              <p className="text-xs text-zinc-400">{c.locationDesc}</p>
            </div>
            <button
              onClick={() => setLocationOn(v => !v)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${locationOn ? 'bg-emerald-500' : 'bg-zinc-600'}`}
              aria-checked={locationOn}
              role="switch"
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${locationOn ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Marketing toggle */}
          <div className="flex items-start justify-between gap-4 py-2 border-t border-zinc-700">
            <div>
              <p className="text-sm font-medium">{c.marketing}</p>
              <p className="text-xs text-zinc-400">{c.marketingDesc}</p>
            </div>
            <button
              onClick={() => setMarketingOn(v => !v)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${marketingOn ? 'bg-emerald-500' : 'bg-zinc-600'}`}
              aria-checked={marketingOn}
              role="switch"
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${marketingOn ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {c.save}
            </button>
            <button
              onClick={handleEssentialOnly}
              className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {c.essentialOnly}
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold">{c.title} </span>
            <span className="text-sm text-zinc-400">{c.description} </span>
            <Link href="/privacy" className="text-sm text-emerald-400 hover:text-emerald-300 underline">
              {c.learnMore}
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            <button
              onClick={() => setDetailed(true)}
              className="text-sm text-zinc-300 hover:text-white underline px-2 py-1 transition-colors"
            >
              {c.customize}
            </button>
            <button
              onClick={handleEssentialOnly}
              className="bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium py-1.5 px-4 rounded-lg transition-colors"
            >
              {c.essentialOnly}
            </button>
            <button
              onClick={handleAcceptAll}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-1.5 px-4 rounded-lg transition-colors"
            >
              {c.acceptAll}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
