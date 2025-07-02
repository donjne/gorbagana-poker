// src/components/profile/ProfileContent.tsx
'use client';
import { toast } from '@/components/ui/Toaster';
import { JSX, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Wallet, 
  History, 
  Settings, 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  Coins,
  Gamepad2,
  Calendar,
  Clock,
  Target,
  Award,
  Star,
  Zap,
  Crown,
  Medal,
  Copy,
  ExternalLink,
  Edit3,
  Save,
  X,
  Download,
  Upload,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  Filter,
  type LucideIcon 
} from 'lucide-react';

import { StaggeredItem } from '@/components/ui/PageTransitions';
import { cn } from '@/lib/utils';

// Types for profile data
interface UserProfile {
  id: string;
  username: string;
  walletAddress: string;
  avatarUrl?: string;
  joinDate: string;
  lastActive: string;
  isOnline: boolean;
  bio?: string;
  country?: string;
  preferredGame?: string;
}

interface UserStats {
  rank: number;
  totalWinnings: number;
  totalLosses: number;
  netProfit: number;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  worstStreak: number;
  averagePot: number;
  biggestWin: number;
  biggestLoss: number;
  favoriteTimeSlot: string;
  totalHoursPlayed: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'games' | 'winnings' | 'streaks' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface GameHistory {
  id: string;
  gameType: string;
  result: 'win' | 'loss';
  amount: number;
  pot: number;
  playersCount: number;
  duration: string;
  date: string;
  rank: number;
}

interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'game_win' | 'game_loss';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  txHash?: string;
}

// Mock data - replace with API calls
const mockProfile: UserProfile = {
  id: 'user123',
  username: 'PokerPro2024',
  walletAddress: 'Gb8f2X9k2H4m7N3pQ6rS8tU1vW9yZ5aB7cD2eFgH1jK4',
  joinDate: '2024-01-15',
  lastActive: '5 minutes ago',
  isOnline: true,
  bio: 'Professional poker player. Lightning fast on Gorbagana. Always up for a challenge!',
  country: 'United States',
  preferredGame: 'Two-Card Indian Poker'
};

const mockStats: UserStats = {
  rank: 1,
  totalWinnings: 15420,
  totalLosses: 8630,
  netProfit: 6790,
  gamesPlayed: 234,
  gamesWon: 156,
  winRate: 66.7,
  currentStreak: 12,
  bestStreak: 18,
  worstStreak: -7,
  averagePot: 65.9,
  biggestWin: 890,
  biggestLoss: -320,
  favoriteTimeSlot: 'Evening (6-10 PM)',
  totalHoursPlayed: 127.5
};

const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'First Victory',
    description: 'Win your first game',
    icon: 'trophy',
    category: 'games',
    rarity: 'common',
    unlockedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Hot Streak',
    description: 'Win 10 games in a row',
    icon: 'zap',
    category: 'streaks',
    rarity: 'rare',
    unlockedAt: '2024-02-20'
  },
  {
    id: '3',
    name: 'Big Winner',
    description: 'Win 10,000+ GOR total',
    icon: 'coins',
    category: 'winnings',
    rarity: 'epic',
    unlockedAt: '2024-03-10'
  },
  {
    id: '4',
    name: 'Speed Demon',
    description: 'Win a game in under 2 minutes',
    icon: 'zap',
    category: 'special',
    rarity: 'legendary',
    unlockedAt: '2024-03-15'
  },
  {
    id: '5',
    name: 'Century Club',
    description: 'Play 100 games',
    icon: 'gamepad',
    category: 'games',
    rarity: 'rare',
    progress: 234,
    maxProgress: 100,
    unlockedAt: '2024-02-28'
  }
];

const mockGameHistory: GameHistory[] = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  gameType: 'Two-Card Indian Poker',
  result: Math.random() > 0.4 ? 'win' : 'loss',
  amount: Math.floor(Math.random() * 500) + 10,
  pot: Math.floor(Math.random() * 800) + 50,
  playersCount: Math.floor(Math.random() * 5) + 2,
  duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  rank: Math.floor(Math.random() * 6) + 1
}));

const mockTransactions: WalletTransaction[] = Array.from({ length: 20 }, (_, i) => ({
  id: (i + 1).toString(),
  type: ['deposit', 'withdrawal', 'game_win', 'game_loss'][Math.floor(Math.random() * 4)] as any,
  amount: Math.floor(Math.random() * 1000) + 10,
  status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)] as any,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  txHash: Math.random() > 0.3 ? `0x${Math.random().toString(16).substr(2, 64)}` : undefined
}));

export function ProfileContent(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'achievements' | 'wallet' | 'settings'>('overview');
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [stats, setStats] = useState<UserStats>(mockStats);
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>(mockGameHistory);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(mockTransactions);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(mockProfile);
  const [showPrivateInfo, setShowPrivateInfo] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'wins' | 'losses'>('all');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'history', name: 'Game History', icon: History },
    { id: 'achievements', name: 'Achievements', icon: Trophy },
    { id: 'wallet', name: 'Wallet', icon: Wallet },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const handleSaveProfile = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    // TODO: Save to API
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  } catch (error) {
    // Fallback for browsers that don't support clipboard API
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Copied to clipboard!');
    } catch (fallbackError) {
      console.error('Failed to copy text: ', fallbackError);
      toast.error('Failed to copy to clipboard');
    }
  }
};

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 bg-gray-400/20';
      case 'rare': return 'text-blue-400 bg-blue-400/20';
      case 'epic': return 'text-purple-400 bg-purple-400/20';
      case 'legendary': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

type AchievementIconType = 'trophy' | 'zap' | 'coins' | 'gamepad' | 'star' | 'crown' | 'medal' | 'target' | 'award';

const getAchievementIcon = (icon: string): LucideIcon => {
  const icons: Record<AchievementIconType, LucideIcon> = {
    trophy: Trophy,
    zap: Zap,
    coins: Coins,
    gamepad: Gamepad2,
    star: Star,
    crown: Crown,
    medal: Medal,
    target: Target,
    award: Award
  };
  
  return icons[icon as AchievementIconType] || Award;
};

  const filteredGameHistory = gameHistory.filter(game => {
    if (historyFilter === 'all') return true;
    return game.result === historyFilter.slice(0, -1);
  });

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <StaggeredItem>
        <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-gor-400 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div className={cn(
                  'absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-surface-primary',
                  profile.isOnline ? 'bg-green-400' : 'bg-gray-500'
                )} />
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-white font-gaming">
                    {profile.username}
                  </h1>
                  <div className="flex items-center space-x-1">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    <span className="text-yellow-400 font-medium">#{stats.rank}</span>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4" />
                    <span className="font-mono">{formatWalletAddress(profile.walletAddress)}</span>
                    <button
                      onClick={() => copyToClipboard(profile.walletAddress)}
                      className="hover:text-white transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Last active: {profile.lastActive}</span>
                  </div>
                </div>

                {profile.bio && (
                  <p className="mt-3 text-gray-300 text-sm">{profile.bio}</p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:w-80">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.gamesWon}</div>
                <div className="text-xs text-gray-400">Games Won</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gor-400">{stats.totalWinnings.toLocaleString()}</div>
                <div className="text-xs text-gray-400">Total Winnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-400">{stats.winRate.toFixed(1)}%</div>
                <div className="text-xs text-gray-400">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{stats.currentStreak}</div>
                <div className="text-xs text-gray-400">Current Streak</div>
              </div>
            </div>
          </div>
        </div>
      </StaggeredItem>

      {/* Navigation Tabs */}
      <StaggeredItem>
        <div className="bg-surface-primary rounded-lg border border-surface-tertiary">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap',
                    activeTab === tab.id
                      ? 'text-primary-400 border-primary-400'
                      : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </StaggeredItem>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <StaggeredItem>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Performance Stats */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Win/Loss Chart Placeholder */}
                  <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Performance Overview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-surface-secondary rounded-lg">
                        <div className="text-2xl font-bold text-green-400">{stats.netProfit.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Net Profit (GOR)</div>
                      </div>
                      <div className="text-center p-4 bg-surface-secondary rounded-lg">
                        <div className="text-2xl font-bold text-white">{stats.averagePot.toFixed(1)}</div>
                        <div className="text-xs text-gray-400">Avg Pot (GOR)</div>
                      </div>
                      <div className="text-center p-4 bg-surface-secondary rounded-lg">
                        <div className="text-2xl font-bold text-gor-400">{stats.biggestWin}</div>
                        <div className="text-xs text-gray-400">Biggest Win</div>
                      </div>
                      <div className="text-center p-4 bg-surface-secondary rounded-lg">
                        <div className="text-2xl font-bold text-white">{stats.totalHoursPlayed.toFixed(1)}</div>
                        <div className="text-xs text-gray-400">Hours Played</div>
                      </div>
                    </div>
                  </div>

                  {/* Streaks */}
                  <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Streak Analysis</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Current Streak</span>
                        <div className="flex items-center space-x-2">
                          <div className="text-green-400 font-bold">{stats.currentStreak} wins</div>
                          <Zap className="h-4 w-4 text-green-400" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Best Streak</span>
                        <div className="text-gor-400 font-bold">{stats.bestStreak} wins</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Worst Streak</span>
                        <div className="text-red-400 font-bold">{Math.abs(stats.worstStreak)} losses</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="space-y-6">
                  <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Achievements</h3>
                    <div className="space-y-3">
                      {achievements.filter(a => a.unlockedAt).slice(0, 5).map((achievement) => {
                        const Icon = getAchievementIcon(achievement.icon);
                        return (
                          <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-surface-secondary rounded-lg">
                            <div className={cn('p-2 rounded-lg', getRarityColor(achievement.rarity))}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-white truncate">{achievement.name}</div>
                              <div className="text-xs text-gray-400 truncate">{achievement.description}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Playing Habits */}
                  <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Playing Habits</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Favorite Time</span>
                        <span className="text-white text-sm">{stats.favoriteTimeSlot}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Preferred Game</span>
                        <span className="text-white text-sm">{profile.preferredGame}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Total Sessions</span>
                        <span className="text-white text-sm">{stats.gamesPlayed}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </StaggeredItem>
          )}

          {activeTab === 'history' && (
            <StaggeredItem>
              <div className="bg-surface-primary rounded-lg border border-surface-tertiary">
                {/* Filter Controls */}
                <div className="p-4 border-b border-surface-tertiary">
                  <div className="flex items-center space-x-4">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <div className="flex space-x-2">
                      {['all', 'wins', 'losses'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setHistoryFilter(filter as any)}
                          className={cn(
                            'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                            historyFilter === filter
                              ? 'bg-primary-500 text-white'
                              : 'bg-surface-secondary text-gray-400 hover:text-white'
                          )}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Game History Table */}
                <div className="overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-surface-secondary text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Result</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-2">Pot Size</div>
                    <div className="col-span-2">Players</div>
                    <div className="col-span-2">Duration</div>
                  </div>
                  <div className="divide-y divide-surface-tertiary max-h-96 overflow-y-auto">
                    {filteredGameHistory.slice(0, 20).map((game) => (
                      <div key={game.id} className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-surface-secondary/50 transition-colors">
                        <div className="col-span-2 text-sm text-gray-400">
                          {new Date(game.date).toLocaleDateString()}
                        </div>
                        <div className="col-span-2">
                          <div className={cn(
                            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                            game.result === 'win' 
                              ? 'bg-green-400/20 text-green-400' 
                              : 'bg-red-400/20 text-red-400'
                          )}>
                            {game.result === 'win' ? 'Win' : 'Loss'} (#{game.rank})
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className={cn(
                            'font-medium',
                            game.result === 'win' ? 'text-green-400' : 'text-red-400'
                          )}>
                            {game.result === 'win' ? '+' : '-'}{game.amount} GOR
                          </div>
                        </div>
                        <div className="col-span-2 text-white font-medium">
                          {game.pot} GOR
                        </div>
                        <div className="col-span-2 text-gray-400">
                          {game.playersCount} players
                        </div>
                        <div className="col-span-2 text-gray-400">
                          {game.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </StaggeredItem>
          )}

          {activeTab === 'achievements' && (
            <StaggeredItem>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => {
                  const Icon = getAchievementIcon(achievement.icon);
                  const isUnlocked = !!achievement.unlockedAt;
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      className={cn(
                        'bg-surface-primary rounded-lg border border-surface-tertiary p-4 transition-all duration-200',
                        isUnlocked ? 'hover:border-primary-500/50' : 'opacity-60'
                      )}
                      whileHover={isUnlocked ? { scale: 1.02 } : {}}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={cn(
                          'p-3 rounded-lg flex-shrink-0',
                          isUnlocked ? getRarityColor(achievement.rarity) : 'bg-gray-600/20 text-gray-600'
                        )}>
                          <Icon className="h-6 w-6" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={cn(
                              'font-semibold truncate',
                              isUnlocked ? 'text-white' : 'text-gray-500'
                            )}>
                              {achievement.name}
                            </h3>
                            <div className={cn(
                              'px-2 py-1 rounded text-xs font-medium',
                              getRarityColor(achievement.rarity)
                            )}>
                              {achievement.rarity}
                            </div>
                          </div>
                          
                          <p className={cn(
                            'text-sm mb-2',
                            isUnlocked ? 'text-gray-300' : 'text-gray-500'
                          )}>
                            {achievement.description}
                          </p>
                          
                          {achievement.progress !== undefined && achievement.maxProgress && (
                            <div className="mb-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">Progress</span>
                                <span className="text-gray-400">
                                  {achievement.progress}/{achievement.maxProgress}
                                </span>
                              </div>
                              <div className="w-full bg-surface-tertiary rounded-full h-2">
                                <div
                                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                                  style={{ 
                                    width: `${Math.min(100, (achievement.progress / achievement.maxProgress) * 100)}%` 
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          
                          {isUnlocked && achievement.unlockedAt && (
                            <div className="text-xs text-gray-400">
                              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </StaggeredItem>
          )}

          {activeTab === 'wallet' && (
            <StaggeredItem>
              <div className="space-y-6">
                {/* Wallet Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Wallet className="h-6 w-6 text-gor-400" />
                      <h3 className="text-lg font-semibold text-white">Current Balance</h3>
                    </div>
                    <div className="text-3xl font-bold text-gor-400 mb-2">
                      {stats.netProfit.toLocaleString()} GOR
                    </div>
                    <div className="text-sm text-gray-400">
                      ≈ ${(stats.netProfit * 0.1).toFixed(2)} USD
                    </div>
                  </div>

                  <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <TrendingUp className="h-6 w-6 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">Total Deposits</h3>
                    </div>
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {(stats.totalWinnings + stats.totalLosses).toLocaleString()} GOR
                    </div>
                    <div className="text-sm text-gray-400">
                      Lifetime deposits
                    </div>
                  </div>

                  <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <TrendingDown className="h-6 w-6 text-red-400" />
                      <h3 className="text-lg font-semibold text-white">Total Withdrawals</h3>
                    </div>
                    <div className="text-3xl font-bold text-red-400 mb-2">
                      {stats.totalLosses.toLocaleString()} GOR
                    </div>
                    <div className="text-sm text-gray-400">
                      Lifetime withdrawals
                    </div>
                  </div>
                </div>

                {/* Wallet Actions */}
                <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Wallet Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                      <Plus className="h-4 w-4" />
                      <span>Deposit</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                      <Minus className="h-4 w-4" />
                      <span>Withdraw</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-surface-secondary hover:bg-surface-tertiary text-white rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-surface-secondary hover:bg-surface-tertiary text-white rounded-lg transition-colors">
                      <RefreshCw className="h-4 w-4" />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Transaction History */}
                <div className="bg-surface-primary rounded-lg border border-surface-tertiary">
                  <div className="p-4 border-b border-surface-tertiary">
                    <h3 className="text-lg font-semibold text-white">Transaction History</h3>
                  </div>
                  
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-surface-secondary text-xs font-medium text-gray-400 uppercase tracking-wider">
                      <div className="col-span-2">Type</div>
                      <div className="col-span-2">Amount</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-3">Date</div>
                      <div className="col-span-3">Transaction Hash</div>
                    </div>
                    
                    <div className="divide-y divide-surface-tertiary max-h-96 overflow-y-auto">
                      {transactions.slice(0, 15).map((tx) => (
                        <div key={tx.id} className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-surface-secondary/50 transition-colors">
                          <div className="col-span-2">
                            <div className={cn(
                              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                              tx.type === 'deposit' ? 'bg-green-400/20 text-green-400' :
                              tx.type === 'withdrawal' ? 'bg-red-400/20 text-red-400' :
                              tx.type === 'game_win' ? 'bg-blue-400/20 text-blue-400' :
                              'bg-orange-400/20 text-orange-400'
                            )}>
                              {tx.type.replace('_', ' ')}
                            </div>
                          </div>
                          
                          <div className="col-span-2">
                            <div className={cn(
                              'font-medium',
                              tx.type === 'deposit' || tx.type === 'game_win' ? 'text-green-400' : 'text-red-400'
                            )}>
                              {tx.type === 'deposit' || tx.type === 'game_win' ? '+' : '-'}{tx.amount} GOR
                            </div>
                          </div>
                          
                          <div className="col-span-2">
                            <div className={cn(
                              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                              tx.status === 'completed' ? 'bg-green-400/20 text-green-400' :
                              tx.status === 'pending' ? 'bg-yellow-400/20 text-yellow-400' :
                              'bg-red-400/20 text-red-400'
                            )}>
                              {tx.status}
                            </div>
                          </div>
                          
                          <div className="col-span-3 text-gray-400 text-sm">
                            {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString()}
                          </div>
                          
                          <div className="col-span-3">
                            {tx.txHash ? (
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-xs text-gray-400 truncate">
                                  {tx.txHash.slice(0, 8)}...{tx.txHash.slice(-6)}
                                </span>
                                <button
                                  onClick={() => copyToClipboard(tx.txHash!)}
                                  className="text-gray-400 hover:text-white transition-colors"
                                >
                                  <Copy className="h-3 w-3" />
                                </button>
                                <button className="text-gray-400 hover:text-white transition-colors">
                                  <ExternalLink className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">-</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </StaggeredItem>
          )}

          {activeTab === 'settings' && (
            <StaggeredItem>
              <div className="space-y-6">
                {/* Profile Settings */}
                <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          <Save className="h-4 w-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Username
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.username}
                          onChange={(e) => setEditedProfile({...editedProfile, username: e.target.value})}
                          className="w-full px-3 py-2 bg-surface-secondary border border-surface-tertiary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-surface-secondary rounded-lg text-white">
                          {profile.username}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Country
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedProfile.country || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, country: e.target.value})}
                          className="w-full px-3 py-2 bg-surface-secondary border border-surface-tertiary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-surface-secondary rounded-lg text-white">
                          {profile.country || 'Not specified'}
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editedProfile.bio || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 bg-surface-secondary border border-surface-tertiary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        />
                      ) : (
                        <div className="px-3 py-2 bg-surface-secondary rounded-lg text-white min-h-[76px]">
                          {profile.bio || 'No bio provided'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Privacy Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Show Wallet Address</div>
                        <div className="text-sm text-gray-400">Display your wallet address publicly</div>
                      </div>
                      <button
                        onClick={() => setShowPrivateInfo(!showPrivateInfo)}
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                          showPrivateInfo ? 'bg-primary-500' : 'bg-gray-600'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            showPrivateInfo ? 'translate-x-6' : 'translate-x-1'
                          )}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Show Online Status</div>
                        <div className="text-sm text-gray-400">Let others see when you're online</div>
                      </div>
                      <button
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                          profile.isOnline ? 'bg-primary-500' : 'bg-gray-600'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                            profile.isOnline ? 'translate-x-6' : 'translate-x-1'
                          )}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Show Game History</div>
                        <div className="text-sm text-gray-400">Allow others to view your game history</div>
                      </div>
                      <button
                        className={cn(
                          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-primary-500'
                        )}
                      >
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Notification Preferences</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Game Invitations</div>
                        <div className="text-sm text-gray-400">Receive notifications for game invites</div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-primary-500">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Tournament Updates</div>
                        <div className="text-sm text-gray-400">Get notified about tournaments</div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-primary-500">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Achievement Unlocks</div>
                        <div className="text-sm text-gray-400">Celebrate when you unlock achievements</div>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-primary-500">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-surface-primary rounded-lg border border-red-500/50 p-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-6">Danger Zone</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div>
                        <div className="text-white font-medium">Delete Account</div>
                        <div className="text-sm text-gray-400">Permanently delete your account and all data</div>
                      </div>
                      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </StaggeredItem>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}