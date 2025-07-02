// src/components/leaderboard/LeaderboardContent.tsx
'use client';

import { JSX, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Crown, 
  Medal, 
  TrendingUp, 
  TrendingDown,
  Coins,
  Gamepad2,
  Users,
  Calendar,
  Filter,
  Search,
  Star,
  Zap,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  type LucideIcon
} from 'lucide-react';

import { StaggeredItem } from '@/components/ui/PageTransitions';
import { cn } from '@/lib/utils';


// Types for leaderboard data
interface LeaderboardPlayer {
  id: string;
  username: string;
  walletAddress: string;
  rank: number;
  previousRank: number;
  totalWinnings: number;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  averagePot: number;
  biggestWin: number;
  lastActive: string;
  badges: string[];
  isOnline: boolean;
}

interface LeaderboardStats {
  totalPlayers: number;
  totalGames: number;
  totalVolume: number;
  biggestPot: number;
  topWinRate: number;
  mostActivePlayer: string;
}

// Mock data - replace with API calls
const mockLeaderboardData: LeaderboardPlayer[] = [
  {
    id: '1',
    username: 'PokerPro2024',
    walletAddress: 'Gb8f...X9k2',
    rank: 1,
    previousRank: 2,
    totalWinnings: 15420,
    gamesPlayed: 234,
    gamesWon: 156,
    winRate: 66.7,
    currentStreak: 12,
    bestStreak: 18,
    averagePot: 65.9,
    biggestWin: 890,
    lastActive: '2 minutes ago',
    badges: ['hot-streak', 'big-winner', 'veteran'],
    isOnline: true
  },
  {
    id: '2',
    username: 'GorbaganaKing',
    walletAddress: 'Ab3d...Y7m1',
    rank: 2,
    previousRank: 1,
    totalWinnings: 14850,
    gamesPlayed: 198,
    gamesWon: 128,
    winRate: 64.6,
    currentStreak: 3,
    bestStreak: 22,
    averagePot: 75.0,
    biggestWin: 1250,
    lastActive: '1 hour ago',
    badges: ['legend', 'consistent', 'high-roller'],
    isOnline: true
  },
  {
    id: '3',
    username: 'FastCards',
    walletAddress: 'Cx9f...Z8h3',
    rank: 3,
    previousRank: 4,
    totalWinnings: 12680,
    gamesPlayed: 187,
    gamesWon: 115,
    winRate: 61.5,
    currentStreak: 7,
    bestStreak: 15,
    averagePot: 67.8,
    biggestWin: 720,
    lastActive: '5 minutes ago',
    badges: ['rising-star', 'quick-play'],
    isOnline: true
  },
  // Add more mock players...
  ...Array.from({ length: 17 }, (_, i) => ({
    id: (i + 4).toString(),
    username: `Player${i + 4}`,
    walletAddress: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.random().toString(36).substr(2, 3)}...${Math.random().toString(36).substr(2, 4)}`,
    rank: i + 4,
    previousRank: i + 4 + Math.floor(Math.random() * 3) - 1,
    totalWinnings: Math.floor(Math.random() * 10000) + 1000,
    gamesPlayed: Math.floor(Math.random() * 150) + 50,
    gamesWon: Math.floor(Math.random() * 80) + 20,
    winRate: Math.floor(Math.random() * 40) + 45,
    currentStreak: Math.floor(Math.random() * 10),
    bestStreak: Math.floor(Math.random() * 20) + 5,
    averagePot: Math.floor(Math.random() * 50) + 30,
    biggestWin: Math.floor(Math.random() * 500) + 100,
    lastActive: `${Math.floor(Math.random() * 24)} hours ago`,
    badges: ['newcomer'],
    isOnline: Math.random() > 0.7
  }))
];

const mockStats: LeaderboardStats = {
  totalPlayers: 1247,
  totalGames: 8934,
  totalVolume: 156780,
  biggestPot: 2340,
  topWinRate: 66.7,
  mostActivePlayer: 'PokerPro2024'
};

export function LeaderboardContent(): JSX.Element {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>(mockLeaderboardData);
  const [stats, setStats] = useState<LeaderboardStats>(mockStats);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'winnings' | 'winRate' | 'games'>('winnings');
  const [timeFrame, setTimeFrame] = useState<'all' | 'week' | 'month'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort players
  const filteredPlayers = players
    .filter(player => 
      player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'winnings':
          return b.totalWinnings - a.totalWinnings;
        case 'winRate':
          return b.winRate - a.winRate;
        case 'games':
          return b.gamesPlayed - a.gamesPlayed;
        default:
          return a.rank - b.rank;
      }
    });

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const getRankChange = (current: number, previous: number) => {
    const change = previous - current;
    if (change > 0) {
      return (
        <div className="flex items-center text-green-400 text-xs">
          <TrendingUp className="h-3 w-3 mr-1" />
          +{change}
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center text-red-400 text-xs">
          <TrendingDown className="h-3 w-3 mr-1" />
          {change}
        </div>
      );
    }
    return <div className="text-gray-500 text-xs">-</div>;
  };

type BadgeType = 'hot-streak' | 'big-winner' | 'veteran' | 'legend' | 'consistent' | 'high-roller' | 'rising-star' | 'quick-play' | 'newcomer';

interface BadgeConfig {
  icon: LucideIcon;
  color: string;
  bg: string;
}

// Fixed getBadgeIcon function with proper typing
const getBadgeIcon = (badge: string): BadgeConfig => {
  const badges: Record<BadgeType, BadgeConfig> = {
    'hot-streak': { icon: Zap, color: 'text-orange-400', bg: 'bg-orange-400/20' },
    'big-winner': { icon: Coins, color: 'text-yellow-400', bg: 'bg-yellow-400/20' },
    'veteran': { icon: Star, color: 'text-blue-400', bg: 'bg-blue-400/20' },
    'legend': { icon: Crown, color: 'text-purple-400', bg: 'bg-purple-400/20' },
    'consistent': { icon: Target, color: 'text-green-400', bg: 'bg-green-400/20' },
    'high-roller': { icon: Trophy, color: 'text-gor-400', bg: 'bg-gor-400/20' },
    'rising-star': { icon: TrendingUp, color: 'text-pink-400', bg: 'bg-pink-400/20' },
    'quick-play': { icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-400/20' },
    'newcomer': { icon: Award, color: 'text-gray-400', bg: 'bg-gray-400/20' }
  };
  
  return badges[badge as BadgeType] || badges['newcomer'];
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <StaggeredItem>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-gaming">
              Leaderboard
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Top players ranked by total winnings
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-surface-secondary hover:bg-surface-tertiary text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
              <span className="hidden sm:inline">Refresh</span>
            </motion.button>
          </div>
        </div>
      </StaggeredItem>

      {/* Stats Cards */}
      <StaggeredItem>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-surface-primary rounded-lg p-4 border border-surface-tertiary">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-primary-400" />
              <span className="text-xs text-gray-400">Total Players</span>
            </div>
            <div className="text-lg font-bold text-white">{stats.totalPlayers.toLocaleString()}</div>
          </div>

          <div className="bg-surface-primary rounded-lg p-4 border border-surface-tertiary">
            <div className="flex items-center space-x-2 mb-2">
              <Gamepad2 className="h-4 w-4 text-gor-400" />
              <span className="text-xs text-gray-400">Total Games</span>
            </div>
            <div className="text-lg font-bold text-white">{stats.totalGames.toLocaleString()}</div>
          </div>

          <div className="bg-surface-primary rounded-lg p-4 border border-surface-tertiary">
            <div className="flex items-center space-x-2 mb-2">
              <Coins className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-gray-400">Total Volume</span>
            </div>
            <div className="text-lg font-bold text-white">{stats.totalVolume.toLocaleString()} GOR</div>
          </div>

          <div className="bg-surface-primary rounded-lg p-4 border border-surface-tertiary">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="h-4 w-4 text-gor-400" />
              <span className="text-xs text-gray-400">Biggest Pot</span>
            </div>
            <div className="text-lg font-bold text-white">{stats.biggestPot.toLocaleString()} GOR</div>
          </div>

          <div className="bg-surface-primary rounded-lg p-4 border border-surface-tertiary">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-xs text-gray-400">Top Win Rate</span>
            </div>
            <div className="text-lg font-bold text-white">{stats.topWinRate}%</div>
          </div>

          <div className="bg-surface-primary rounded-lg p-4 border border-surface-tertiary">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-gray-400">Most Active</span>
            </div>
            <div className="text-sm font-bold text-white truncate">{stats.mostActivePlayer}</div>
          </div>
        </div>
      </StaggeredItem>

      {/* Search and Filters */}
      <StaggeredItem>
        <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface-secondary border border-surface-tertiary rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-surface-secondary border border-surface-tertiary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="winnings">Total Winnings</option>
              <option value="winRate">Win Rate</option>
              <option value="games">Games Played</option>
            </select>

            {/* Time Frame */}
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value as any)}
              className="px-4 py-2 bg-surface-secondary border border-surface-tertiary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Time</option>
              <option value="month">This Month</option>
              <option value="week">This Week</option>
            </select>
          </div>
        </div>
      </StaggeredItem>

      {/* Leaderboard Table */}
      <StaggeredItem>
        <div className="bg-surface-primary rounded-lg border border-surface-tertiary overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-surface-secondary border-b border-surface-tertiary text-xs font-medium text-gray-400 uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4 sm:col-span-3">Player</div>
            <div className="col-span-2 hidden sm:block">Winnings</div>
            <div className="col-span-2 hidden md:block">Games</div>
            <div className="col-span-2 hidden md:block">Win Rate</div>
            <div className="col-span-2 hidden lg:block">Streak</div>
            <div className="col-span-7 sm:col-span-5 md:col-span-3 lg:col-span-1">Status</div>
          </div>

          {/* Player Rows */}
          <div className="divide-y divide-surface-tertiary">
            <AnimatePresence>
              {filteredPlayers.slice(0, 20).map((player, index) => (
                <motion.div
                  key={player.id}
                  className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-surface-secondary/50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center">
                    <div className="flex flex-col items-center space-y-1">
                      {getRankIcon(player.rank)}
                      {getRankChange(player.rank, player.previousRank)}
                    </div>
                  </div>

                  {/* Player Info */}
                  <div className="col-span-4 sm:col-span-3 flex items-center space-x-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <div className="font-medium text-white truncate">
                          {player.username}
                        </div>
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          player.isOnline ? 'bg-green-400' : 'bg-gray-500'
                        )} />
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {player.walletAddress}
                      </div>
                      {/* Badges */}
                      <div className="flex items-center space-x-1 mt-1">
                        {player.badges.slice(0, 2).map((badge) => {
                          const badgeInfo = getBadgeIcon(badge);
                          const BadgeIcon = badgeInfo.icon;
                          return (
                            <div
                              key={badge}
                              className={cn(
                                'p-1 rounded',
                                badgeInfo.bg
                              )}
                              title={badge.replace('-', ' ')}
                            >
                              <BadgeIcon className={cn('h-3 w-3', badgeInfo.color)} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Total Winnings */}
                  <div className="col-span-2 hidden sm:flex items-center">
                    <div>
                      <div className="font-medium text-white">
                        {player.totalWinnings.toLocaleString()} GOR
                      </div>
                      <div className="text-xs text-gray-400">
                        Avg: {player.averagePot.toFixed(1)} GOR
                      </div>
                    </div>
                  </div>

                  {/* Games */}
                  <div className="col-span-2 hidden md:flex items-center">
                    <div>
                      <div className="font-medium text-white">
                        {player.gamesWon}/{player.gamesPlayed}
                      </div>
                      <div className="text-xs text-gray-400">
                        Best win: {player.biggestWin} GOR
                      </div>
                    </div>
                  </div>

                  {/* Win Rate */}
                  <div className="col-span-2 hidden md:flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-white">
                          {player.winRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-surface-tertiary rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${player.winRate}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Streak */}
                  <div className="col-span-2 hidden lg:flex items-center">
                    <div>
                      <div className="font-medium text-white">
                        {player.currentStreak} current
                      </div>
                      <div className="text-xs text-gray-400">
                        Best: {player.bestStreak}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-7 sm:col-span-5 md:col-span-3 lg:col-span-1 flex items-center justify-end">
                    <div className="text-xs text-gray-400 text-right">
                      {player.lastActive}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </StaggeredItem>

      {/* Show More Button */}
      {filteredPlayers.length > 20 && (
        <StaggeredItem>
          <div className="text-center">
            <button className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors">
              Load More Players
            </button>
          </div>
        </StaggeredItem>
      )}
    </div>
  );
}