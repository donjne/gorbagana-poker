'use client';

import { useState, useEffect, JSX } from 'react';
import { Shuffle, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { Player } from '@/types';

interface CardDealingProps {
  isDealing: boolean;
  players: Player[];
  onComplete?: () => void;
  className?: string;
}

export function CardDealing({ 
  isDealing, 
  players, 
  onComplete,
  className 
}: CardDealingProps): JSX.Element | null {
  const [currentDealIndex, setCurrentDealIndex] = useState(-1);
  const [showShuffle, setShowShuffle] = useState(false);

  useEffect(() => {
    if (!isDealing) {
      setCurrentDealIndex(-1);
      setShowShuffle(false);
      return;
    }

    // Start with shuffle animation
    setShowShuffle(true);
    
    const shuffleTimer = setTimeout(() => {
      setShowShuffle(false);
      setCurrentDealIndex(0);
    }, 1500);

    return () => clearTimeout(shuffleTimer);
  }, [isDealing]);

  useEffect(() => {
    if (currentDealIndex >= 0 && currentDealIndex < players.length) {
      const dealTimer = setTimeout(() => {
        if (currentDealIndex === players.length - 1) {
          // Dealing complete
          setTimeout(() => {
            onComplete?.();
          }, 500);
        } else {
          setCurrentDealIndex(currentDealIndex + 1);
        }
      }, 400); // 400ms between each card deal

      return () => clearTimeout(dealTimer);
    }
  }, [currentDealIndex, players.length, onComplete]);

  if (!isDealing) return null;

  return (
    <div className={cn(
      'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50',
      className
    )}>
      <div className="text-center">
        {showShuffle ? (
          /* Shuffle Animation */
          <div className="space-y-6">
            <div className="relative">
              <div className="w-24 h-32 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg border-2 border-primary-400 mx-auto flex items-center justify-center animate-pulse">
                <Shuffle className="h-12 w-12 text-white animate-spin" />
              </div>
              
              {/* Floating cards effect */}
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-16 h-24 bg-white rounded border opacity-60"
                  style={{
                    top: `${-20 + Math.random() * 40}px`,
                    left: `${-30 + Math.random() * 60}px`,
                    transform: `rotate(${-15 + Math.random() * 30}deg)`,
                    animation: `float-${i} 2s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-gaming">
                Shuffling Deck
              </h3>
              <p className="text-gray-400">
                Preparing cards for dealing...
              </p>
            </div>
          </div>
        ) : (
          /* Dealing Animation */
          <div className="space-y-6">
            <div className="relative">
              {/* Deck */}
              <div className="w-24 h-32 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg border-2 border-primary-400 mx-auto flex items-center justify-center">
                <div className="text-white font-bold text-lg">DECK</div>
              </div>
              
              {/* Dealing animation */}
              {currentDealIndex >= 0 && (
                <div className="absolute inset-0">
                  <div
                    className="w-16 h-24 bg-white rounded border-2 border-gray-300 absolute top-0 left-1/2 transform -translate-x-1/2 animate-card-flip"
                    style={{
                      animation: 'dealCard 0.4s ease-out forwards',
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white font-gaming">
                Dealing Cards
              </h3>
              <p className="text-gray-400">
                Dealing to {players[currentDealIndex]?.username || 'players'}...
              </p>
              
              {/* Progress indicator */}
              <div className="flex justify-center space-x-2 mt-4">
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className={cn(
                      'w-3 h-3 rounded-full transition-all duration-300',
                      index <= currentDealIndex
                        ? 'bg-success scale-110'
                        : index === currentDealIndex + 1
                        ? 'bg-warning animate-pulse'
                        : 'bg-gray-600'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Status indicator */}
        <div className="mt-8 flex items-center justify-center space-x-2 text-gor-400">
          <Zap className="h-4 w-4 animate-pulse" />
          <span className="text-sm font-medium">
            Powered by Gorbagana • Lightning Fast
          </span>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(-10deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(15deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-8px) rotate(10deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(20deg); }
          50% { transform: translateY(-12px) rotate(-15deg); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translateY(0px) rotate(-20deg); }
          50% { transform: translateY(-6px) rotate(8deg); }
        }
        @keyframes float-5 {
          0%, 100% { transform: translateY(0px) rotate(8deg); }
          50% { transform: translateY(-14px) rotate(-12deg); }
        }
        @keyframes dealCard {
          0% {
            transform: translateX(-50%) translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) translateY(-100px) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}