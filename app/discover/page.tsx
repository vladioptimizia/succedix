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

interface Interaction {
  businessId: string;
  action: SwipeAction;
}

interface SwipeCounter {
  date: string;
  count: number;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
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
    const storedProfile = loadJSON<BuyerReadinessInput | null>(STORAGE_PROFILE, null);
    setProfile(storedProfile ?? DEFAULT_PROFILE);
    setInteractions(loadJSON<Interaction[]>(STORAGE_INTERACTIONS, []));

    const storedCounter = loadJSON<SwipeCounter>(STORAGE_SWIPE_COUNTER, {
      date: todayKey(),
      count: 0,
    });
    setCounter(storedCounter.date === todayKey() ? storedCounter : { date: todayKey(), count: 0 });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const scoredQueue = useMemo(() => {
    if (!profile) return [];
    const interacted = new Set(interactions.map((i) => i.businessId));
    return MOCK_BUSINESSES.filter((b) => !interacted.has(b.id))
      .map((b) => ({
        business: b,
        fitScore: calculateSuccessionFitScore(b, profile),
      }))
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

    if (action === "like") setToast("♡ Adicionado aos Salvos");
    else if (action === "save") setToast("📌 Guardado para depois");
    else setToast("Próximo...");
  }

  const savedBusinesses = interactions
    .filter((i) => i.action === "like" || i.action === "save")
    .map((i) => MOCK_BUSINESSES.find((b) => b.id === i.businessId))
    .filter(Boolean);

  if (!profile) {
    return <main className="min-h-screen flex items-center justify-center">Carregando...</main>;
  }

  return (
    <main className="min-h-screen px-6 py-10 flex flex-col items-center gap-8">
      <header className="w-full max-w-sm flex items-center justify-between">
        <h1 className="text-xl font-bold">Descobrir</h1>
        <Link href="/" className="text-sm text-gray-400 hover:text-white">
          Sair
        </Link>
      </header>

      {!limitReached && current && (
        <div className="flex flex-col items-center gap-6">
          <SwipeCard business={current.business} fitScore={current.fitScore} />
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => recordInteraction(current.business.id, "pass")}
            >
              ← Pass
            </Button>
            <Button
              variant="primary"
              onClick={() => recordInteraction(current.business.id, "like")}
            >
              ♡ Like
            </Button>
            <Button
              variant="ghost"
              onClick={() => recordInteraction(current.business.id, "save")}
            >
              📌 Guardar
            </Button>
          </div>
          <LimitIndicator used={counter.count} max={DAILY_LIMIT} />
        </div>
      )}

      {(limitReached || !current) && (
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <p className="text-lg font-semibold">
            {limitReached
              ? "Explorou todos os negócios de hoje!"
              : "Não há mais negócios disponíveis no momento."}
          </p>
          <p className="text-gray-400 text-sm">
            Próximas oportunidades em 24h, ou faça upgrade para ilimitado.
          </p>
          <Button variant="primary">Upgrade agora (CHF 24/mês)</Button>
        </div>
      )}

      {savedBusinesses.length > 0 && (
        <section className="w-full max-w-sm">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">
            Salvos ({savedBusinesses.length})
          </h2>
          <ul className="space-y-2">
            {savedBusinesses.map((b) => (
              <li
                key={b!.id}
                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-sm"
              >
                <span className="font-medium">{b!.name}</span>
                <span className="text-gray-400">
                  {" "}
                  — {b!.city} | CHF {(b!.priceMin / 1000).toFixed(0)}k-
                  {(b!.priceMax / 1000).toFixed(0)}k
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 px-4 py-2 rounded-full text-sm shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}

function LimitIndicator({ used, max }: { used: number; max: number }) {
  const remaining = max - used;
  return (
    <div className="w-full max-w-sm text-center text-sm text-gray-400">
      {remaining} swipe{remaining !== 1 ? "s" : ""} restante{remaining !== 1 ? "s" : ""} hoje
      <div className="w-full h-1.5 bg-gray-800 rounded-full mt-2">
        <div
          className="h-1.5 bg-success rounded-full transition-all"
          style={{ width: `${(used / max) * 100}%` }}
        />
      </div>
    </div>
  );
}
