'use client';

import { useParams, useRouter } from 'next/navigation';
import { JSX, useEffect, useState } from 'react';
import { StaggeredItem } from '@/components/ui/PageTransitions';
import { LoadingScreen } from '@/components/ui/EnhancedLoading';
import { GameBoard } from '@/components/game/GameBoard';
import { MobileGameBoard } from '@/components/game/MobileGameBoard';
import { useResponsive } from '@/hooks/useResponsive';
import type { Game } from '@/types';

export default function GamePage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const gameId = params?.gameId as string;
  
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Responsive design - use mobile version on smaller screens
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    if (!gameId) {
      setError('Invalid game ID');
      setLoading(false);
      return;
    }

    // TODO: Fetch game data from API
    const fetchGameData = async (): Promise<void> => {
      try {
        setLoading(true);
        
        // Replace with actual API call
        // const response = await fetch(`/api/games/${gameId}`);
        // if (!response.ok) throw new Error('Game not found');
        // const gameData = await response.json();
        
        // For now, simulate loading and set mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock game data - replace with actual API response
        const mockGame: Game = {
          id: gameId,
          inviteCode: 'ABC123',
          status: 'waiting', // 'waiting', 'betting', 'showdown', 'ended'
          players: [],
          pot: 0,
          currentBet: 0,
          ante: 10,
          maxPlayers: 6,
          currentRound: 1,
          currentPlayerIndex: 0,
          deck: [],
          createdAt: new Date().toISOString(),
        };
        
        setGame(mockGame);
      } catch (err) {
        console.error('Failed to fetch game:', err);
        setError(err instanceof Error ? err.message : 'Failed to load game');
      } finally {
        setLoading(false);
      }
    };

    void fetchGameData();
  }, [gameId]);

  const handleLeaveGame = (): void => {
    if (confirm('Are you sure you want to leave this game?')) {
      // TODO: Implement proper leave game logic
      // await leaveGame(gameId);
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
                <svg 
                  className="w-10 h-10 text-red-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
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

  // Main Game View - Responsive
  return (
    <div className="min-h-screen bg-background-primary">
      <StaggeredItem>
        {/* Render appropriate GameBoard based on screen size */}
        {isMobile || isTablet ? (
          <MobileGameBoard
            gameId={gameId}
            game={game}
            className="game-board-mobile"
          />
        ) : (
          <GameBoard
            gameId={gameId}
            game={game}
            className="game-board-desktop"
          />
        )}

        {/* Development: Leave Game Button (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed top-4 right-4 z-50">
            <button
              onClick={handleLeaveGame}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Leave Game
            </button>
          </div>
        )}
      </StaggeredItem>
    </div>
  );
}