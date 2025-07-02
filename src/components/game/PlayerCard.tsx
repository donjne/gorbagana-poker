'use client';

import { Crown, Wifi, WifiOff, Timer } from 'lucide-react';

import { formatGOR, formatCard, getSuitColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

import type { Player, PlayerAction } from '@/types';
import { JSX } from 'react';

interface PlayerCardProps {
  player: Player;
  isCurrentTurn: boolean;
  isMe: boolean;
  showCard: boolean;
  position: number;
  className?: string;
}

export function PlayerCard({ 
  player, 
  isCurrentTurn, 
  isMe, 
  showCard, 
  position,
  className 
}: PlayerCardProps): JSX.Element {
  
  const getActionColor = (action: PlayerAction | null): string => {
    switch (action) {
      case 'check':
        return 'text-info';
      case 'bet':
      case 'raise':
        return 'text-gor-400';
      case 'call':
        return 'text-success';
      case 'fold':
      case 'auto-fold':
        return 'text-danger';
      default:
        return 'text-gray-400';
    }
  };

  const getActionLabel = (action: PlayerAction | null): string => {
    switch (action) {
      case 'check':
        return 'Check';
      case 'bet':
        return 'Bet';
      case 'call':
        return 'Call';
      case 'raise':
        return 'Raise';
      case 'fold':
        return 'Fold';
      case 'auto-fold':
        return 'Auto-fold';
      default:
        return '';
    }
  };

  const getCardDisplay = (): JSX.Element => {
    if (!player.card) {
      return (
        <div className="playing-card playing-card-back">
          <div className="text-white text-lg font-bold">?</div>
        </div>
      );
    }

    if (showCard) {
      const suitColor = getSuitColor(player.card.suit);
      return (
        <div className={cn(
          'playing-card',
          suitColor === 'red' ? 'playing-card-red' : 'playing-card-black'
        )}>
          <div className="text-lg font-bold">
            {formatCard(player.card)}
          </div>
        </div>
      );
    }

    // Hide card for non-showdown states (Indian poker rule)
    return (
      <div className="playing-card playing-card-back">
        <div className="text-white text-lg font-bold">
          {isMe ? '?' : formatCard(player.card)}
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      'relative transition-all duration-300',
      isCurrentTurn && 'scale-110',
      player.isFolded && 'opacity-50 grayscale',
      className
    )}>
      {/* Player Card */}
      <div className={cn(
        'relative bg-surface-primary rounded-xl border-2 p-3 min-w-[120px] shadow-card backdrop-blur-sm',
        isCurrentTurn 
          ? 'border-gor-400 shadow-glow-gold' 
          : isMe 
          ? 'border-primary-500 shadow-glow-green'
          : 'border-surface-tertiary',
        isCurrentTurn && 'animate-pulse-slow'
      )}>
        {/* Turn Indicator */}
        {isCurrentTurn && (
          <div className="absolute -top-2 -right-2">
            <div className="w-6 h-6 bg-gor-400 rounded-full flex items-center justify-center animate-ping">
              <Timer className="h-3 w-3 text-black" />
            </div>
          </div>
        )}

        {/* Player Info Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {/* Username */}
            <span className={cn(
              'text-sm font-semibold truncate max-w-[80px]',
              isMe ? 'text-primary-400' : 'text-white'
            )}>
              {player.username}
            </span>
            
            {/* Crown for position 0 (game creator) */}
            {position === 0 && (
              <div title="Game Creator">
                <Crown className="h-3 w-3 text-gor-400" />
              </div>
            )}
          </div>

          {/* Connection Status */}
          <div className="flex items-center">
            {player.isConnected ? (
              <Wifi className="h-3 w-3 text-success" />
            ) : (
              <WifiOff className="h-3 w-3 text-danger" />
            )}
          </div>
        </div>

        {/* Playing Card */}
        <div className="flex justify-center mb-3">
          {getCardDisplay()}
        </div>

        {/* Player Stats */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Chips:</span>
            <span className="text-gor-400 font-medium">
              {formatGOR(player.chips)} GOR
            </span>
          </div>
          
          {player.currentBet > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Bet:</span>
              <span className="text-success font-medium">
                {formatGOR(player.currentBet)} GOR
              </span>
            </div>
          )}
        </div>

        {/* Last Action */}
        {player.lastAction && (
          <div className="mt-2 pt-2 border-t border-surface-tertiary">
            <div className="text-center">
              <span className={cn(
                'text-xs font-medium',
                getActionColor(player.lastAction)
              )}>
                {getActionLabel(player.lastAction)}
                {(player.lastAction === 'bet' || player.lastAction === 'raise') && 
                 player.currentBet > 0 && (
                  <span className="ml-1">
                    {formatGOR(player.currentBet)}
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Folded Indicator */}
        {player.isFolded && (
          <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
            <span className="text-danger font-bold text-sm bg-black/80 px-2 py-1 rounded">
              FOLDED
            </span>
          </div>
        )}

        {/* Waiting Indicator */}
        {!player.isActive && !player.isFolded && (
          <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
            <span className="text-warning font-bold text-sm bg-black/80 px-2 py-1 rounded">
              AWAY
            </span>
          </div>
        )}
      </div>

      {/* Position Label */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="bg-surface-secondary text-gray-400 text-xs px-2 py-1 rounded-full border border-surface-tertiary">
          {isMe ? 'You' : `P${position + 1}`}
        </div>
      </div>

      {/* Turn Timer for Current Player */}
      {isCurrentTurn && player.timeRemaining > 0 && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className={cn(
            'bg-surface-primary px-3 py-1 rounded-full border text-xs font-mono',
            player.timeRemaining <= 10 
              ? 'border-danger text-danger animate-timer-tick' 
              : 'border-warning text-warning'
          )}>
            {Math.ceil(player.timeRemaining)}s
          </div>
        </div>
      )}
    </div>
  );
}