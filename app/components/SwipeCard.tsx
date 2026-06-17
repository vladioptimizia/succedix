'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

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

interface SwipeCardProps {
  business: Business;
  onSwipe: (action: 'like' | 'pass' | 'save') => Promise<void>;
  swipesRemaining: number;
  swipesMax: number;
  isLoading?: boolean;
}

const SWIPE_THRESHOLD = 100;
const ROTATION_ANGLE = 15;

export function SwipeCard({
  business,
  onSwipe,
  swipesRemaining,
  swipesMax,
  isLoading = false,
}: SwipeCardProps) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeAction, setSwipeAction] = useState<'like' | 'pass' | 'save' | null>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const getSwipeDirection = (xPos: number, yPos: number): 'like' | 'pass' | 'save' | null => {
    const absX = Math.abs(xPos);
    const absY = Math.abs(yPos);
    if (absY > absX && yPos < -SWIPE_THRESHOLD) return 'save';
    if (xPos > SWIPE_THRESHOLD) return 'like';
    if (xPos < -SWIPE_THRESHOLD) return 'pass';
    return null;
  };

  const handleDragEnd = async (_event: unknown, info: { offset: { x: number; y: number } }) => {
    const action = getSwipeDirection(info.offset.x, info.offset.y);

    if (action) {
      if (action === 'like') { setX(1000); setRotation(45); }
      else if (action === 'pass') { setX(-1000); setRotation(-45); }
      else if (action === 'save') { setY(-1000); }

      await new Promise((resolve) => setTimeout(resolve, 300));
      await onSwipe(action);

      setX(0); setY(0); setRotation(0); setSwipeAction(null);
    } else {
      setX(0); setY(0); setRotation(0); setSwipeAction(null);
    }

    setIsDragging(false);
  };

  const handleDrag = (_event: unknown, info: { offset: { x: number; y: number } }) => {
    setX(info.offset.x);
    setY(info.offset.y);
    setRotation((info.offset.x / window.innerWidth) * ROTATION_ANGLE);
    setSwipeAction(getSwipeDirection(info.offset.x, info.offset.y));
  };

  const cardBorder =
    swipeAction === 'like' ? 'border-green-500 bg-green-500/5'
    : swipeAction === 'pass' ? 'border-red-500 bg-red-500/5'
    : swipeAction === 'save' ? 'border-blue-500 bg-blue-500/5'
    : 'border-gray-700';

  const actionLabel =
    swipeAction === 'like' ? '♥ LIKE'
    : swipeAction === 'pass' ? '← PASS'
    : swipeAction === 'save' ? '📌 SAVE'
    : null;

  const actionColor =
    swipeAction === 'like' ? 'bg-green-600'
    : swipeAction === 'pass' ? 'bg-red-600'
    : 'bg-blue-600';

  const triggerSwipe = (action: 'like' | 'pass' | 'save') => {
    if (action === 'like') { setX(1000); setRotation(45); }
    else if (action === 'pass') { setX(-1000); setRotation(-45); }
    else { setY(-1000); }
    setTimeout(() => onSwipe(action), 300);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div
        ref={constraintsRef}
        className="relative w-full max-w-md h-screen max-h-[600px] flex items-center justify-center"
      >
        <motion.div
          drag
          dragElastic={0.2}
          dragConstraints={constraintsRef}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onDragStart={() => setIsDragging(true)}
          animate={{ x, y, rotate: rotation }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`absolute w-full h-full bg-gray-950 rounded-2xl border-2 ${cardBorder} cursor-grab active:cursor-grabbing shadow-2xl overflow-hidden transition-colors duration-200`}
        >
          {/* Imagem */}
          <div className="w-full h-1/2 bg-gray-900 relative">
            {business.photos?.[0] ? (
              <img src={business.photos[0]} alt={business.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-5xl">
                🏢
              </div>
            )}

            {actionLabel && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className={`text-4xl font-bold px-8 py-4 rounded-2xl text-white ${actionColor}`}>
                  {actionLabel}
                </div>
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <div className="w-full h-1/2 p-6 flex flex-col justify-between bg-black">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{business.name}</h2>
              <p className="text-gray-400 text-sm mb-3">{business.sector} · {business.city}</p>
              {business.description && (
                <p className="text-gray-300 text-sm line-clamp-2">{business.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 bg-gray-900 p-4 rounded-xl">
              <div>
                <p className="text-gray-600 text-xs uppercase mb-0.5">Localização</p>
                <p className="text-white font-semibold">📍 {business.canton}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs uppercase mb-0.5">Preço</p>
                <p className="text-white font-semibold">CHF {business.priceMin}k</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs uppercase mb-0.5">Desde</p>
                <p className="text-white font-semibold">{business.establishedYear}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs uppercase mb-0.5">Canton</p>
                <p className="text-green-400 font-semibold">{business.canton} 🇨🇭</p>
              </div>
            </div>
          </div>
        </motion.div>

        {!isDragging && (
          <div className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none">
            <p className="text-gray-700 text-xs">Arraste para interagir</p>
          </div>
        )}
      </div>

      {/* Swipe counter */}
      <div className="w-full max-w-md mt-6 px-2">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-semibold text-sm">{swipesRemaining} swipes restantes</span>
            <span className="text-gray-500 text-xs">{swipesMax} máximo/dia</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-green-400"
              animate={{ width: `${(swipesRemaining / swipesMax) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {swipesRemaining === 0 && (
            <p className="text-red-400 text-xs mt-2 text-center">⏰ Limite diário atingido. Volte amanhã!</p>
          )}
          {swipesRemaining <= 2 && swipesRemaining > 0 && (
            <p className="text-yellow-400 text-xs mt-2 text-center">⚠️ Apenas {swipesRemaining} swipes restantes</p>
          )}
        </div>

        {/* Botões alternativos */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <button
            onClick={() => triggerSwipe('pass')}
            disabled={isLoading || swipesRemaining === 0}
            className="py-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-xl font-bold text-sm transition-colors"
          >
            ← PASS
          </button>
          <button
            onClick={() => triggerSwipe('save')}
            disabled={isLoading}
            className="py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl font-bold text-sm transition-colors"
          >
            📌 SAVE
          </button>
          <button
            onClick={() => triggerSwipe('like')}
            disabled={isLoading || swipesRemaining === 0}
            className="py-3 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white rounded-xl font-bold text-sm transition-colors"
          >
            ♥ LIKE
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="text-white text-center">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Processando...</p>
          </div>
        </div>
      )}
    </div>
  );
}
