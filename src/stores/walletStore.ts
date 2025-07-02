import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { User, UserStats, Transaction } from '@/types';

interface WalletState {
  // User data
  user: User | null;
  isRegistered: boolean;
  
  // Wallet connection state
  isConnected: boolean;
  walletAddress: string | null;
  balance: number | null;
  
  // User stats
  stats: UserStats | null;
  
  // Recent transactions
  recentTransactions: Transaction[];
  
  // Loading states
  isLoadingBalance: boolean;
  isLoadingStats: boolean;
  isRegistering: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setWalletConnection: (connected: boolean, address: string | null) => void;
  setBalance: (balance: number) => void;
  setStats: (stats: UserStats) => void;
  addTransaction: (transaction: Transaction) => void;
  setLoadingBalance: (loading: boolean) => void;
  setLoadingStats: (loading: boolean) => void;
  setRegistering: (registering: boolean) => void;
  
  // Computed getters
  getFormattedBalance: () => string;
  getWinRate: () => number;
  
  // Actions
  updateBalance: (amount: number) => void;
  incrementGamesWon: () => void;
  incrementGamesLost: () => void;
  
  // Reset
  reset: () => void;
}

const initialState = {
  user: null,
  isRegistered: false,
  isConnected: false,
  walletAddress: null,
  balance: null,
  stats: null,
  recentTransactions: [],
  isLoadingBalance: false,
  isLoadingStats: false,
  isRegistering: false,
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Setters
      setUser: (user) => {
        set({ 
          user, 
          isRegistered: !!user,
          walletAddress: user?.walletAddress || null,
        });
      },

      setWalletConnection: (connected, address) => {
        set({ 
          isConnected: connected, 
          walletAddress: address,
          // Clear user data if disconnected
          ...(connected ? {} : { user: null, isRegistered: false, balance: null, stats: null }),
        });
      },

      setBalance: (balance) => {
        set({ balance });
        
        // Update user balance if user exists
        const { user } = get();
        if (user) {
          set({ 
            user: { ...user, gorBalance: balance },
            stats: get().stats ? { ...get().stats!, gorBalance: balance } : null,
          });
        }
      },

      setStats: (stats) => {
        set({ stats });
      },

      addTransaction: (transaction) => {
        set((state) => ({
          recentTransactions: [transaction, ...state.recentTransactions].slice(0, 10), // Keep last 10
        }));
      },

      setLoadingBalance: (loading) => {
        set({ isLoadingBalance: loading });
      },

      setLoadingStats: (loading) => {
        set({ isLoadingStats: loading });
      },

      setRegistering: (registering) => {
        set({ isRegistering: registering });
      },

      // Computed getters
      getFormattedBalance: () => {
        const { balance } = get();
        if (balance === null) return '0.00';
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(balance);
      },

      getWinRate: () => {
        const { user } = get();
        if (!user || (user.gamesWon + user.gamesLost) === 0) return 0;
        return Math.round((user.gamesWon / (user.gamesWon + user.gamesLost)) * 100);
      },

      // Actions
      updateBalance: (amount) => {
        const { balance } = get();
        const newBalance = (balance || 0) + amount;
        get().setBalance(Math.max(0, newBalance)); // Prevent negative balance
      },

      incrementGamesWon: () => {
        const { user } = get();
        if (!user) return;
        
        const updatedUser = {
          ...user,
          gamesWon: user.gamesWon + 1,
          winRate: get().getWinRate(),
        };
        
        set({ user: updatedUser });
      },

      incrementGamesLost: () => {
        const { user } = get();
        if (!user) return;
        
        const updatedUser = {
          ...user,
          gamesLost: user.gamesLost + 1,
          winRate: get().getWinRate(),
        };
        
        set({ user: updatedUser });
      },

      // Reset all state
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'gorbagana-wallet-store',
      // Only persist user registration and basic wallet info
      partialize: (state) => ({
        user: state.user,
        isRegistered: state.isRegistered,
        walletAddress: state.walletAddress,
      }),
    }
  )
);

// Selectors for common use cases
export const useUser = () => useWalletStore((state) => state.user);
export const useIsRegistered = () => useWalletStore((state) => state.isRegistered);
export const useWalletConnection = () => useWalletStore((state) => ({
  isConnected: state.isConnected,
  walletAddress: state.walletAddress,
}));
export const useBalance = () => useWalletStore((state) => ({
  balance: state.balance,
  isLoading: state.isLoadingBalance,
  formatted: state.getFormattedBalance(),
}));
export const useUserStats = () => useWalletStore((state) => ({
  stats: state.stats,
  isLoading: state.isLoadingStats,
  winRate: state.getWinRate(),
}));