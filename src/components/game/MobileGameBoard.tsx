'use client';

import { JSX, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  Coins, 
  Eye, 
  EyeOff, 
  Crown,
  Zap,
  Signal,
  Wifi,
  WifiOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileBettingControls } from './MobileBettingControls';

interface MobileGameBoardProps {
  gameId: string;
  players: any[];
  currentPlayer: any;
  isMyTurn: boolean;
  timeRemaining: number;
  pot: number;
  currentBet: number;
  myStack: number;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
}

export function MobileGameBoard({
  gameId,
  players,
  currentPlayer,
  isMyTurn,
  timeRemaining,
  pot,
  currentBet,
  myStack,
  connectionStatus
}: MobileGameBoardProps): JSX.Element {
  const [showPlayerCards, setShowPlayerCards] = useState(true);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  const handlePlayerAction = (action: string, amount?: number) => {
    // TODO: Implement action handling
    console.log('Player action:', action, amount);
  };

  return (
    <div className={cn(
      'min-h-screen bg-gradient-to-br from-surface-primary via-background-primary to-surface-secondary',
      orientation === 'landscape' ? 'landscape-layout' : 'portrait-layout'
    )}>
      {/* Status Bar */}
      <div className="fixed top-0 left-0 right-0 bg-surface-primary/95 backdrop-blur-sm border-b border-surface-tertiary p-3 z-40">
        <div className="flex items-center justify-between">
          {/* Game Info */}
          <div className="flex items-center space-x-3">
            <div className="text-sm font-medium text-white">
              Game #{gameId.slice(0, 6)}
            </div>
            <div className={cn(
              'flex items-center space-x-1 text-xs px-2 py-1 rounded-full',
              connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400' :
              connectionStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            )}>
              {connectionStatus === 'connected' ? <Wifi className="h-3 w-3" /> :
               connectionStatus === 'connecting' ? <Signal className="h-3 w-3" /> :
               <WifiOff className="h-3 w-3" />}
              <span className="capitalize">{connectionStatus}</span>
            </div>
          </div>

          {/* Current Turn */}
          <div className="flex items-center space-x-2">
            {currentPlayer && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gor-400 rounded-full animate-pulse" />
                <span className="text-sm text-white">{currentPlayer.username}</span>
              </div>
            )}
          </div>

          {/* Timer */}
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className={cn(
              'text-sm font-mono',
              timeRemaining > 15 ? 'text-green-400' :
              timeRemaining > 5 ? 'text-yellow-400' : 'text-red-400'
            )}>
              {timeRemaining}s
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="pt-16 pb-32 px-4">
        {/* Pot Display */}
        <motion.div
          className="text-center py-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center space-x-2 bg-surface-primary/80 backdrop-blur-sm rounded-full px-6 py-3 border border-surface-tertiary">
            <Coins className="h-6 w-6 text-gor-400" />
            <div>
              <div className="text-2xl font-bold text-gor-400">{pot} GOR</div>
              <div className="text-xs text-gray-400">Total Pot</div>
            </div>
          </div>
          {currentBet > 0 && (
            <div className="mt-2 text-sm text-gray-400">
              Current bet: <span className="text-white font-medium">{currentBet} GOR</span>
            </div>
          )}
        </motion.div>

        {/* Players Grid - Mobile Optimized */}
        <div className={cn(
          'grid gap-3',
          orientation === 'landscape' ? 'grid-cols-3' : 'grid-cols-2'
        )}>
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              className={cn(
                'bg-surface-primary/80 backdrop-blur-sm rounded-lg p-4 border border-surface-tertiary',
                player.isCurrentPlayer && 'ring-2 ring-gor-400 border-gor-400/50',
                player.isMe && 'bg-primary-500/10 border-primary-500/50'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Player Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    player.isOnline ? 'bg-green-400' : 'bg-gray-500'
                  )} />
                  <span className="text-white font-medium text-sm truncate">
                    {player.username}
                  </span>
                  {player.isDealer && <Crown className="h-4 w-4 text-yellow-400" />}
                </div>
                {player.isCurrentPlayer && (
                  <Zap className="h-4 w-4 text-gor-400 animate-pulse" />
                )}
              </div>

              {/* Player Card */}
              <div className="mb-3">
                {player.isMe ? (
                  <div className="relative">
                    <div className="w-full h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center border-2 border-primary-400">
                      <div className="text-center">
                        {showPlayerCards ? (
                          <div className="text-white font-bold text-lg">
                            {player.hiddenCard || '🃏'}
                          </div>
                        ) : (
                          <EyeOff className="h-6 w-6 text-white" />
                        )}
                        <div className="text-xs text-white/80 mt-1">Your Card</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPlayerCards(!showPlayerCards)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/20 rounded-full flex items-center justify-center"
                    >
                      {showPlayerCards ? (
                        <Eye className="h-3 w-3 text-white" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-white" />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-20 bg-surface-secondary rounded-lg flex items-center justify-center border border-surface-tertiary">
                    <div className="text-center">
                      <div className="text-white font-bold text-lg">
                        {player.visibleCard || '🃏'}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Visible</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Player Stats */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Stack</span>
                  <span className="text-white font-medium">{player.stack} GOR</span>
                </div>
                {player.currentBet > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Bet</span>
                    <span className="text-gor-400 font-medium">{player.currentBet} GOR</span>
                  </div>
                )}
                {player.lastAction && (
                  <div className="text-xs text-center py-1 px-2 bg-surface-secondary rounded text-gray-300">
                    {player.lastAction}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Game Actions Summary - Mobile */}
        <div className="mt-6 bg-surface-primary/60 backdrop-blur-sm rounded-lg p-4 border border-surface-tertiary">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">{players.length}</div>
              <div className="text-xs text-gray-400">Players</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gor-400">{pot}</div>
              <div className="text-xs text-gray-400">Total Pot</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{myStack}</div>
              <div className="text-xs text-gray-400">Your Stack</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Betting Controls */}
      <MobileBettingControls
        currentBet={currentBet}
        minBet={10}
        maxBet={myStack}
        playerStack={myStack}
        potSize={pot}
        onAction={handlePlayerAction}
        timeRemaining={timeRemaining}
        isMyTurn={isMyTurn}
        canCheck={currentBet === 0}
        callAmount={currentBet}
      />
    </div>
  );
}