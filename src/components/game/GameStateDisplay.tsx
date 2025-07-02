'use client';

import { useState, useEffect, JSX } from 'react';
import { 
  Users, 
  Coins, 
  Clock, 
  TrendingUp, 
  Eye, 
  Trophy,
  BarChart3,
  Activity,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

import { formatGOR, formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

import type { Game, User } from '@/types';

interface GameStateDisplayProps {
  game: Game;
  currentUser: User | null;
  className?: string;
}

export function GameStateDisplay({ 
  game, 
  currentUser,
  className 
}: GameStateDisplayProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getGameStatusColor = (): string => {
    switch (game.status) {
      case 'waiting':
        return 'text-warning';
      case 'betting':
        return 'text-success';
      case 'showdown':
        return 'text-info';
      case 'finished':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getGameStatusLabel = (): string => {
    switch (game.status) {
      case 'waiting':
        return 'Waiting for Players';
      case 'starting':
        return 'Starting Game...';
      case 'betting':
        return 'Betting Round';
      case 'showdown':
        return 'Showdown';
      case 'finished':
        return 'Game Complete';
      default:
        return game.status;
    }
  };

  const activePlayers = game.players.filter(p => !p.isFolded);
  const totalChips = game.players.reduce((sum, p) => sum + p.chips, 0);
  const averageChips = totalChips / game.players.length;

  const getCurrentPlayerInfo = () => {
    if (game.status !== 'betting') return null;
    return game.players[game.currentPlayerIndex];
  };

  const currentPlayer = getCurrentPlayerInfo();

  return (
    <div className={cn(
      'bg-surface-primary/95 backdrop-blur-md rounded-lg border border-surface-tertiary shadow-card',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-tertiary">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Game Stats</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-surface-secondary rounded transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>

      {/* Game Status */}
      <div className="p-4 border-b border-surface-tertiary">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Status:</span>
          <span className={cn('text-sm font-medium', getGameStatusColor())}>
            {getGameStatusLabel()}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Game ID:</span>
          <span className="text-sm font-mono text-white">
            #{game.id.slice(0, 8).toUpperCase()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Duration:</span>
          <span className="text-sm text-white">
            {formatRelativeTime(game.createdAt)}
          </span>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Current Round Info */}
          <div className="p-4 border-b border-surface-tertiary">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Round:</span>
                  <span className="text-white font-medium">{game.currentRound}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Players:</span>
                  <span className="text-white font-medium">
                    {activePlayers.length}/{game.players.length}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Pot:</span>
                  <span className="text-gor-400 font-medium">
                    {formatGOR(game.pot)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Current Bet:</span>
                  <span className="text-success font-medium">
                    {game.currentBet > 0 ? formatGOR(game.currentBet) : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Turn */}
          {currentPlayer && game.status === 'betting' && (
            <div className="p-4 border-b border-surface-tertiary">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-4 w-4 text-primary-400" />
                <span className="text-sm font-medium text-white">Current Turn</span>
              </div>
              
              <div className="bg-surface-secondary/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Player:</span>
                  <span className={cn(
                    'text-sm font-medium',
                    currentPlayer.userId === currentUser?.id ? 'text-primary-400' : 'text-white'
                  )}>
                    {currentPlayer.username}
                    {currentPlayer.userId === currentUser?.id && ' (You)'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Chips:</span>
                  <span className="text-gor-400 text-sm font-medium">
                    {formatGOR(currentPlayer.chips)} GOR
                  </span>
                </div>

                {currentPlayer.timeRemaining > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Time Left:</span>
                    <span className={cn(
                      'text-sm font-medium',
                      currentPlayer.timeRemaining <= 10 ? 'text-danger' : 'text-warning'
                    )}>
                      {currentPlayer.timeRemaining}s
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Player List */}
          <div className="p-4 border-b border-surface-tertiary">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-white">Players</span>
            </div>
            
            <div className="space-y-2">
              {game.players.map((player, index) => (
                <div
                  key={player.id}
                  className={cn(
                    'flex items-center justify-between p-2 rounded-lg text-sm',
                    player.userId === currentUser?.id 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'bg-surface-secondary/30',
                    player.isFolded && 'opacity-50'
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      'font-medium',
                      player.userId === currentUser?.id ? 'text-primary-400' : 'text-white',
                      player.isFolded && 'line-through'
                    )}>
                      {player.username}
                    </span>
                    {index === 0 && (
                      <Trophy className="h-3 w-3 text-gor-400" />
                    )}
                    {game.currentPlayerIndex === index && game.status === 'betting' && (
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-gor-400 font-medium">
                      {formatGOR(player.chips)}
                    </span>
                    {player.currentBet > 0 && (
                      <span className="text-success text-xs">
                        (+{formatGOR(player.currentBet)})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Statistics */}
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-white">Statistics</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-surface-secondary/30 rounded-lg p-2">
                <div className="text-gray-400 mb-1">Avg Stack</div>
                <div className="text-gor-400 font-medium">
                  {formatGOR(averageChips)} GOR
                </div>
              </div>
              
              <div className="bg-surface-secondary/30 rounded-lg p-2">
                <div className="text-gray-400 mb-1">Active</div>
                <div className="text-success font-medium">
                  {activePlayers.length}/{game.players.length}
                </div>
              </div>
              
              <div className="bg-surface-secondary/30 rounded-lg p-2">
                <div className="text-gray-400 mb-1">Total Chips</div>
                <div className="text-white font-medium">
                  {formatGOR(totalChips)} GOR
                </div>
              </div>
              
              <div className="bg-surface-secondary/30 rounded-lg p-2">
                <div className="text-gray-400 mb-1">Ante</div>
                <div className="text-gor-400 font-medium">
                  {formatGOR(game.ante)} GOR
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}