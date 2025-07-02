'use client';

import { useEffect, JSX } from 'react';
import { useRouter } from 'next/navigation';

import { useGameStore } from '@/stores/gameStore';
import { useWallet } from '@/hooks/useWallet';
import { CardDealing } from '@/components/game/CardDealing';
import { GameResults } from '@/components/game/GameResults';
import { toast } from '@/components/ui/Toaster';

interface GameFlowProps {
  gameId: string;
}

export function GameFlow({ gameId }: GameFlowProps): JSX.Element {
  const router = useRouter();
  const { user, updateBalance } = useWallet();
  
  const {
    currentGame,
    winner,
    showResults,
    dealingCards,
    revealingCards,
    dealCards,
    resetGame,
    leaveGame,
  } = useGameStore();

  // Auto-start dealing when game is ready
  useEffect(() => {
    if (currentGame?.status === 'waiting' && currentGame.players.length >= 2) {
      // Auto-start after a delay (in real implementation, this would be triggered by backend)
      const timer = setTimeout(() => {
        dealCards();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentGame?.status, currentGame?.players.length, dealCards]);

  // Handle game completion effects
  useEffect(() => {
    if (showResults && winner && currentGame) {
      // Update user balance if they won
      if (winner.userId === user?.id) {
        updateBalance(currentGame.pot);
        toast.gameSuccess(`You won ${currentGame.pot} GOR!`);
      } else {
        toast.playerAction(winner.username, `won ${currentGame.pot} GOR!`);
      }
    }
  }, [showResults, winner, currentGame, user?.id, updateBalance]);

  const handleNewGame = (): void => {
    resetGame();
    // TODO: Create new game or return to lobby
    toast.success('Starting new game...');
  };

  const handleBackToDashboard = (): void => {
    leaveGame();
    router.push('/dashboard');
  };

  const handleShowReplay = (): void => {
    // TODO: Implement game replay functionality
    toast.success('Replay feature coming soon!');
  };

  return (
    <>
      {/* Card Dealing Animation */}
      {dealingCards && currentGame && (
        <CardDealing
          isDealing={dealingCards}
          players={currentGame.players}
          onComplete={() => {
            toast.success('Cards dealt! Game begins!');
          }}
        />
      )}

      {/* Card Revealing Animation */}
      {revealingCards && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-24 h-32 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg border-2 border-primary-400 mx-auto flex items-center justify-center animate-card-flip mb-6">
              <div className="text-white font-bold text-lg">🃏</div>
            </div>
            <h3 className="text-2xl font-bold text-white font-gaming mb-2">
              Showdown!
            </h3>
            <p className="text-gray-400">
              Revealing cards and determining winner...
            </p>
          </div>
        </div>
      )}

      {/* Game Results */}
      {showResults && winner && currentGame && (
        <GameResults
          game={currentGame}
          winner={winner}
          currentUserId={user?.id}
          onNewGame={handleNewGame}
          onBackToDashboard={handleBackToDashboard}
          onShowReplay={handleShowReplay}
        />
      )}
    </>
  );
}