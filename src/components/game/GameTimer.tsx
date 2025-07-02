'use client';

import { JSX, useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

import { formatTimeRemaining } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface GameTimerProps {
  timeRemaining: number;
  isActive: boolean;
  isMyTurn: boolean;
  className?: string;
}

export function GameTimer({ 
  timeRemaining, 
  isActive, 
  isMyTurn,
  className 
}: GameTimerProps): JSX.Element {
  const [displayTime, setDisplayTime] = useState(timeRemaining);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  // Update display time and warning states
  useEffect(() => {
    setDisplayTime(timeRemaining);
    setIsWarning(timeRemaining <= 15 && timeRemaining > 5);
    setIsCritical(timeRemaining <= 5 && timeRemaining > 0);
  }, [timeRemaining]);

  // Local countdown for smooth display
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setDisplayTime(prev => {
        const newTime = Math.max(0, prev - 1);
        setIsWarning(newTime <= 15 && newTime > 5);
        setIsCritical(newTime <= 5 && newTime > 0);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  if (!isActive) {
    return (
      <div className={cn(
        'bg-surface-primary/90 backdrop-blur-md rounded-lg px-4 py-2 border border-surface-tertiary',
        className
      )}>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-400">Waiting...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'bg-surface-primary/90 backdrop-blur-md rounded-lg px-4 py-2 border transition-all duration-200',
      isCritical 
        ? 'border-danger shadow-glow-red' 
        : isWarning 
        ? 'border-warning shadow-glow-gold' 
        : 'border-surface-tertiary',
      className
    )}>
      <div className="flex items-center space-x-2">
        {isCritical ? (
          <AlertTriangle className={cn(
            'h-4 w-4 text-danger',
            isMyTurn && 'animate-timer-tick'
          )} />
        ) : (
          <Clock className={cn(
            'h-4 w-4',
            isCritical 
              ? 'text-danger' 
              : isWarning 
              ? 'text-warning' 
              : 'text-gray-400'
          )} />
        )}
        
        <span className={cn(
          'text-sm font-mono font-medium',
          isCritical 
            ? 'text-danger' 
            : isWarning 
            ? 'text-warning' 
            : 'text-white'
        )}>
          {formatTimeRemaining(displayTime)}
        </span>
        
        {isMyTurn && (
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full font-medium',
            isCritical 
              ? 'bg-danger/20 text-danger' 
              : isWarning 
              ? 'bg-warning/20 text-warning' 
              : 'bg-primary/20 text-primary-400'
          )}>
            Your Turn
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-2 w-full bg-surface-tertiary rounded-full h-1">
        <div 
          className={cn(
            'h-1 rounded-full transition-all duration-1000 ease-linear',
            isCritical 
              ? 'bg-danger' 
              : isWarning 
              ? 'bg-warning' 
              : 'bg-primary-500'
          )}
          style={{ 
            width: `${Math.max(0, (displayTime / 30) * 100)}%` // Assuming 30s max
          }}
        />
      </div>
    </div>
  );
}