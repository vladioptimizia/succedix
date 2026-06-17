'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LocaleContext';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-24"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,8,8,0.9)' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-serif text-lg font-semibold flex items-center gap-1.5 mb-3">
              Succedix<span style={{ color: '#10b981' }}>.</span>
              <span title="Exklusive Plattform für die Schweiz">🇨🇭</span>
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>
              {t.footer.tagline}<br />
              {t.footer.subtagline}
            </p>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#4b5563' }}>{t.footer.platform}</p>
            <nav className="flex flex-col gap-2.5 text-sm" style={{ color: '#6b7280' }}>
              <Link href="/onboarding/buyer" className="hover:text-white transition-colors">{t.footer.platformLinks.buy}</Link>
              <Link href="/onboarding/seller" className="hover:text-white transition-colors">{t.footer.platformLinks.sell}</Link>
              <Link href="/discover" className="hover:text-white transition-colors">{t.footer.platformLinks.discover}</Link>
            </nav>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#4b5563' }}>{t.footer.company}</p>
            <nav className="flex flex-col gap-2.5 text-sm" style={{ color: '#6b7280' }}>
              <Link href="/#wie-es-funktioniert" className="hover:text-white transition-colors">{t.footer.companyLinks.howItWorks}</Link>
              <Link href="/login" className="hover:text-white transition-colors">{t.footer.companyLinks.login}</Link>
            </nav>
          </div>

          <div>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#4b5563' }}>{t.footer.legal}</p>
            <div className="flex flex-col gap-3">
              <Link
                href="/privacy"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7' }}
              >
                {t.footer.legalLinks.privacy}
              </Link>
              <nav className="flex flex-col gap-2 text-sm pl-1" style={{ color: '#6b7280' }}>
                <Link href="/privacy#cookies" className="hover:text-white transition-colors">{t.footer.legalLinks.cookies}</Link>
                <Link href="/privacy#rights" className="hover:text-white transition-colors">{t.footer.legalLinks.rights}</Link>
                <Link href="mailto:privacidade@succedix.ch" className="hover:text-white transition-colors">{t.footer.legalLinks.dpo}</Link>
              </nav>
            </div>
          </div>

        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: '#4b5563' }}
        >
          <p>© {year} Succedix Sàrl. {t.footer.copyright}</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }}
              />
              {t.footer.compliance}
            </span>
            <Link
              href="/privacy"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all hover:opacity-90"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7' }}
            >
              {t.footer.privacyBtn}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
