'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/browser';

interface Business {
  id: string;
  name: string;
  sector?: string;
  canton?: string;
  city?: string;
  description?: string;
  asking_price_min?: number;
  asking_price_max?: number;
  annual_revenue?: number;
  founded_year?: number;
  team_size?: number;
  operating_margin?: number;
  sale_reason?: string;
  status: string;
  vendor_id?: string;
}

const SECTOR_LABELS: Record<string, string> = {
  tech: 'Technologie', retail: 'Handel', gastro: 'Gastronomie',
  health: 'Gesundheit', construction: 'Bau', services: 'Dienstleistungen',
  manufacturing: 'Produktion', other: 'Sonstiges',
};

function Skeleton({ h = 20, w = '100%', r = 8 }: { h?: number; w?: string | number; r?: number }) {
  return <div style={{ height: h, width: w, borderRadius: r, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />;
}

function ScoreCircle({ score, size = 100 }: { score: number; size?: number }) {
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.22, fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 10, color: '#6b7280' }}>Match</span>
      </div>
    </div>
  );
}

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [compatScore, setCompatScore] = useState<number | null>(null);
  const [interestSent, setInterestSent] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sendingInterest, setSendingInterest] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id ?? null;
      setUserId(uid);

      const { data: biz } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .in('status', ['published', 'approved'])
        .maybeSingle();

      if (!biz) { setNotFound(true); setLoading(false); return; }
      setBusiness(biz);

      if (uid) {
        // Track view
        await supabase.from('interactions').insert({ buyer_id: uid, business_id: id, action: 'viewed' }).then(() => {});

        // Check existing interest/saved
        const { data: existing } = await supabase
          .from('interactions')
          .select('action')
          .eq('buyer_id', uid)
          .eq('business_id', id)
          .in('action', ['interested', 'saved']);

        if (existing) {
          setInterestSent(existing.some((e: { action: string }) => e.action === 'interested'));
          setSaved(existing.some((e: { action: string }) => e.action === 'saved'));
        }

        // Compatibility score from buyer_profiles
        const { data: bp } = await supabase.from('buyer_profiles').select('compatibility_scores').eq('user_id', uid).maybeSingle();
        if (bp?.compatibility_scores?.[id]) setCompatScore(bp.compatibility_scores[id]);
      }

      setLoading(false);
    }
    load();
  }, [id]);

  async function handleInterest() {
    if (!userId) { router.push('/login'); return; }
    setSendingInterest(true);
    await supabase.from('interactions').upsert({ buyer_id: userId, business_id: id, action: 'interested' }, { onConflict: 'buyer_id,business_id,action' });
    setInterestSent(true);
    setSendingInterest(false);
  }

  async function handleSave() {
    if (!userId) { router.push('/login'); return; }
    if (saved) {
      await supabase.from('interactions').delete().eq('buyer_id', userId).eq('business_id', id).eq('action', 'saved');
      setSaved(false);
    } else {
      await supabase.from('interactions').upsert({ buyer_id: userId, business_id: id, action: 'saved' }, { onConflict: 'buyer_id,business_id,action' });
      setSaved(true);
    }
  }

  const fmt = (n?: number) => {
    if (!n) return '—';
    if (n >= 1_000_000) return `CHF ${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `CHF ${(n / 1_000).toFixed(0)}k`;
    return `CHF ${n}`;
  };

  const fmtPrice = (min?: number, max?: number) => {
    if (!min && !max) return 'Preis auf Anfrage';
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `ab ${fmt(min)}`;
    return `bis ${fmt(max)}`;
  };

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Inserat nicht gefunden</h1>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>Dieses Inserat existiert nicht oder ist nicht mehr verfügbar.</p>
          <Link href="/discover" style={{ background: '#10b981', color: '#fff', borderRadius: 10, padding: '10px 24px', textDecoration: 'none', fontWeight: 600 }}>Zum Marktplatz</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @media(max-width:900px){.opp-layout{flex-direction:column!important} .opp-sidebar{position:static!important;width:auto!important}}`}</style>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" style={{ fontWeight: 700, fontSize: 18, color: '#fff', textDecoration: 'none' }}>
            Succedix<span style={{ color: '#10b981' }}>.</span>
          </Link>
          <span style={{ color: '#374151' }}>/</span>
          <Link href="/discover" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }}>Marktplatz</Link>
          <span style={{ color: '#374151' }}>/</span>
          <span style={{ fontSize: 14, color: '#fff' }}>{loading ? '…' : (business?.name ?? 'Inserat')}</span>
        </div>
      </header>

      <div className="opp-layout" style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'flex', gap: 32, alignItems: 'flex-start' }}>
        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Hero */}
          <div style={{ marginBottom: 32 }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Skeleton h={36} w="60%" r={10} />
                <Skeleton h={20} w="40%" r={8} />
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {business?.sector && (
                    <span style={{ fontSize: 13, background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: 999, padding: '3px 12px', fontWeight: 600 }}>
                      {SECTOR_LABELS[business.sector] ?? business.sector}
                    </span>
                  )}
                  {business?.canton && (
                    <span style={{ fontSize: 13, background: 'rgba(255,255,255,0.06)', color: '#9ca3af', borderRadius: 999, padding: '3px 12px' }}>
                      📍 {business.canton}{business.city ? `, ${business.city}` : ''}
                    </span>
                  )}
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.2 }}>{business?.name}</h1>
                <p style={{ fontSize: 20, color: '#10b981', fontWeight: 700, margin: 0 }}>
                  {fmtPrice(business?.asking_price_min, business?.asking_price_max)}
                </p>
              </>
            )}
          </div>

          {/* About */}
          <section style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>Über das Unternehmen</h2>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Skeleton h={16} /><Skeleton h={16} /><Skeleton h={16} w="70%" />
              </div>
            ) : (
              <p style={{ color: '#d1d5db', lineHeight: 1.7, margin: 0 }}>
                {business?.description ?? 'Keine Beschreibung verfügbar.'}
              </p>
            )}
          </section>

          {/* Key metrics */}
          <section style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Kennzahlen</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {[
                { label: 'Jahresumsatz', value: loading ? null : fmt(business?.annual_revenue) },
                { label: 'Gründungsjahr', value: loading ? null : (business?.founded_year?.toString() ?? '—') },
                { label: 'Mitarbeiter', value: loading ? null : (business?.team_size ? `${business.team_size} Pers.` : '—') },
                { label: 'Betriebsmarge', value: loading ? null : (business?.operating_margin ? `${business.operating_margin}%` : '—') },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 18 }}>
                  <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 8px' }}>{label}</p>
                  {loading ? <Skeleton h={24} w="60%" /> : <p style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>{value}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Sale reason */}
          <section style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 12 }}>Warum wird verkauft</h2>
            {loading ? <Skeleton h={16} w="80%" /> : (
              interestSent ? (
                <p style={{ color: '#d1d5db', margin: 0, lineHeight: 1.7 }}>{business?.sale_reason ?? 'Information wird nach Kontaktaufnahme geteilt.'}</p>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 20 }}>🔒</span>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>Verfügbar nach Interesse bekunden</p>
                </div>
              )
            )}
          </section>

          {/* Documents */}
          <section style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 0, marginBottom: 16 }}>Dokumente</h2>
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, filter: 'blur(2px)', pointerEvents: 'none', userSelect: 'none' }}>
                {['NDA-Vereinbarung', 'Finanzbericht (3 Jahre)', 'Betriebshandbuch', 'Bewertungsgutachten'].map(doc => (
                  <div key={doc} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 18 }}>📄</span>
                    <span style={{ fontSize: 14, color: '#fff' }}>{doc}</span>
                  </div>
                ))}
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(8,8,8,0.7)', backdropFilter: 'blur(4px)', borderRadius: 12, gap: 8 }}>
                <span style={{ fontSize: 32 }}>🔒</span>
                <p style={{ fontSize: 15, fontWeight: 600, margin: 0, color: '#fff' }}>Verfügbar nach Kontaktaufnahme</p>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Bekunden Sie Interesse um Zugang zu erhalten</p>
              </div>
            </div>
          </section>

          {/* Similar businesses */}
          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Ähnliche Unternehmen</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: 16, opacity: 0.5 }}>
                  <div style={{ height: 60, borderRadius: 8, background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.1) 100%)', marginBottom: 12 }} />
                  <Skeleton h={14} w="80%" r={6} />
                  <div style={{ marginTop: 6 }}><Skeleton h={12} w="50%" r={5} /></div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky sidebar */}
        <div className="opp-sidebar" style={{ width: 320, flexShrink: 0, position: 'sticky', top: 88 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
            {/* Price */}
            <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 6px' }}>Kaufpreis</p>
              {loading ? <Skeleton h={28} w="70%" /> : (
                <p style={{ fontSize: 24, fontWeight: 800, color: '#10b981', margin: 0 }}>
                  {fmtPrice(business?.asking_price_min, business?.asking_price_max)}
                </p>
              )}
            </div>

            {/* Compatibility score */}
            {userId && compatScore !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <ScoreCircle score={compatScore} size={80} />
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>Kompatibilität</p>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Basierend auf Ihrem Profil</p>
                </div>
              </div>
            )}

            {/* CTA buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <button
                onClick={handleInterest}
                disabled={interestSent || sendingInterest}
                style={{ background: interestSent ? 'rgba(16,185,129,0.2)' : '#10b981', color: interestSent ? '#10b981' : '#fff', border: interestSent ? '1px solid rgba(16,185,129,0.4)' : 'none', borderRadius: 12, padding: '13px', fontSize: 15, fontWeight: 700, cursor: interestSent ? 'default' : 'pointer', width: '100%' }}>
                {interestSent ? '✓ Interesse bekundet' : sendingInterest ? 'Wird gesendet…' : 'Interesse bekunden'}
              </button>
              <button
                onClick={handleSave}
                style={{ background: 'transparent', color: saved ? '#10b981' : '#9ca3af', border: `1px solid ${saved ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 12, padding: '11px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                {saved ? '✓ Gespeichert' : '♡ Speichern'}
              </button>
            </div>

            {/* Quick facts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { label: 'Branche', value: loading ? null : (business?.sector ? (SECTOR_LABELS[business.sector] ?? business.sector) : '—') },
                { label: 'Kanton', value: loading ? null : (business?.canton ?? '—') },
                { label: 'Status', value: loading ? null : 'Verifiziert' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
                  {loading ? <Skeleton h={14} w={80} r={4} /> : <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{value}</span>}
                </div>
              ))}
            </div>

            {/* Seller info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👤</div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>Anonymer Verkäufer</p>
                <span style={{ fontSize: 12, background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: 999, padding: '1px 8px' }}>✓ Verifiziert</span>
              </div>
            </div>

            {/* Confidentiality notice */}
            <div style={{ padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#6b7280', lineHeight: 1.6 }}>
                🔒 Alle Informationen sind vertraulich. Ihre Anfrage wird anonym übermittelt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
