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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="max-w-md w-full mx-4 rounded-2xl p-8 text-white"
        style={{ background: 'rgba(12,12,12,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {/* Cookie icon */}
        <div className="text-5xl text-center mb-4">🍪</div>

        {/* Title & description */}
        <h2 className="text-lg font-bold text-center mb-2">{c.title}</h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          {c.description}{' '}
          <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 underline">
            {c.learnMore}
          </Link>
        </p>

        {/* Expandable toggles */}
        {detailed && (
          <div className="space-y-3 mb-6">
            {/* Analytics toggle */}
            <div className="flex items-start justify-between gap-4 py-3 border-t border-white/10">
              <div>
                <p className="text-sm font-medium">{c.analytics}</p>
                <p className="text-xs text-gray-400">{c.analyticsDesc}</p>
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
            <div className="flex items-start justify-between gap-4 py-3 border-t border-white/10">
              <div>
                <p className="text-sm font-medium">{c.location}</p>
                <p className="text-xs text-gray-400">{c.locationDesc}</p>
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
            <div className="flex items-start justify-between gap-4 py-3 border-t border-white/10">
              <div>
                <p className="text-sm font-medium">{c.marketing}</p>
                <p className="text-xs text-gray-400">{c.marketingDesc}</p>
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
          </div>
        )}

        {/* Buttons */}
        {detailed ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-colors"
            >
              {c.save}
            </button>
            <button
              onClick={handleEssentialOnly}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-colors"
            >
              {c.essentialOnly}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              onClick={handleAcceptAll}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
            >
              {c.acceptAll}
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleEssentialOnly}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-colors"
              >
                {c.essentialOnly}
              </button>
              <button
                onClick={() => setDetailed(true)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2.5 px-4 rounded-xl transition-colors"
              >
                {c.customize}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
