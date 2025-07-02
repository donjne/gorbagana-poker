import { useEffect, useCallback } from 'react';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';

import { useWalletStore } from '@/stores/walletStore';
import { createGorbaganaConnection, getWalletBalance } from '@/lib/gorbagana';
import { toast } from '@/components/ui/Toaster';

import type { User } from '@/types';

interface UseWalletReturn {
  // Wallet connection state
  isConnected: boolean;
  isConnecting: boolean;
  walletAddress: string | null;
  publicKey: string | null;
  
  // User state
  user: User | null;
  isRegistered: boolean;
  
  // Balance state
  balance: number | null;
  isLoadingBalance: boolean;
  formattedBalance: string;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  registerUser: (userData: { username: string }) => Promise<void>;
  updateBalance: (amount: number) => void;
  
  // Utils
  requireConnection: () => boolean;
  requireRegistration: () => boolean;
}

export function useWallet(): UseWalletReturn {
  const {
    publicKey,
    connected,
    connecting,
    connect: solanaConnect,
    disconnect: solanaDisconnect,
  } = useSolanaWallet();

  const {
    user,
    isRegistered,
    balance,
    isLoadingBalance,
    setWalletConnection,
    setBalance,
    setLoadingBalance,
    setUser,
    getFormattedBalance,
    updateBalance: storeUpdateBalance,
    reset,
  } = useWalletStore();

  // Update store when wallet connection changes
  useEffect(() => {
    const walletAddress = publicKey?.toString() || null;
    setWalletConnection(connected, walletAddress);

    if (connected && publicKey) {
      // Auto-refresh balance when connected
      refreshBalance();
    } else if (!connected) {
      // Clear state when disconnected
      setBalance(0);
    }
  }, [connected, publicKey, setWalletConnection, setBalance]);

  // Refresh wallet balance
  const refreshBalance = useCallback(async (): Promise<void> => {
    if (!connected || !publicKey) {
      setBalance(0);
      return;
    }

    setLoadingBalance(true);
    try {
      const connection = createGorbaganaConnection();
      const walletBalance = await getWalletBalance(connection, publicKey);
      setBalance(walletBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast.error('Failed to fetch wallet balance');
    } finally {
      setLoadingBalance(false);
    }
  }, [connected, publicKey, setBalance, setLoadingBalance]);

  // Connect wallet
  const connect = useCallback(async (): Promise<void> => {
    try {
      await solanaConnect();
      toast.walletSuccess('Wallet connected successfully');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
      throw error;
    }
  }, [solanaConnect]);

  // Disconnect wallet
  const disconnect = useCallback(async (): Promise<void> => {
    try {
      await solanaDisconnect();
      reset(); // Clear all store state
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Failed to disconnect wallet');
      throw error;
    }
  }, [solanaDisconnect, reset]);

  // Register user
  const registerUser = useCallback(async (userData: { username: string }): Promise<void> => {
    if (!connected || !publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      // TODO: Replace with actual API call
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        walletAddress: publicKey.toString(),
        username: userData.username,
        gorBalance: balance || 1000, // Use current balance or default
        totalStaked: 0,
        gamesWon: 0,
        gamesLost: 0,
        winRate: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setUser(mockUser);
      toast.gameSuccess(`Welcome to Gorbagana Poker, ${userData.username}!`);
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error('Failed to register user');
      throw error;
    }
  }, [connected, publicKey, balance, setUser]);

  // Update balance wrapper
  const updateBalance = useCallback((amount: number): void => {
    storeUpdateBalance(amount);
  }, [storeUpdateBalance]);

  // Utility function to check if wallet is connected
  const requireConnection = useCallback((): boolean => {
    if (!connected) {
      toast.error('Please connect your wallet first');
      return false;
    }
    return true;
  }, [connected]);

  // Utility function to check if user is registered
  const requireRegistration = useCallback((): boolean => {
    if (!requireConnection()) return false;
    
    if (!isRegistered) {
      toast.error('Please complete your profile setup first');
      return false;
    }
    return true;
  }, [requireConnection, isRegistered]);

  return {
    // Wallet connection state
    isConnected: connected,
    isConnecting: connecting,
    walletAddress: publicKey?.toString() || null,
    publicKey: publicKey?.toString() || null,
    
    // User state
    user,
    isRegistered,
    
    // Balance state
    balance,
    isLoadingBalance,
    formattedBalance: getFormattedBalance(),
    
    // Actions
    connect,
    disconnect,
    refreshBalance,
    registerUser,
    updateBalance,
    
    // Utils
    requireConnection,
    requireRegistration,
  };
}