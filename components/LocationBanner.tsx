'use client';

import { useTranslation } from '@/lib/i18n/LocaleContext';
import { Canton } from '@/lib/types';
import { requestLocationPermission } from '@/lib/geo';

interface LocationBannerProps {
  onDetected: (canton: Canton | null) => void;
  onDismiss: () => void;
}

export default function LocationBanner({ onDetected, onDismiss }: LocationBannerProps) {
  const { t } = useTranslation();

  async function handleAllow() {
    const canton = await requestLocationPermission();
    if (typeof window !== 'undefined') {
      localStorage.setItem('location_banner_dismissed', '1');
    }
    onDetected(canton);
  }

  function handleDismiss() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('location_banner_dismissed', '1');
    }
    onDismiss();
  }

  return (
    <div
      className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl text-sm"
      style={{
        background: 'rgba(17,17,17,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-lg flex-shrink-0">📍</span>
        <div className="min-w-0">
          <p className="font-medium text-white leading-tight">{t.location.bannerTitle}</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: '#9ca3af' }}>{t.location.bannerDesc}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleAllow}
          className="px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}
        >
          {t.location.allow}
        </button>
        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#6b7280' }}
        >
          {t.location.dismiss}
        </button>
      </div>
    </div>
  );
}
