'use client';

import { useState, useEffect, JSX } from 'react';
import { TrendingUp, TrendingDown, Target, Coins, RefreshCw, Eye, EyeOff } from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { formatGOR, formatRelativeTime } from '@/lib/utils';
import { LoadingSkeleton } from '@/components/ui/LoadingSpinner';

import type { Transaction } from '@/types';

interface UserStatsProps {
  className?: string;
}

export function UserStats({ className }: UserStatsProps): JSX.Element {
  const { user, balance, isLoadingBalance, formattedBalance, refreshBalance } = useWallet();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  // Fetch recent transactions
  useEffect(() => {
    async function fetchTransactions(): Promise<void> {
      if (!user) return;
      
      setLoadingTransactions(true);
      try {
        // TODO: Replace with actual API call
        const mockTransactions: Transaction[] = [
          {
            id: '1',
            userId: user.id,
            type: 'win',
            amount: 150,
            gameId: 'ABC123',
            status: 'confirmed',
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
          },
          {
            id: '2',
            userId: user.id,
            type: 'ante',
            amount: -50,
            gameId: 'ABC123',
            status: 'confirmed',
            createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
          },
          {
            id: '3',
            userId: user.id,
            type: 'win',
            amount: 75,
            gameId: 'DEF456',
            status: 'confirmed',
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          },
        ];
        
        setRecentTransactions(mockTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoadingTransactions(false);
      }
    }

    fetchTransactions();
  }, [user]);

  if (!user) {
    return <div className={className} />;
  }

  const totalGames = user.gamesWon + user.gamesLost;
  const winRate = totalGames > 0 ? Math.round((user.gamesWon / totalGames) * 100) : 0;

  const getTransactionIcon = (type: Transaction['type']): JSX.Element => {
    switch (type) {
      case 'win':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'ante':
      case 'bet':
        return <TrendingDown className="h-4 w-4 text-danger" />;
      case 'deposit':
        return <Coins className="h-4 w-4 text-gor-400" />;
      default:
        return <Target className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTransactionLabel = (transaction: Transaction): string => {
    switch (transaction.type) {
      case 'win':
        return `Won from Game #${transaction.gameId?.slice(-6) || 'Unknown'}`;
      case 'ante':
        return `Ante for Game #${transaction.gameId?.slice(-6) || 'Unknown'}`;
      case 'bet':
        return `Bet in Game #${transaction.gameId?.slice(-6) || 'Unknown'}`;
      case 'deposit':
        return 'Wallet Deposit';
      case 'withdrawal':
        return 'Wallet Withdrawal';
      default:
        return 'Transaction';
    }
  };

  return (
    <div className={className}>
      {/* Balance Card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Wallet Balance</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 hover:bg-surface-secondary rounded transition-colors"
              title={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? (
                <Eye className="h-4 w-4 text-gray-400" />
              ) : (
                <EyeOff className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={refreshBalance}
              disabled={isLoadingBalance}
              className="p-1 hover:bg-surface-secondary rounded transition-colors disabled:opacity-50"
              title="Refresh balance"
            >
              <RefreshCw className={`h-4 w-4 text-gray-400 ${isLoadingBalance ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        <div className="text-center py-4">
          {isLoadingBalance ? (
            <div className="animate-pulse">
              <div className="h-8 bg-surface-tertiary rounded w-32 mx-auto mb-2" />
              <div className="h-4 bg-surface-tertiary rounded w-16 mx-auto" />
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold text-gor-400 mb-1">
                {showBalance ? `${formatGOR(balance || 0)} GOR` : '••••••'}
              </div>
              <div className="text-sm text-gray-400">
                Available Balance
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-xl font-bold text-success mb-1">
            {user.gamesWon}
          </div>
          <div className="text-sm text-gray-400">Wins</div>
        </div>
        
        <div className="card text-center">
          <div className="text-xl font-bold text-danger mb-1">
            {user.gamesLost}
          </div>
          <div className="text-sm text-gray-400">Losses</div>
        </div>
        
        <div className="card text-center">
          <div className="text-xl font-bold text-primary-400 mb-1">
            {winRate}%
          </div>
          <div className="text-sm text-gray-400">Win Rate</div>
        </div>
        
        <div className="card text-center">
          <div className="text-xl font-bold text-gor-400 mb-1">
            {formatGOR(user.totalStaked)}
          </div>
          <div className="text-sm text-gray-400">Total Staked</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <span className="text-sm text-gray-400">Last 24 hours</span>
        </div>
        
        {loadingTransactions ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <LoadingSkeleton key={i} lines={2} />
            ))}
          </div>
        ) : recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg hover:bg-surface-tertiary transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <div className="text-sm font-medium text-white">
                      {getTransactionLabel(transaction)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatRelativeTime(transaction.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-semibold ${
                    transaction.amount > 0 ? 'text-success' : 'text-danger'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{formatGOR(Math.abs(transaction.amount))} GOR
                  </div>
                  <div className={`text-xs ${
                    transaction.status === 'confirmed' ? 'text-success' : 
                    transaction.status === 'pending' ? 'text-warning' : 'text-danger'
                  }`}>
                    {transaction.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No recent activity</p>
            <p className="text-sm text-gray-500 mt-1">
              Your game transactions will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}