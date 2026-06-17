'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/browser';

interface Business {
  id: string;
  name: string;
  sector: string;
  canton: string;
  city: string;
  price_min: number;
  price_max: number;
  annual_revenue: number;
  status: string;
}

const ALL_SECTORS = ['Café', 'Restaurant', 'Retail', 'Services', 'Healthcare', 'Other'];
const ALL_CANTONS = ['ZH', 'BE', 'AG', 'ZG', 'VD', 'GE', 'TI', 'LU', 'SG', 'BS'];

function fmtK(n: number) {
  return `CHF ${Math.round(n / 1000)}k`;
}

function ScoreCircle({ score }: { score: number }) {
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 36 36)" />
        <text x="36" y="36" textAnchor="middle" dominantBaseline="central"
          fill={color} fontSize="14" fontWeight="700">{score}%</text>
      </svg>
      <span className="text-xs" style={{ color: '#6b7280' }}>Match</span>
    </div>
  );
}

export default function MatchesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filtered, setFiltered] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sectors, setSectors] = useState<string[]>([]);
  const [canton, setCanton] = useState('');
  const [minScore, setMinScore] = useState(0);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/login'); return; }
      const { data } = await supabase
        .from('businesses')
        .select('id, name, sector, canton, city, price_min, price_max, annual_revenue, status')
        .in('status', ['published', 'approved'])
        .order('created_at', { ascending: false });
      const list = (data ?? []) as Business[];
      setBusinesses(list);
      setFiltered(list);
      setLoading(false);
    }
    init();
  }, []);

  function applyFilters() {
    let result = [...businesses];
    if (sectors.length) result = result.filter(b => sectors.includes(b.sector));
    if (canton) result = result.filter(b => b.canton === canton);
    setFiltered(result);
    setShowFilters(false);
  }

  function resetFilters() {
    setSectors([]);
    setCanton('');
    setMinScore(0);
    setFiltered(businesses);
  }

  function toggleSector(s: string) {
    setSectors(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  const getScore = (b: Business) => {
    const base = 65 + (b.annual_revenue > 200000 ? 10 : 0) + (b.price_min < 300000 ? 5 : 0);
    return Math.min(99, base);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen px-4 md:px-6 py-12" style={{ background: '#080808' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Meine Matches</h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
            Unternehmen die zu Ihrem Profil passen — {filtered.length} Ergebnisse
          </p>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden w-full flex items-center justify-between px-4 py-3 rounded-xl mb-4 text-sm font-medium"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e5e7eb' }}
        >
          <span>Filter {sectors.length || canton ? `(aktiv)` : ''}</span>
          <span>{showFilters ? '▲' : '▼'}</span>
        </button>

        <div className="flex gap-6">

          {/* Filter sidebar — desktop always visible, mobile collapsible */}
          <aside
            className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col gap-6 w-full md:w-64 flex-shrink-0`}
          >
            <div className="rounded-2xl p-5 sticky top-24" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-semibold text-white">Filter</span>
                <button onClick={resetFilters} className="text-xs" style={{ color: '#6b7280' }}>Zurücksetzen</button>
              </div>

              {/* Sektor */}
              <div className="mb-5">
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#4b5563' }}>Sektor</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_SECTORS.map(s => (
                    <button key={s} onClick={() => toggleSector(s)}
                      className="text-xs px-3 py-1.5 rounded-full transition-all"
                      style={{
                        background: sectors.includes(s) ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                        border: sectors.includes(s) ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.08)',
                        color: sectors.includes(s) ? '#34d399' : '#6b7280',
                      }}
                    >{s}</button>
                  ))}
                </div>
              </div>

              {/* Kanton */}
              <div className="mb-5">
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#4b5563' }}>Kanton</p>
                <select value={canton} onChange={e => setCanton(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-xl outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e5e7eb' }}
                >
                  <option value="">Alle Kantone</option>
                  {ALL_CANTONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Min score */}
              <div className="mb-6">
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#4b5563' }}>Min. Match %</p>
                <input type="number" min={0} max={100} value={minScore} onChange={e => setMinScore(Number(e.target.value))}
                  placeholder="0"
                  className="w-full text-sm px-3 py-2 rounded-xl outline-none"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#e5e7eb' }}
                />
              </div>

              <button onClick={applyFilters}
                className="w-full py-2.5 rounded-xl text-sm font-medium"
                style={{ background: '#10b981', color: '#fff' }}
              >
                Filter anwenden
              </button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24 text-center rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-5xl">🎯</span>
                <h2 className="font-serif text-xl font-bold text-white">Noch keine Matches</h2>
                <p className="text-sm max-w-xs" style={{ color: '#6b7280' }}>
                  Vervollständigen Sie Ihr Käuferprofil um passende Unternehmen zu sehen.
                </p>
                <Link href="/onboarding/buyer"
                  className="mt-2 px-6 py-2.5 rounded-full text-sm font-medium"
                  style={{ background: '#10b981', color: '#fff' }}>
                  Profil vervollständigen
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map(b => {
                  const score = getScore(b);
                  if (score < minScore) return null;
                  return (
                    <div key={b.id} className="flex items-center gap-4 p-4 rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>

                      {/* Icon */}
                      <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl"
                        style={{ background: 'linear-gradient(135deg, #064e3b, #1f2937)' }}>
                        {b.sector === 'Café' ? '☕' : b.sector === 'Restaurant' ? '🍽️' : b.sector === 'Retail' ? '🛍️' : b.sector === 'Healthcare' ? '🏥' : '🏢'}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
                            {b.sector}
                          </span>
                        </div>
                        <p className="font-semibold text-white truncate">{b.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{b.canton} · {b.city}</p>
                        <p className="text-sm text-white mt-1">{fmtK(b.price_min)} – {fmtK(b.price_max)}</p>
                        <p className="text-xs" style={{ color: '#6b7280' }}>Umsatz: {fmtK(b.annual_revenue)}</p>
                      </div>

                      {/* Score + actions */}
                      <div className="flex flex-col items-center gap-2 flex-shrink-0">
                        <ScoreCircle score={score} />
                        <Link href={`/opportunity/${b.id}`}
                          className="text-xs px-3 py-1.5 rounded-xl font-medium"
                          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}>
                          Details →
                        </Link>
                        <button className="text-xs px-3 py-1.5 rounded-xl"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>
                          🔖
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
