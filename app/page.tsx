'use client';

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LocaleContext";

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen flex flex-col">

      {/* ─── HERO ─── */}
      <section
        className="relative flex flex-col items-center text-center px-6 pt-28 pb-32 gap-8 overflow-hidden"
      >
        {/* Swiss city background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1600&q=80&auto=format&fit=crop')",
            filter: 'grayscale(100%) brightness(0.55) contrast(1.3)',
            backgroundPosition: 'center 20%',
          }}
        />
        {/* green tint overlay */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.06), transparent), linear-gradient(to bottom, rgba(8,8,8,0.1) 0%, rgba(8,8,8,0.75) 100%)' }} />
        {/* content sits above overlays */}
        <div className="relative z-10 flex flex-col items-center gap-8 w-full">
        <span
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-1.5 rounded-full"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
          {t.hero.badge}
        </span>

        <h1 className="font-serif text-4xl md:text-7xl font-bold max-w-3xl leading-tight" style={{ letterSpacing: '-0.02em' }}>
          {t.hero.headline1}
          <br />
          <span style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t.hero.headline2}</span>
        </h1>

        <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
          {t.hero.subtext}
          <br />
          <span className="text-gray-300 font-medium">{t.hero.highlight}</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
          <Link
            href="/onboarding/buyer"
            className="h-12 px-8 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
            style={{ background: '#10b981', color: '#fff', boxShadow: '0 0 24px rgba(16,185,129,0.3)' }}
          >
            {t.hero.ctaBuy}
          </Link>
          <Link
            href="/onboarding/seller"
            className="h-12 px-8 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e5e7eb' }}
          >
            {t.hero.ctaSell}
          </Link>
        </div>

        {/* Social proof */}
        <div className="flex flex-wrap justify-center gap-8 mt-4">
          <Stat value={t.hero.stat1value} label={t.hero.stat1label} />
          <Stat value={t.hero.stat2value} label={t.hero.stat2label} />
          <Stat value={t.hero.stat3value} label={t.hero.stat3label} />
        </div>

        <p className="text-gray-600 text-xs mt-1">{t.hero.freeSwipes}</p>
        </div>
      </section>

      {/* ─── KATEGORIEN ─── */}
      <section className="px-4 md:px-6 py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs tracking-widest uppercase text-gray-500 mb-3">Branchen</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-8">Kategorien</h2>
          {/* Mobile: horizontal scroll. Desktop: grid */}
          <div className="flex md:hidden gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
            {CATEGORIES.map((cat) => (
              <CategoryPill key={cat.label} icon={cat.icon} label={cat.label} count={cat.count} />
            ))}
          </div>
          <div className="hidden md:grid grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <CategoryPill key={cat.label} icon={cat.icon} label={cat.label} count={cat.count} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── AUSGEWÄHLTE INSERATE ─── */}
      <section className="px-4 md:px-6 py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs tracking-widest uppercase text-gray-500 mb-2">Marktplatz</p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">Ausgewählte Möglichkeiten</h2>
            </div>
            <Link href="/discover" className="text-sm font-medium hidden sm:block" style={{ color: '#10b981' }}>
              Alle ansehen →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {FEATURED_BUSINESSES.map((biz) => (
              <FeaturedBusinessCard key={biz.name} {...biz} />
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/discover" className="text-sm font-medium" style={{ color: '#10b981' }}>
              Alle ansehen →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 3 PILLARS ─── */}
      <section className="px-6 py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs tracking-widest uppercase text-gray-500 mb-3">{t.pillars.tag}</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-4">{t.pillars.title}</h2>
          <p className="text-center text-gray-500 mb-16 max-w-xl mx-auto">
            {t.pillars.subtitle}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <PillarCard
              icon="🔒"
              title={t.pillars.discretion.title}
              description={t.pillars.discretion.quote}
              features={[t.pillars.discretion.f1, t.pillars.discretion.f2, t.pillars.discretion.f3, t.pillars.discretion.f4]}
            />
            <PillarCard
              icon="🎯"
              title={t.pillars.matching.title}
              description={t.pillars.matching.quote}
              features={[t.pillars.matching.f1, t.pillars.matching.f2, t.pillars.matching.f3, t.pillars.matching.f4]}
              highlight
            />
            <PillarCard
              icon="🚀"
              title={t.pillars.support.title}
              description={t.pillars.support.quote}
              features={[t.pillars.support.f1, t.pillars.support.f2, t.pillars.support.f3, t.pillars.support.f4]}
            />
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="wie-es-funktioniert" className="px-6 py-24" style={{ background: 'rgba(16,185,129,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs tracking-widest uppercase text-gray-500 mb-3">{t.process.tag}</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-16">{t.process.title}</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <StepCard number={t.process.s1.num} title={t.process.s1.title} description={t.process.s1.desc} />
            <StepCard number={t.process.s2.num} title={t.process.s2.title} description={t.process.s2.desc} />
            <StepCard number={t.process.s3.num} title={t.process.s3.title} description={t.process.s3.desc} />
            <StepCard number={t.process.s4.num} title={t.process.s4.title} description={t.process.s4.desc} accent />
          </div>
        </div>
      </section>

      {/* ─── FOR WHOM ─── */}
      <section className="px-6 py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <AudienceCard
            tag={t.sellers.tag}
            headline={t.sellers.title}
            body={t.sellers.desc}
            points={[t.sellers.f1, t.sellers.f2, t.sellers.f3, t.sellers.f4]}
            cta={t.sellers.cta}
            href="/onboarding/seller"
          />
          <AudienceCard
            tag={t.buyers.tag}
            headline={t.buyers.title}
            body={t.buyers.desc}
            points={[t.buyers.f1, t.buyers.f2, t.buyers.f3, t.buyers.f4]}
            cta={t.buyers.cta}
            href="/onboarding/buyer"
          />
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─── */}
      <section className="px-6 py-20" style={{ background: 'rgba(16,185,129,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-xs tracking-widest uppercase text-gray-500 mb-3">{t.comparison.tag}</p>
          <h2 className="font-serif text-3xl font-bold text-center mb-12">{t.comparison.title}</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-800">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium">{t.comparison.col1}</th>
                  <th className="px-6 py-4 text-gray-500 font-medium text-center">{t.comparison.col2}</th>
                  <th className="px-6 py-4 font-medium text-center" style={{ color: '#10b981' }}>{t.comparison.col3}</th>
                </tr>
              </thead>
              <tbody>
                {t.comparison.rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-800"
                    style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}
                  >
                    <td className="px-6 py-4 text-gray-300">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-gray-500">{row.competitors}</td>
                    <td className="px-6 py-4 text-center font-semibold" style={{ color: '#10b981' }}>{row.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="px-6 py-24 flex flex-col items-center text-center gap-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 className="font-serif text-3xl md:text-4xl font-bold max-w-xl">{t.cta.title}</h2>
        <p className="text-gray-400 max-w-sm">{t.cta.subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/onboarding/buyer"
            className="h-12 px-10 rounded-full font-medium text-sm flex items-center justify-center"
            style={{ background: '#10b981', color: '#fff', boxShadow: '0 0 32px rgba(16,185,129,0.25)' }}
          >
            {t.cta.ctaBuy}
          </Link>
          <Link
            href="/onboarding/seller"
            className="h-12 px-8 rounded-full font-medium text-sm flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#e5e7eb' }}
          >
            {t.cta.ctaSell}
          </Link>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-gray-600 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <span className="font-serif text-gray-500 font-medium">Succedix.</span>
        <span className="mx-3">·</span>
        {t.hero.highlight}
        <span className="mx-3">·</span>
        🇨🇭 Schweiz
        <span className="mx-3">·</span>
        © {new Date().getFullYear()}
      </footer>
    </main>
  );
}

const FEATURED_BUSINESSES = [
  { name: 'Bäckerei Zentral', sector: 'Bäckerei', canton: 'ZH', price: 'CHF 180k – 240k' },
  { name: 'Studio Beauté', sector: 'Beauty', canton: 'GE', price: 'CHF 95k – 130k' },
  { name: 'IT-Service Boutique', sector: 'Technologie', canton: 'ZG', price: 'CHF 220k – 320k' },
];

function FeaturedBusinessCard({ name, sector, canton, price }: { name: string; sector: string; canton: string; price: string }) {
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="h-44" style={{ background: 'linear-gradient(135deg, #064e3b 0%, #1f2937 100%)' }} />
      <div className="p-4 flex flex-col gap-2">
        <span className="self-start text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>{sector}</span>
        <p className="font-semibold text-white">{name}</p>
        <p className="text-xs" style={{ color: '#6b7280' }}>{canton}</p>
        <p className="text-sm text-white">{price}</p>
        <Link href="/discover" className="mt-2 text-center text-xs py-2 rounded-xl font-medium" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
          Details ansehen →
        </Link>
      </div>
    </div>
  );
}

const CATEGORIES = [
  { icon: '☕', label: 'Café & Gastronomie', count: 45 },
  { icon: '🛍️', label: 'Detailhandel', count: 38 },
  { icon: '🔧', label: 'Dienstleistungen', count: 52 },
  { icon: '🏥', label: 'Gesundheit', count: 29 },
  { icon: '✂️', label: 'Beauty & Wellness', count: 33 },
  { icon: '🏗️', label: 'Handwerk', count: 41 },
  { icon: '💻', label: 'Technologie', count: 18 },
  { icon: '➕', label: 'Weitere', count: 60 },
];

function CategoryPill({ icon, label, count }: { icon: string; label: string; count: number }) {
  return (
    <Link href="/discover"
      className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center flex-shrink-0 snap-start transition-all hover:opacity-80"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', minWidth: 120 }}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-medium text-white leading-tight">{label}</span>
      <span className="text-xs" style={{ color: '#4b5563' }}>+{count} Inserate</span>
    </Link>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-serif text-2xl font-bold" style={{ color: '#10b981' }}>{value}</p>
      <p className="text-gray-500 text-xs mt-0.5">{label}</p>
    </div>
  );
}

function PillarCard({
  icon, title, description, features, highlight = false,
}: {
  icon: string; title: string; description: string; features: string[]; highlight?: boolean;
}) {
  return (
    <div
      className="p-8 rounded-2xl flex flex-col gap-4"
      style={{
        background: highlight ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
        border: highlight ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <span className="text-3xl">{icon}</span>
      <h3 className="font-serif text-xl font-bold">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed italic">{description}</p>
      <ul className="space-y-2 mt-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
            <span className="mt-0.5 text-success flex-shrink-0">✓</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepCard({
  number, title, description, accent = false,
}: {
  number: string; title: string; description: string; accent?: boolean;
}) {
  return (
    <div
      className="p-6 rounded-2xl flex flex-col gap-3"
      style={{
        background: accent ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.03)',
        border: accent ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <span
        className="font-serif text-3xl font-bold"
        style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
      >
        {number}
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function AudienceCard({
  tag, headline, body, points, cta, href,
}: {
  tag: string; headline: string; body: string; points: string[]; cta: string; href: string;
}) {
  return (
    <div
      className="p-8 rounded-2xl flex flex-col gap-5"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <span className="text-xs tracking-widest uppercase" style={{ color: '#10b981' }}>{tag}</span>
      <h3 className="font-serif text-xl font-bold leading-snug">{headline}</h3>
      <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{body}</p>
      <ul className="space-y-2">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
            <span className="mt-0.5 text-success flex-shrink-0">✓</span>
            {p}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="mt-2 self-start h-9 px-5 rounded-full text-sm font-medium flex items-center"
        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}
      >
        {cta} →
      </Link>
    </div>
  );
}
