'use client';

import { useState, useEffect, JSX } from 'react';
import { 
  Check, 
  DollarSign, 
  TrendingUp, 
  X, 
  Minus,
  Plus,
  RotateCcw
} from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { formatGOR } from '@/lib/utils';
import { LoadingButton } from '@/components/ui/LoadingSpinner';
import { cn } from '@/lib/utils';

import type { Game, Player, PlayerAction } from '@/types';

interface ActionButtonsProps {
  game: Game;
  player: Player;
  isMyTurn: boolean;
  onAction: (action: PlayerAction, amount?: number) => void;
  className?: string;
}

export function ActionButtons({
  game,
  player,
  isMyTurn,
  onAction,
  className
}: ActionButtonsProps): JSX.Element {
  const { balance } = useWallet();
  const [betAmount, setBetAmount] = useState(0);
  const [showBettingInterface, setShowBettingInterface] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate available actions and amounts
  const currentBet = game.currentBet;
  const callAmount = Math.max(0, currentBet - player.currentBet);
  const minRaise = currentBet > 0 ? currentBet * 2 : game.ante;
  const maxBet = Math.min(player.chips, balance || 0);
  const canCheck = currentBet === 0 || player.currentBet === currentBet;
  const canCall = currentBet > 0 && player.currentBet < currentBet && callAmount <= maxBet;
  const canBet = currentBet === 0 && maxBet >= game.ante;
  const canRaise = currentBet > 0 && maxBet >= minRaise;

  // Initialize bet amount
  useEffect(() => {
    if (canBet) {
      setBetAmount(game.ante);
    } else if (canRaise) {
      setBetAmount(minRaise);
    }
  }, [canBet, canRaise, game.ante, minRaise]);

  // Handle action submission
  const handleAction = async (action: PlayerAction, amount?: number): Promise<void> => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      onAction(action, amount);
      setShowBettingInterface(false);
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick bet amounts
  const getQuickBetAmounts = (): number[] => {
    const amounts = [];
    if (canBet || canRaise) {
      const base = canBet ? game.ante : minRaise;
      amounts.push(base);
      if (base * 2 <= maxBet) amounts.push(base * 2);
      if (base * 3 <= maxBet) amounts.push(base * 3);
      if (maxBet > base * 3) amounts.push(maxBet); // All-in
    }
    return amounts.slice(0, 3); // Limit to 3 quick options
  };

  if (!isMyTurn) {
    return (
      <div className={cn(
        'bg-surface-primary/90 backdrop-blur-md rounded-xl p-4 border border-surface-tertiary',
        className
      )}>
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-2">Waiting for your turn...</div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'bg-surface-primary/95 backdrop-blur-md rounded-xl border-2 border-gor-400/50 shadow-glow-gold',
      className
    )}>
      {!showBettingInterface ? (
        /* Main Action Buttons */
        <div className="p-4">
          <div className="text-center mb-4">
            <div className="text-gor-400 font-semibold text-sm mb-1">Your Turn</div>
            <div className="text-white text-xs">
              Choose your action • Balance: {formatGOR(balance || 0)} GOR
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Check/Call Button */}
            {canCheck ? (
              <LoadingButton
                loading={isSubmitting}
                onClick={() => handleAction('check')}
                className="btn-secondary flex items-center justify-center space-x-2 py-3"
              >
                <Check className="h-4 w-4" />
                <span>Check</span>
              </LoadingButton>
            ) : canCall ? (
              <LoadingButton
                loading={isSubmitting}
                onClick={() => handleAction('call', callAmount)}
                className="btn-primary flex items-center justify-center space-x-2 py-3"
                disabled={callAmount > maxBet}
              >
                <Check className="h-4 w-4" />
                <div className="text-center">
                  <div>Call</div>
                  <div className="text-xs opacity-80">{formatGOR(callAmount)}</div>
                </div>
              </LoadingButton>
            ) : (
              <button disabled className="btn-secondary opacity-50 cursor-not-allowed py-3">
                <span>Can't Call</span>
              </button>
            )}

            {/* Bet/Raise Button */}
            {canBet || canRaise ? (
              <button
                onClick={() => setShowBettingInterface(true)}
                className="btn-gor flex items-center justify-center space-x-2 py-3"
              >
                {canBet ? (
                  <>
                    <DollarSign className="h-4 w-4" />
                    <span>Bet</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4" />
                    <span>Raise</span>
                  </>
                )}
              </button>
            ) : (
              <button disabled className="btn-secondary opacity-50 cursor-not-allowed py-3">
                <span>Can't {canBet ? 'Bet' : 'Raise'}</span>
              </button>
            )}

            {/* Fold Button */}
            <LoadingButton
              loading={isSubmitting}
              onClick={() => handleAction('fold')}
              className="btn-danger flex items-center justify-center space-x-2 py-3 col-span-2"
            >
              <X className="h-4 w-4" />
              <span>Fold</span>
            </LoadingButton>
          </div>

          {/* Quick Action Info */}
          <div className="mt-3 text-xs text-gray-400 text-center">
            {currentBet > 0 ? (
              <span>Current bet: {formatGOR(currentBet)} GOR</span>
            ) : (
              <span>No current bet</span>
            )}
          </div>
        </div>
      ) : (
        /* Betting Interface */
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">
              {canBet ? 'Place Bet' : 'Raise Amount'}
            </h3>
            <button
              onClick={() => setShowBettingInterface(false)}
              className="p-1 hover:bg-surface-secondary rounded transition-colors"
            >
              <RotateCcw className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {/* Quick Bet Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {getQuickBetAmounts().map((amount, index) => (
              <button
                key={index}
                onClick={() => setBetAmount(amount)}
                className={cn(
                  'p-2 rounded-lg border text-sm transition-colors',
                  betAmount === amount
                    ? 'border-gor-400 bg-gor-400/20 text-gor-400'
                    : 'border-surface-tertiary bg-surface-secondary text-gray-300 hover:border-gor-400/50'
                )}
              >
                <div className="font-medium">{formatGOR(amount)}</div>
                <div className="text-xs opacity-75">
                  {amount === maxBet ? 'All-in' : 
                   amount === game.ante ? 'Min' :
                   amount === minRaise ? 'Min Raise' : 
                   `${Math.round(amount / game.ante)}x`}
                </div>
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">Custom Amount</label>
            <div className="relative">
              <div className="flex items-center border border-surface-tertiary rounded-lg bg-surface-secondary">
                <button
                  onClick={() => setBetAmount(Math.max(canBet ? game.ante : minRaise, betAmount - 10))}
                  className="p-2 hover:bg-surface-tertiary rounded-l-lg transition-colors"
                  disabled={betAmount <= (canBet ? game.ante : minRaise)}
                >
                  <Minus className="h-4 w-4 text-gray-400" />
                </button>
                
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => {
                    const value = Math.max(0, parseInt(e.target.value) || 0);
                    setBetAmount(Math.min(value, maxBet));
                  }}
                  min={canBet ? game.ante : minRaise}
                  max={maxBet}
                  step={10}
                  className="flex-1 bg-transparent text-center text-white font-mono py-2 px-3 focus:outline-none"
                />
                
                <button
                  onClick={() => setBetAmount(Math.min(maxBet, betAmount + 10))}
                  className="p-2 hover:bg-surface-tertiary rounded-r-lg transition-colors"
                  disabled={betAmount >= maxBet}
                >
                  <Plus className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Min: {formatGOR(canBet ? game.ante : minRaise)}</span>
              <span>Max: {formatGOR(maxBet)}</span>
            </div>
          </div>

          {/* Range Slider */}
          <div className="mb-4">
            <input
              type="range"
              min={canBet ? game.ante : minRaise}
              max={maxBet}
              step={5}
              value={betAmount}
              onChange={(e) => setBetAmount(parseInt(e.target.value))}
              className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <LoadingButton
              loading={isSubmitting}
              onClick={() => handleAction(canBet ? 'bet' : 'raise', betAmount)}
              className="btn-gor w-full flex items-center justify-center space-x-2 py-3"
              disabled={betAmount < (canBet ? game.ante : minRaise) || betAmount > maxBet}
            >
              {canBet ? <DollarSign className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
              <span>
                {canBet ? 'Bet' : 'Raise to'} {formatGOR(betAmount)} GOR
              </span>
            </LoadingButton>

            <button
              onClick={() => setShowBettingInterface(false)}
              className="btn-secondary w-full py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}