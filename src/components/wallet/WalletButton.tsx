'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react';
import { useState, useEffect, JSX } from 'react';

import { formatWalletAddress, formatGOR, copyToClipboard } from '@/lib/utils';
import { getWalletBalance, createGorbaganaConnection } from '@/lib/gorbagana';
import { toast } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';

interface WalletButtonProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function WalletButton({ variant = 'default', className }: WalletButtonProps): JSX.Element {
  const { publicKey, disconnect, connected, connecting } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);

  // Fetch wallet balance when connected
  useEffect(() => {
    async function fetchBalance(): Promise<void> {
      if (!publicKey || !connected) {
        setBalance(null);
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
    }

    fetchBalance();
  }, [publicKey, connected]);

  // Handle wallet disconnect
  const handleDisconnect = async (): Promise<void> => {
    try {
      await disconnect();
      setBalance(null);
      setShowDropdown(false);
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  // Handle copy address
  const handleCopyAddress = async (): Promise<void> => {
    if (!publicKey) return;
    
    const success = await copyToClipboard(publicKey.toString());
    if (success) {
      toast.success('Address copied to clipboard');
    } else {
      toast.error('Failed to copy address');
    }
    setShowDropdown(false);
  };

  // Handle view on explorer
  const handleViewOnExplorer = (): void => {
    if (!publicKey) return;
    
    const explorerUrl = `https://explorer.gorbagana.wtf/address/${publicKey.toString()}`;
    window.open(explorerUrl, '_blank');
    setShowDropdown(false);
  };

  // Not connected state
  if (!connected) {
    return (
      <div className={cn('wallet-button-container', className)}>
        <WalletMultiButton 
          className={cn(
            'btn-gor',
            variant === 'compact' && 'px-3 py-1.5 text-sm'
          )}
        >
          {connecting ? (
            <span className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-r-transparent" />
              <span>Connecting...</span>
            </span>
          ) : (
            <span className="flex items-center space-x-2">
              <Wallet className="h-4 w-4" />
              <span>{variant === 'compact' ? 'Connect' : 'Connect Wallet'}</span>
            </span>
          )}
        </WalletMultiButton>
      </div>
    );
  }

  // Connected state
  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={cn(
            'flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-3 py-1.5 rounded-lg transition-colors',
            className
          )}
        >
          <Wallet className="h-4 w-4" />
          <span className="text-sm font-medium">
            {formatWalletAddress(publicKey?.toString() || '')}
          </span>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-surface-primary border border-surface-tertiary rounded-lg shadow-card z-50">
            <div className="p-4">
              <div className="text-sm text-gray-400 mb-2">Balance</div>
              <div className="text-lg font-semibold text-gor-400 mb-4">
                {loadingBalance ? (
                  <div className="animate-pulse bg-surface-tertiary h-6 w-24 rounded" />
                ) : (
                  `${formatGOR(balance || 0)} GOR`
                )}
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleCopyAddress}
                  className="w-full flex items-center space-x-2 text-left text-sm text-gray-300 hover:text-white p-2 rounded hover:bg-surface-secondary transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Address</span>
                </button>
                
                <button
                  onClick={handleViewOnExplorer}
                  className="w-full flex items-center space-x-2 text-left text-sm text-gray-300 hover:text-white p-2 rounded hover:bg-surface-secondary transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View on Explorer</span>
                </button>
                
                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center space-x-2 text-left text-sm text-danger hover:text-red-400 p-2 rounded hover:bg-surface-secondary transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default (full) variant
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={cn(
          'flex items-center space-x-3 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-glow-green',
          className
        )}
      >
        <Wallet className="h-5 w-5" />
        <div className="text-left">
          <div className="text-sm font-medium">
            {formatWalletAddress(publicKey?.toString() || '')}
          </div>
          <div className="text-xs text-primary-200">
            {loadingBalance ? (
              'Loading...'
            ) : (
              `${formatGOR(balance || 0)} GOR`
            )}
          </div>
        </div>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-surface-primary border border-surface-tertiary rounded-lg shadow-card z-50">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-400 mb-2">Wallet Balance</div>
              <div className="text-3xl font-bold text-gor-400">
                {loadingBalance ? (
                  <div className="animate-pulse bg-surface-tertiary h-8 w-32 rounded mx-auto" />
                ) : (
                  `${formatGOR(balance || 0)} GOR`
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {formatWalletAddress(publicKey?.toString() || '', 8, 8)}
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleCopyAddress}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Address</span>
              </button>
              
              <button
                onClick={handleViewOnExplorer}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View on Explorer</span>
              </button>
              
              <button
                onClick={handleDisconnect}
                className="w-full btn-danger flex items-center justify-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}