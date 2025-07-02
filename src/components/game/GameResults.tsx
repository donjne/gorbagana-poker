'use client';

import { useState, useEffect, JSX } from 'react';
import { 
  Trophy, 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  Share2, 
  RotateCcw,
  Home,
  Eye
} from 'lucide-react';

import { formatGOR, formatCard, copyToClipboard } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
import { cn } from '@/lib/utils';

import type { Game, Player } from '@/types';

interface GameResultsProps {
  game: Game;
  winner: Player;
  currentUserId?: string;
  onNewGame?: () => void;
  onBackToDashboard?: () => void;
  onShowReplay?: () => void;
  className?: string;
}

export function GameResults({
  game,
  winner,
  currentUserId,
  onNewGame,
  onBackToDashboard,
  onShowReplay,
  className
}: GameResultsProps): JSX.Element {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  const isWinner = winner.userId === currentUserId;
  const currentPlayer = game.players.find(p => p.userId === currentUserId);

  useEffect(() => {
    // Trigger confetti for winner
    if (isWinner) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isWinner]);

  // Animation sequence
  useEffect(() => {
    const sequence = [
      () => setAnimationPhase(1), // Show winner
      () => setAnimationPhase(2), // Show pot
      () => setAnimationPhase(3), // Show final results
    ];

    sequence.forEach((fn, index) => {
      setTimeout(fn, index * 1000);
    });
  }, []);

  const handleShare = async (): Promise<void> => {
    const shareText = `Just ${isWinner ? 'won' : 'played'} ${formatGOR(game.pot)} GOR in Gorbagana Poker! ${isWinner ? '🏆' : '🎮'} #GorbaganaPoker`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Gorbagana Poker Result',
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copy
        const success = await copyToClipboard(shareText);
        if (success) {
          toast.success('Result copied to clipboard!');
        }
      }
    } else {
      const success = await copyToClipboard(shareText);
      if (success) {
        toast.success('Result copied to clipboard!');
      }
    }
  };

  const getFinalStats = () => {
    const totalPlayers = game.players.length;
    const userPosition = game.players
      .sort((a, b) => (b.chips + (b.id === winner.id ? game.pot : 0)) - (a.chips + (a.id === winner.id ? game.pot : 0)))
      .findIndex(p => p.userId === currentUserId) + 1;
    
    return {
      position: userPosition,
      totalPlayers,
      potWon: isWinner ? game.pot : 0,
      netGain: currentPlayer ? (currentPlayer.chips - game.ante) + (isWinner ? game.pot : 0) : 0,
    };
  };

  const stats = getFinalStats();

  return (
    <div className={cn(
      'fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4',
      className
    )}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#fbbf24', '#10b981', '#3b82f6', '#ef4444'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-lg w-full">
        {/* Main Result Card */}
        <div className={cn(
          'bg-surface-primary rounded-2xl border-2 p-8 text-center shadow-2xl transition-all duration-1000',
          isWinner 
            ? 'border-gor-400 shadow-glow-gold' 
            : 'border-surface-tertiary',
          animationPhase >= 1 && 'animate-slide-up'
        )}>
          {/* Winner Announcement */}
          <div className={cn(
            'mb-6 transition-all duration-1000',
            animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>
            <div className={cn(
              'w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl',
              isWinner 
                ? 'bg-gor-400 text-black animate-pulse' 
                : 'bg-surface-secondary text-gray-400'
            )}>
              {isWinner ? '🏆' : '🎮'}
            </div>
            
            <h1 className={cn(
              'text-3xl font-bold font-gaming mb-2',
              isWinner ? 'text-gor-400' : 'text-white'
            )}>
              {isWinner ? 'VICTORY!' : 'GAME OVER'}
            </h1>
            
            <p className="text-gray-400 text-lg">
              {isWinner 
                ? 'Congratulations! You won the pot!' 
                : `${winner.username} wins with ${winner.card ? formatCard(winner.card) : 'the best hand'}!`
              }
            </p>
          </div>

          {/* Pot Display */}
          <div className={cn(
            'mb-6 transition-all duration-1000 delay-500',
            animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>
            <div className="bg-surface-secondary rounded-xl p-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Coins className="h-8 w-8 text-gor-400" />
                <div>
                  <div className="text-sm text-gray-400">Total Pot</div>
                  <div className="text-3xl font-bold text-gor-400">
                    {formatGOR(game.pot)} GOR
                  </div>
                </div>
              </div>
              
              {isWinner && (
                <div className="text-success text-sm font-medium">
                  + Added to your balance
                </div>
              )}
            </div>
          </div>

          {/* Game Stats */}
          <div className={cn(
            'mb-6 transition-all duration-1000 delay-1000',
            animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-surface-secondary rounded-lg p-3">
                <div className="text-gray-400 mb-1">Your Position</div>
                <div className="text-white font-semibold">
                  #{stats.position} of {stats.totalPlayers}
                </div>
              </div>
              
              <div className="bg-surface-secondary rounded-lg p-3">
                <div className="text-gray-400 mb-1">Net Result</div>
                <div className={cn(
                  'font-semibold flex items-center justify-center space-x-1',
                  stats.netGain >= 0 ? 'text-success' : 'text-danger'
                )}>
                  {stats.netGain >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>
                    {stats.netGain >= 0 ? '+' : ''}{formatGOR(stats.netGain)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowStats(!showStats)}
              className="btn-secondary text-sm flex items-center space-x-2 mx-auto"
            >
              <Eye className="h-4 w-4" />
              <span>{showStats ? 'Hide' : 'Show'} Detailed Stats</span>
            </button>
          </div>

          {/* Detailed Stats */}
          {showStats && (
            <div className="mb-6 bg-surface-secondary rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3">Game Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Game Duration:</span>
                  <span className="text-white">
                    {game.endedAt && game.startedAt 
                      ? `${Math.round((new Date(game.endedAt).getTime() - new Date(game.startedAt).getTime()) / (1000 * 60))} minutes`
                      : 'Unknown'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Rounds:</span>
                  <span className="text-white">{game.currentRound}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Entry Fee:</span>
                  <span className="text-gor-400">{formatGOR(game.ante)} GOR</span>
                </div>
                {winner.card && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Winning Card:</span>
                    <span className="text-primary-400">{formatCard(winner.card)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {onNewGame && (
                <button
                  onClick={onNewGame}
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>New Game</span>
                </button>
              )}
              
              <button
                onClick={handleShare}
                className="btn-gor flex items-center justify-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>

            {onShowReplay && (
              <button
                onClick={onShowReplay}
                className="btn-secondary w-full flex items-center justify-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>View Replay</span>
              </button>
            )}

            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="btn-secondary w-full flex items-center justify-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}