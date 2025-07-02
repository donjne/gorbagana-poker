'use client';

import { JSX, useEffect, useState } from 'react';
import { Timer, Zap, AlertTriangle } from 'lucide-react';

import { formatTimeRemaining } from '@/lib/utils';
import { cn } from '@/lib/utils';

import type { Player } from '@/types';

interface TurnIndicatorProps {
  currentPlayer: Player;
  timeRemaining: number;
  isMyTurn: boolean;
  onTimeExpired?: () => void;
  className?: string;
}

export function TurnIndicator({
  currentPlayer,
  timeRemaining,
  isMyTurn,
  onTimeExpired,
  className
}: TurnIndicatorProps): JSX.Element {
  const [localTime, setLocalTime] = useState(timeRemaining);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  // Update local timer
  useEffect(() => {
    setLocalTime(timeRemaining);
    setIsWarning(timeRemaining <= 15 && timeRemaining > 5);
    setIsCritical(timeRemaining <= 5 && timeRemaining > 0);
  }, [timeRemaining]);

  // Local countdown
  useEffect(() => {
    if (localTime <= 0) return;

    const interval = setInterval(() => {
      setLocalTime(prev => {
        const newTime = prev - 1;
        setIsWarning(newTime <= 15 && newTime > 5);
        setIsCritical(newTime <= 5 && newTime > 0);
        
        if (newTime <= 0 && onTimeExpired) {
          onTimeExpired();
        }
        
        return Math.max(0, newTime);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [localTime, onTimeExpired]);

  const getIndicatorColor = (): string => {
    if (isCritical) return 'border-danger bg-danger/20 shadow-glow-red';
    if (isWarning) return 'border-warning bg-warning/20 shadow-glow-gold';
    if (isMyTurn) return 'border-gor-400 bg-gor-400/20 shadow-glow-gold';
    return 'border-primary-500 bg-primary/20';
  };

  const getTextColor = (): string => {
    if (isCritical) return 'text-danger';
    if (isWarning) return 'text-warning';
    if (isMyTurn) return 'text-gor-400';
    return 'text-primary-400';
  };

  const getIcon = (): JSX.Element => {
    if (isCritical) {
      return <AlertTriangle className={cn('h-5 w-5', getTextColor(), 'animate-pulse')} />;
    }
    if (isMyTurn) {
      return <Zap className={cn('h-5 w-5', getTextColor())} />;
    }
    return <Timer className={cn('h-5 w-5', getTextColor())} />;
  };

  return (
    <div className={cn(
      'relative bg-surface-primary/90 backdrop-blur-md rounded-xl border-2 p-4 transition-all duration-300',
      getIndicatorColor(),
      isCritical && isMyTurn && 'animate-pulse',
      className
    )}>
      {/* Pulsing border for critical time */}
      {isCritical && isMyTurn && (
        <div className="absolute inset-0 border-2 border-danger rounded-xl animate-ping" />
      )}

      <div className="flex items-center justify-between">
        {/* Player Info */}
        <div className="flex items-center space-x-3">
          {getIcon()}
          <div>
            <div className={cn('font-semibold', getTextColor())}>
              {isMyTurn ? 'Your Turn' : `${currentPlayer.username}'s Turn`}
            </div>
            <div className="text-xs text-gray-400">
              {isMyTurn ? 'Choose your action' : 'Waiting for action'}
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="text-right">
          <div className={cn(
            'text-xl font-mono font-bold',
            getTextColor(),
            isCritical && 'animate-timer-tick'
          )}>
            {formatTimeRemaining(localTime)}
          </div>
          <div className="text-xs text-gray-400">
            {localTime > 0 ? 'remaining' : 'time up'}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Time</span>
          <span>{Math.round((localTime / 30) * 100)}%</span>
        </div>
        <div className="w-full bg-surface-tertiary rounded-full h-2 overflow-hidden">
          <div 
            className={cn(
              'h-full transition-all duration-1000 ease-linear rounded-full',
              isCritical ? 'bg-danger' : isWarning ? 'bg-warning' : 'bg-primary-500'
            )}
            style={{ 
              width: `${Math.max(0, (localTime / 30) * 100)}%` 
            }}
          />
        </div>
      </div>

      {/* Warning Messages */}
      {isMyTurn && isWarning && (
        <div className={cn(
          'mt-3 p-2 rounded-lg text-xs text-center font-medium',
          isCritical 
            ? 'bg-danger/20 text-danger border border-danger/30' 
            : 'bg-warning/20 text-warning border border-warning/30'
        )}>
          {isCritical 
            ? '⚠️ Time almost up! You will auto-fold!'
            : '⏰ Running out of time...'
          }
        </div>
      )}

      {/* Action History */}
      {currentPlayer.lastAction && (
        <div className="mt-2 pt-2 border-t border-surface-tertiary/50">
          <div className="text-xs text-gray-400 text-center">
            Last action: <span className={cn(
              'font-medium',
              currentPlayer.lastAction === 'fold' ? 'text-danger' :
              currentPlayer.lastAction === 'raise' || currentPlayer.lastAction === 'bet' ? 'text-gor-400' :
              currentPlayer.lastAction === 'call' ? 'text-success' : 'text-info'
            )}>
              {currentPlayer.lastAction.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}