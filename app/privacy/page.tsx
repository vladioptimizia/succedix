'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/LocaleContext';

type Section = 'overview' | 'data-collected' | 'usage' | 'sharing' | 'retention' | 'rights' | 'cookies' | 'contact';

const SECTION_IDS: Section[] = ['overview', 'data-collected', 'usage', 'sharing', 'retention', 'rights', 'cookies', 'contact'];
const SECTION_ICONS = ['🛡️', '📋', '⚙️', '🔗', '🗓️', '✅', '🍪', '📬'];

function SectionBlock({ id, title, children }: { id: Section; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-serif text-2xl font-bold mb-6" style={{ color: '#f9fafb' }}>{title}</h2>
      <div className="flex flex-col gap-4 text-gray-400 leading-relaxed text-sm">
        {children}
      </div>
    </section>
  );
}

function RightCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl p-5" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)' }}>
      <p className="font-medium text-emerald-400 mb-1">{title}</p>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}

export default function PrivacyPage() {
  const { t } = useTranslation();
  const [active, setActive] = useState<Section>('overview');

  const handleScroll = (id: Section) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12 text-center">
          <span
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            {t.privacy.lastUpdated}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            {t.privacy.title}
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
            {t.privacy.intro}
          </p>
        </div>

        <div className="flex gap-8 items-start">

          {/* Sidebar nav */}
          <aside className="hidden lg:flex flex-col gap-1 w-56 shrink-0 sticky top-24">
            {SECTION_IDS.map((id, idx) => (
              <button
                key={id}
                onClick={() => handleScroll(id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all"
                style={{
                  background: active === id ? 'rgba(16,185,129,0.1)' : 'transparent',
                  border: active === id ? '1px solid rgba(16,185,129,0.2)' : '1px solid transparent',
                  color: active === id ? '#6ee7b7' : '#6b7280',
                }}
              >
                <span className="text-base">{SECTION_ICONS[idx]}</span>
                {t.privacy.sections[idx]?.title ?? id}
              </button>
            ))}
            <div className="mt-6 px-3">
              <Link
                href="mailto:privacidade@succedix.ch"
                className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                {t.footer.legalLinks.dpo} →
              </Link>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 flex flex-col gap-14">
            {t.privacy.sections.map((section, idx) => (
              <SectionBlock key={idx} id={SECTION_IDS[idx]} title={section.title}>
                <p>{section.content}</p>
              </SectionBlock>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
