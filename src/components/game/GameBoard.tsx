'use client';

import { useState, useEffect, JSX } from 'react';
import { Users, Coins, Clock } from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { useRealtimeGame } from '@/hooks/useRealtimeGame';
import { PlayerCard } from '@/components/game/PlayerCard';
import { GameTimer } from '@/components/game/GameTimer';
import { PotDisplay } from '@/components/game/PotDisplay';
import { GameChat } from '@/components/game/GameChat';
import { ActionButtons } from '@/components/game/ActionButtons';
import { TurnIndicator } from '@/components/game/TurnIndicator';
import { GameStateDisplay } from '@/components/game/GameStateDisplay';
import { GameFlow } from '@/components/game/GameFlow';
import { ConnectionStatus } from '@/components/ui/ConnectionStatus';
import { formatGOR } from '@/lib/utils';

import type { Game, Player, PlayerAction } from '@/types';

interface GameBoardProps {
  gameId: string;
  game?: Game | null;
  className?: string;
}

export function GameBoard({ gameId, game: initialGame, className }: GameBoardProps): JSX.Element {
  const { user } = useWallet();
  
  // Real-time game integration
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
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [myPosition, setMyPosition] = useState<number>(-1);

  // Find current user's player data
  useEffect(() => {
    if (activeGame && user) {
      const playerData = activeGame.players.find(p => p.userId === user.id);
      setCurrentPlayer(playerData || null);
      setMyPosition(playerData?.position || -1);
    }
  }, [activeGame, user]);

  // Request sync if game state seems stale
  useEffect(() => {
    if (!activeGame && isConnected && !isSyncing) {
      console.log('No game state available, requesting sync...');
      requestSync();
    }
  }, [activeGame, isConnected, isSyncing, requestSync]);

  if (!activeGame) {
    return (
      <div className={`game-board ${className}`}>
        <div className="flex items-center justify-center min-h-screen">
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
      </div>
    );
  }

  // Calculate player positions around the table
  const getPlayerPosition = (playerIndex: number, totalPlayers: number): { top: string; left: string; transform: string } => {
    const angle = (playerIndex * 360) / totalPlayers;
    const radians = (angle * Math.PI) / 180;
    const radius = 35; // Percentage from center
    
    const x = 50 + radius * Math.cos(radians - Math.PI / 2);
    const y = 50 + radius * Math.sin(radians - Math.PI / 2);
    
    return {
      top: `${y}%`,
      left: `${x}%`,
      transform: 'translate(-50%, -50%)'
    };
  };

  const isMyTurn = Boolean(
    activeGame.status === 'betting' && 
    currentPlayer && 
    activeGame.players[activeGame.currentPlayerIndex]?.id === currentPlayer.id
  );

  const getCurrentTurnPlayer = (): Player | null => {
    return activeGame.players[activeGame.currentPlayerIndex] || null;
  };

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

  return (
    <div className={`game-board relative ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.3) 0%, transparent 40%),
              conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(58, 159, 58, 0.1) 60deg, transparent 120deg, rgba(245, 158, 11, 0.1) 180deg, transparent 240deg, rgba(58, 159, 58, 0.1) 300deg, transparent 360deg)
            `,
          }}
        />
      </div>

      {/* Game Header */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex items-center justify-between">
          {/* Game Info */}
          <div className="bg-surface-primary/90 backdrop-blur-md rounded-lg px-4 py-2 border border-surface-tertiary">
            <div className="flex items-center space-x-4">
              <ConnectionStatus variant="indicator" />
              <span className="text-sm text-gray-300">
                {isConnected ? 'Connected' : 'Reconnecting...'}
              </span>
              
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-white">
                  {activeGame.players.length}/{activeGame.maxPlayers}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 text-gor-400" />
                <span className="text-sm text-gor-400">
                  {formatGOR(activeGame.ante)} GOR ante
                </span>
              </div>

              {isSyncing && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-warning border-r-transparent" />
                  <span className="text-xs text-warning">Syncing...</span>
                </div>
              )}
            </div>
          </div>

          {/* Connection Status & Game Timer */}
          <div className="flex items-center space-x-3">
            <ConnectionStatus variant="minimal" />
            <GameTimer 
              timeRemaining={getCurrentTurnPlayer()?.timeRemaining || 0}
              isActive={activeGame.status === 'betting'}
              isMyTurn={isMyTurn}
            />
          </div>
        </div>
      </div>

      {/* Turn Indicator */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
        {activeGame.status === 'betting' && getCurrentTurnPlayer() && (
          <TurnIndicator
            currentPlayer={getCurrentTurnPlayer()!}
            timeRemaining={getCurrentTurnPlayer()?.timeRemaining || 0}
            isMyTurn={isMyTurn}
            onTimeExpired={() => {
              // Auto-fold on timeout
              if (currentPlayer && isMyTurn) {
                handlePlayerAction('auto-fold');
              }
            }}
          />
        )}
      </div>

      {/* Central Game Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Game Table */}
        <div className="relative w-96 h-96 rounded-full border-4 border-gor-400/30 bg-gradient-to-br from-primary-900/20 to-gor-900/20 backdrop-blur-sm">
          {/* Table Felt Pattern */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary-800/10 to-gor-800/10 border border-primary-500/20" />
          
          {/* Pot Display */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <PotDisplay 
              amount={activeGame.pot}
              currentBet={activeGame.currentBet}
              lastAction={getCurrentTurnPlayer()?.lastAction || null}
            />
          </div>

          {/* Player Positions */}
          {activeGame.players.map((player, index) => {
            const position = getPlayerPosition(index, activeGame.players.length);
            const isCurrentTurn = activeGame.currentPlayerIndex === index && activeGame.status === 'betting';
            const isMe = player.userId === user?.id;
            
            return (
              <div
                key={player.id}
                className="absolute"
                style={position}
              >
                <PlayerCard
                  player={player}
                  isCurrentTurn={isCurrentTurn}
                  isMe={isMe}
                  showCard={activeGame.status === 'showdown' || player.isFolded}
                  position={index}
                />
              </div>
            );
          })}

          {/* Empty Player Slots */}
          {Array.from({ length: activeGame.maxPlayers - activeGame.players.length }, (_, i) => {
            const slotIndex = activeGame.players.length + i;
            const position = getPlayerPosition(slotIndex, activeGame.maxPlayers);
            
            return (
              <div
                key={`empty-${i}`}
                className="absolute"
                style={position}
              >
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-surface-tertiary bg-surface-primary/50 flex items-center justify-center">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Panel */}
      {currentPlayer && !currentPlayer.isFolded && activeGame.status === 'betting' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <ActionButtons
            game={activeGame}
            player={currentPlayer}
            isMyTurn={isMyTurn}
            onAction={handlePlayerAction}
          />
        </div>
      )}

      {/* Side Panel - Game State */}
      <div className="absolute top-4 left-4 bottom-4 w-80 z-10 space-y-4">
        <GameStateDisplay 
          game={activeGame}
          currentUser={user}
        />
      </div>

      {/* Side Panel - Chat */}
      <div className="absolute top-4 right-4 bottom-4 w-80 z-10">
        <GameChat 
          gameId={gameId}
          players={activeGame.players}
          currentUser={user}
        />
      </div>

      {/* Game Round Info */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-surface-primary/90 backdrop-blur-md rounded-lg px-4 py-2 border border-surface-tertiary">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">Round {activeGame.currentRound}</span>
            </div>
            
            {activeGame.status === 'betting' && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-success">Betting in progress</span>
              </div>
            )}

            {!isConnected && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                <span className="text-danger">Offline</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Game Flow Components */}
      <GameFlow gameId={gameId} />

      {/* Connection Lost Overlay */}
      {!isConnected && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface-primary rounded-xl p-8 text-center shadow-card max-w-md">
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

      {/* Sync Status Indicator */}
      {isSyncing && isConnected && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-warning/90 backdrop-blur-md rounded-lg px-4 py-2 border border-warning/30">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-r-transparent" />
              <span className="text-black text-sm font-medium">Syncing game state...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}