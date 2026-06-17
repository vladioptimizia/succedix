'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { SwipeCard } from '@/app/components/SwipeCard';
import { createClient } from '@/lib/supabase/browser';

interface Business {
  id: string;
  name: string;
  sector: string;
  canton: string;
  city: string;
  priceMin: number;
  priceMax: number;
  photos: string[];
  establishedYear: number;
  description?: string;
}

export default function DiscoveryPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [swipesRemaining, setSwipesRemaining] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  const fetchNextCard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/interactions/get-next-card', {
        headers: { 'x-user-id': userId || '' },
      });
      const data = await res.json();
      if (res.status === 429) {
        setSwipesRemaining(0);
        setError('Limite diário atingido! Volte amanhã.');
        setBusiness(null);
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Erro ao carregar');
      setBusiness(data.business ?? null);
      if (data.swipesRemaining !== undefined) setSwipesRemaining(data.swipesRemaining);
      if (!data.business) setError('Nenhum negócio disponível no momento.');
    } catch (err) {
      setError('Erro ao carregar. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId !== null) fetchNextCard();
  }, [userId, fetchNextCard]);

  const handleSwipe = async (action: 'like' | 'pass' | 'save') => {
    if (!business) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/interactions/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId || '' },
        body: JSON.stringify({ businessId: business.id, action }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setSwipesRemaining(0);
        setError('Limite diário atingido! Volte amanhã.');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Erro ao processar swipe');
      if (data.swipesRemaining !== undefined) setSwipesRemaining(data.swipesRemaining);
      const msg = action === 'like' ? '♥ Adicionado aos favoritos!'
        : action === 'pass' ? '👋 Passado'
        : '📌 Guardado para depois!';
      setFeedbackMessage(msg);
      setTimeout(() => setFeedbackMessage(null), 2000);
      await new Promise((r) => setTimeout(r, 500));
      fetchNextCard();
    } catch (err) {
      setError(`Erro: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-40 bg-gray-950/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg font-semibold text-white">
            Succedix<span className="text-green-500">.</span>
          </Link>
          <p className="text-gray-500 text-sm">Descubra oportunidades 🔍</p>
        </div>
      </header>

      <div className="pt-14">
        {business && !error ? (
          <SwipeCard
            business={business}
            onSwipe={handleSwipe}
            swipesRemaining={swipesRemaining}
            swipesMax={5}
            isLoading={isLoading}
          />
        ) : isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p>A carregar negócios...</p>
            </div>
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center max-w-sm">
              <p className="text-gray-400 text-lg mb-6">{error || 'Nenhum negócio disponível.'}</p>
              {swipesRemaining > 0 && (
                <button
                  onClick={fetchNextCard}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium"
                >
                  Tentar novamente
                </button>
              )}
              {swipesRemaining === 0 && (
                <Link href="/" className="text-green-400 underline text-sm">Voltar ao início</Link>
              )}
            </div>
          </div>
        )}
      </div>

      {feedbackMessage && (
        <div className="fixed top-16 left-4 right-4 max-w-md mx-auto bg-green-600 text-white px-6 py-3 rounded-xl text-center text-sm font-medium z-50 shadow-lg">
          {feedbackMessage}
        </div>
      )}
    </div>
  );
}
