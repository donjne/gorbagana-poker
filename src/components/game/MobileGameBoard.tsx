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
  WifiOff,
  MessageCircle,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileBettingControls } from './MobileBettingControls';

// Import the missing hooks and components
import { useWallet } from '@/hooks/useWallet';
import { useRealtimeGame } from '@/hooks/useRealtimeGame';
import { GameChat } from '@/components/game/GameChat';
import { GameFlow } from '@/components/game/GameFlow';
import { ConnectionStatus } from '@/components/ui/ConnectionStatus';
import { formatGOR } from '@/lib/utils';

import type { 
  MobileGameBoardProps, 
  Player, 
  PlayerAction,
  Game
} from '@/types';

export function MobileGameBoard({
  gameId,
  game: initialGame,
  className
}: MobileGameBoardProps): JSX.Element {
  const { user } = useWallet();
  const [showPlayerCards, setShowPlayerCards] = useState(true);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showChat, setShowChat] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  // Real-time game integration (same as desktop GameBoard)
  const { 
    game: realtimeGame, 
    isConnected, 
    isSyncing, 
    sendAction,
    requestSync
  } = useRealtimeGame({
    gameId,
    autoJoin: true,
    onPlayerJoined: (data) => {
      console.log('Player joined the game:', data.player.username);
    },
    onPlayerLeft: (data) => {
      console.log('Player left the game');
    },
    onGameUpdated: (game) => {
      console.log('Game state updated via real-time');
    },
    onActionBroadcast: (actionData) => {
      console.log('Action broadcast received:', actionData);
    },
    onRoundEnded: (data) => {
      console.log('Round ended, winner:', data.winner.username);
    },
  });

  // Use real-time game state if available, otherwise fallback to initial
  const activeGame = realtimeGame || initialGame;

  // const { orientation } = useResponsive();

  // useEffect(() => {
  //   // Orientation is now handled by useResponsive hook
  // }, []);

  // Find current user's player data
  useEffect(() => {
    if (activeGame && user) {
      const playerData = activeGame.players.find(p => p.userId === user.id);
      setCurrentPlayer(playerData || null);
    }
  }, [activeGame, user]);

  // Request sync if game state seems stale
  useEffect(() => {
    if (!activeGame && isConnected && !isSyncing) {
      console.log('No game state available, requesting sync...');
      requestSync();
    }
  }, [activeGame, isConnected, isSyncing, requestSync]);

  // Handle player actions with real-time sending
  const handlePlayerAction = async (action: PlayerAction, amount?: number): Promise<void> => {
    if (!currentPlayer || !user) {
      console.error('Cannot send action: no current player or user');
      return;
    }

    try {
      const actionData = {
        playerId: currentPlayer.id,
        action,
        amount,
        timestamp: new Date().toISOString(),
      };

      // Send via real-time connection (includes optimistic updates)
      await sendAction(actionData);
      console.log('Action sent successfully:', actionData);
    } catch (error) {
      console.error('Failed to send action:', error);
    }
  };

  // Loading state
  if (!activeGame) {
    return (
      <div className={cn('min-h-screen bg-gradient-to-br from-surface-primary via-background-primary to-surface-secondary flex items-center justify-center', className)}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-r-transparent mx-auto" />
          <p className="text-white text-lg">
            {isSyncing ? 'Syncing game state...' : 'Loading game...'}
          </p>
          <ConnectionStatus variant="detailed" />
          
          {!isConnected && (
            <button
              onClick={requestSync}
              className="btn-primary mt-4"
            >
              Retry Connection
            </button>
          )}
        </div>
      </div>
    );
  }

  const getCurrentTurnPlayer = (): Player | null => {
    return activeGame.players[activeGame.currentPlayerIndex] || null;
  };

  const isMyTurn = Boolean(
    activeGame.status === 'betting' && 
    currentPlayer && 
    activeGame.players[activeGame.currentPlayerIndex]?.id === currentPlayer.id
  );

  const timeRemaining = getCurrentTurnPlayer()?.timeRemaining || 0;

  return (
    <div className={cn(
      'min-h-screen bg-gradient-to-br from-surface-primary via-background-primary to-surface-secondary relative',
      orientation === 'landscape' ? 'landscape-layout' : 'portrait-layout',
      className
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
              isConnected ? 'bg-green-500/20 text-green-400' :
              isSyncing ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            )}>
              {isConnected ? <Wifi className="h-3 w-3" /> :
               isSyncing ? <Signal className="h-3 w-3" /> :
               <WifiOff className="h-3 w-3" />}
              <span className="capitalize">
                {isConnected ? 'Connected' : isSyncing ? 'Syncing' : 'Disconnected'}
              </span>
            </div>
          </div>

          {/* Current Turn */}
          <div className="flex items-center space-x-2">
            {getCurrentTurnPlayer() && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gor-400 rounded-full animate-pulse" />
                <span className="text-sm text-white">{getCurrentTurnPlayer()!.username}</span>
              </div>
            )}
          </div>

          {/* Timer & Chat Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
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
              <div className="text-2xl font-bold text-gor-400">{formatGOR(activeGame.pot)}</div>
              <div className="text-xs text-gray-400">Total Pot</div>
            </div>
          </div>
          {activeGame.currentBet > 0 && (
            <div className="mt-2 text-sm text-gray-400">
              Current bet: <span className="text-white font-medium">{formatGOR(activeGame.currentBet)}</span>
            </div>
          )}
        </motion.div>

        {/* Players Grid - Mobile Optimized */}
        <div className={cn(
          'grid gap-3',
          orientation === 'landscape' ? 'grid-cols-3' : 'grid-cols-2'
        )}>
          {activeGame.players.map((player, index) => {
            const isCurrentTurn = activeGame.currentPlayerIndex === index && activeGame.status === 'betting';
            const isMe = player.userId === user?.id;
            
            return (
              <motion.div
                key={player.id}
                className={cn(
                  'bg-surface-primary/80 backdrop-blur-sm rounded-lg p-4 border border-surface-tertiary',
                  isCurrentTurn && 'ring-2 ring-gor-400 border-gor-400/50',
                  isMe && 'bg-primary-500/10 border-primary-500/50'
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
                      player.isConnected ? 'bg-green-400' : 'bg-gray-500'
                    )} />
                    <span className="text-white font-medium text-sm truncate">
                      {player.username}
                    </span>
                  </div>
                  {isCurrentTurn && (
                    <Zap className="h-4 w-4 text-gor-400 animate-pulse" />
                  )}
                </div>

                {/* Player Card */}
                <div className="mb-3">
                  {isMe ? (
                    <div className="relative">
                      <div className="w-full h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center border-2 border-primary-400">
                        <div className="text-center">
                          {showPlayerCards ? (
                            <div className="text-white font-bold text-lg">
                              🃏
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
                          {(activeGame.status === 'showdown' || player.isFolded) ? '🃏' : '🂠'}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {player.isFolded ? 'Folded' : 'Hidden'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Player Stats */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Stack</span>
                    <span className="text-white font-medium">{formatGOR(player.chips)}</span>
                  </div>
                  {player.currentBet > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Bet</span>
                      <span className="text-gor-400 font-medium">{formatGOR(player.currentBet)}</span>
                    </div>
                  )}
                  {player.lastAction && (
                    <div className="text-xs text-center py-1 px-2 bg-surface-secondary rounded text-gray-300">
                      {player.lastAction}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Game Actions Summary - Mobile */}
        <div className="mt-6 bg-surface-primary/60 backdrop-blur-sm rounded-lg p-4 border border-surface-tertiary">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">{activeGame.players.length}</div>
              <div className="text-xs text-gray-400">Players</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gor-400">{formatGOR(activeGame.pot)}</div>
              <div className="text-xs text-gray-400">Total Pot</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{formatGOR(currentPlayer?.chips || 0)}</div>
              <div className="text-xs text-gray-400">Your Stack</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Betting Controls */}
      {currentPlayer && !currentPlayer.isFolded && activeGame.status === 'betting' && (
        <MobileBettingControls
          currentBet={activeGame.currentBet}
          minBet={activeGame.ante}
          maxBet={currentPlayer.chips}
          playerStack={currentPlayer.chips}
          potSize={activeGame.pot}
          onAction={handlePlayerAction}
          timeRemaining={timeRemaining}
          isMyTurn={isMyTurn}
          canCheck={activeGame.currentBet === 0}
          callAmount={activeGame.currentBet}
        />
      )}

      {/* Mobile Chat Overlay */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full bg-surface-primary rounded-t-2xl max-h-[70vh] flex flex-col">
            <div className="p-4 border-b border-surface-tertiary flex items-center justify-between">
              <h3 className="text-white font-medium">Game Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <GameChat 
                gameId={gameId}
                players={activeGame.players}
                currentUser={user}
              />
            </div>
          </div>
        </div>
      )}

      {/* Connection Lost Overlay */}
      {!isConnected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface-primary rounded-xl p-8 text-center shadow-card max-w-md mx-4">
            <ConnectionStatus variant="detailed" />
            <h3 className="text-lg font-bold text-white mb-2 mt-4">Connection Lost</h3>
            <p className="text-gray-400 mb-4">
              Attempting to reconnect to the game server...
            </p>
            <button
              onClick={requestSync}
              className="btn-primary w-full"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Game Flow Components */}
      <GameFlow gameId={gameId} />

      {/* Sync Status Indicator */}
      {isSyncing && isConnected && (
        <div className="fixed bottom-36 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-warning/90 backdrop-blur-md rounded-lg px-4 py-2 border border-warning/30">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-r-transparent" />
              <span className="text-black text-sm font-medium">Syncing...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}