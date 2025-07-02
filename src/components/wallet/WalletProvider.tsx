'use client';

import React, { JSX, useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

import { createGorbaganaConnection } from '@/lib/gorbagana';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps): JSX.Element {
  // Create connection to Gorbagana network
  const connection = useMemo(() => createGorbaganaConnection(), []);

  // Configure wallet adapters - only Backpack for Gorbagana
  const wallets = useMemo(
    () => [
      new BackpackWalletAdapter({
        network: WalletAdapterNetwork.Devnet, // Gorbagana runs on devnet
      }),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={connection.rpcEndpoint}>
      <SolanaWalletProvider 
        wallets={wallets} 
        autoConnect={true}
        onError={(error) => {
          console.error('Wallet error:', error);
          // TODO: Show user-friendly error message
        }}
      >
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}