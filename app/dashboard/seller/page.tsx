'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/browser';

interface Business {
  id: string;
  name: string;
  status: string;
  asking_price_min?: number;
  asking_price_max?: number;
  created_at: string;
}

interface SellerProfile {
  readiness_score?: number;
  readiness_finances?: number;
  readiness_documentation?: number;
  readiness_operations?: number;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'Entwurf', color: '#9ca3af', bg: 'rgba(156,163,175,0.1)' },
    pending: { label: 'In Prüfung', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    approved: { label: 'Genehmigt', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    published: { label: 'Veröffentlicht', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
    rejected: { label: 'Abgelehnt', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  };
  const s = map[status] ?? map.draft;
  return (
    <span style={{ color: s.color, background: s.bg, borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>
      {s.label}
    </span>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
      <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={70} cy={70} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={10} />
        <circle cx={70} cy={70} r={radius} fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 32, fontWeight: 700, color }}>{score}</span>
        <span style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const color = value >= 70 ? '#10b981' : value >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(value, 100)}%`, background: color, height: '100%', borderRadius: 4 }} />
    </div>
  );
}

function Skeleton({ h = 20, w = '100%', r = 8 }: { h?: number; w?: string | number; r?: number }) {
  return (
    <div style={{ height: h, width: w, borderRadius: r, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />
  );
}

export default function SellerDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile>({});
  const [buyerInterestCount, setBuyerInterestCount] = useState(0);
  const [daysListed, setDaysListed] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/login'); return; }

      const userId = session.user.id;
      setUserName(session.user.email?.split('@')[0] ?? 'Benutzer');

      const [{ data: biz }, { data: sp }] = await Promise.all([
        supabase.from('businesses').select('*').eq('vendor_id', userId),
        supabase.from('seller_profiles').select('*').eq('user_id', userId).maybeSingle(),
      ]);

      const bizList: Business[] = biz ?? [];
      setBusinesses(bizList);
      setSellerProfile(sp ?? {});

      if (bizList.length > 0) {
        const { count } = await supabase
          .from('interactions')
          .select('id', { count: 'exact', head: true })
          .in('business_id', bizList.map((b) => b.id))
          .in('action', ['liked', 'saved', 'interested']);
        setBuyerInterestCount(count ?? 0);
      }

      const published = bizList.filter((b) => b.status === 'published' || b.status === 'approved');
      if (published.length > 0) {
        const oldest = published.reduce((a, b) => a.created_at < b.created_at ? a : b);
        const diff = Math.floor((Date.now() - new Date(oldest.created_at).getTime()) / 86400000);
        setDaysListed(diff);
      }

      setLoading(false);
    }
    load();
  }, []);

  const score = sellerProfile.readiness_score ?? 0;
  const scoreColor = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  const nextSteps = score >= 70
    ? ['NDA-Vorlage vorbereiten', 'Käuferprofil prüfen', 'Erst-Gespräch planen']
    : score >= 40
    ? ['Dokumente vervollständigen', 'Finanzdaten aktualisieren', 'Betriebshandbuch erstellen', 'Score auf 70+ verbessern']
    : ['Basisprofil ausfüllen', 'Finanzdaten hochladen', 'Betriebsbeschreibung ergänzen', 'Dokumente vorbereiten', 'Score auf 40+ verbessern'];

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  const formatPrice = (min?: number, max?: number) => {
    if (!min && !max) return '—';
    const fmt = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${(n / 1_000).toFixed(0)}k`;
    if (min && max) return `CHF ${fmt(min)} – ${fmt(max)}`;
    if (min) return `ab CHF ${fmt(min)}`;
    return `bis CHF ${fmt(max!)}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}} @media(max-width:768px){.dash-grid{grid-template-columns:1fr!important}}`}</style>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" style={{ fontWeight: 700, fontSize: 18, color: '#fff', textDecoration: 'none' }}>
              Succedix<span style={{ color: '#10b981' }}>.</span>
            </Link>
            <span style={{ color: '#374151' }}>/</span>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Mein Dashboard</span>
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
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
            <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 0 }}>Readiness Score</p>
            {loading ? <Skeleton h={40} /> : (
              <p style={{ fontSize: 40, fontWeight: 800, color: scoreColor, lineHeight: 1, margin: 0 }}>{score}<span style={{ fontSize: 16, color: '#6b7280' }}>/100</span></p>
            )}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
            <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 0 }}>Interessierte Käufer</p>
            {loading ? <Skeleton h={40} /> : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1, margin: 0 }}>{buyerInterestCount}</p>
                <span style={{ fontSize: 11, color: '#6b7280', background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '2px 8px' }}>anonym</span>
              </div>
            )}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
            <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 0 }}>Aktive Inserate</p>
            {loading ? <Skeleton h={40} /> : (
              <p style={{ fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1, margin: 0 }}>{businesses.filter(b => b.status === 'published').length}</p>
            )}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
            <p style={{ color: '#6b7280', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 0 }}>Tage Inseriert</p>
            {loading ? <Skeleton h={40} /> : (
              <p style={{ fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1, margin: 0 }}>{daysListed}</p>
            )}
          </div>
        </div>

        {/* Main grid */}
        <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 24 }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Meine Inserate</h2>
                <Link href="/onboarding/seller" style={{ background: '#10b981', color: '#fff', borderRadius: 8, padding: '7px 16px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                  + Neu
                </Link>
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[1,2,3].map(i => <Skeleton key={i} h={52} r={10} />)}
                </div>
              ) : businesses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                  <p style={{ fontSize: 32, marginBottom: 8 }}>📋</p>
                  <p style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>Noch keine Inserate</p>
                  <p style={{ fontSize: 13, marginTop: 4 }}>Erstellen Sie Ihr erstes Inserat</p>
                  <Link href="/onboarding/seller" style={{ display: 'inline-block', marginTop: 16, background: '#10b981', color: '#fff', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                    Inserat erstellen
                  </Link>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        {['Unternehmen', 'Status', 'Preis', 'Aktionen'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {businesses.map((b) => (
                        <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '14px 12px', fontWeight: 600, color: '#fff' }}>{b.name}</td>
                          <td style={{ padding: '14px 12px' }}><StatusBadge status={b.status} /></td>
                          <td style={{ padding: '14px 12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>{formatPrice(b.asking_price_min, b.asking_price_max)}</td>
                          <td style={{ padding: '14px 12px' }}>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              <Link href={`/onboarding/seller?edit=${b.id}`} style={{ fontSize: 12, color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '4px 10px', textDecoration: 'none', whiteSpace: 'nowrap' }}>Bearbeiten</Link>
                              <Link href={`/opportunity/${b.id}`} style={{ fontSize: 12, color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '4px 10px', textDecoration: 'none', whiteSpace: 'nowrap' }}>Vorschau</Link>
                              {b.status === 'approved' && (
                                <button style={{ fontSize: 12, color: '#fff', background: '#10b981', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Veröffentlichen</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Score card */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, marginTop: 0 }}>Readiness Score</h2>
              {loading ? <Skeleton h={140} r={70} /> : <ScoreCircle score={score} />}
              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { label: 'Finanzen', value: sellerProfile.readiness_finances ?? 0 },
                  { label: 'Dokumentation', value: sellerProfile.readiness_documentation ?? 0 },
                  { label: 'Betrieb', value: sellerProfile.readiness_operations ?? 0 },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#9ca3af' }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{value}%</span>
                    </div>
                    {loading ? <Skeleton h={6} r={4} /> : <ProgressBar value={value} />}
                  </div>
                ))}
              </div>
            </div>

            {/* Interested buyers */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, marginTop: 0 }}>Interessierte Käufer</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 12 }}>
                <span style={{ fontSize: 32, flexShrink: 0 }}>🔒</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 20, color: '#10b981' }}>{loading ? '—' : buyerInterestCount} Käufer</p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>haben Interesse gezeigt — Namen nach erstem Kontakt sichtbar</p>
                </div>
              </div>
            </div>

            {/* Next steps */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, marginTop: 0 }}>Nächste Schritte</h2>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[1,2,3].map(i => <Skeleton key={i} h={18} r={6} />)}
                </div>
              ) : (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {nextSteps.map((step, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#10b981', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                      <span style={{ fontSize: 14, color: '#d1d5db' }}>{step}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
