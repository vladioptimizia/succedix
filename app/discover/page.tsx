'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import SwipeCard from '@/components/SwipeCard';
import { createClient } from '@/lib/supabase/browser';
import { calculateSuccessionFitScore } from '@/lib/scoring';
import { BuyerReadinessInput, Canton, Sector, SwipeAction } from '@/lib/types';
import { SWIPES_PER_DAY as DAILY_LIMIT } from '@/lib/constants';

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

export default function DiscoverPage() {
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
  const supabase = createClient();

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
      // Supabase returns related records as arrays; flatten and deduplicate by id
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

  const fetchNextCard = useCallback(async () => {
    setLoading(true);
    const userId = await getUserId();
    const res = await fetch('/api/interactions/get-next-card', {
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

  useEffect(() => {
    async function init() {
      const userId = await getUserId();
      if (!userId) return;

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

      await fetchSaved(userId);
      await fetchNextCard();
    }
    init();
  }, []);

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

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

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
    if (action === 'like') setToast('Adicionado aos salvos');
    else if (action === 'save') setToast('Guardado para depois');
    else setToast('Próximo negócio');
    if (action !== 'pass') fetchSaved(userId);
    if (!json.limitReached) fetchNextCard();
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-success border-t-transparent animate-spin" />
    </div>
  );

  if (noProfile) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
      <h2 className="font-serif text-2xl font-bold">Complete o seu perfil primeiro</h2>
      <p className="text-sm" style={{ color: '#6b7280' }}>Precisamos saber o que procura para mostrar os melhores negócios.</p>
      <Link href="/onboarding/buyer"><Button variant="primary">Criar perfil de comprador</Button></Link>
    </div>
  );

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-lg mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold">Descobrir</h1>
            <p className="text-sm mt-0.5" style={{ color: '#4b5563' }}>
              {swipesRemaining} swipe{swipesRemaining !== 1 ? 's' : ''} restante{swipesRemaining !== 1 ? 's' : ''} hoje
            </p>
          </div>
          <Link href="/" className="text-sm" style={{ color: '#4b5563' }}>← Início</Link>
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
                sector: card.sector as any,
                canton: card.canton as any,
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
              <button onClick={() => handleSwipe('pass')} className="flex-1 h-12 rounded-full text-sm font-medium" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>← Passar</button>
              <button onClick={() => handleSwipe('like')} className="flex-1 h-12 rounded-full text-sm font-medium" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>♡ Like</button>
              <button onClick={() => handleSwipe('save')} className="h-12 px-4 rounded-full text-sm font-medium" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>📌</button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-10 flex flex-col items-center gap-4 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-4xl">{limitReached ? '⏳' : '🎉'}</span>
            <h2 className="font-serif text-xl font-semibold">{limitReached ? 'Limite diário atingido' : 'Sem mais negócios'}</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
              {limitReached ? 'Volte amanhã ou faça upgrade para swipes ilimitados.' : 'Não há mais negócios disponíveis. Novos negócios são adicionados regularmente.'}
            </p>
            {limitReached && <Button variant="primary" className="mt-2">Upgrade — CHF 24/mês</Button>}
          </div>
        )}

        {savedBusinesses.length > 0 && (
          <section>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#4b5563' }}>Salvos ({savedBusinesses.length})</p>
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

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-sm px-5 py-2.5 rounded-full" style={{ background: 'rgba(17,17,17,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', color: '#e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
          {toast}
        </div>
      )}
    </main>
  );
}
