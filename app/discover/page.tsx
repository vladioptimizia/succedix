'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import SwipeCard from '@/components/SwipeCard';
import LocationBanner from '@/components/LocationBanner';
import { createClient } from '@/lib/supabase/browser';
import { calculateSuccessionFitScore } from '@/lib/scoring';
import { BuyerReadinessInput, Canton, Sector, SwipeAction } from '@/lib/types';
import { SECTOR_VALUES, SECTOR_LABELS_PT, CANTON_VALUES, CANTON_LABELS_DE } from '@/lib/taxonomy';
import { SWIPES_PER_DAY as DAILY_LIMIT } from '@/lib/constants';
import { useTranslation } from '@/lib/i18n/LocaleContext';
import { trackSwipe } from '@/lib/analytics';

/* ─────────────────────────── types ─────────────────────────── */

interface CardData {
  id: string;
  name: string;
  sector: string;
  canton: string;
  city: string;
  priceMin: number;
  priceMax: number;
  photos: string[];
  establishedYear: number;
  description: string;
  annualRevenue: number;
}

interface SavedBusiness {
  id: string;
  name: string;
  city: string;
  price_min: number;
  price_max: number;
}

interface BusinessRow {
  id: string;
  name: string;
  sector: string;
  canton: string;
  city: string;
  price_min: number;
  price_max: number;
  annual_revenue: number;
  established_year: number;
  description: string;
  photos: string[];
  status: string;
  created_at: string;
}

interface DesktopFilters {
  cantons: string[];
  sectors: string[];
  priceMin: string;
  priceMax: string;
  revenueMin: string;
  revenueMax: string;
}

type ViewMode = 'grid' | 'list';

/* ─────────────────────────── constants ─────────────────────────── */

const CANTON_LABELS = CANTON_LABELS_DE;

const ALL_CANTONS: string[] = CANTON_VALUES.filter((c) => c !== 'outro');
const ALL_SECTORS: string[] = SECTOR_VALUES.filter((s) => s !== 'outro');

const DEFAULT_FILTERS: DesktopFilters = {
  cantons: [],
  sectors: [],
  priceMin: '',
  priceMax: '',
  revenueMin: '',
  revenueMax: '',
};

/* ─────────────────────────── helpers ─────────────────────────── */

function fmtCHF(n: number): string {
  return new Intl.NumberFormat('de-CH', { maximumFractionDigits: 0 }).format(n);
}

function fmtK(n: number): string {
  return `CHF ${fmtCHF(Math.round(n / 1000))}k`;
}

function applyFilters(businesses: BusinessRow[], filters: DesktopFilters): BusinessRow[] {
  return businesses.filter((b) => {
    if (filters.cantons.length && !filters.cantons.includes(b.canton)) return false;
    if (filters.sectors.length && !filters.sectors.includes(b.sector)) return false;
    if (filters.priceMin && b.price_min < Number(filters.priceMin)) return false;
    if (filters.priceMax && b.price_max > Number(filters.priceMax)) return false;
    if (filters.revenueMin && b.annual_revenue < Number(filters.revenueMin)) return false;
    if (filters.revenueMax && b.annual_revenue > Number(filters.revenueMax)) return false;
    return true;
  });
}

/* ─────────────────────────── sub-components ─────────────────────────── */

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
      }}
    >
      <div className="h-40" style={{ background: 'rgba(255,255,255,0.05)' }} />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-16 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="h-4 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="h-3 w-1/2 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="h-3 w-2/3 rounded" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>
    </div>
  );
}

interface GridCardProps {
  business: BusinessRow;
  fitScore: number;
}

function GridCard({ business: b, fitScore }: GridCardProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
      }}
    >
      {/* image placeholder */}
      <div
        className="h-40 flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #1f2937 100%)',
        }}
      />
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* sector badge */}
        <span
          className="self-start text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.2)',
            color: '#34d399',
          }}
        >
          {b.sector}
        </span>

        {/* name */}
        <p className="font-semibold text-base leading-snug text-white">{b.name}</p>

        {/* location */}
        <p className="text-xs" style={{ color: '#6b7280' }}>
          {b.canton} · {b.city}
        </p>

        {/* price */}
        <p className="text-sm text-white">
          {fmtK(b.price_min)} – {fmtK(b.price_max)}
        </p>

        {/* revenue */}
        <p className="text-xs" style={{ color: '#6b7280' }}>
          Umsatz: {fmtK(b.annual_revenue)}
        </p>

        {/* fit score */}
        <span
          className="self-start text-xs px-2 py-0.5 rounded-full font-medium mt-auto"
          style={{
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.2)',
            color: '#10b981',
          }}
        >
          ⚡ {fitScore}% Match
        </span>

        {/* actions */}
        <div className="flex gap-2 mt-2">
          <Link
            href={`/opportunity/${b.id}`}
            className="flex-1 text-center text-xs py-2 rounded-xl font-medium transition-colors"
            style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)',
              color: '#34d399',
            }}
          >
            Details →
          </Link>
          <button
            className="px-3 py-2 rounded-xl text-xs font-medium"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#6b7280',
            }}
            aria-label="Speichern"
          >
            🔖
          </button>
        </div>
      </div>
    </div>
  );
}

interface ListCardProps {
  business: BusinessRow;
  fitScore: number;
}

function ListCard({ business: b, fitScore }: ListCardProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex items-center gap-4 p-4"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
      }}
    >
      {/* thumbnail */}
      <div
        className="w-20 h-16 rounded-xl flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #1f2937 100%)' }}
      />
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)',
              color: '#34d399',
            }}
          >
            {b.sector}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.2)',
              color: '#10b981',
            }}
          >
            ⚡ {fitScore}% Match
          </span>
        </div>
        <p className="font-semibold text-sm text-white truncate">{b.name}</p>
        <p className="text-xs" style={{ color: '#6b7280' }}>
          {b.canton} · {b.city} · {fmtK(b.price_min)} – {fmtK(b.price_max)}
        </p>
        <p className="text-xs" style={{ color: '#4b5563' }}>Umsatz: {fmtK(b.annual_revenue)}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={`/opportunity/${b.id}`}
          className="text-xs py-2 px-3 rounded-xl font-medium"
          style={{
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.2)',
            color: '#34d399',
          }}
        >
          Details →
        </Link>
        <button
          className="px-3 py-2 rounded-xl text-xs font-medium"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#6b7280',
          }}
          aria-label="Speichern"
        >
          🔖
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── page ─────────────────────────── */

export default function DiscoverPage() {
  const { t } = useTranslation();
  const supabase = createClient();

  /* ── mobile swipe state (unchanged) ── */
  const [card, setCard] = useState<CardData | null>(null);
  const [fitScore, setFitScore] = useState(75);
  const [swipesRemaining, setSwipesRemaining] = useState(DAILY_LIMIT);
  const [loading, setLoading] = useState(true);
  const [limitReached, setLimitReached] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [noProfile, setNoProfile] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [savedBusinesses, setSavedBusinesses] = useState<SavedBusiness[]>([]);
  const [buyerProfile, setBuyerProfile] = useState<BuyerReadinessInput | null>(null);
  const [showLocationBanner, setShowLocationBanner] = useState(false);
  const [userCanton, setUserCanton] = useState<Canton | null>(null);

  /* ── desktop state ── */
  const [allBusinesses, setAllBusinesses] = useState<BusinessRow[]>([]);
  const [desktopLoading, setDesktopLoading] = useState(true);
  const [filters, setFilters] = useState<DesktopFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<DesktopFilters>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  /* ─────────── helpers ─────────── */

  const getUserId = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id ?? '';
  }, [supabase]);

  const fetchSaved = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('interactions')
      .select('action, businesses(id, name, city, price_min, price_max)')
      .eq('buyer_id', userId)
      .in('action', ['like', 'save']);
    if (data) {
      const seen = new Set<string>();
      const businesses: SavedBusiness[] = [];
      for (const row of data as { businesses: SavedBusiness[] }[]) {
        for (const b of row.businesses ?? []) {
          if (b && !seen.has(b.id)) { seen.add(b.id); businesses.push(b); }
        }
      }
      setSavedBusinesses(businesses);
    }
  }, [supabase]);

  const fetchNextCard = useCallback(async (canton?: Canton | null) => {
    setLoading(true);
    const userId = await getUserId();
    const url = new URL('/api/interactions/get-next-card', window.location.origin);
    if (canton) url.searchParams.set('canton', canton);
    const res = await fetch(url.toString(), {
      headers: { 'x-user-id': userId },
    });
    const json = await res.json();
    if (res.status === 429) {
      setLimitReached(true);
      setSwipesRemaining(0);
      setLoading(false);
      return;
    }
    if (json.swipesRemaining !== undefined) setSwipesRemaining(json.swipesRemaining);
    if (!json.business) {
      setNoMore(true);
      setCard(null);
    } else {
      setCard(json.business);
      setNoMore(false);
    }
    setLoading(false);
  }, [getUserId]);

  /* ─────────── init ─────────── */

  useEffect(() => {
    async function init() {
      const userId = await getUserId();
      if (!userId) { setLoading(false); return; }

      const { data: profile } = await supabase
        .from('buyer_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profile) {
        setBuyerProfile({
          capitalMin: profile.capital_min || 0,
          capitalMax: profile.capital_max || 0,
          capitalSource: 'proprio',
          sectorsInterested: profile.sectors_interested || [],
          openToOtherSectors: profile.explore_other_regions || false,
          regionMain: profile.region_main || 'ZH',
          radiusKm: profile.radius_km || 20,
          exploreOtherRegions: profile.explore_other_regions || false,
          involvementType: profile.involvement_type || 'unknown',
          hoursAvailablePerWeek: profile.hours_available_per_week || 0,
          experienceBackground: profile.experience_background || '',
          timelineMonths: profile.timeline_months || 6,
          languages: profile.languages || [],
        });
      } else {
        try {
          const raw = localStorage.getItem('succedix_buyer_profile');
          if (raw) setBuyerProfile(JSON.parse(raw));
          else setNoProfile(true);
        } catch { setNoProfile(true); }
      }

      const dismissed = localStorage.getItem('location_banner_dismissed');
      if (!dismissed) setShowLocationBanner(true);

      await fetchSaved(userId);
      await fetchNextCard();
    }
    init();
  }, []);

  /* ── fetch desktop businesses ── */
  useEffect(() => {
    async function fetchBusinesses() {
      setDesktopLoading(true);
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .in('status', ['published', 'approved'])
        .order('created_at', { ascending: false });
      if (data) setAllBusinesses(data as BusinessRow[]);
      setDesktopLoading(false);
    }
    fetchBusinesses();
  }, []);

  /* ── fit score for mobile card ── */
  useEffect(() => {
    if (!card || !buyerProfile) return;
    const score = calculateSuccessionFitScore({
      id: card.id,
      name: card.name,
      sector: card.sector as Sector,
      canton: card.canton as Canton,
      city: card.city,
      distanceKm: 15,
      priceMin: card.priceMin,
      priceMax: card.priceMax,
      establishedYear: card.establishedYear,
      photoUrl: '',
      sellerReadinessScore: 0,
      tags: [],
    }, buyerProfile);
    setFitScore(score);
  }, [card, buyerProfile]);

  /* ── toast auto-clear ── */
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  /* ─────────── handlers ─────────── */

  async function handleSwipe(action: SwipeAction) {
    if (!card) return;
    const userId = await getUserId();
    const res = await fetch('/api/interactions/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
      body: JSON.stringify({ businessId: card.id, action }),
    });
    const json = await res.json();
    if (res.status === 429) { setLimitReached(true); setSwipesRemaining(0); return; }
    if (json.swipesRemaining !== undefined) setSwipesRemaining(json.swipesRemaining);
    if (json.limitReached) setLimitReached(true);
    trackSwipe(action, card.id);
    if (action === 'like') setToast(t.discover.toastLike);
    else if (action === 'save') setToast(t.discover.toastSave);
    else setToast(t.discover.toastPass);
    if (action !== 'pass') fetchSaved(userId);
    if (!json.limitReached) fetchNextCard(userCanton);
  }

  function toggleCanton(c: string) {
    setFilters((prev) => ({
      ...prev,
      cantons: prev.cantons.includes(c)
        ? prev.cantons.filter((x) => x !== c)
        : [...prev.cantons, c],
    }));
  }

  function toggleSector(s: string) {
    setFilters((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(s)
        ? prev.sectors.filter((x) => x !== s)
        : [...prev.sectors, s],
    }));
  }

  function handleApplyFilters() {
    setAppliedFilters({ ...filters });
  }

  function handleResetFilters() {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  }

  /* ─────────── derived data ─────────── */

  const filteredBusinesses = applyFilters(allBusinesses, appliedFilters);

  // Simple static fit score for desktop cards (no per-card async calc)
  function desktopFitScore(b: BusinessRow): number {
    if (!buyerProfile) return 72;
    return calculateSuccessionFitScore(
      {
        id: b.id,
        name: b.name,
        sector: b.sector as Sector,
        canton: b.canton as Canton,
        city: b.city,
        distanceKm: 20,
        priceMin: b.price_min,
        priceMax: b.price_max,
        establishedYear: b.established_year,
        photoUrl: '',
        sellerReadinessScore: 0,
        tags: [],
      },
      buyerProfile,
    );
  }

  /* ─────────── early returns ─────────── */

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#080808' }}>
      <div className="w-8 h-8 rounded-full border-2 border-success border-t-transparent animate-spin" />
    </div>
  );

  if (noProfile) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center" style={{ background: '#080808' }}>
      <h2 className="font-serif text-2xl font-bold">{t.discover.noProfileTitle}</h2>
      <p className="text-sm" style={{ color: '#6b7280' }}>{t.discover.noProfileDesc}</p>
      <Link href="/onboarding/buyer"><Button variant="primary">{t.discover.noProfileCta}</Button></Link>
    </div>
  );

  /* ─────────── render ─────────── */

  return (
    <main className="min-h-screen" style={{ background: '#080808' }}>

      {/* ══════════════════════════════════════════════
          DESKTOP LAYOUT  (hidden on mobile)
      ══════════════════════════════════════════════ */}
      <div className="hidden md:flex gap-6 px-6 py-8 max-w-screen-xl mx-auto">

        {/* ── Left sidebar ── */}
        <aside
          className="w-72 flex-shrink-0 sticky top-24 self-start overflow-y-auto rounded-2xl p-6 flex flex-col gap-6"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16,
            maxHeight: 'calc(100vh - 7rem)',
          }}
        >
          {/* header */}
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white text-base">Filter</h2>
            <button
              onClick={handleResetFilters}
              className="text-xs transition-colors"
              style={{ color: '#6b7280' }}
            >
              Zurücksetzen
            </button>
          </div>

          {/* Kanton */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium tracking-wide uppercase" style={{ color: '#4b5563' }}>Kanton</p>
            <div className="flex flex-wrap gap-2">
              {ALL_CANTONS.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleCanton(c)}
                  className="text-xs px-2.5 py-1 rounded-full font-medium transition-all"
                  style={
                    filters.cantons.includes(c)
                      ? { background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981' }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#6b7280' }
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Sektor */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium tracking-wide uppercase" style={{ color: '#4b5563' }}>Sektor</p>
            <div className="flex flex-col gap-2">
              {ALL_SECTORS.map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.sectors.includes(s)}
                    onChange={() => toggleSector(s)}
                    className="w-3.5 h-3.5 accent-emerald-500 rounded"
                  />
                  <span className="text-sm" style={{ color: filters.sectors.includes(s) ? '#10b981' : '#6b7280' }}>
                    {SECTOR_LABELS_PT[s as Sector] ?? s}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Preis */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium tracking-wide uppercase" style={{ color: '#4b5563' }}>Preis</p>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min CHF"
                value={filters.priceMin}
                onChange={(e) => setFilters((p) => ({ ...p, priceMin: e.target.value }))}
                className="w-full rounded-xl px-3 py-2 text-xs outline-none"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#e5e7eb',
                }}
              />
              <input
                type="number"
                placeholder="Max CHF"
                value={filters.priceMax}
                onChange={(e) => setFilters((p) => ({ ...p, priceMax: e.target.value }))}
                className="w-full rounded-xl px-3 py-2 text-xs outline-none"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#e5e7eb',
                }}
              />
            </div>
          </div>

          {/* Umsatz */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium tracking-wide uppercase" style={{ color: '#4b5563' }}>Umsatz</p>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min CHF"
                value={filters.revenueMin}
                onChange={(e) => setFilters((p) => ({ ...p, revenueMin: e.target.value }))}
                className="w-full rounded-xl px-3 py-2 text-xs outline-none"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#e5e7eb',
                }}
              />
              <input
                type="number"
                placeholder="Max CHF"
                value={filters.revenueMax}
                onChange={(e) => setFilters((p) => ({ ...p, revenueMax: e.target.value }))}
                className="w-full rounded-xl px-3 py-2 text-xs outline-none"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#e5e7eb',
                }}
              />
            </div>
          </div>

          {/* Apply button */}
          <button
            onClick={handleApplyFilters}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: '#10b981', color: '#fff' }}
          >
            Filter anwenden
          </button>
        </aside>

        {/* ── Right content area ── */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">

          {/* header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl font-bold text-white">Inserate</h1>
              {!desktopLoading && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#6b7280',
                  }}
                >
                  {filteredBusinesses.length}
                </span>
              )}
            </div>

            {/* view toggle */}
            <div
              className="flex items-center gap-1 p-1 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <button
                onClick={() => setViewMode('grid')}
                className="p-2 rounded-lg transition-all text-sm"
                style={
                  viewMode === 'grid'
                    ? { background: 'rgba(16,185,129,0.15)', color: '#10b981' }
                    : { color: '#4b5563' }
                }
                aria-label="Grid view"
                title="Grid"
              >
                {/* grid icon */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="0" y="0" width="6" height="6" rx="1.5" fill="currentColor" />
                  <rect x="8" y="0" width="6" height="6" rx="1.5" fill="currentColor" />
                  <rect x="0" y="8" width="6" height="6" rx="1.5" fill="currentColor" />
                  <rect x="8" y="8" width="6" height="6" rx="1.5" fill="currentColor" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="p-2 rounded-lg transition-all text-sm"
                style={
                  viewMode === 'list'
                    ? { background: 'rgba(16,185,129,0.15)', color: '#10b981' }
                    : { color: '#4b5563' }
                }
                aria-label="List view"
                title="Liste"
              >
                {/* list icon */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="0" y="1" width="14" height="2" rx="1" fill="currentColor" />
                  <rect x="0" y="6" width="14" height="2" rx="1" fill="currentColor" />
                  <rect x="0" y="11" width="14" height="2" rx="1" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>

          {/* skeleton / content */}
          {desktopLoading ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div
              className="rounded-2xl p-12 flex flex-col items-center gap-4 text-center"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="text-4xl">🔍</span>
              <p className="font-semibold text-white">Keine Inserate gefunden</p>
              <p className="text-sm" style={{ color: '#6b7280' }}>Passen Sie Ihre Filterkriterien an.</p>
              <button
                onClick={handleResetFilters}
                className="mt-2 text-sm px-4 py-2 rounded-xl font-medium"
                style={{
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  color: '#10b981',
                }}
              >
                Filter zurücksetzen
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredBusinesses.map((b) => (
                <GridCard key={b.id} business={b} fitScore={desktopFitScore(b)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredBusinesses.map((b) => (
                <ListCard key={b.id} business={b} fitScore={desktopFitScore(b)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE LAYOUT  (hidden on desktop) — original Tinder swipe
      ══════════════════════════════════════════════ */}
      <div className="flex md:hidden flex-col">
        <div className="px-4 py-12">
          <div className="max-w-lg mx-auto flex flex-col gap-8">
            {showLocationBanner && (
              <LocationBanner
                onDetected={(canton) => {
                  setShowLocationBanner(false);
                  if (canton) {
                    setUserCanton(canton);
                    fetchNextCard(canton);
                  }
                }}
                onDismiss={() => setShowLocationBanner(false)}
              />
            )}

            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl font-bold">{t.discover.title}</h1>
                <p className="text-sm mt-0.5" style={{ color: '#4b5563' }}>
                  {swipesRemaining} {swipesRemaining !== 1 ? t.discover.swipePlural : t.discover.swipeSingular}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {userCanton && (
                  <span
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}
                  >
                    📍 {CANTON_LABELS[userCanton] ?? userCanton}
                    <button
                      onClick={() => { setUserCanton(null); fetchNextCard(null); }}
                      className="ml-1 leading-none"
                      style={{ color: '#6b7280' }}
                    >
                      ×
                    </button>
                  </span>
                )}
                <Link href="/" className="text-sm" style={{ color: '#4b5563' }}>{t.discover.back}</Link>
              </div>
            </div>

            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${((DAILY_LIMIT - swipesRemaining) / DAILY_LIMIT) * 100}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }}
              />
            </div>

            {!limitReached && !noMore && card ? (
              <div className="flex flex-col items-center gap-5">
                <SwipeCard
                  business={{
                    id: card.id,
                    name: card.name,
                    sector: card.sector as Sector,
                    canton: card.canton as Canton,
                    city: card.city,
                    distanceKm: 15,
                    priceMin: card.priceMin,
                    priceMax: card.priceMax,
                    establishedYear: card.establishedYear,
                    photoUrl: '',
                    sellerReadinessScore: 0,
                    tags: [],
                  }}
                  fitScore={fitScore}
                />
                <div className="flex items-center gap-3 w-full max-w-sm">
                  <button onClick={() => handleSwipe('pass')} className="flex-1 h-12 rounded-full text-sm font-medium" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>{t.discover.pass}</button>
                  <button onClick={() => handleSwipe('like')} className="flex-1 h-12 rounded-full text-sm font-medium" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>{t.discover.like}</button>
                  <button onClick={() => handleSwipe('save')} className="h-12 px-4 rounded-full text-sm font-medium" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>{t.discover.save}</button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl p-10 flex flex-col items-center gap-4 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-4xl">{limitReached ? '⏳' : '🎉'}</span>
                <h2 className="font-serif text-xl font-semibold">{limitReached ? t.discover.limitTitle : t.discover.noMoreTitle}</h2>
                <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
                  {limitReached ? t.discover.limitDesc : t.discover.noMoreDesc}
                </p>
                {limitReached && <Button variant="primary" className="mt-2">{t.discover.limitUpgrade}</Button>}
              </div>
            )}

            {savedBusinesses.length > 0 && (
              <section>
                <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#4b5563' }}>{t.discover.savedTitle} ({savedBusinesses.length})</p>
                <div className="flex flex-col gap-2">
                  {savedBusinesses.map((b, i) => (
                    <div key={b.id ?? i} className="px-4 py-3 rounded-xl flex items-center justify-between text-sm" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="font-medium">{b.name}</span>
                      <span style={{ color: '#4b5563' }}>{b.city} · CHF {((b.price_min || 0) / 1000).toFixed(0)}k</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* ── toast (shared) ── */}
      {toast && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 text-sm px-5 py-2.5 rounded-full"
          style={{
            background: 'rgba(17,17,17,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            color: '#e5e7eb',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          {toast}
        </div>
      )}
    </main>
  );
}
