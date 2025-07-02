// src/hooks/useRealtimeGame.ts
import { useEffect, useCallback, useRef } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useRealtimeStore, useOptimisticGameState } from '@/stores/realtimeStore';
import { useGameStore } from '@/stores/gameStore';
import { toast } from '@/components/ui/Toaster';

import type { Game, Player, PlayerActionData, SocketEvents } from '@/types';

interface UseRealtimeGameReturn {
  // Game state (with optimistic updates)
  game: Game | null;
  isConnected: boolean;
  isSyncing: boolean;
  
  // Actions
  sendAction: (actionData: PlayerActionData) => Promise<string>;
  joinGameRoom: () => void;
  leaveGameRoom: () => void;
  requestSync: () => void;
  
  // Event handlers you can override
  onPlayerJoined?: (data: { game: Game; player: Player }) => void;
  onPlayerLeft?: (data: { game: Game; playerId: string }) => void;
  onGameUpdated?: (game: Game) => void;
  onActionBroadcast?: (actionData: PlayerActionData) => void;
  onRoundStarted?: (data: { game: Game }) => void;
  onRoundEnded?: (data: { game: Game; winner: Player }) => void;
  onGameEnded?: (data: { game: Game; winner: Player }) => void;
}

interface UseRealtimeGameOptions {
  gameId: string;
  autoJoin?: boolean;
  onPlayerJoined?: (data: { game: Game; player: Player }) => void;
  onPlayerLeft?: (data: { game: Game; playerId: string }) => void;
  onGameUpdated?: (game: Game) => void;
  onActionBroadcast?: (actionData: PlayerActionData) => void;
  onRoundStarted?: (data: { game: Game }) => void;
  onRoundEnded?: (data: { game: Game; winner: Player }) => void;
  onGameEnded?: (data: { game: Game; winner: Player }) => void;
}

export function useRealtimeGame({
  gameId,
  autoJoin = true,
  onPlayerJoined,
  onPlayerLeft,
  onGameUpdated,
  onActionBroadcast,
  onRoundStarted,
  onRoundEnded,
  onGameEnded,
}: UseRealtimeGameOptions): UseRealtimeGameReturn {
  
  const socket = useSocket();
  const { 
    isConnected: realtimeConnected, 
    pendingSync,
    addOptimisticAction,
    handleServerUpdate,
    requestGameSync,
    setConnectionState,
  } = useRealtimeStore();
  
  const { setCurrentGame } = useGameStore();
  
  // Get optimistic game state
  const optimisticGame = useOptimisticGameState(gameId);
  
  // Track if we've joined the room
  const hasJoinedRoom = useRef(false);
  const gameIdRef = useRef(gameId);

  // Update refs
  useEffect(() => {
    gameIdRef.current = gameId;
  }, [gameId]);

  // Update connection state in realtime store
  useEffect(() => {
    setConnectionState(socket.isConnected, socket.isConnecting);
  }, [socket.isConnected, socket.isConnecting, setConnectionState]);

  // Auto-join game room when connected
  useEffect(() => {
    if (socket.isConnected && autoJoin && gameId && !hasJoinedRoom.current) {
      socket.joinGame(gameId);
      hasJoinedRoom.current = true;
      console.log(`Joined game room: ${gameId}`);
    }
  }, [socket.isConnected, autoJoin, gameId, socket]);

  // Leave room on unmount or gameId change
  useEffect(() => {
    return () => {
      if (hasJoinedRoom.current && gameIdRef.current) {
        socket.leaveGame(gameIdRef.current);
        hasJoinedRoom.current = false;
        console.log(`Left game room: ${gameIdRef.current}`);
      }
    };
  }, [socket]);

  // Handle game ID changes
  useEffect(() => {
    if (hasJoinedRoom.current && gameIdRef.current !== gameId) {
      // Leave old room
      socket.leaveGame(gameIdRef.current);
      
      // Join new room
      if (gameId && socket.isConnected) {
        socket.joinGame(gameId);
        console.log(`Switched to game room: ${gameId}`);
      } else {
        hasJoinedRoom.current = false;
      }
    }
  }, [gameId, socket]);

  // Event handlers
  const handleGameUpdated = useCallback((game: Game) => {
    console.log('Game updated via socket:', game.id);
    handleServerUpdate(game);
    setCurrentGame(game);
    onGameUpdated?.(game);
  }, [handleServerUpdate, setCurrentGame, onGameUpdated]);

  const handlePlayerJoined = useCallback((data: { game: Game; player: Player }) => {
    console.log('Player joined:', data.player.username);
    handleServerUpdate(data.game);
    setCurrentGame(data.game);
    toast.playerAction(data.player.username, 'joined the game');
    onPlayerJoined?.(data);
  }, [handleServerUpdate, setCurrentGame, onPlayerJoined]);

  const handlePlayerLeft = useCallback((data: { game: Game; playerId: string }) => {
    console.log('Player left:', data.playerId);
    const player = data.game.players.find(p => p.id === data.playerId);
    handleServerUpdate(data.game);
    setCurrentGame(data.game);
    
    if (player) {
      toast.playerAction(player.username, 'left the game');
    }
    onPlayerLeft?.(data);
  }, [handleServerUpdate, setCurrentGame, onPlayerLeft]);

  const handleActionBroadcast = useCallback((actionData: PlayerActionData) => {
    console.log('Action broadcast:', actionData);
    
    // Find the player who made the action
    const game = optimisticGame;
    if (game) {
      const player = game.players.find(p => p.id === actionData.playerId);
      if (player) {
        const actionText = getActionText(actionData);
        toast.playerAction(player.username, actionText);
      }
    }
    
    onActionBroadcast?.(actionData);
  }, [optimisticGame, onActionBroadcast]);

  const handleRoundStarted = useCallback((data: { game: Game }) => {
    console.log('Round started');
    handleServerUpdate(data.game);
    setCurrentGame(data.game);
    toast.gameSuccess('New round started!');
    onRoundStarted?.(data);
  }, [handleServerUpdate, setCurrentGame, onRoundStarted]);

  const handleRoundEnded = useCallback((data: { game: Game; winner: Player }) => {
    console.log('Round ended, winner:', data.winner.username);
    handleServerUpdate(data.game);
    setCurrentGame(data.game);
    toast.gameSuccess(`${data.winner.username} wins the round!`);
    onRoundEnded?.(data);
  }, [handleServerUpdate, setCurrentGame, onRoundEnded]);

  const handleGameEnded = useCallback((data: { game: Game; winner: Player }) => {
    console.log('Game ended, winner:', data.winner.username);
    handleServerUpdate(data.game);
    setCurrentGame(data.game);
    toast.gameSuccess(`Game over! ${data.winner.username} wins!`);
    onGameEnded?.(data);
  }, [handleServerUpdate, setCurrentGame, onGameEnded]);

  const handleTimerUpdate = useCallback((data: { playerId: string; timeRemaining: number }) => {
    // Update player timer in current game
    if (optimisticGame) {
      const updatedGame = {
        ...optimisticGame,
        players: optimisticGame.players.map(player =>
          player.id === data.playerId
            ? { ...player, timeRemaining: data.timeRemaining }
            : player
        ),
      };
      setCurrentGame(updatedGame);
    }
  }, [optimisticGame, setCurrentGame]);

  const handleError = useCallback((data: { message: string }) => {
    console.error('Socket error:', data.message);
    toast.error(`Game error: ${data.message}`);
  }, []);

  // Register socket event listeners
  useEffect(() => {
    if (!socket.isConnected) return;

    socket.on('game-updated', handleGameUpdated);
    socket.on('player-joined', handlePlayerJoined);
    socket.on('player-left', handlePlayerLeft);
    socket.on('action-broadcast', handleActionBroadcast);
    socket.on('round-started', handleRoundStarted);
    socket.on('round-ended', handleRoundEnded);
    socket.on('game-ended', handleGameEnded);
    socket.on('timer-update', handleTimerUpdate);
    socket.on('error', handleError);

    return () => {
      socket.off('game-updated', handleGameUpdated);
      socket.off('player-joined', handlePlayerJoined);
      socket.off('player-left', handlePlayerLeft);
      socket.off('action-broadcast', handleActionBroadcast);
      socket.off('round-started', handleRoundStarted);
      socket.off('round-ended', handleRoundEnded);
      socket.off('game-ended', handleGameEnded);
      socket.off('timer-update', handleTimerUpdate);
      socket.off('error', handleError);
    };
  }, [
    socket,
    handleGameUpdated,
    handlePlayerJoined,
    handlePlayerLeft,
    handleActionBroadcast,
    handleRoundStarted,
    handleRoundEnded,
    handleGameEnded,
    handleTimerUpdate,
    handleError,
  ]);

  // Action methods
  const sendAction = useCallback(async (actionData: PlayerActionData): Promise<string> => {
    if (!socket.isConnected) {
      throw new Error('Not connected to server');
    }

    // Add optimistic action for immediate UI feedback
    const actionId = addOptimisticAction(actionData);
    
    // Send to server
    socket.sendPlayerAction(actionData);
    
    return actionId;
  }, [socket, addOptimisticAction]);

  const joinGameRoom = useCallback(() => {
    if (socket.isConnected && gameId) {
      socket.joinGame(gameId);
      hasJoinedRoom.current = true;
    }
  }, [socket, gameId]);

  const leaveGameRoom = useCallback(() => {
    if (hasJoinedRoom.current && gameId) {
      socket.leaveGame(gameId);
      hasJoinedRoom.current = false;
    }
  }, [socket, gameId]);

  const requestSync = useCallback(() => {
    requestGameSync(gameId);
  }, [requestGameSync, gameId]);

  return {
    game: optimisticGame,
    isConnected: realtimeConnected && socket.isConnected,
    isSyncing: pendingSync,
    sendAction,
    joinGameRoom,
    leaveGameRoom,
    requestSync,
  };
}

// Helper function to format action text for toasts
function getActionText(actionData: PlayerActionData): string {
  switch (actionData.action) {
    case 'check':
      return 'checked';
    case 'call':
      return 'called';
    case 'bet':
      return `bet ${actionData.amount} GOR`;
    case 'raise':
      return `raised to ${actionData.amount} GOR`;
    case 'fold':
      return 'folded';
    case 'auto-fold':
      return 'auto-folded (timeout)';
    default:
      return `performed ${actionData.action}`;
  }
}