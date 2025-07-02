import { useCallback, useState } from 'react';

import { useWallet } from '@/hooks/useWallet';
import { toast } from '@/components/ui/Toaster';

import type { Game, Player, PlayerAction, PlayerActionData } from '@/types';

interface UseGameActionsReturn {
  executeAction: (action: PlayerAction, amount?: number) => Promise<void>;
  isExecuting: boolean;
  canPerformAction: (action: PlayerAction, amount?: number) => boolean;
  getActionError: (action: PlayerAction, amount?: number) => string | null;
}

export function useGameActions(
  game: Game,
  player: Player,
  onActionComplete?: (actionData: PlayerActionData) => void
): UseGameActionsReturn {
  const { user, requireRegistration } = useWallet();
  const [isExecuting, setIsExecuting] = useState(false);

  // Validate if player can perform an action
  const canPerformAction = useCallback((action: PlayerAction, amount?: number): boolean => {
    if (!user || !requireRegistration()) return false;
    if (player.isFolded || !player.isActive) return false;
    if (game.status !== 'betting') return false;
    
    const currentBet = game.currentBet;
    const callAmount = Math.max(0, currentBet - player.currentBet);
    
    switch (action) {
      case 'check':
        return currentBet === 0 || player.currentBet === currentBet;
        
      case 'call':
        return currentBet > 0 && player.currentBet < currentBet && callAmount <= player.chips;
        
      case 'bet':
        return currentBet === 0 && (amount || 0) >= game.ante && (amount || 0) <= player.chips;
        
      case 'raise':
        return currentBet > 0 && 
               (amount || 0) >= currentBet * 2 && 
               (amount || 0) <= player.chips;
        
      case 'fold':
        return true; // Can always fold
        
      default:
        return false;
    }
  }, [user, requireRegistration, player, game]);

  // Get error message for invalid actions
  const getActionError = useCallback((action: PlayerAction, amount?: number): string | null => {
    if (!user) return 'Please connect your wallet';
    if (!requireRegistration()) return 'Please complete registration';
    if (player.isFolded) return 'You have already folded';
    if (!player.isActive) return 'You are not active in this game';
    if (game.status !== 'betting') return 'Not in betting phase';
    
    const currentBet = game.currentBet;
    const callAmount = Math.max(0, currentBet - player.currentBet);
    
    switch (action) {
      case 'check':
        if (currentBet > 0 && player.currentBet < currentBet) {
          return `You must call ${callAmount} GOR or fold`;
        }
        return null;
        
      case 'call':
        if (currentBet === 0) return 'No bet to call';
        if (player.currentBet >= currentBet) return 'You have already called';
        if (callAmount > player.chips) return 'Insufficient chips to call';
        return null;
        
      case 'bet':
        if (currentBet > 0) return 'There is already a bet, you must raise';
        if (!amount) return 'Bet amount required';
        if (amount < game.ante) return `Minimum bet is ${game.ante} GOR`;
        if (amount > player.chips) return 'Insufficient chips';
        return null;
        
      case 'raise':
        if (currentBet === 0) return 'No bet to raise, place a bet instead';
        if (!amount) return 'Raise amount required';
        if (amount < currentBet * 2) return `Minimum raise is ${currentBet * 2} GOR`;
        if (amount > player.chips) return 'Insufficient chips';
        return null;
        
      case 'fold':
        return null; // Can always fold
        
      default:
        return 'Invalid action';
    }
  }, [user, requireRegistration, player, game]);

  // Execute a game action
  const executeAction = useCallback(async (action: PlayerAction, amount?: number): Promise<void> => {
    if (isExecuting) return;
    
    const error = getActionError(action, amount);
    if (error) {
      toast.error(error);
      return;
    }

    setIsExecuting(true);
    
    try {
      // Create action data
      const actionData: PlayerActionData = {
        playerId: player.id,
        action,
        amount,
        timestamp: new Date().toISOString(),
      };

      // Simulate network delay for demo
      await new Promise(resolve => setTimeout(resolve, 500));

      // TODO: Send action to backend via socket or API
      console.log('Executing action:', actionData);

      // Show action feedback
      const actionMessages = {
        check: 'You checked',
        call: `You called ${amount} GOR`,
        bet: `You bet ${amount} GOR`,
        raise: `You raised to ${amount} GOR`,
        fold: 'You folded',
        'auto-fold': 'Auto-folded due to timeout'
      };

      toast.playerAction(player.username, actionMessages[action]);

      // Notify parent component
      if (onActionComplete) {
        onActionComplete(actionData);
      }

    } catch (error) {
      console.error('Error executing action:', error);
      toast.error('Failed to execute action. Please try again.');
    } finally {
      setIsExecuting(false);
    }
  }, [isExecuting, getActionError, player, onActionComplete]);

  return {
    executeAction,
    isExecuting,
    canPerformAction,
    getActionError,
  };
}