'use client';

import { useEffect, useState, JSX } from 'react';
import { Coins, TrendingUp } from 'lucide-react';

import { formatGOR } from '@/lib/utils';
import { cn } from '@/lib/utils';

import type { PlayerAction } from '@/types';

interface PotDisplayProps {
  amount: number;
  currentBet: number;
  lastAction: PlayerAction | null;
  className?: string;
}

export function PotDisplay({ 
  amount, 
  currentBet, 
  lastAction,
  className 
}: PotDisplayProps): JSX.Element {
  const [previousAmount, setPreviousAmount] = useState(amount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showIncrease, setShowIncrease] = useState(false);

  // Animate pot changes
  useEffect(() => {
    if (amount !== previousAmount) {
      setIsAnimating(true);
      setShowIncrease(amount > previousAmount);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setShowIncrease(false);
        setPreviousAmount(amount);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [amount, previousAmount]);

  const getLastActionDisplay = (): string => {
    switch (lastAction) {
      case 'bet':
        return `Bet ${formatGOR(currentBet)}`;
      case 'raise':
        return `Raised to ${formatGOR(currentBet)}`;
      case 'call':
        return `Called ${formatGOR(currentBet)}`;
      case 'check':
        return 'Checked';
      case 'fold':
        return 'Folded';
      default:
        return '';
    }
  };

  return (
    <div className={cn(
      'text-center transition-all duration-300',
      isAnimating && 'animate-pot-grow',
      className
    )}>
      {/* Main Pot Display */}
      <div className={cn(
        'relative bg-gradient-to-br from-gor-400 to-gor-600 text-black rounded-2xl px-6 py-4 shadow-glow-gold border-2 border-gor-300',
        isAnimating && amount > previousAmount && 'animate-pulse'
      )}>
        {/* Pot Icon */}
        <div className="flex items-center justify-center mb-2">
          <div className="bg-black/20 rounded-full p-2">
            <Coins className="h-6 w-6 text-black" />
          </div>
        </div>

        {/* Pot Amount */}
        <div className="space-y-1">
          <div className="text-xs font-medium opacity-80">TOTAL POT</div>
          <div className="text-2xl font-bold font-mono">
            {formatGOR(amount)} GOR
          </div>
        </div>

        {/* Increase Animation */}
        {showIncrease && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-success text-white px-2 py-1 rounded text-xs font-bold animate-slide-up">
              +{formatGOR(amount - previousAmount)}
            </div>
          </div>
        )}

        {/* Sparkle Effect for Large Increases */}
        {isAnimating && amount - previousAmount > 100 && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Current Bet Info */}
      {currentBet > 0 && (
        <div className="mt-3">
          <div className="bg-surface-primary/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-surface-tertiary">
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <div className="text-sm">
                <span className="text-gray-400">Current bet: </span>
                <span className="text-success font-semibold">
                  {formatGOR(currentBet)} GOR
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Last Action Display */}
      {lastAction && getLastActionDisplay() && (
        <div className="mt-2">
          <div className="text-xs text-gray-400 bg-surface-secondary/60 backdrop-blur-sm rounded px-3 py-1 border border-surface-tertiary/50">
            {getLastActionDisplay()}
          </div>
        </div>
      )}

      {/* Empty Pot State */}
      {amount === 0 && (
        <div className="mt-2">
          <div className="text-xs text-gray-500">
            Waiting for bets...
          </div>
        </div>
      )}
    </div>
  );
}