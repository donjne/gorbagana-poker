'use client';

import { useState, useEffect, JSX } from 'react';
import { Coins, TrendingUp, AlertTriangle, Calculator } from 'lucide-react';

import { formatGOR } from '@/lib/utils';
import { cn } from '@/lib/utils';

import type { Game, Player } from '@/types';

interface BettingInterfaceProps {
  game: Game;
  player: Player;
  maxAmount: number;
  onAmountChange: (amount: number) => void;
  initialAmount?: number;
  betType: 'bet' | 'raise';
  className?: string;
}

export function BettingInterface({
  game,
  player,
  maxAmount,
  onAmountChange,
  initialAmount = 0,
  betType,
  className
}: BettingInterfaceProps): JSX.Element {
  const [amount, setAmount] = useState(initialAmount);
  const [showCalculator, setShowCalculator] = useState(false);

  // Calculate constraints
  const minAmount = betType === 'bet' ? game.ante : game.currentBet * 2;
  const potOdds = game.pot > 0 ? ((amount / (game.pot + amount)) * 100).toFixed(1) : '0';
  const stackPercent = player.chips > 0 ? ((amount / player.chips) * 100).toFixed(1) : '0';

  useEffect(() => {
    onAmountChange(amount);
  }, [amount, onAmountChange]);

  // Predefined bet sizes
  const getBetSizes = (): Array<{ label: string; amount: number; description: string }> => {
    const potSize = game.pot || game.ante;
    return [
      {
        label: 'Min',
        amount: minAmount,
        description: betType === 'bet' ? 'Minimum bet' : 'Minimum raise'
      },
      {
        label: '1/2 Pot',
        amount: Math.min(Math.round(potSize * 0.5), maxAmount),
        description: 'Half pot size'
      },
      {
        label: '3/4 Pot',
        amount: Math.min(Math.round(potSize * 0.75), maxAmount),
        description: 'Three quarters pot'
      },
      {
        label: 'Pot',
        amount: Math.min(potSize, maxAmount),
        description: 'Full pot size'
      },
      {
        label: 'All-in',
        amount: maxAmount,
        description: 'All available chips'
      }
    ].filter(size => size.amount >= minAmount && size.amount <= maxAmount);
  };

  const handlePercentageClick = (percentage: number): void => {
    const newAmount = Math.round((maxAmount * percentage) / 100);
    setAmount(Math.max(minAmount, Math.min(newAmount, maxAmount)));
  };

  const handleQuickAdjust = (adjustment: number): void => {
    const newAmount = Math.max(minAmount, Math.min(amount + adjustment, maxAmount));
    setAmount(newAmount);
  };

  const isValidAmount = amount >= minAmount && amount <= maxAmount;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Betting Constraints Info */}
      <div className="bg-surface-secondary/50 rounded-lg p-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Minimum:</span>
            <span className="text-white font-medium">{formatGOR(minAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Maximum:</span>
            <span className="text-white font-medium">{formatGOR(maxAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Current pot:</span>
            <span className="text-gor-400 font-medium">{formatGOR(game.pot)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Your chips:</span>
            <span className="text-primary-400 font-medium">{formatGOR(player.chips)}</span>
          </div>
        </div>
      </div>

      {/* Quick Bet Sizes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">Quick Sizes</span>
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="p-1 hover:bg-surface-secondary rounded transition-colors"
            title="Show calculator"
          >
            <Calculator className="h-4 w-4 text-gray-400" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {getBetSizes().slice(0, 6).map((size, index) => (
            <button
              key={index}
              onClick={() => setAmount(size.amount)}
              className={cn(
                'p-2 rounded-lg border text-sm transition-all duration-200',
                amount === size.amount
                  ? 'border-gor-400 bg-gor-400/20 text-gor-400 shadow-glow-gold'
                  : 'border-surface-tertiary bg-surface-secondary text-gray-300 hover:border-gor-400/50 hover:bg-gor-400/10'
              )}
              title={size.description}
            >
              <div className="font-medium">{size.label}</div>
              <div className="text-xs opacity-75">{formatGOR(size.amount)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Percentage Buttons */}
      <div>
        <span className="text-sm font-medium text-gray-300 mb-2 block">Stack Percentage</span>
        <div className="grid grid-cols-4 gap-2">
          {[25, 50, 75, 100].map((percentage) => (
            <button
              key={percentage}
              onClick={() => handlePercentageClick(percentage)}
              className="p-2 rounded-lg border border-surface-tertiary bg-surface-secondary text-gray-300 hover:border-primary-400/50 hover:bg-primary-400/10 text-sm transition-colors"
            >
              {percentage}%
            </button>
          ))}
        </div>
      </div>

      {/* Manual Input with Quick Adjust */}
      <div>
        <span className="text-sm font-medium text-gray-300 mb-2 block">Custom Amount</span>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuickAdjust(-10)}
              className="p-2 bg-surface-secondary border border-surface-tertiary rounded-lg hover:bg-surface-tertiary transition-colors"
              disabled={amount - 10 < minAmount}
            >
              -10
            </button>
            <button
              onClick={() => handleQuickAdjust(-50)}
              className="p-2 bg-surface-secondary border border-surface-tertiary rounded-lg hover:bg-surface-tertiary transition-colors"
              disabled={amount - 50 < minAmount}
            >
              -50
            </button>
            
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setAmount(Math.max(0, Math.min(value, maxAmount)));
              }}
              min={minAmount}
              max={maxAmount}
              step={5}
              className={cn(
                'flex-1 input-primary text-center font-mono text-lg py-3',
                !isValidAmount && 'border-danger focus:ring-danger'
              )}
            />
            
            <button
              onClick={() => handleQuickAdjust(50)}
              className="p-2 bg-surface-secondary border border-surface-tertiary rounded-lg hover:bg-surface-tertiary transition-colors"
              disabled={amount + 50 > maxAmount}
            >
              +50
            </button>
            <button
              onClick={() => handleQuickAdjust(10)}
              className="p-2 bg-surface-secondary border border-surface-tertiary rounded-lg hover:bg-surface-tertiary transition-colors"
              disabled={amount + 10 > maxAmount}
            >
              +10
            </button>
          </div>

          {/* Range Slider */}
          <div className="px-1">
            <input
              type="range"
              min={minAmount}
              max={maxAmount}
              step={5}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${((amount - minAmount) / (maxAmount - minAmount)) * 100}%, #4b5563 ${((amount - minAmount) / (maxAmount - minAmount)) * 100}%, #4b5563 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Validation & Info */}
      {!isValidAmount && (
        <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-danger flex-shrink-0" />
          <span className="text-danger text-sm">
            {amount < minAmount 
              ? `Minimum ${betType} is ${formatGOR(minAmount)} GOR`
              : `Maximum available is ${formatGOR(maxAmount)} GOR`
            }
          </span>
        </div>
      )}

      {/* Bet Analysis (Calculator) */}
      {showCalculator && (
        <div className="bg-surface-secondary/50 rounded-lg p-3 space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-gor-400" />
            <span className="text-sm font-medium text-white">Bet Analysis</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Pot odds:</span>
              <span className="text-info">{potOdds}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Stack %:</span>
              <span className={cn(
                parseFloat(stackPercent) > 75 ? 'text-danger' : 
                parseFloat(stackPercent) > 50 ? 'text-warning' : 'text-success'
              )}>
                {stackPercent}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Final pot:</span>
              <span className="text-gor-400">{formatGOR(game.pot + amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Remaining:</span>
              <span className="text-primary-400">{formatGOR(player.chips - amount)}</span>
            </div>
          </div>

          {parseFloat(stackPercent) > 75 && (
            <div className="bg-warning/10 border border-warning/20 rounded p-2 mt-2">
              <span className="text-warning text-xs">
                ⚠️ This bet represents a large portion of your stack
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}