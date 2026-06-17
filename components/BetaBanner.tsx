'use client';
import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/LocaleContext';

export default function BetaBanner() {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div
      className="w-full flex items-center justify-center gap-3 px-4 py-2 text-xs font-medium"
      style={{ background: 'rgba(16,185,129,0.08)', borderBottom: '1px solid rgba(16,185,129,0.15)', color: '#6ee7b7' }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block flex-shrink-0" />
      {t.betaBanner.text}
      <button
        onClick={() => setDismissed(true)}
        className="ml-2 opacity-50 hover:opacity-100 transition-opacity text-sm"
        aria-label="Dismiss"
      >
        {t.betaBanner.dismiss}
      </button>
    </div>
  );
}
