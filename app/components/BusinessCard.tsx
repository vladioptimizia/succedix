'use client';

import { useState } from 'react';

interface Business {
  id: string;
  name: string;
  sector: string;
  canton: string;
  priceMin: number;
  priceMax: number;
  photos: string[];
  establishedYear: number;
}

interface BusinessCardProps {
  business: Business;
  onLike: () => Promise<void>;
  onPass: () => Promise<void>;
  onSave: () => Promise<void>;
  swipesRemaining: number;
  swipesMax: number;
}

export function BusinessCard({
  business,
  onLike,
  onPass,
  onSave,
  swipesRemaining,
  swipesMax,
}: BusinessCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSwipe = async (action: 'like' | 'pass' | 'save') => {
    setIsLoading(true);
    try {
      if (action === 'like') await onLike();
      if (action === 'pass') await onPass();
      if (action === 'save') await onSave();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black rounded-lg border border-gray-800 overflow-hidden">
      <div className="w-full h-64 bg-gray-900">
        {business.photos?.[0] ? (
          <img
            src={business.photos[0]}
            alt={business.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            Sem foto
          </div>
        )}
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-2">{business.name}</h2>
        <p className="text-gray-400 mb-4">{business.sector}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600 text-sm">Localização</p>
            <p className="text-white">📍 {business.canton}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Preço</p>
            <p className="text-white">CHF {business.priceMin}k-{business.priceMax}k</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Desde</p>
            <p className="text-white">{business.establishedYear}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Fit Score</p>
            <p className="text-green-400">87% 🟢</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleSwipe('pass')}
            disabled={isLoading}
            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold disabled:opacity-50"
          >
            ← PASS
          </button>
          <button
            onClick={() => handleSwipe('like')}
            disabled={isLoading}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold disabled:opacity-50"
          >
            ♡ LIKE
          </button>
          <button
            onClick={() => handleSwipe('save')}
            disabled={isLoading}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold disabled:opacity-50"
          >
            📌 SAVE
          </button>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <p className="text-gray-400 text-sm mb-2">
            {swipesRemaining} swipes restantes hoje
          </p>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${(swipesRemaining / swipesMax) * 100}%` }}
            />
          </div>
          {swipesRemaining === 0 && (
            <p className="text-red-400 text-xs mt-2">
              Limite atingido. Volte amanhã para novos swipes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
