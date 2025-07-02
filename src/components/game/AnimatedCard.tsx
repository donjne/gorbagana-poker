// src/components/game/AnimatedCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCard, getSuitColor } from '@/lib/utils';
import { useGameSounds } from '@/hooks/useSound';
import { cn } from '@/lib/utils';

import type { Card } from '@/types';

interface AnimatedCardProps {
  card: Card | null;
  isVisible: boolean;
  isDealing: boolean;
  dealDelay?: number;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  onDealComplete?: () => void;
  onClick?: () => void;
  isClickable?: boolean;
}

const cardSizes = {
  small: 'w-12 h-16',
  medium: 'w-16 h-24',
  large: 'w-20 h-28',
};

export function AnimatedCard({
  card,
  isVisible,
  isDealing,
  dealDelay = 0,
  className,
  size = 'medium',
  onDealComplete,
  onClick,
  isClickable = false,
}: AnimatedCardProps) {
  const [isDealt, setIsDealt] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const { cardDeal, cardFlip } = useGameSounds();

  // Handle dealing animation
  useEffect(() => {
    if (isDealing && !isDealt) {
      const timer = setTimeout(() => {
        setIsDealt(true);
        cardDeal();
        onDealComplete?.();
      }, dealDelay);

      return () => clearTimeout(timer);
    }
  }, [isDealing, isDealt, dealDelay, cardDeal, onDealComplete]);

  // Handle visibility changes (flipping)
  useEffect(() => {
    if (isDealt && card) {
      if (isVisible !== isFlipping) {
        setIsFlipping(true);
        cardFlip();
        
        const timer = setTimeout(() => {
          setIsFlipping(false);
        }, 300);

        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, isDealt, card, isFlipping, cardFlip]);

  const handleClick = () => {
    if (isClickable && onClick && !isDealing && !isFlipping) {
      onClick();
    }
  };

  // Card back content
  const cardBack = (
    <div className={cn(
      'playing-card playing-card-back relative overflow-hidden',
      cardSizes[size],
      className
    )}>
      {/* Card back pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-repeat" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpolygon points='10,0 20,10 10,20 0,10'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '12px 12px'
            }}
          />
        </div>
        
        {/* Gorbagana logo/symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white font-bold text-lg opacity-80">G</div>
        </div>
      </div>
    </div>
  );

  // Card front content
  const cardFront = card ? (
    <div className={cn(
      'playing-card relative overflow-hidden',
      getSuitColor(card.suit) === 'red' ? 'playing-card-red' : 'playing-card-black',
      cardSizes[size],
      className
    )}>
      {/* Card background */}
      <div className="absolute inset-0 bg-white border-2 border-gray-300 rounded-lg" />
      
      {/* Card content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="font-bold text-lg">
            {formatCard(card)}
          </div>
        </div>
      </div>
      
      {/* Corner indicators */}
      <div className="absolute top-1 left-1 text-xs font-semibold">
        {card.rank}
      </div>
      <div className="absolute bottom-1 right-1 text-xs font-semibold transform rotate-180">
        {card.rank}
      </div>
    </div>
  ) : cardBack;

  return (
    <motion.div
      className={cn(
        'relative cursor-pointer select-none',
        isClickable && 'hover:scale-105 transition-transform'
      )}
      onClick={handleClick}
      whileHover={isClickable ? { scale: 1.05 } : {}}
      whileTap={isClickable ? { scale: 0.95 } : {}}
    >
      <AnimatePresence mode="wait">
        {!isDealt ? (
          // Dealing animation
          <motion.div
            key="dealing"
            initial={{ 
              x: -200, 
              y: -100, 
              rotate: -45,
              scale: 0.8,
              opacity: 0 
            }}
            animate={{ 
              x: 0, 
              y: 0, 
              rotate: 0,
              scale: 1,
              opacity: 1 
            }}
            exit={{ 
              scale: 0.9,
              opacity: 0 
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: dealDelay / 1000,
            }}
          >
            {cardBack}
          </motion.div>
        ) : (
          // Card flip animation
          <motion.div
            key={isVisible ? 'front' : 'back'}
            initial={{ rotateY: 90, scale: 0.8 }}
            animate={{ rotateY: 0, scale: 1 }}
            exit={{ rotateY: -90, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            {isVisible ? cardFront : cardBack}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow effect for special states */}
      <AnimatePresence>
        {isClickable && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              background: 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Dealing sparkles */}
      <AnimatePresence>
        {isDealing && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gor-400 rounded-full"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [-10, -20, -30],
                }}
                transition={{
                  duration: 1,
                  delay: (dealDelay / 1000) + (i * 0.1),
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}