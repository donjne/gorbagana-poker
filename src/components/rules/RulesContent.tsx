// src/components/rules/RulesContent.tsx
'use client';

import { JSX, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen,
  PlayCircle,
  Users,
  Clock,
  Coins,
  Eye,
  EyeOff,
  Target,
  Trophy,
  Zap,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Gamepad2,
  Layers,
  Timer,
  DollarSign,
  Shuffle,
  Star,
  Award,
  TrendingUp
} from 'lucide-react';

import { StaggeredItem, FadeScale } from '@/components/ui/PageTransitions';
import { cn } from '@/lib/utils';

// Types for rules content
interface RuleSection {
  id: string;
  title: string;
  icon: any;
  content: string;
  expanded?: boolean;
}

interface GameExample {
  id: string;
  title: string;
  scenario: string;
  playerCards: { player: string; card: string; hidden?: boolean }[];
  pot: number;
  currentBet: number;
  action: string;
  explanation: string;
}

interface TipCard {
  id: string;
  type: 'tip' | 'warning' | 'strategy';
  title: string;
  content: string;
  icon: any;
}

// Mock data for rules content
const gameRules: RuleSection[] = [
  {
    id: 'overview',
    title: 'Game Overview',
    icon: BookOpen,
    content: `Two-Card Indian Poker is a thrilling variant where each player receives two cards but can only see one! You'll see one card face-up on your forehead (visible to everyone except you) and hold one card face-down that only you can see. The goal is to make the best poker hand possible with both cards while reading your opponents and managing your bets strategically.`
  },
  {
    id: 'setup',
    title: 'Game Setup',
    icon: Users,
    content: `Games support 2-6 players. Each player antes up the minimum bet to join the pot. Cards are dealt from a standard 52-card deck. One card goes face-up on your forehead (the "Indian" card that everyone can see except you), and one card is dealt face-down to your hand (that only you can see).`
  },
  {
    id: 'betting',
    title: 'Betting Rounds',
    icon: Coins,
    content: `There are two betting rounds. After receiving cards, players bet based on their hidden card and what they can see of opponents' visible cards. Players can Check, Bet, Call, Raise, or Fold. The betting continues until all active players have matched the highest bet or folded.`
  },
  {
    id: 'showdown',
    title: 'Showdown & Winning',
    icon: Trophy,
    content: `After the final betting round, remaining players reveal their hidden cards. The best two-card poker hand wins the pot. Hand rankings follow standard poker rules: Pair > High Card. In case of ties, the highest kicker card determines the winner.`
  },
  {
    id: 'speed',
    title: 'Gorbagana Speed',
    icon: Zap,
    content: `Games on Gorbagana are lightning-fast! Each player has 30 seconds to make their betting decision. If time runs out, your hand automatically folds. This keeps games exciting and prevents slow play. The entire game typically completes in under 5 minutes!`
  }
];

const gameExamples: GameExample[] = [
  {
    id: 'example1',
    title: 'Basic Betting Example',
    scenario: 'You have a King in your hand, and you can see opponents have a 7, Jack, and Queen showing.',
    playerCards: [
      { player: 'You', card: 'K♠', hidden: true },
      { player: 'Player 2', card: '7♣' },
      { player: 'Player 3', card: 'J♦' },
      { player: 'Player 4', card: 'Q♥' }
    ],
    pot: 120,
    currentBet: 25,
    action: 'Recommended: CALL or RAISE',
    explanation: 'With a King in hand, you have a strong high card. Most opponents would need to pair their visible card to beat you, which is unlikely. This is a good spot to bet for value.'
  },
  {
    id: 'example2',
    title: 'Difficult Decision',
    scenario: 'You have a 6 in your hand, and opponents show Ace, King, and 10.',
    playerCards: [
      { player: 'You', card: '6♣', hidden: true },
      { player: 'Player 2', card: 'A♠' },
      { player: 'Player 3', card: 'K♦' },
      { player: 'Player 4', card: '10♥' }
    ],
    pot: 200,
    currentBet: 50,
    action: 'Recommended: FOLD',
    explanation: 'With only a 6 high, you need opponents to have very low hidden cards to win. Given the strong visible cards, folding is the prudent choice to minimize losses.'
  },
  {
    id: 'example3',
    title: 'Bluffing Opportunity',
    scenario: 'You have a 9 in your hand, opponents show 3, 5, and 8. Heavy betting is happening.',
    playerCards: [
      { player: 'You', card: '9♠', hidden: true },
      { player: 'Player 2', card: '3♣' },
      { player: 'Player 3', card: '5♦' },
      { player: 'Player 4', card: '8♥' }
    ],
    pot: 300,
    currentBet: 75,
    action: 'Recommended: CALL or RAISE',
    explanation: 'With a 9 high and opponents showing low cards, you likely have the best hand. The heavy betting might be bluffs since their visible cards are weak. Consider raising for value.'
  }
];

const tipCards: TipCard[] = [
  {
    id: 'tip1',
    type: 'tip',
    title: 'Read the Table',
    content: 'Always observe what cards opponents have showing. This gives you crucial information about the strength of their possible hands.',
    icon: Eye
  },
  {
    id: 'tip2',
    type: 'strategy',
    title: 'Position Matters',
    content: 'Acting later in the betting round gives you more information. Use this advantage to make better decisions.',
    icon: Target
  },
  {
    id: 'tip3',
    type: 'warning',
    title: 'Time Management',
    content: 'With only 30 seconds per decision, practice quick decision-making. Don\'t let the timer force you into bad choices.',
    icon: Timer
  },
  {
    id: 'tip4',
    type: 'tip',
    title: 'Bankroll Management',
    content: 'Only play with money you can afford to lose. Start with smaller stakes until you master the game mechanics.',
    icon: DollarSign
  },
  {
    id: 'tip5',
    type: 'strategy',
    title: 'Bluffing Basics',
    content: 'Bluff when opponents show weak cards but you suspect they have strong hidden cards. Mix up your play to be unpredictable.',
    icon: Shuffle
  }
];

export function RulesContent(): JSX.Element {
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);
  const [activeExample, setActiveExample] = useState<string>('example1');
  const [showQuickStart, setShowQuickStart] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getTipIcon = (type: string) => {
    switch (type) {
      case 'tip': return Lightbulb;
      case 'warning': return AlertTriangle;
      case 'strategy': return Target;
      default: return HelpCircle;
    }
  };

  const getTipColor = (type: string) => {
    switch (type) {
      case 'tip': return 'border-blue-500/50 bg-blue-500/10';
      case 'warning': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'strategy': return 'border-green-500/50 bg-green-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const getTipIconColor = (type: string) => {
    switch (type) {
      case 'tip': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'strategy': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <StaggeredItem>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-primary-500/20 rounded-full">
              <Layers className="h-8 w-8 text-primary-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white font-gaming">
              How to Play
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Master the art of Two-Card Indian Poker on Gorbagana's lightning-fast platform
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setShowQuickStart(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <PlayCircle className="h-5 w-5" />
              <span>Quick Start Guide</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 bg-surface-secondary hover:bg-surface-tertiary text-white rounded-lg transition-colors">
              <Gamepad2 className="h-5 w-5" />
              <span>Practice Game</span>
            </button>
          </div>
        </div>
      </StaggeredItem>

      {/* Quick Stats */}
      <StaggeredItem>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-4 text-center">
            <Users className="h-6 w-6 text-primary-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">2-6</div>
            <div className="text-xs text-gray-400">Players</div>
          </div>
          <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-4 text-center">
            <Clock className="h-6 w-6 text-gor-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">30s</div>
            <div className="text-xs text-gray-400">Per Decision</div>
          </div>
          <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-4 text-center">
            <Timer className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">5min</div>
            <div className="text-xs text-gray-400">Game Duration</div>
          </div>
          <div className="bg-surface-primary rounded-lg border border-surface-tertiary p-4 text-center">
            <Star className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">Easy</div>
            <div className="text-xs text-gray-400">To Learn</div>
          </div>
        </div>
      </StaggeredItem>

      {/* Game Rules Sections */}
      <StaggeredItem>
        <div className="bg-surface-primary rounded-lg border border-surface-tertiary">
          <div className="p-6 border-b border-surface-tertiary">
            <h2 className="text-xl font-bold text-white font-gaming">Game Rules</h2>
            <p className="text-gray-400 text-sm mt-1">Everything you need to know to start playing</p>
          </div>

          <div className="divide-y divide-surface-tertiary">
            {gameRules.map((rule, index) => {
              const Icon = rule.icon;
              const isExpanded = expandedSections.includes(rule.id);

              return (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => toggleSection(rule.id)}
                    className="w-full p-6 text-left hover:bg-surface-secondary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary-500/20 rounded-lg">
                          <Icon className="h-5 w-5 text-primary-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{rule.title}</h3>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="ml-14 text-gray-300 leading-relaxed">
                            {rule.content}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </StaggeredItem>

      {/* Interactive Examples */}
      <StaggeredItem>
        <div className="bg-surface-primary rounded-lg border border-surface-tertiary">
          <div className="p-6 border-b border-surface-tertiary">
            <h2 className="text-xl font-bold text-white font-gaming">Interactive Examples</h2>
            <p className="text-gray-400 text-sm mt-1">Learn through realistic game scenarios</p>
          </div>

          {/* Example Tabs */}
          <div className="flex overflow-x-auto border-b border-surface-tertiary">
            {gameExamples.map((example) => (
              <button
                key={example.id}
                onClick={() => setActiveExample(example.id)}
                className={cn(
                  'px-6 py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap',
                  activeExample === example.id
                    ? 'text-primary-400 border-primary-400'
                    : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                )}
              >
                {example.title}
              </button>
            ))}
          </div>

          {/* Example Content */}
          <AnimatePresence mode="wait">
            {gameExamples.map((example) => (
              activeExample === example.id && (
                <motion.div
                  key={example.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Scenario */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Scenario</h3>
                        <p className="text-gray-300">{example.scenario}</p>
                      </div>

                      {/* Player Cards */}
                      <div>
                        <h4 className="text-md font-semibold text-white mb-3">Cards on Table</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {example.playerCards.map((playerCard, index) => (
                            <div
                              key={index}
                              className={cn(
                                'p-3 rounded-lg border',
                                playerCard.player === 'You'
                                  ? 'bg-primary-500/10 border-primary-500/50'
                                  : 'bg-surface-secondary border-surface-tertiary'
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-400">{playerCard.player}</span>
                                {playerCard.hidden ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                              <div className="text-2xl font-bold text-white font-mono mt-1">
                                {playerCard.hidden ? '🃏' : playerCard.card}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {playerCard.hidden ? 'Hidden (only you see)' : 'Visible to all'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pot Info */}
                      <div className="bg-surface-secondary rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-400">Current Pot</div>
                            <div className="text-lg font-bold text-gor-400">{example.pot} GOR</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Current Bet</div>
                            <div className="text-lg font-bold text-white">{example.currentBet} GOR</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analysis */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Recommended Action</h3>
                        <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <span className="font-semibold text-green-400">{example.action}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-semibold text-white mb-2">Analysis</h4>
                        <p className="text-gray-300 leading-relaxed">{example.explanation}</p>
                      </div>

                      {/* Action Buttons */}
                      <div>
                        <h4 className="text-md font-semibold text-white mb-3">Your Options</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm">
                            Check
                          </button>
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                            Call {example.currentBet}
                          </button>
                          <button className="px-4 py-2 bg-gor-500 hover:bg-gor-600 text-white rounded-lg transition-colors text-sm">
                            Raise
                          </button>
                          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm">
                            Fold
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>
      </StaggeredItem>

      {/* Tips & Strategies */}
      <StaggeredItem>
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white font-gaming mb-2">Tips & Strategies</h2>
            <p className="text-gray-400">Pro tips to improve your gameplay</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tipCards.map((tip, index) => {
              const Icon = getTipIcon(tip.type);
              
              return (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'p-4 rounded-lg border',
                    getTipColor(tip.type)
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <div className={cn('flex-shrink-0 mt-0.5', getTipIconColor(tip.type))}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{tip.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{tip.content}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </StaggeredItem>

      {/* Quick Start Modal */}
      <AnimatePresence>
        {showQuickStart && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuickStart(false)}
          >
            <motion.div
              className="bg-surface-primary rounded-lg border border-surface-tertiary max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-surface-tertiary">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white font-gaming">Quick Start Guide</h2>
                  <button
                    onClick={() => setShowQuickStart(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Join a Game</h3>
                        <p className="text-gray-400 text-sm">Find a table with your preferred stakes</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Receive Cards</h3>
                        <p className="text-gray-400 text-sm">One visible to others, one hidden to you</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Make Decisions</h3>
                        <p className="text-gray-400 text-sm">Bet based on your hand and opponents' cards</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        4
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Act Quickly</h3>
                        <p className="text-gray-400 text-sm">You have 30 seconds per decision</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        5
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Showdown</h3>
                        <p className="text-gray-400 text-sm">Reveal cards and see who wins the pot</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gor-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        ⚡
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Lightning Fast</h3>
                        <p className="text-gray-400 text-sm">Games finish in under 5 minutes!</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <button
                    onClick={() => setShowQuickStart(false)}
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                  >
                    Got It, Let's Play!
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ready to Play Section */}
      <StaggeredItem>
        <div className="bg-gradient-to-r from-primary-500/20 to-gor-400/20 rounded-lg border border-primary-500/50 p-8 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Award className="h-8 w-8 text-gor-400" />
              <h2 className="text-2xl font-bold text-white font-gaming">Ready to Play?</h2>
            </div>
            <p className="text-gray-300 max-w-md mx-auto">
              Now that you understand the rules, join a game and experience Gorbagana's lightning-fast poker action!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
                <PlayCircle className="h-5 w-5" />
                <span>Play Now</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 bg-surface-secondary hover:bg-surface-tertiary text-white rounded-lg transition-colors">
                <TrendingUp className="h-5 w-5" />
                <span>View Leaderboard</span>
              </button>
            </div>
          </div>
        </div>
      </StaggeredItem>
    </div>
  );
}