'use client';

import Link from "next/link";
import { useTranslation, Locale } from "@/lib/i18n/LocaleContext";

export default function Header() {
  const { t, locale, switchLocale } = useTranslation();

  return (
    <header className="fixed top-0 inset-x-0 z-50" style={{ background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight flex items-center gap-2">
          Succedix<span className="text-success">.</span>
          <span className="text-base" title="Plataforma exclusiva para a Suíça">🇨🇭</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <Link href="/#como-funciona" className="hover:text-white transition-colors">{t.nav.howItWorks}</Link>
          <Link href="/onboarding/seller" className="hover:text-white transition-colors">{t.nav.sell}</Link>
          <Link href="/onboarding/buyer" className="hover:text-white transition-colors">{t.nav.buy}</Link>
        </nav>
        <div className="flex items-center gap-4">
          {/* Language toggle */}
          <div className="flex items-center gap-1 text-xs font-medium">
            {(['de', 'en'] as Locale[]).map((loc, i) => (
              <span key={loc} className="flex items-center gap-1">
                {i > 0 && <span style={{ color: '#374151' }}>|</span>}
                <button
                  onClick={() => switchLocale(loc)}
                  className="transition-colors"
                  style={{ color: locale === loc ? '#10b981' : '#6b7280', fontWeight: locale === loc ? 600 : 400 }}
                >
                  {loc.toUpperCase()}
                </button>
              </span>
            ))}
          </div>
          <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors px-4 h-9 flex items-center">
            {t.nav.login}
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium h-9 px-5 rounded-full flex items-center transition-colors"
            style={{ background: '#10b981', color: '#fff' }}
          >
            {t.nav.signup}
          </Link>
        </div>
      </div>
    </header>
  );
}
