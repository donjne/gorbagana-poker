import { useCallback } from 'react';

import { toast } from '@/components/ui/Toaster';

import type { Game, Player, PlayerAction } from '@/types';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

interface UseGameValidationReturn {
  validateGameState: (game: Game) => ValidationResult;
  validatePlayerAction: (game: Game, player: Player, action: PlayerAction, amount?: number) => ValidationResult;
  validateGameTransition: (fromStatus: Game['status'], toStatus: Game['status']) => ValidationResult;
  showValidationToast: (result: ValidationResult) => void;
}

export function useGameValidation(): UseGameValidationReturn {
  // Validate overall game state consistency
  const validateGameState = useCallback((game: Game): ValidationResult => {
    // Check player count
    if (game.players.length < 2) {
      return {
        isValid: false,
        error: 'Game requires at least 2 players'
      };
    }

    if (game.players.length > game.maxPlayers) {
      return {
        isValid: false,
        error: 'Too many players in game'
      };
    }

    // Check pot consistency
    const totalBets = game.players.reduce((sum, player) => sum + player.currentBet, 0);
    const expectedPot = totalBets + (game.players.length * game.ante);
    
    if (Math.abs(game.pot - expectedPot) > 0.01) { // Allow small floating point differences
      return {
        isValid: false,
        error: 'Pot amount doesn\'t match total bets'
      };
    }

    // Check active players for betting phase
    if (game.status === 'betting') {
      const activePlayers = game.players.filter(p => !p.isFolded);
      if (activePlayers.length < 2) {
        return {
          isValid: false,
          error: 'Not enough active players for betting'
        };
      }

      // Check current player index
      if (game.currentPlayerIndex < 0 || game.currentPlayerIndex >= game.players.length) {
        return {
          isValid: false,
          error: 'Invalid current player index'
        };
      }

      const currentPlayer = game.players[game.currentPlayerIndex];
      if (!currentPlayer || currentPlayer.isFolded) {
        return {
          isValid: false,
          error: 'Current player is not active'
        };
      }
    }

    // Check for showdown conditions
    if (game.status === 'showdown') {
      const activePlayers = game.players.filter(p => !p.isFolded);
      if (activePlayers.length === 0) {
        return {
          isValid: false,
          error: 'No active players for showdown'
        };
      }

      // Ensure all active players have cards
      const playersWithoutCards = activePlayers.filter(p => !p.card);
      if (playersWithoutCards.length > 0) {
        return {
          isValid: false,
          error: 'Some players missing cards for showdown'
        };
      }
    }

    // Check chip balances
    const playersWithNegativeChips = game.players.filter(p => p.chips < 0);
    if (playersWithNegativeChips.length > 0) {
      return {
        isValid: false,
        error: 'Players cannot have negative chip balances'
      };
    }

    return { isValid: true };
  }, []);

  // Validate specific player actions
  const validatePlayerAction = useCallback((
    game: Game, 
    player: Player, 
    action: PlayerAction, 
    amount?: number
  ): ValidationResult => {
    // Basic player checks
    if (player.isFolded) {
      return {
        isValid: false,
        error: 'Folded players cannot act'
      };
    }

    if (!player.isActive) {
      return {
        isValid: false,
        error: 'Inactive players cannot act'
      };
    }

    if (game.status !== 'betting') {
      return {
        isValid: false,
        error: 'Actions only allowed during betting phase'
      };
    }

    // Check if it's the player's turn
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.id !== player.id) {
      return {
        isValid: false,
        error: 'Not your turn to act'
      };
    }

    const currentBet = game.currentBet;
    const callAmount = Math.max(0, currentBet - player.currentBet);

    // Validate specific actions
    switch (action) {
      case 'check':
        if (currentBet > 0 && player.currentBet < currentBet) {
          return {
            isValid: false,
            error: 'Cannot check when there is a bet to call'
          };
        }
        break;

      case 'call':
        if (currentBet === 0) {
          return {
            isValid: false,
            error: 'No bet to call'
          };
        }
        if (player.currentBet >= currentBet) {
          return {
            isValid: false,
            error: 'You have already called the current bet'
          };
        }
        if (callAmount > player.chips) {
          return {
            isValid: false,
            error: 'Insufficient chips to call'
          };
        }
        break;

      case 'bet':
        if (currentBet > 0) {
          return {
            isValid: false,
            error: 'Cannot bet when there is already a bet (use raise instead)'
          };
        }
        if (!amount || amount < game.ante) {
          return {
            isValid: false,
            error: `Minimum bet is ${game.ante} GOR`
          };
        }
        if (amount > player.chips) {
          return {
            isValid: false,
            error: 'Insufficient chips for this bet'
          };
        }
        break;

      case 'raise':
        if (currentBet === 0) {
          return {
            isValid: false,
            error: 'Cannot raise when there is no bet (use bet instead)'
          };
        }
        if (!amount || amount <= currentBet) {
          return {
            isValid: false,
            error: 'Raise amount must be higher than current bet'
          };
        }
        if (amount < currentBet * 2) {
          return {
            isValid: false,
            error: `Minimum raise is ${currentBet * 2} GOR`
          };
        }
        if (amount > player.chips + player.currentBet) {
          return {
            isValid: false,
            error: 'Insufficient chips for this raise'
          };
        }
        break;

      case 'fold':
        // Folding is always valid
        break;

      default:
        return {
          isValid: false,
          error: 'Invalid action type'
        };
    }

    // Check for warnings
    let warning;
    if (action === 'fold' && callAmount === 0) {
      warning = 'You can check instead of folding';
    } else if ((action === 'bet' || action === 'raise') && amount && amount >= player.chips * 0.8) {
      warning = 'This action uses most of your chips';
    }

    return { 
      isValid: true, 
      warning 
    };
  }, []);

  // Validate game status transitions
  const validateGameTransition = useCallback((
    fromStatus: Game['status'], 
    toStatus: Game['status']
  ): ValidationResult => {
    const validTransitions: Record<Game['status'], Game['status'][]> = {
      'waiting': ['starting', 'cancelled'],
      'starting': ['betting', 'cancelled'],
      'betting': ['showdown', 'finished', 'cancelled'],
      'showdown': ['finished'],
      'finished': [],
      'cancelled': []
    };

    const allowedTransitions = validTransitions[fromStatus] || [];
    
    if (!allowedTransitions.includes(toStatus)) {
      return {
        isValid: false,
        error: `Invalid transition from ${fromStatus} to ${toStatus}`
      };
    }

    return { isValid: true };
  }, []);

  // Show validation result as toast
  const showValidationToast = useCallback((result: ValidationResult): void => {
    if (!result.isValid && result.error) {
      toast.error(result.error);
    } else if (result.warning) {
      toast.error(result.warning);
    }
  }, []);

  return {
    validateGameState,
    validatePlayerAction,
    validateGameTransition,
    showValidationToast,
  };
}