'use client';

import { JSX, useState } from 'react';
import { X, Users, Coins, Clock, UserPlus } from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { isValidInviteCode, formatGOR } from '@/lib/utils';
import { LoadingButton } from '@/components/ui/LoadingSpinner';
import { toast } from '@/components/ui/Toaster';

import type { JoinGameRequest, Game, Player } from '@/types';

interface JoinGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameJoined: (game: Game) => void;
}

export function JoinGameModal({ isOpen, onClose, onGameJoined }: JoinGameModalProps): JSX.Element | null {
  const { user, balance, requireRegistration } = useWallet();
  const [inviteCode, setInviteCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [foundGame, setFoundGame] = useState<Game | null>(null);

  if (!isOpen) return null;

  const handleSearchGame = async (): Promise<void> => {
    if (!requireRegistration()) return;
    
    if (!isValidInviteCode(inviteCode)) {
      toast.error('Please enter a valid 6-character invite code');
      return;
    }

    setIsSearching(true);
    
    try {
      // TODO: Replace with actual API call
      const mockGame: Game = {
        id: Math.random().toString(36).substring(7),
        inviteCode: inviteCode.toUpperCase(),
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
            username: 'DegenPlayer',
            walletAddress: '1234567890',
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
        createdAt: new Date().toISOString(),
      };

      setFoundGame(mockGame);
      
    } catch (error) {
      console.error('Error searching for game:', error);
      toast.error('Game not found or no longer available');
      setFoundGame(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleJoinGame = async (): Promise<void> => {
    if (!foundGame || !user) return;
    
    if ((balance || 0) < foundGame.ante) {
      toast.error('Insufficient balance to join this game');
      return;
    }

    setIsJoining(true);
    
    try {
      const joinRequest: JoinGameRequest = {
        inviteCode: foundGame.inviteCode,
      };

      // TODO: Replace with actual API call
      const newPlayer: Player = {
        id: user.id,
        userId: user.id,
        username: user.username,
        walletAddress: user.walletAddress,
        position: foundGame.players.length,
        card: null,
        chips: foundGame.ante,
        currentBet: 0,
        isActive: true,
        isFolded: false,
        lastAction: null,
        timeRemaining: 0,
        isConnected: true,
      };

      const updatedGame: Game = {
        ...foundGame,
        players: [...foundGame.players, newPlayer],
      };

      toast.gameSuccess('Successfully joined the game!');
      onGameJoined(updatedGame);
      onClose();
      
    } catch (error) {
      console.error('Error joining game:', error);
      toast.error('Failed to join game');
    } finally {
      setIsJoining(false);
    }
  };

  const handleInviteCodeChange = (value: string): void => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setInviteCode(cleaned);
    
    // Reset found game when code changes
    if (foundGame) {
      setFoundGame(null);
    }
  };

  const canAffordGame = foundGame ? (balance || 0) >= foundGame.ante : true;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bg-surface-primary rounded-xl max-w-md w-full mx-4 shadow-card" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-surface-tertiary">
          <h2 className="text-xl font-bold text-white font-gaming">Join Game</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-secondary rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Invite Code Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Enter Invite Code
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => handleInviteCodeChange(e.target.value)}
                placeholder="ABC123"
                className="input-primary flex-1 text-center font-mono text-lg tracking-wider uppercase"
                maxLength={6}
              />
              <LoadingButton
                loading={isSearching}
                onClick={handleSearchGame}
                className="btn-secondary px-4"
                disabled={!isValidInviteCode(inviteCode)}
              >
                Search
              </LoadingButton>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Enter the 6-character invite code shared by the game creator
            </p>
          </div>

          {/* Game Found */}
          {foundGame && (
            <div className="bg-surface-secondary rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Game Found!
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  foundGame.status === 'waiting' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                }`}>
                  {foundGame.status === 'waiting' ? 'Waiting for Players' : 'In Progress'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">
                    {foundGame.players.length}/{foundGame.maxPlayers} players
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Coins className="h-4 w-4 text-gor-400" />
                  <span className="text-gray-300">
                    {formatGOR(foundGame.ante)} GOR ante
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">
                    Created {new Date(foundGame.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <UserPlus className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">
                    {foundGame.maxPlayers - foundGame.players.length} spots left
                  </span>
                </div>
              </div>

              {/* Players List */}
              <div>
                <div className="text-sm font-medium text-gray-300 mb-2">Current Players:</div>
                <div className="space-y-1">
                  {foundGame.players.map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">
                        {index + 1}. {player.username}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        player.isConnected ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                      }`}>
                        {player.isConnected ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-surface-primary rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Required ante:</span>
                  <span className="text-sm font-medium text-gor-400">
                    {formatGOR(foundGame.ante)} GOR
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-surface-tertiary pt-2">
                  <span className="text-sm font-medium text-white">Your balance:</span>
                  <span className={`text-sm font-medium ${canAffordGame ? 'text-success' : 'text-danger'}`}>
                    {formatGOR(balance || 0)} GOR
                  </span>
                </div>
              </div>

              {!canAffordGame && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
                  <p className="text-danger text-sm">
                    Insufficient balance. You need {formatGOR(foundGame.ante - (balance || 0))} more GOR.
                  </p>
                </div>
              )}

              {foundGame.players.length >= foundGame.maxPlayers && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                  <p className="text-warning text-sm">
                    This game is full. Try finding another game or create your own.
                  </p>
                </div>
              )}

              <LoadingButton
                loading={isJoining}
                onClick={handleJoinGame}
                className="btn-primary w-full"
                disabled={
                  !canAffordGame || 
                  foundGame.players.length >= foundGame.maxPlayers ||
                  foundGame.status !== 'waiting'
                }
              >
                {foundGame.players.length >= foundGame.maxPlayers 
                  ? 'Game Full' 
                  : foundGame.status !== 'waiting'
                  ? 'Game Already Started'
                  : 'Join Game'
                }
              </LoadingButton>
            </div>
          )}

          {/* Help Text */}
          {!foundGame && (
            <div className="bg-surface-secondary rounded-lg p-4">
              <h4 className="text-sm font-medium text-white mb-2">How to Join a Game</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Get an invite code from a friend who created a game</li>
                <li>• Enter the 6-character code above</li>
                <li>• Make sure you have enough GOR for the ante</li>
                <li>• Join the game and wait for other players</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}