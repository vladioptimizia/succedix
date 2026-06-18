'use client';

import { useState } from 'react';
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LocaleContext";

export default function Header() {
  const { t, locale, switchLocale } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50" style={{ background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-1.5">
            Succedix<span className="text-success">.</span>
            <span className="text-sm" title="Exklusive Plattform für die Schweiz">🇨🇭</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <Link href="/#wie-es-funktioniert" className="hover:text-white transition-colors">{t.nav.howItWorks}</Link>
            <Link href="/onboarding/seller" className="hover:text-white transition-colors">{t.nav.sell}</Link>
            <Link href="/onboarding/buyer" className="hover:text-white transition-colors">{t.nav.buy}</Link>
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-medium">
              <button onClick={() => switchLocale('de')} className={locale === 'de' ? 'text-emerald-500 font-semibold' : 'text-gray-400'}>DE</button>
              <span className="text-gray-600">|</span>
              <button onClick={() => switchLocale('en')} className={locale === 'en' ? 'text-emerald-500 font-semibold' : 'text-gray-400'}>EN</button>
            </div>
            <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors px-4 h-9 flex items-center">{t.nav.login}</Link>
            <Link href="/login" className="text-sm font-medium h-9 px-5 rounded-full flex items-center transition-colors" style={{ background: '#10b981', color: '#fff' }}>{t.nav.signup}</Link>
            <Link href="/admin" className="text-sm font-medium h-9 px-4 rounded-full flex items-center gap-1.5 transition-colors" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/><path d="M12 8v4l3 3"/></svg>
              Admin
            </Link>
          </div>

          {/* Mobile right */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/admin" className="text-xs font-medium h-8 px-3 rounded-full flex items-center gap-1 transition-colors" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc' }}>
              Admin
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              aria-label="Menu"
            >
              <span className={`block w-5 h-0.5 bg-gray-300 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-gray-300 transition-all ${open ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-gray-300 transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />
          <nav
            className="absolute top-14 left-0 right-0 flex flex-col gap-1 p-4"
            style={{ background: 'rgba(10,10,10,0.98)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            onClick={e => e.stopPropagation()}
          >
            <Link href="/#wie-es-funktioniert" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">{t.nav.howItWorks}</Link>
            <Link href="/onboarding/seller" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">{t.nav.sell}</Link>
            <Link href="/onboarding/buyer" onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all">{t.nav.buy}</Link>
            <div className="h-px my-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <div className="flex gap-2 px-2">
              <Link href="/login" onClick={() => setOpen(false)} className="flex-1 h-11 rounded-xl text-sm text-gray-300 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>{t.nav.login}</Link>
              <Link href="/login" onClick={() => setOpen(false)} className="flex-1 h-11 rounded-xl text-sm font-medium flex items-center justify-center" style={{ background: '#10b981', color: '#fff' }}>{t.nav.signup}</Link>
            </div>
            <div className="flex justify-center gap-3 pt-2 pb-1">
              <button onClick={() => { switchLocale('de'); setOpen(false); }} className={`text-xs px-3 py-1 rounded-full ${locale === 'de' ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500'}`}>DE</button>
              <button onClick={() => { switchLocale('en'); setOpen(false); }} className={`text-xs px-3 py-1 rounded-full ${locale === 'en' ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-500'}`}>EN</button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
