import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

/**
 * Gorbagana network configuration
 */
export const GORBAGANA_CONFIG = {
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || 'https://rpc.gorbagana.wtf',
  NETWORK: process.env.NEXT_PUBLIC_NETWORK || 'devnet',
  CHAIN_ID: 'gorbagana-testnet',
  NATIVE_TOKEN: 'GOR',
  NATIVE_TOKEN_DECIMALS: 9,
  EXPLORER_URL: 'https://explorer.gorbagana.wtf',
} as const;

/**
 * Creates a connection to the Gorbagana network
 */
export function createGorbaganaConnection(): Connection {
  return new Connection(
    GORBAGANA_CONFIG.RPC_URL,
    {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000,
    }
  );
}

/**
 * Converts GOR amount to lamports
 */
export function gorToLamports(gor: number): number {
  return Math.floor(gor * LAMPORTS_PER_SOL);
}

/**
 * Converts lamports to GOR
 */
export function lamportsToGor(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL;
}

/**
 * Validates if a string is a valid Solana public key
 */
export function isValidPublicKey(key: string): boolean {
  try {
    new PublicKey(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the balance of a wallet address in GOR
 */
export async function getWalletBalance(
  connection: Connection,
  publicKey: PublicKey
): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey);
    return lamportsToGor(balance);
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return 0;
  }
}

/**
 * Gets recent transactions for a wallet
 */
export async function getRecentTransactions(
  connection: Connection,
  publicKey: PublicKey,
  limit = 10
): Promise<string[]> {
  try {
    const signatures = await connection.getSignaturesForAddress(
      publicKey,
      { limit }
    );
    return signatures.map(sig => sig.signature);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

/**
 * Checks if the connection to Gorbagana is healthy
 */
export async function checkNetworkHealth(connection: Connection): Promise<boolean> {
  try {
    const slot = await connection.getSlot();
    return slot > 0;
  } catch {
    return false;
  }
}

/**
 * Gets the current slot height
 */
export async function getCurrentSlot(connection: Connection): Promise<number | null> {
  try {
    return await connection.getSlot();
  } catch {
    return null;
  }
}

/**
 * Waits for transaction confirmation
 */
export async function confirmTransaction(
  connection: Connection,
  signature: string,
  commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed'
): Promise<boolean> {
  try {
    const result = await connection.confirmTransaction(signature, commitment);
    return !result.value.err;
  } catch {
    return false;
  }
}

/**
 * Gorbagana-specific constants for the poker game
 */
export const POKER_CONFIG = {
  MIN_ANTE: 10, // 10 GOR minimum ante
  MAX_ANTE: 1000, // 1000 GOR maximum ante
  HOUSE_FEE_PERCENTAGE: 0.02, // 2% house fee
  TRANSACTION_FEE: 0.000005, // Base transaction fee in GOR
} as const;

/**
 * Calculates the house fee for a given pot amount
 */
export function calculateHouseFee(potAmount: number): number {
  return Math.floor(potAmount * POKER_CONFIG.HOUSE_FEE_PERCENTAGE);
}

/**
 * Calculates the total transaction cost including fees
 */
export function calculateTransactionCost(amount: number): number {
  return amount + POKER_CONFIG.TRANSACTION_FEE;
}

/**
 * Formats a transaction signature for display
 */
export function formatTransactionSignature(signature: string): string {
  return `${signature.slice(0, 8)}...${signature.slice(-8)}`;
}

/**
 * Gets the explorer URL for a transaction
 */
export function getTransactionExplorerUrl(signature: string): string {
  return `${GORBAGANA_CONFIG.EXPLORER_URL}/tx/${signature}`;
}

/**
 * Gets the explorer URL for an address
 */
export function getAddressExplorerUrl(address: string): string {
  return `${GORBAGANA_CONFIG.EXPLORER_URL}/address/${address}`;
}