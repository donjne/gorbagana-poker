'use client';

import { JSX, useState } from 'react';
import { Plus, Users, HelpCircle } from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { UserRegistration } from '@/components/wallet/UserRegistration';
import { UserStats } from '@/components/dashboard/UserStats';
import { CreateGameModal } from '@/components/dashboard/CreateGameModal';
import { JoinGameModal } from '@/components/dashboard/JoinGameModal';
import { GameLobby } from '@/components/dashboard/GameLobby';
import { HowToPlayModal } from '@/components/dashboard/HowToPlayModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

import type { User, Game } from '@/types';

export function DashboardContent(): JSX.Element {
  const { isConnected, isRegistered, user, isConnecting } = useWallet();
  const [showRegistration, setShowRegistration] = useState(false);
  const [showCreateGame, setShowCreateGame] = useState(false);
  const [showJoinGame, setShowJoinGame] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Handle successful registration
  const handleRegistrationComplete = (newUser: User): void => {
    setShowRegistration(false);
    // User state is automatically updated through the hook
  };

  // Handle game creation
  const handleGameCreated = (game: Game): void => {
    // TODO: Navigate to game page
    console.log('Game created:', game);
  };

  // Handle game join
  const handleGameJoined = (game: Game): void => {
    // TODO: Navigate to game page
    console.log('Joined game:', game);
  };

  // Handle game spectate
  const handleGameSpectate = (game: Game): void => {
    // TODO: Navigate to game page in spectator mode
    console.log('Spectating game:', game);
  };

  // Show loading state while connecting
  if (isConnecting) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-main">
          <div className="text-center">
            <LoadingSpinner size="large" />
            <p className="text-white text-lg mt-4">Connecting wallet...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show wallet connection prompt
  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white font-gaming mb-4">
            GORBAGANA POKER
          </h1>
          <p className="text-xl text-gor-400 mb-8">
            Two-Card Indian Poker on Gorbagana Testnet
          </p>
          <div className="card max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              Welcome to the Game
            </h2>
            <p className="text-gray-400 mb-6">
              Connect your Backpack wallet to start playing poker with $GOR tokens
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setShowHowToPlay(true)}
                className="btn-secondary w-full flex items-center justify-center space-x-2"
              >
                <HelpCircle className="h-4 w-4" />
                <span>How to Play</span>
              </button>
              <p className="text-sm text-gray-500">
                New to Gorbagana? Get test tokens from the{' '}
                <a 
                  href="https://faucet.gorbagana.wtf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gor-400 hover:text-gor-300 underline"
                >
                  faucet
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show registration flow
  if (!isRegistered || showRegistration) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white font-gaming mb-4">
            GORBAGANA POKER
          </h1>
          <p className="text-xl text-gor-400">
            Two-Card Indian Poker on Gorbagana Testnet
          </p>
        </div>
        
        <UserRegistration 
          onRegistrationComplete={handleRegistrationComplete}
          onSkip={() => setShowRegistration(false)}
        />
      </div>
    );
  }

  // Show main dashboard for registered users
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-gaming mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-400">
            Ready for some psychological warfare?
          </p>
        </div>
        <button
          onClick={() => setShowHowToPlay(true)}
          className="btn-secondary flex items-center space-x-2"
        >
          <HelpCircle className="h-4 w-4" />
          <span>How to Play</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - User Stats */}
        <div className="lg:col-span-1">
          <UserStats />
        </div>

        {/* Right Column - Game Actions & Lobby */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card card-hover">
                <div className="text-center p-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500 rounded-full mb-3">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Create Game</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Start a new game and invite friends
                  </p>
                  <button 
                    onClick={() => setShowCreateGame(true)}
                    className="btn-primary w-full"
                  >
                    Create New Game
                  </button>
                </div>
              </div>
              
              <div className="card card-hover">
                <div className="text-center p-2">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gor-500 rounded-full mb-3">
                    <Users className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Join Game</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Enter a code to join existing game
                  </p>
                  <button 
                    onClick={() => setShowJoinGame(true)}
                    className="btn-gor w-full"
                  >
                    Join with Code
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Game Lobby */}
          <GameLobby 
            onJoinGame={handleGameJoined}
            onSpectateGame={handleGameSpectate}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateGameModal
        isOpen={showCreateGame}
        onClose={() => setShowCreateGame(false)}
        onGameCreated={handleGameCreated}
      />

      <JoinGameModal
        isOpen={showJoinGame}
        onClose={() => setShowJoinGame(false)}
        onGameJoined={handleGameJoined}
      />

      <HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </div>
  );
}