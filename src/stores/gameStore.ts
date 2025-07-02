import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createDeck, shuffleArray } from '@/lib/utils';

import type { Game, Player, Card, PlayerAction, PlayerActionData, GameStatus } from '@/types';

interface GameState {
  // Current game data
  currentGame: Game | null;
  gameHistory: Game[];
  
  // Game flow state
  isDealing: boolean;
  isRevealing: boolean;
  showResults: boolean;
  winner: Player | null;
  
  // Animation states
  animatingActions: PlayerActionData[];
  dealingCards: boolean;
  revealingCards: boolean;
  
  // UI state
  spectatorMode: boolean;
  showGameStats: boolean;
  autoAdvance: boolean;
  
  // Actions
  setCurrentGame: (game: Game) => void;
  updateGameState: (updates: Partial<Game>) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  
  // Game flow actions
  dealCards: () => void;
  processPlayerAction: (actionData: PlayerActionData) => void;
  advanceToNextPlayer: () => void;
  startShowdown: () => void;
  endGame: (winner: Player) => void;
  checkRoundEnd: () => void;
  
  // Animation actions
  setDealingCards: (dealing: boolean) => void;
  setRevealingCards: (revealing: boolean) => void;
  addAnimatingAction: (action: PlayerActionData) => void;
  clearAnimatingActions: () => void;
  
  // Utility actions
  calculateWinner: () => Player | null;
  getTotalPot: () => number;
  getActivePlayers: () => Player[];
  canPlayerAct: (playerId: string) => boolean;
  
  // Reset and cleanup
  resetGame: () => void;
  leaveGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentGame: null,
      gameHistory: [],
      isDealing: false,
      isRevealing: false,
      showResults: false,
      winner: null,
      animatingActions: [],
      dealingCards: false,
      revealingCards: false,
      spectatorMode: false,
      showGameStats: false,
      autoAdvance: false,

      // Setters
      setCurrentGame: (game) => {
        set({ currentGame: game });
      },

      updateGameState: (updates) => {
        const { currentGame } = get();
        if (!currentGame) return;
        
        set({
          currentGame: {
            ...currentGame,
            ...updates,
          }
        });
      },

      updatePlayer: (playerId, updates) => {
        const { currentGame } = get();
        if (!currentGame) return;

        const updatedPlayers = currentGame.players.map(player =>
          player.id === playerId ? { ...player, ...updates } : player
        );

        set({
          currentGame: {
            ...currentGame,
            players: updatedPlayers,
          }
        });
      },

      // Game flow actions
      dealCards: () => {
        const { currentGame } = get();
        if (!currentGame || currentGame.status !== 'waiting') return;

        set({ dealingCards: true });

        // Create and shuffle deck
        const deck = shuffleArray(createDeck());
        
        // Deal one card to each player
        const updatedPlayers = currentGame.players.map((player, index) => ({
          ...player,
          card: deck[index] || null,
          isActive: true,
          isFolded: false,
          currentBet: 0,
          timeRemaining: 30, // 30 seconds per turn
        }));

        // Update game state
        setTimeout(() => {
          set({
            currentGame: {
              ...currentGame,
              status: 'betting' as GameStatus,
              currentRound: 1,
              currentPlayerIndex: 0,
              deck,
              players: updatedPlayers,
            },
            dealingCards: false,
          });
        }, 2000); // 2 second dealing animation
      },

      processPlayerAction: (actionData) => {
        const { currentGame } = get();
        if (!currentGame || currentGame.status !== 'betting') return;

        // Add action to animation queue
        get().addAnimatingAction(actionData);

        // Find the player
        const playerIndex = currentGame.players.findIndex(p => p.id === actionData.playerId);
        if (playerIndex === -1) return;

        const player = currentGame.players[playerIndex];
        const updatedPlayers = [...currentGame.players];
        let newPot = currentGame.pot;
        let newCurrentBet = currentGame.currentBet;

        // Process the action
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
            const callAmount = Math.max(0, currentGame.currentBet - player.currentBet);
            updatedPlayers[playerIndex] = {
              ...player,
              currentBet: currentGame.currentBet,
              chips: player.chips - callAmount,
              lastAction: actionData.action,
            };
            newPot += callAmount;
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
            newPot += additionalBet;
            newCurrentBet = Math.max(newCurrentBet, betAmount);
            break;
        }

        // Update game state
        set({
          currentGame: {
            ...currentGame,
            players: updatedPlayers,
            pot: newPot,
            currentBet: newCurrentBet,
          }
        });

        // Check if round should end
        setTimeout(() => {
          get().checkRoundEnd();
        }, 1000);
      },

      advanceToNextPlayer: () => {
        const { currentGame } = get();
        if (!currentGame) return;

        const activePlayers = currentGame.players.filter(p => !p.isFolded);
        if (activePlayers.length <= 1) {
          get().startShowdown();
          return;
        }

        // Find next active player
        let nextIndex = (currentGame.currentPlayerIndex + 1) % currentGame.players.length;
        while (currentGame.players[nextIndex]?.isFolded && nextIndex !== currentGame.currentPlayerIndex) {
          nextIndex = (nextIndex + 1) % currentGame.players.length;
        }

        set({
          currentGame: {
            ...currentGame,
            currentPlayerIndex: nextIndex,
          }
        });
      },

      startShowdown: () => {
        const { currentGame } = get();
        if (!currentGame) return;

        set({
          currentGame: {
            ...currentGame,
            status: 'showdown' as GameStatus,
          },
          revealingCards: true,
        });

        // Calculate winner after reveal animation
        setTimeout(() => {
          const winner = get().calculateWinner();
          if (winner) {
            get().endGame(winner);
          }
          set({ revealingCards: false });
        }, 3000);
      },

      endGame: (winner) => {
        const { currentGame } = get();
        if (!currentGame) return;

        // Award pot to winner
        const updatedPlayers = currentGame.players.map(player =>
          player.id === winner.id
            ? { ...player, chips: player.chips + currentGame.pot }
            : player
        );

        const finishedGame = {
          ...currentGame,
          status: 'finished' as GameStatus,
          players: updatedPlayers,
          winner: winner.id,
          endedAt: new Date().toISOString(),
        };

        set({
          currentGame: finishedGame,
          winner,
          showResults: true,
          gameHistory: [...get().gameHistory, finishedGame],
        });
      },

      // Helper function to check if round should end
      checkRoundEnd: () => {
        const { currentGame } = get();
        if (!currentGame) return;

        const activePlayers = currentGame.players.filter(p => !p.isFolded);
        
        // If only one player left, end immediately
        if (activePlayers.length <= 1) {
          get().startShowdown();
          return;
        }

        // Check if all active players have acted and bets are equal
        const playersWithActions = activePlayers.filter(p => p.lastAction);
        const allBetsEqual = activePlayers.every(p => 
          p.currentBet === currentGame.currentBet || p.isFolded
        );

        if (playersWithActions.length === activePlayers.length && allBetsEqual) {
          get().startShowdown();
        } else {
          get().advanceToNextPlayer();
        }
      },

      // Animation actions
      setDealingCards: (dealing) => set({ dealingCards: dealing }),
      setRevealingCards: (revealing) => set({ revealingCards: revealing }),
      
      addAnimatingAction: (action) => {
        set(state => ({
          animatingActions: [...state.animatingActions, action]
        }));
        
        // Remove action after animation
        setTimeout(() => {
          set(state => ({
            animatingActions: state.animatingActions.filter(a => a !== action)
          }));
        }, 2000);
      },

      clearAnimatingActions: () => set({ animatingActions: [] }),

      // Utility functions
      calculateWinner: () => {
        const { currentGame } = get();
        if (!currentGame) return null;

        const activePlayers = currentGame.players.filter(p => !p.isFolded);
        if (activePlayers.length === 0) return null;
        if (activePlayers.length === 1) return activePlayers[0]!;

        // Find highest card
        const playersWithCards = activePlayers.filter(p => p.card);
        if (playersWithCards.length === 0) return activePlayers[0]!;

        return playersWithCards.reduce((highest, current) => {
          if (!highest.card || !current.card) return highest;
          return current.card.value > highest.card.value ? current : highest;
        });
      },

      getTotalPot: () => {
        const { currentGame } = get();
        return currentGame?.pot || 0;
      },

      getActivePlayers: () => {
        const { currentGame } = get();
        return currentGame?.players.filter(p => !p.isFolded) || [];
      },

      canPlayerAct: (playerId) => {
        const { currentGame } = get();
        if (!currentGame || currentGame.status !== 'betting') return false;
        
        const currentPlayer = currentGame.players[currentGame.currentPlayerIndex];
        return currentPlayer?.id === playerId && !currentPlayer.isFolded;
      },

      // Reset and cleanup
      resetGame: () => {
        set({
          currentGame: null,
          isDealing: false,
          isRevealing: false,
          showResults: false,
          winner: null,
          animatingActions: [],
          dealingCards: false,
          revealingCards: false,
        });
      },

      leaveGame: () => {
        const { currentGame } = get();
        if (currentGame) {
          set({
            gameHistory: [...get().gameHistory, currentGame],
          });
        }
        get().resetGame();
      },
    }),
    {
      name: 'gorbagana-game-store',
      partialize: (state) => ({
        gameHistory: state.gameHistory,
        showGameStats: state.showGameStats,
        autoAdvance: state.autoAdvance,
      }),
    }
  )
);

// Selectors for common use cases
export const useCurrentGame = () => useGameStore(state => state.currentGame);
export const useGameStatus = () => useGameStore(state => ({
  isDealing: state.isDealing,
  isRevealing: state.isRevealing,
  showResults: state.showResults,
  winner: state.winner,
}));
export const useGameAnimations = () => useGameStore(state => ({
  animatingActions: state.animatingActions,
  dealingCards: state.dealingCards,
  revealingCards: state.revealingCards,
}));