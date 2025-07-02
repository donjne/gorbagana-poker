'use client';

import { Users, Play, Eye, Trophy, Clock, Pause } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { Game, Player } from '@/types';
import { JSX } from 'react';

interface GameStatusProps {
  game: Game;
  currentPlayer: Player | null;
  isMyTurn: boolean;
  className?: string;
}

export function GameStatus({ 
  game, 
  currentPlayer, 
  isMyTurn,
  className 
}: GameStatusProps): JSX.Element {
  
  const getStatusIcon = (): JSX.Element => {
    switch (game.status) {
      case 'waiting':
        return <Users className="h-5 w-5 text-warning" />;
      case 'starting':
        return <Play className="h-5 w-5 text-info animate-pulse" />;
      case 'betting':
        return <Clock className="h-5 w-5 text-success" />;
      case 'showdown':
        return <Eye className="h-5 w-5 text-primary-400" />;
      case 'finished':
        return <Trophy className="h-5 w-5 text-gor-400" />;
      case 'cancelled':
        return <Pause className="h-5 w-5 text-danger" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (): string => {
    switch (game.status) {
      case 'waiting':
        return `Waiting for ${game.maxPlayers - game.players.length} more player${game.maxPlayers - game.players.length !== 1 ? 's' : ''}`;
      case 'starting':
        return 'Game starting...';
      case 'betting':
        if (isMyTurn) {
          return "It's your turn to act";
        } else if (currentPlayer) {
          return `Waiting for ${currentPlayer.username}`;
        } else {
          return 'Betting round in progress';
        }
      case 'showdown':
        return 'Revealing cards...';
      case 'finished':
        return 'Game finished';
      case 'cancelled':
        return 'Game cancelled';
      default:
        return 'Unknown status';
    }
  };

  const getStatusColor = (): string => {
    switch (game.status) {
      case 'waiting':
        return 'border-warning/30 bg-warning/5';
      case 'starting':
        return 'border-info/30 bg-info/5';
      case 'betting':
        return isMyTurn 
          ? 'border-gor-400/50 bg-gor-400/10 shadow-glow-gold'
          : 'border-success/30 bg-success/5';
      case 'showdown':
        return 'border-primary-400/30 bg-primary-400/5';
      case 'finished':
        return 'border-gor-400/30 bg-gor-400/5';
      case 'cancelled':
        return 'border-danger/30 bg-danger/5';
      default:
        return 'border-surface-tertiary bg-surface-primary/50';
    }
  };

  const getTextColor = (): string => {
    switch (game.status) {
      case 'waiting':
        return 'text-warning';
      case 'starting':
        return 'text-info';
      case 'betting':
        return isMyTurn ? 'text-gor-400' : 'text-success';
      case 'showdown':
        return 'text-primary-400';
      case 'finished':
        return 'text-gor-400';
      case 'cancelled':
        return 'text-danger';
      default:
        return 'text-gray-400';
    }
  };

  const getAdditionalInfo = (): string | null => {
    switch (game.status) {
      case 'waiting':
        return game.players.length >= 2 
          ? 'Game can start with current players'
          : 'Need at least 2 players to start';
      case 'betting':
        if (currentPlayer?.timeRemaining && currentPlayer.timeRemaining > 0) {
          return `${Math.ceil(currentPlayer.timeRemaining)}s remaining`;
        }
        return null;
      case 'showdown':
        return 'Cards will be revealed automatically';
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      'bg-surface-primary/90 backdrop-blur-md rounded-lg px-6 py-3 border-2 transition-all duration-300',
      getStatusColor(),
      isMyTurn && game.status === 'betting' && 'animate-pulse-slow',
      className
    )}>
      <div className="flex items-center justify-center space-x-3">
        {/* Status Icon */}
        <div className="flex-shrink-0">
          {getStatusIcon()}
        </div>

        {/* Status Text */}
        <div className="text-center">
          <div className={cn(
            'text-sm font-semibold',
            getTextColor()
          )}>
            {getStatusText()}
          </div>
          
          {/* Additional Info */}
          {getAdditionalInfo() && (
            <div className="text-xs text-gray-400 mt-1">
              {getAdditionalInfo()}
            </div>
          )}
        </div>
      </div>

      {/* Progress Indicator for Waiting */}
      {game.status === 'waiting' && (
        <div className="mt-3">
          <div className="flex items-center justify-center space-x-1">
            <div className="text-xs text-gray-400">
              {game.players.length}/{game.maxPlayers} players
            </div>
          </div>
          <div className="mt-2 w-full bg-surface-tertiary rounded-full h-1">
            <div 
              className="bg-warning h-1 rounded-full transition-all duration-300"
              style={{ 
                width: `${(game.players.length / game.maxPlayers) * 100}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Round Information */}
      {(game.status === 'betting' || game.status === 'showdown') && (
        <div className="mt-2 pt-2 border-t border-surface-tertiary/50">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
            <span>Round {game.currentRound}</span>
            <span>•</span>
            <span>{game.players.filter(p => !p.isFolded).length} active players</span>
          </div>
        </div>
      )}
    </div>
  );
}