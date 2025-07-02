'use client';

import { useState, useEffect, JSX } from 'react';
import { Users, Coins, Clock, Eye, UserPlus, Filter, RefreshCw } from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { formatGOR, formatRelativeTime } from '@/lib/utils';
import { LoadingSkeleton } from '@/components/ui/LoadingSpinner';
import { toast } from '@/components/ui/Toaster';

import type { Game } from '@/types';

interface GameLobbyProps {
  className?: string;
  onJoinGame: (game: Game) => void;
  onSpectateGame: (game: Game) => void;
}

type FilterType = 'all' | 'waiting' | 'in-progress' | 'can-join';

export function GameLobby({ className, onJoinGame, onSpectateGame }: GameLobbyProps): JSX.Element {
  const { user, balance } = useWallet();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch available games
  const fetchGames = async (): Promise<void> => {
    try {
      // TODO: Replace with actual API call
      const mockGames: Game[] = [
        {
          id: 'game1',
          inviteCode: 'ABC123',
          status: 'waiting',
          currentRound: 0,
          maxPlayers: 4,
          ante: 50,
          pot: 0,
          currentBet: 0,
          currentPlayerIndex: 0,
          players: [
            {
              id: 'player1',
              userId: 'user1',
              username: 'PokerPro',
              walletAddress: '123456',
              position: 0,
              card: null,
              chips: 50,
              currentBet: 0,
              isActive: true,
              isFolded: false,
              lastAction: null,
              timeRemaining: 0,
              isConnected: true,
            }
          ],
          deck: [],
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
        {
          id: 'game2',
          inviteCode: 'DEF456',
          status: 'betting',
          currentRound: 1,
          maxPlayers: 6,
          ante: 100,
          pot: 400,
          currentBet: 50,
          currentPlayerIndex: 1,
          players: [
            {
              id: 'player2',
              userId: 'user2',
              username: 'BluffMaster',
              walletAddress: '789012',
              position: 0,
              card: null,
              chips: 150,
              currentBet: 50,
              isActive: true,
              isFolded: false,
              lastAction: 'bet',
              timeRemaining: 25,
              isConnected: true,
            },
            {
              id: 'player3',
              userId: 'user3',
              username: 'CardShark',
              walletAddress: '345678',
              position: 1,
              card: null,
              chips: 100,
              currentBet: 0,
              isActive: true,
              isFolded: false,
              lastAction: null,
              timeRemaining: 0,
              isConnected: true,
            }
          ],
          deck: [],
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
        {
          id: 'game3',
          inviteCode: 'GHI789',
          status: 'waiting',
          currentRound: 0,
          maxPlayers: 3,
          ante: 25,
          pot: 0,
          currentBet: 0,
          currentPlayerIndex: 0,
          players: [
            {
              id: 'player4',
              userId: 'user4',
              username: 'RookiePlayer',
              walletAddress: '901234',
              position: 0,
              card: null,
              chips: 25,
              currentBet: 0,
              isActive: true,
              isFolded: false,
              lastAction: null,
              timeRemaining: 0,
              isConnected: true,
            },
            {
              id: 'player5',
              userId: 'user5',
              username: 'CasualGamer',
              walletAddress: '567890',
              position: 1,
              card: null,
              chips: 25,
              currentBet: 0,
              isActive: true,
              isFolded: false,
              lastAction: null,
              timeRemaining: 0,
              isConnected: true,
            }
          ],
          deck: [],
          createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        }
      ];
      
      setGames(mockGames);
    } catch (error) {
      console.error('Error fetching games:', error);
      toast.error('Failed to load games');
    }
  };

  // Initial load
  useEffect(() => {
    const loadGames = async (): Promise<void> => {
      setLoading(true);
      await fetchGames();
      setLoading(false);
    };
    
    loadGames();
  }, []);

  // Refresh games
  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await fetchGames();
    setRefreshing(false);
    toast.success('Games refreshed');
  };

  // Filter games
  const filteredGames = games.filter(game => {
    switch (filter) {
      case 'waiting':
        return game.status === 'waiting';
      case 'in-progress':
        return game.status !== 'waiting' && game.status !== 'finished';
      case 'can-join':
        return game.status === 'waiting' && 
               game.players.length < game.maxPlayers && 
               (balance || 0) >= game.ante &&
               !game.players.some(p => p.userId === user?.id);
      default:
        return true;
    }
  });

  const canJoinGame = (game: Game): boolean => {
    return game.status === 'waiting' && 
           game.players.length < game.maxPlayers && 
           (balance || 0) >= game.ante &&
           !game.players.some(p => p.userId === user?.id);
  };

  const getGameStatusColor = (status: Game['status']): string => {
    switch (status) {
      case 'waiting':
        return 'text-warning';
      case 'betting':
      case 'starting':
        return 'text-success';
      case 'showdown':
        return 'text-info';
      case 'finished':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getGameStatusLabel = (status: Game['status']): string => {
    switch (status) {
      case 'waiting':
        return 'Waiting for Players';
      case 'starting':
        return 'Starting...';
      case 'betting':
        return 'Betting Round';
      case 'showdown':
        return 'Showdown';
      case 'finished':
        return 'Finished';
      default:
        return status;
    }
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white font-gaming">Public Games</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'All Games' },
          { key: 'waiting', label: 'Waiting' },
          { key: 'in-progress', label: 'In Progress' },
          { key: 'can-join', label: 'Can Join' },
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key as FilterType)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === filterOption.key
                ? 'bg-primary-500 text-white'
                : 'bg-surface-secondary text-gray-300 hover:bg-surface-tertiary'
            }`}
          >
            <Filter className="inline h-3 w-3 mr-1" />
            {filterOption.label}
          </button>
        ))}
      </div>

      {/* Games List */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }, (_, i) => (
            <LoadingSkeleton key={i} lines={3} className="card" />
          ))
        ) : filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <div key={game.id} className="card card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-white">
                    Game #{game.id.slice(0, 8).toUpperCase()}
                  </h3>
                  <span className={`text-sm px-2 py-1 rounded-full bg-surface-secondary ${getGameStatusColor(game.status)}`}>
                    {getGameStatusLabel(game.status)}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  {formatRelativeTime(game.createdAt)}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    {game.players.length}/{game.maxPlayers} players
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Coins className="h-4 w-4 text-gor-400" />
                  <span className="text-sm text-gray-300">
                    {formatGOR(game.ante)} GOR ante
                  </span>
                </div>
                
                {game.status !== 'waiting' && (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-gor-400 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-black" />
                    </div>
                    <span className="text-sm text-gray-300">
                      Pot: {formatGOR(game.pot)} GOR
                    </span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    Round {game.currentRound}
                  </span>
                </div>
              </div>

              {/* Players Preview */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Players:</div>
                <div className="flex flex-wrap gap-2">
                  {game.players.map((player) => (
                    <span
                      key={player.id}
                      className={`text-xs px-2 py-1 rounded ${
                        player.isConnected ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                      }`}
                    >
                      {player.username}
                    </span>
                  ))}
                  {game.players.length < game.maxPlayers && (
                    <span className="text-xs px-2 py-1 rounded bg-surface-tertiary text-gray-400">
                      {game.maxPlayers - game.players.length} open slot{game.maxPlayers - game.players.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                {canJoinGame(game) ? (
                  <button
                    onClick={() => onJoinGame(game)}
                    className="btn-primary flex items-center space-x-2 flex-1"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Join Game</span>
                  </button>
                ) : game.status === 'waiting' && game.players.length >= game.maxPlayers ? (
                  <button disabled className="btn-secondary flex-1 opacity-50 cursor-not-allowed">
                    Game Full
                  </button>
                ) : game.status === 'waiting' && (balance || 0) < game.ante ? (
                  <button disabled className="btn-secondary flex-1 opacity-50 cursor-not-allowed">
                    Insufficient Balance
                  </button>
                ) : (
                  <button
                    onClick={() => onSpectateGame(game)}
                    className="btn-secondary flex items-center space-x-2 flex-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Spectate</span>
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Games Found</h3>
            <p className="text-gray-400 mb-4">
              {filter === 'all' 
                ? 'No public games are currently available'
                : `No games match the "${filter}" filter`
              }
            </p>
            <button
              onClick={() => setFilter('all')}
              className="btn-secondary"
            >
              Show All Games
            </button>
          </div>
        )}
      </div>
    </div>
  );
}