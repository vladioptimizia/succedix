"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import SwipeCard from "@/components/SwipeCard";
import { MOCK_BUSINESSES } from "@/lib/mockBusinesses";
import { calculateSuccessionFitScore } from "@/lib/scoring";
import { BuyerReadinessInput, SwipeAction } from "@/lib/types";

const DAILY_LIMIT = 5;
const STORAGE_PROFILE = "succedix_buyer_profile";
const STORAGE_INTERACTIONS = "succedix_interactions";
const STORAGE_SWIPE_COUNTER = "succedix_swipe_counter";

const DEFAULT_PROFILE: BuyerReadinessInput = {
  capitalMin: 100000,
  capitalMax: 250000,
  capitalSource: "proprio",
  sectorsInterested: ["cafe", "restaurante"],
  openToOtherSectors: true,
  regionMain: "ZH",
  radiusKm: 30,
  exploreOtherRegions: true,
  involvementType: "operator",
  hoursAvailablePerWeek: 40,
  experienceBackground: "Gestão bancária",
  timelineMonths: 6,
  languages: ["Português", "Inglês"],
};

interface Interaction { businessId: string; action: SwipeAction; }
interface SwipeCounter { date: string; count: number; }

function todayKey() { return new Date().toISOString().slice(0, 10); }

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const raw = window.localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : fallback; }
  catch { return fallback; }
}

function saveJSON(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export default function DiscoverPage() {
  const [profile, setProfile] = useState<BuyerReadinessInput | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [counter, setCounter] = useState<SwipeCounter>({ date: todayKey(), count: 0 });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setProfile(loadJSON<BuyerReadinessInput | null>(STORAGE_PROFILE, null) ?? DEFAULT_PROFILE);
    setInteractions(loadJSON<Interaction[]>(STORAGE_INTERACTIONS, []));
    const stored = loadJSON<SwipeCounter>(STORAGE_SWIPE_COUNTER, { date: todayKey(), count: 0 });
    setCounter(stored.date === todayKey() ? stored : { date: todayKey(), count: 0 });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const scoredQueue = useMemo(() => {
    if (!profile) return [];
    const interacted = new Set(interactions.map((i) => i.businessId));
    return MOCK_BUSINESSES
      .filter((b) => !interacted.has(b.id))
      .map((b) => ({ business: b, fitScore: calculateSuccessionFitScore(b, profile) }))
      .sort((a, b) => b.fitScore - a.fitScore);
  }, [profile, interactions]);

  const limitReached = counter.count >= DAILY_LIMIT;
  const current = !limitReached ? scoredQueue[0] : undefined;

  function recordInteraction(businessId: string, action: SwipeAction) {
    const next = [...interactions, { businessId, action }];
    setInteractions(next);
    saveJSON(STORAGE_INTERACTIONS, next);
    if (action !== "save") {
      const next2 = { date: todayKey(), count: counter.count + 1 };
      setCounter(next2);
      saveJSON(STORAGE_SWIPE_COUNTER, next2);
    }
    if (action === "like") setToast("Adicionado aos salvos");
    else if (action === "save") setToast("Guardado para depois");
    else setToast("Próximo negócio");
  }

  const savedBusinesses = interactions
    .filter((i) => i.action === "like" || i.action === "save")
    .map((i) => MOCK_BUSINESSES.find((b) => b.id === i.businessId))
    .filter(Boolean);

  if (!profile) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-success border-t-transparent animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-lg mx-auto flex flex-col gap-8">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold">Descobrir</h1>
            <p className="text-sm mt-0.5" style={{ color: '#4b5563' }}>
              {DAILY_LIMIT - counter.count} swipe{DAILY_LIMIT - counter.count !== 1 ? 's' : ''} restante{DAILY_LIMIT - counter.count !== 1 ? 's' : ''} hoje
            </p>
          </div>
          <Link href="/" className="text-sm transition-colors" style={{ color: '#4b5563' }}>← Início</Link>
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${(counter.count / DAILY_LIMIT) * 100}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }}
          />
        </div>

        {/* Main card + actions */}
        {!limitReached && current ? (
          <div className="flex flex-col items-center gap-5">
            <SwipeCard business={current.business} fitScore={current.fitScore} />
            <div className="flex items-center gap-3 w-full max-w-sm">
              <button
                onClick={() => recordInteraction(current.business.id, "pass")}
                className="flex-1 h-12 rounded-full text-sm font-medium transition-all"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
              >
                ← Passar
              </button>
              <button
                onClick={() => recordInteraction(current.business.id, "like")}
                className="flex-1 h-12 rounded-full text-sm font-medium transition-all"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}
              >
                ♡ Like
              </button>
              <button
                onClick={() => recordInteraction(current.business.id, "save")}
                className="h-12 px-4 rounded-full text-sm font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}
              >
                📌
              </button>
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl p-10 flex flex-col items-center gap-4 text-center"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-4xl">{limitReached ? '⏳' : '🎉'}</span>
            <h2 className="font-serif text-xl font-semibold">
              {limitReached ? 'Limite diário atingido' : 'Sem mais negócios'}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>
              {limitReached
                ? 'Volte amanhã ou faça upgrade para swipes ilimitados.'
                : 'Não há mais negócios disponíveis no momento.'}
            </p>
            <Button variant="primary" className="mt-2">Upgrade — CHF 24/mês</Button>
          </div>
        )}

        {/* Saved */}
        {savedBusinesses.length > 0 && (
          <section>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#4b5563' }}>Salvos ({savedBusinesses.length})</p>
            <div className="flex flex-col gap-2">
              {savedBusinesses.map((b) => (
                <div
                  key={b!.id}
                  className="px-4 py-3 rounded-xl flex items-center justify-between text-sm"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <span className="font-medium">{b!.name}</span>
                  <span style={{ color: '#4b5563' }}>{b!.city} · CHF {(b!.priceMin/1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 text-sm px-5 py-2.5 rounded-full"
          style={{ background: 'rgba(17,17,17,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', color: '#e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
        >
          {toast}
        </div>
      )}
    </main>
  );
}
