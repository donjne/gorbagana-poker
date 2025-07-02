'use client';

import { useParams, useRouter } from 'next/navigation';
import { JSX, useEffect, useState } from 'react';
import { StaggeredItem } from '@/components/ui/PageTransitions';
import { LoadingScreen } from '@/components/ui/EnhancedLoading';


// Define Game type inline for now
interface Game {
  id: string;
  status: string;
  // Add other game properties as needed
}

export default function GamePage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const gameId = params?.gameId as string;
  
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) {
      setError('Invalid game ID');
      setLoading(false);
      return;
    }

    // TODO: Fetch game data from API
    // For now, simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
      // TODO: Replace with actual game data
      // setGame(fetchedGameData);
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameId]);

  const handleLeaveGame = (): void => {
    if (confirm('Are you sure you want to leave this game?')) {
      // TODO: Implement proper leave game logic
      router.push('/dashboard');
    }
  };

  // Loading State
  if (loading) {
    return (
      <LoadingScreen
        variant="game"
        message="Loading game..."
        submessage="Connecting to game room and syncing state"
      />
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <StaggeredItem>
          <div className="text-center max-w-md mx-auto px-6">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4 font-gaming">
              Game Not Found
            </h1>
            
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              {error}. The game may have ended, been cancelled, or the link might be invalid.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Back to Dashboard
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-surface-secondary hover:bg-surface-tertiary text-gray-300 hover:text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </StaggeredItem>
      </div>
    );
  }

  // Main Game View
  return (
    <div className="min-h-screen bg-background-primary">
      <StaggeredItem>
        <div className="game-board p-4">
          <div className="max-w-6xl mx-auto">
            {/* Game Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">
                Game {gameId}
              </h1>
              <button
                onClick={handleLeaveGame}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Leave Game
              </button>
            </div>

            {/* Game Content Placeholder */}
            <div className="bg-surface-primary rounded-lg p-8 text-center">
              <h2 className="text-xl text-white mb-4">Game Board</h2>
              <p className="text-gray-400">
                Game components will be implemented in future phases
              </p>
              {game && (
                <div className="mt-4 text-sm text-gray-500">
                  Game ID: {game.id} | Status: {game.status}
                </div>
              )}
            </div>
          </div>
        </div>
      </StaggeredItem>
    </div>
  );
}