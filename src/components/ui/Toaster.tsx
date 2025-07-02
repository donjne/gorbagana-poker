'use client';

import { Toaster as HotToaster, toast as hotToast } from 'react-hot-toast';
import { soundManager } from '@/lib/soundManager';
import { JSX } from 'react';
import type React from 'react';

export function Toaster(): JSX.Element {
  return (
    <HotToaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: '#1f2937', // surface-primary
          color: '#ffffff',
          border: '1px solid #4b5563', // surface-tertiary
          borderRadius: '0.75rem',
          fontSize: '14px',
          maxWidth: '500px',
        },
        // Success toast styling
        success: {
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#ffffff',
            border: '1px solid #10b981', // success color
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        },
        // Error toast styling
        error: {
          duration: 5000,
          style: {
            background: '#1f2937',
            color: '#ffffff',
            border: '1px solid #ef4444', // danger color
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
        // Loading toast styling
        loading: {
          style: {
            background: '#1f2937',
            color: '#ffffff',
            border: '1px solid #fbbf24', // gor color
          },
          iconTheme: {
            primary: '#fbbf24',
            secondary: '#ffffff',
          },
        },
        // Custom class names
        className: 'toast-notification',
      }}
    />
  );
}

// Enhanced toast utility functions with proper TypeScript and sound integration
export const toast = {
  success: (message: string): string => {
    soundManager.playSuccess();
    return hotToast.success(message);
  },
  
  error: (message: string): string => {
    soundManager.playError();
    return hotToast.error(message);
  },
  
  loading: (message: string): string => {
    return hotToast.loading(message);
  },
  
  dismiss: (toastId?: string): void => {
    hotToast.dismiss(toastId);
  },
  
  // Enhanced game-specific toasts with proper sound integration
  gameSuccess: (message: string): string => {
    soundManager.playGameWin();
    return hotToast.success(message, {
      icon: '🎉',
      duration: 4000,
    });
  },
  
  walletSuccess: (message: string): string => {
    soundManager.playConnect();
    return hotToast.success(message, {
      icon: '💳',
      duration: 3000,
    });
  },
  
  transactionPending: (message: string): string => {
    return hotToast.loading(message, {
      icon: '⏳',
      duration: 10000,
    });
  },
  
  transactionSuccess: (message: string): string => {
    soundManager.playChipCollect();
    return hotToast.success(message, {
      icon: '✅',
      duration: 5000,
    });
  },
  
  playerAction: (playerName: string, action: string): string => {
    // Use specific sounds based on action type
    if (action.includes('bet') || action.includes('raise')) {
      soundManager.playActionBet();
    } else if (action.includes('call')) {
      soundManager.playActionCall();
    } else if (action.includes('check')) {
      soundManager.playActionCheck();
    } else if (action.includes('fold')) {
      soundManager.playActionFold();
    } else {
      soundManager.playNotification();
    }
    
    return hotToast(`${playerName} ${action}`, {
      icon: '🎮',
      duration: 2000,
      style: {
        background: '#1f2937',
        color: '#fbbf24',
        border: '1px solid #fbbf24',
      },
    });
  },

  // Additional enhanced toast functions
  gameUpdate: (message: string): string => {
    soundManager.playNotification();
    return hotToast(message, {
      duration: 3000,
      style: {
        background: '#1f2937',
        color: '#ffffff',
        border: '1px solid #3b82f6',
      },
      icon: '🎮',
    });
  },

  wallet: (message: string, type: 'success' | 'error' = 'success'): string => {
    if (type === 'success') {
      soundManager.playConnect();
      return hotToast.success(message, {
        duration: 3000,
        icon: '🔗',
      });
    } else {
      soundManager.playDisconnect();
      return hotToast.error(message, {
        duration: 4000,
        icon: '❌',
      });
    }
  },

  gor: (amount: number, type: 'win' | 'lose'): string => {
    const message = type === 'win' 
      ? `+${amount} $GOR won!` 
      : `-${amount} $GOR lost`;
    
    if (type === 'win') {
      soundManager.playGameWin();
      soundManager.playChipCollect();
      return hotToast.success(message, {
        duration: 4000,
        style: {
          background: '#1f2937',
          color: '#ffffff',
          border: '1px solid #10b981',
        },
        icon: '💰',
      });
    } else {
      soundManager.playGameLose();
      return hotToast.error(message, {
        duration: 3000,
        style: {
          background: '#1f2937',
          color: '#ffffff',
          border: '1px solid #ef4444',
        },
        icon: '💸',
      });
    }
  },

  // Round events with comprehensive game sounds
  roundStart: (): string => {
    soundManager.playRoundStart();
    soundManager.playCardDeal();
    return hotToast('New round started!', {
      duration: 2000,
      icon: '🎯',
      style: {
        background: '#1f2937',
        color: '#ffffff',
        border: '1px solid #10b981',
      },
    });
  },

  roundEnd: (winner?: string): string => {
    soundManager.playRoundEnd();
    const message = winner ? `${winner} wins the round!` : 'Round ended';
    return hotToast(message, {
      duration: 3000,
      icon: '🏆',
      style: {
        background: '#1f2937',
        color: '#ffffff',
        border: '1px solid #fbbf24',
      },
    });
  },

  cardFlip: (): string => {
    soundManager.playCardFlip();
    return hotToast('Card revealed!', {
      duration: 1500,
      icon: '🃏',
      style: {
        background: '#1f2937',
        color: '#ffffff',
        border: '1px solid #3b82f6',
      },
    });
  },

  timer: (type: 'warning' | 'critical'): string => {
    if (type === 'warning') {
      soundManager.playTimerWarning();
      return hotToast('10 seconds remaining!', {
        duration: 2000,
        icon: '⏰',
        style: {
          background: '#1f2937',
          color: '#ffffff',
          border: '1px solid #fbbf24',
        },
      });
    } else {
      soundManager.playTimerCritical();
      return hotToast('Time almost up!', {
        duration: 1000,
        icon: '🚨',
        style: {
          background: '#1f2937',
          color: '#ffffff',
          border: '1px solid #ef4444',
        },
      });
    }
  },

  custom: (message: string, options: {
    duration?: number;
    icon?: string;
    style?: React.CSSProperties;
    sound?: 'ui' | 'game' | 'notification' | 'none';
  } = {}): string => {
    // Use your comprehensive sound system
    switch (options.sound) {
      case 'ui':
        soundManager.playButtonClick();
        break;
      case 'game':
        soundManager.playChipPlace();
        break;
      case 'notification':
        soundManager.playNotification();
        break;
      case 'none':
      default:
        // No sound
        break;
    }

    return hotToast(message, {
      duration: options.duration ?? 3000,
      icon: options.icon,
      style: {
        background: '#1f2937',
        color: '#ffffff',
        border: '1px solid #4b5563',
        ...options.style,
      },
    });
  },

  // Utility functions
  clear: (): void => {
    hotToast.remove();
  },

  // Promise wrapper with sound feedback
  promise: <T,>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
    soundEnabled = true
  ): Promise<T> => {
    const originalPromise = promise;
    
    // Add sound feedback
    const enhancedPromise = originalPromise
      .then((data) => {
        if (soundEnabled) soundManager.playSuccess();
        return data;
      })
      .catch((error) => {
        if (soundEnabled) soundManager.playError();
        throw error;
      });

    return hotToast.promise(enhancedPromise, msgs, {
      style: {
        background: '#1f2937',
        color: '#ffffff',
        border: '1px solid #4b5563',
      },
      success: {
        iconTheme: {
          primary: '#10b981',
          secondary: '#ffffff',
        },
      },
      error: {
        iconTheme: {
          primary: '#ef4444',
          secondary: '#ffffff',
        },
      },
      loading: {
        iconTheme: {
          primary: '#fbbf24',
          secondary: '#ffffff',
        },
      },
    });
  },

  // Async versions for better promise handling
  successAsync: async (message: string): Promise<string> => {
    soundManager.playSuccess();
    return hotToast.success(message);
  },

  errorAsync: async (message: string): Promise<string> => {
    soundManager.playError();
    return hotToast.error(message);
  },
};