'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/browser';

interface SavedBusiness {
  id: string;
  name: string;
  sector?: string;
  canton?: string;
  asking_price_min?: number;
  asking_price_max?: number;
  compatibility_score?: number;
}

interface BuyerProfile {
  capital_min?: number;
  capital_max?: number;
  preferred_sectors?: string[];
  preferred_regions?: string[];
  readiness_score?: number;
  profile_match_rate?: number;
}

function ScoreCircle({ score, size = 140 }: { score: number; size?: number }) {
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  const radius = size * 0.386;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;
  const cx = size / 2;
  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cx} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
        <circle cx={cx} cy={cx} r={radius} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.23, fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}

function Skeleton({ h = 20, w = '100%', r = 8 }: { h?: number; w?: string | number; r?: number }) {
  return <div style={{ height: h, width: w, borderRadius: r, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />;
}

const SECTOR_LABELS: Record<string, string> = {
  tech: 'Technologie', retail: 'Handel', gastro: 'Gastronomie',
  health: 'Gesundheit', construction: 'Bau', services: 'Dienstleistungen',
  manufacturing: 'Produktion', other: 'Sonstiges',
};

const DAILY_LIMIT = 5;

export default function BuyerDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [savedBusinesses, setSavedBusinesses] = useState<SavedBusiness[]>([]);
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile>({});
  const [swipesToday, setSwipesToday] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/login'); return; }

      const userId = session.user.id;
      setUserName(session.user.email?.split('@')[0] ?? 'Benutzer');

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [{ data: bp }, { data: interactions }, { count: todayCount }] = await Promise.all([
        supabase.from('buyer_profiles').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('interactions').select('business_id').eq('buyer_id', userId).in('action', ['liked', 'saved']),
        supabase.from('interactions').select('id', { count: 'exact', head: true })
          .eq('buyer_id', userId).eq('action', 'liked').gte('created_at', todayStart.toISOString()),
      ]);

      setBuyerProfile(bp ?? {});
      setSwipesToday(todayCount ?? 0);

      if (interactions && interactions.length > 0) {
        const bizIds = [...new Set(interactions.map((i: { business_id: string }) => i.business_id))];
        const { data: bizData } = await supabase.from('businesses').select('id,name,sector,canton,asking_price_min,asking_price_max').in('id', bizIds);
        setSavedBusinesses(bizData ?? []);
      }

      setLoading(false);
    }
    load();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  const score = buyerProfile.readiness_score ?? 0;
  const matchRate = buyerProfile.profile_match_rate ?? 0;

  const formatCapital = (min?: number, max?: number) => {
    const fmt = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${(n / 1_000).toFixed(0)}k`;
    if (min && max) return `CHF ${fmt(min)} – ${fmt(max)}`;
    if (min) return `ab CHF ${fmt(min)}`;
    if (max) return `bis CHF ${fmt(max)}`;
    return '—';
  };

  const remainingToday = Math.max(0, DAILY_LIMIT - swipesToday);

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @media(max-width:768px){.buyer-grid{grid-template-columns:1fr!important}}`}</style>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" style={{ fontWeight: 700, fontSize: 18, color: '#fff', textDecoration: 'none' }}>
              Succedix<span style={{ color: '#10b981' }}>.</span>
            </Link>
            <span style={{ color: '#374151' }}>/</span>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Entdecken &amp; Verwalten</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {!loading && <span style={{ color: '#9ca3af', fontSize: 14 }}>👤 {userName}</span>}
            <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer' }}>
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Readiness Score', value: loading ? null : `${score}/100`, color: score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444' },
            { label: 'Gespeicherte Unternehmen', value: loading ? null : savedBusinesses.length, color: '#fff' },
            { label: 'Heute Geliked', value: loading ? null : `${swipesToday}/${DAILY_LIMIT}`, color: swipesToday >= DAILY_LIMIT ? '#ef4444' : '#10b981' },
            { label: 'Profil-Match Rate', value: loading ? null : `${matchRate}%`, color: '#10b981' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
              <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 0 }}>{label}</p>
              {loading ? <Skeleton h={40} /> : (
                <p style={{ fontSize: 36, fontWeight: 800, color, lineHeight: 1, margin: 0 }}>{value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="buyer-grid" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 24 }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Gespeicherte Unternehmen</h2>
                <Link href="/discover" style={{ fontSize: 13, color: '#10b981', textDecoration: 'none' }}>Mehr entdecken →</Link>
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[1,2,3].map(i => <Skeleton key={i} h={80} r={12} />)}
                </div>
              ) : savedBusinesses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                  <p style={{ fontSize: 32, marginBottom: 8 }}>🔍</p>
                  <p style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>Noch keine gespeicherten Unternehmen</p>
                  <p style={{ fontSize: 13, marginTop: 4 }}>Entdecken Sie passende Betriebe</p>
                  <Link href="/discover" style={{ display: 'inline-block', marginTop: 16, background: '#10b981', color: '#fff', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                    Zum Marktplatz
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {savedBusinesses.map((biz) => (
                    <div key={biz.id} style={{ display: 'flex', gap: 16, padding: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, alignItems: 'center' }}>
                      {/* Gradient thumbnail */}
                      <div style={{ width: 56, height: 56, borderRadius: 10, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                        🏢
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 4px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{biz.name}</p>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {biz.sector && <span style={{ fontSize: 12, color: '#6b7280' }}>{SECTOR_LABELS[biz.sector] ?? biz.sector}</span>}
                          {biz.canton && <span style={{ fontSize: 12, color: '#6b7280' }}>• {biz.canton}</span>}
                        </div>
                      </div>
                      {biz.compatibility_score !== undefined && (
                        <div style={{ textAlign: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 18, fontWeight: 800, color: '#10b981' }}>{biz.compatibility_score}%</span>
                          <p style={{ fontSize: 10, color: '#6b7280', margin: '2px 0 0' }}>Match</p>
                        </div>
                      )}
                      <Link href={`/opportunity/${biz.id}`} style={{ flexShrink: 0, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                        Details
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Buyer profile */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Käuferprofil</h2>
                <Link href="/onboarding/buyer" style={{ fontSize: 13, color: '#10b981', textDecoration: 'none', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '4px 12px' }}>Bearbeiten</Link>
              </div>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[1,2,3].map(i => <Skeleton key={i} h={16} r={6} />)}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>Kapitalbereich</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{formatCapital(buyerProfile.capital_min, buyerProfile.capital_max)}</span>
                  </div>
                  <div style={{ paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 8 }}>Branchen</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(buyerProfile.preferred_sectors ?? []).length === 0
                        ? <span style={{ fontSize: 12, color: '#4b5563' }}>Nicht angegeben</span>
                        : (buyerProfile.preferred_sectors ?? []).map(s => (
                          <span key={s} style={{ fontSize: 12, background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: 999, padding: '2px 10px' }}>{SECTOR_LABELS[s] ?? s}</span>
                        ))}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 13, color: '#6b7280', display: 'block', marginBottom: 8 }}>Regionen</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(buyerProfile.preferred_regions ?? []).length === 0
                        ? <span style={{ fontSize: 12, color: '#4b5563' }}>Nicht angegeben</span>
                        : (buyerProfile.preferred_regions ?? []).map(r => (
                          <span key={r} style={{ fontSize: 12, background: 'rgba(255,255,255,0.06)', color: '#9ca3af', borderRadius: 999, padding: '2px 10px' }}>{r}</span>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tagesvorschläge */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, marginTop: 0 }}>Tagesvorschläge</h2>
              {loading ? <Skeleton h={60} r={10} /> : (
                <>
                  <p style={{ fontSize: 14, color: '#9ca3af', marginTop: 0, marginBottom: 12 }}>
                    Noch <span style={{ color: '#10b981', fontWeight: 700 }}>{remainingToday}</span> von {DAILY_LIMIT} Vorschlägen heute
                  </p>
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 6, height: 8, overflow: 'hidden', marginBottom: 16 }}>
                    <div style={{ width: `${(swipesToday / DAILY_LIMIT) * 100}%`, background: swipesToday >= DAILY_LIMIT ? '#ef4444' : '#10b981', height: '100%', borderRadius: 6, transition: 'width 0.4s ease' }} />
                  </div>
                  <Link href="/discover" style={{ display: 'block', textAlign: 'center', background: '#10b981', color: '#fff', borderRadius: 10, padding: '10px', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                    Zum Marktplatz →
                  </Link>
                </>
              )}
            </div>

            {/* Readiness Score */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, marginTop: 0 }}>Mein Readiness Score</h2>
              {loading ? <Skeleton h={120} r={60} /> : <ScoreCircle score={score} size={120} />}
              {!loading && score < 70 && (
                <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 12, marginBottom: 0 }}>
                  <Link href="/onboarding/buyer" style={{ color: '#10b981' }}>Profil vervollständigen</Link> um Score zu verbessern
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
