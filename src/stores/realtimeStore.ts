// src/stores/realtimeStore.ts
import { create } from 'zustand';
import { socketManager } from '@/lib/socket';
import { toast } from '@/components/ui/Toaster';

import type { Game, Player, PlayerActionData, SocketEvents } from '@/types';

interface OptimisticAction {
  id: string;
  actionData: PlayerActionData;
  timestamp: number;
  isConfirmed: boolean;
  timeout?: NodeJS.Timeout;
}

interface RealtimeState {
  // Connection state
  isConnected: boolean;
  reconnecting: boolean;
  lastConnectionTime: number | null;
  
  // Game synchronization
  serverGameState: Game | null;
  optimisticActions: OptimisticAction[];
  pendingSync: boolean;
  lastSyncTime: number | null;
  
  // Real-time events
  activeEvents: Array<{
    id: string;
    type: string;
    data: any;
    timestamp: number;
  }>;
  
  // Actions
  setConnectionState: (connected: boolean, reconnecting?: boolean) => void;
  updateServerGameState: (game: Game) => void;
  addOptimisticAction: (actionData: PlayerActionData) => string;
  confirmOptimisticAction: (actionId: string) => void;
  revertOptimisticAction: (actionId: string) => void;
  clearOptimisticActions: () => void;
  addRealtimeEvent: (type: string, data: any) => void;
  clearOldEvents: () => void;
  
  // Real-time sync methods
  requestGameSync: (gameId: string) => void;
  handleServerUpdate: (game: Game) => void;
}

export const useRealtimeStore = create<RealtimeState>((set, get) => ({
  // Initial state
  isConnected: false,
  reconnecting: false,
  lastConnectionTime: null,
  serverGameState: null,
  optimisticActions: [],
  pendingSync: false,
  lastSyncTime: null,
  activeEvents: [],

  // Connection state management
  setConnectionState: (connected, reconnecting = false) => {
    set({
      isConnected: connected,
      reconnecting,
      lastConnectionTime: connected ? Date.now() : get().lastConnectionTime,
    });
  },

  // Server game state management
  updateServerGameState: (game) => {
    set({
      serverGameState: game,
      lastSyncTime: Date.now(),
      pendingSync: false,
    });
  },

  // Optimistic updates for smooth UX
  addOptimisticAction: (actionData) => {
    const actionId = `${actionData.playerId}-${Date.now()}-${Math.random()}`;
    const optimisticAction: OptimisticAction = {
      id: actionId,
      actionData,
      timestamp: Date.now(),
      isConfirmed: false,
      timeout: setTimeout(() => {
        // Revert action if not confirmed within 5 seconds
        console.warn('Optimistic action timed out:', actionId);
        get().revertOptimisticAction(actionId);
        toast.error('Action may have failed - game state updated');
      }, 5000),
    };

    set(state => ({
      optimisticActions: [...state.optimisticActions, optimisticAction],
    }));

    return actionId;
  },

  confirmOptimisticAction: (actionId) => {
    set(state => {
      const updatedActions = state.optimisticActions.map(action => {
        if (action.id === actionId) {
          if (action.timeout) {
            clearTimeout(action.timeout);
          }
          return { ...action, isConfirmed: true };
        }
        return action;
      });

      // Remove confirmed actions after a short delay
      setTimeout(() => {
        set(state => ({
          optimisticActions: state.optimisticActions.filter(a => a.id !== actionId),
        }));
      }, 1000);

      return { optimisticActions: updatedActions };
    });
  },

  revertOptimisticAction: (actionId) => {
    set(state => {
      const action = state.optimisticActions.find(a => a.id === actionId);
      if (action?.timeout) {
        clearTimeout(action.timeout);
      }

      return {
        optimisticActions: state.optimisticActions.filter(a => a.id !== actionId),
      };
    });
  },

  clearOptimisticActions: () => {
    const { optimisticActions } = get();
    optimisticActions.forEach(action => {
      if (action.timeout) {
        clearTimeout(action.timeout);
      }
    });
    set({ optimisticActions: [] });
  },

  // Real-time event management
  addRealtimeEvent: (type, data) => {
    const event = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      data,
      timestamp: Date.now(),
    };

    set(state => ({
      activeEvents: [...state.activeEvents.slice(-50), event], // Keep last 50 events
    }));

    // Auto-cleanup old events
    setTimeout(() => {
      get().clearOldEvents();
    }, 30000); // Clean up after 30 seconds
  },

  clearOldEvents: () => {
    const cutoff = Date.now() - 30000; // 30 seconds ago
    set(state => ({
      activeEvents: state.activeEvents.filter(event => event.timestamp > cutoff),
    }));
  },

  // Game synchronization
  requestGameSync: (gameId) => {
    if (!socketManager.isConnected) {
      console.warn('Cannot sync: socket not connected');
      return;
    }

    set({ pendingSync: true });
    
    // Request game state from server
    socketManager.emit('request-game-state', { gameId });
  },

  handleServerUpdate: (game) => {
    const { optimisticActions, serverGameState } = get();
    
    // Check if this update confirms any optimistic actions
    optimisticActions.forEach(action => {
      if (!action.isConfirmed) {
        // Check if the server state includes this action
        const serverPlayer = game.players.find(p => p.id === action.actionData.playerId);
        if (serverPlayer && serverPlayer.lastAction === action.actionData.action) {
          get().confirmOptimisticAction(action.id);
        }
      }
    });

    // Update server state
    get().updateServerGameState(game);
    
    // Add real-time event
    get().addRealtimeEvent('game-updated', game);
  },
}));

// Utility functions for optimistic updates
export const createOptimisticGameState = (
  serverGame: Game | null, 
  optimisticActions: OptimisticAction[]
): Game | null => {
  if (!serverGame) return null;

  let optimisticGame = { ...serverGame };

  // Apply unconfirmed optimistic actions
  const unconfirmedActions = optimisticActions.filter(a => !a.isConfirmed);
  
  unconfirmedActions.forEach(({ actionData }) => {
    const playerIndex = optimisticGame.players.findIndex(p => p.id === actionData.playerId);
    if (playerIndex === -1) return;

    const player = optimisticGame.players[playerIndex];
    const updatedPlayers = [...optimisticGame.players];

    // Apply optimistic action
    switch (actionData.action) {
      case 'fold':
      case 'auto-fold':
        updatedPlayers[playerIndex] = {
          ...player,
          isFolded: true,
          lastAction: actionData.action,
        };
        break;

      case 'check':
        updatedPlayers[playerIndex] = {
          ...player,
          lastAction: actionData.action,
        };
        break;

      case 'call':
        const callAmount = Math.max(0, optimisticGame.currentBet - player.currentBet);
        updatedPlayers[playerIndex] = {
          ...player,
          currentBet: optimisticGame.currentBet,
          chips: player.chips - callAmount,
          lastAction: actionData.action,
        };
        optimisticGame.pot += callAmount;
        break;

      case 'bet':
      case 'raise':
        const betAmount = actionData.amount || 0;
        const additionalBet = betAmount - player.currentBet;
        updatedPlayers[playerIndex] = {
          ...player,
          currentBet: betAmount,
          chips: player.chips - additionalBet,
          lastAction: actionData.action,
        };
        optimisticGame.pot += additionalBet;
        optimisticGame.currentBet = Math.max(optimisticGame.currentBet, betAmount);
        break;
    }

    optimisticGame.players = updatedPlayers;
  });

  return optimisticGame;
};

// Hook for components to get optimistic game state
export const useOptimisticGameState = (gameId?: string) => {
  const { serverGameState, optimisticActions } = useRealtimeStore();
  
  if (!serverGameState || serverGameState.id !== gameId) {
    return null;
  }

  return createOptimisticGameState(serverGameState, optimisticActions);
};