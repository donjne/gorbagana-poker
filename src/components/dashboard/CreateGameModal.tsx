'use client';

import { JSX, useState } from 'react';
import { X, Users, Coins, Copy, ExternalLink, Gamepad2 } from 'lucide-react';

import { useWallet } from '@/hooks/useWallet';
import { generateInviteCode, formatGOR, copyToClipboard } from '@/lib/utils';
import { LoadingButton } from '@/components/ui/LoadingSpinner';
import { toast } from '@/components/ui/Toaster';
import { GAME_CONFIG } from '@/types';

import type { CreateGameRequest, Game } from '@/types';

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameCreated: (game: Game) => void;
}

export function CreateGameModal({ isOpen, onClose, onGameCreated }: CreateGameModalProps): JSX.Element | null {
  const { user, balance, requireRegistration } = useWallet();
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [ante, setAnte] = useState(50);
  const [isCreating, setIsCreating] = useState(false);
  const [createdGame, setCreatedGame] = useState<Game | null>(null);

  if (!isOpen) return null;

  // Calculate total cost (ante + small fee)
  const totalCost = ante;
  const canAfford = (balance || 0) >= totalCost;

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!requireRegistration()) return;
    
    if (!canAfford) {
      toast.error('Insufficient balance to create this game');
      return;
    }

    setIsCreating(true);
    
    try {
      const gameRequest: CreateGameRequest = {
        maxPlayers,
        ante,
      };

      // TODO: Replace with actual API call
      const newGame: Game = {
        id: Math.random().toString(36).substring(7),
        inviteCode: generateInviteCode(),
        status: 'waiting',
        currentRound: 0,
        maxPlayers,
        ante,
        pot: 0,
        currentBet: 0,
        currentPlayerIndex: 0,
        players: [
          {
            id: user!.id,
            userId: user!.id,
            username: user!.username,
            walletAddress: user!.walletAddress,
            position: 0,
            card: null,
            chips: ante,
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

      setCreatedGame(newGame);
      toast.gameSuccess('Game created successfully!');
      
      // Auto-copy invite code
      const success = await copyToClipboard(newGame.inviteCode);
      if (success) {
        toast.success('Invite code copied to clipboard');
      }
      
    } catch (error) {
      console.error('Error creating game:', error);
      toast.error('Failed to create game');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyInviteCode = async (): Promise<void> => {
    if (!createdGame) return;
    
    const success = await copyToClipboard(createdGame.inviteCode);
    if (success) {
      toast.success('Invite code copied!');
    } else {
      toast.error('Failed to copy invite code');
    }
  };

  const handleJoinGame = (): void => {
    if (createdGame) {
      onGameCreated(createdGame);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bg-surface-primary rounded-xl max-w-md w-full mx-4 shadow-card" onClick={(e) => e.stopPropagation()}>
        {!createdGame ? (
          // Game Creation Form
          <>
            <div className="flex items-center justify-between p-6 border-b border-surface-tertiary">
              <h2 className="text-xl font-bold text-white font-gaming">Create New Game</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-surface-secondary rounded transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Max Players */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  <Users className="inline h-4 w-4 mr-2" />
                  Maximum Players
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 5 }, (_, i) => i + 2).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setMaxPlayers(num)}
                      className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                        maxPlayers === num
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-surface-tertiary bg-surface-secondary text-gray-300 hover:border-primary-400'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: 3-4 players for best experience
                </p>
              </div>

              {/* Ante Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  <Coins className="inline h-4 w-4 mr-2" />
                  Ante Amount (GOR)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={ante}
                    onChange={(e) => setAnte(Number(e.target.value))}
                    min={GAME_CONFIG.minAnte}
                    max={GAME_CONFIG.maxAnte}
                    step="10"
                    className="input-primary w-full pr-12"
                    placeholder="Enter ante amount"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gor-400 text-sm font-medium">
                    GOR
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Min: {GAME_CONFIG.minAnte} GOR</span>
                  <span>Max: {GAME_CONFIG.maxAnte} GOR</span>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-surface-secondary rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Your ante:</span>
                  <span className="text-sm font-medium text-gor-400">
                    {formatGOR(ante)} GOR
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-surface-tertiary pt-2">
                  <span className="text-sm font-medium text-white">Your balance:</span>
                  <span className={`text-sm font-medium ${canAfford ? 'text-success' : 'text-danger'}`}>
                    {formatGOR(balance || 0)} GOR
                  </span>
                </div>
              </div>

              {!canAfford && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-3">
                  <p className="text-danger text-sm">
                    Insufficient balance. You need {formatGOR(totalCost - (balance || 0))} more GOR.
                  </p>
                </div>
              )}

              <LoadingButton
                loading={isCreating}
                className="btn-primary w-full"
                disabled={!canAfford}
              >
                Create Game
              </LoadingButton>
            </form>
          </>
        ) : (
          // Game Created Success
          <>
            <div className="flex items-center justify-between p-6 border-b border-surface-tertiary">
              <h2 className="text-xl font-bold text-white font-gaming">Game Created!</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-surface-secondary rounded transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success rounded-full mb-4">
                <Gamepad2 className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">
                Game #{createdGame.id.slice(0, 8).toUpperCase()}
              </h3>
              
              <p className="text-gray-400 mb-6">
                Share this invite code with your friends to start playing
              </p>

              <div className="bg-surface-secondary rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-400 mb-2">Invite Code</div>
                <div className="text-2xl font-bold text-gor-400 font-mono tracking-wider mb-3">
                  {createdGame.inviteCode}
                </div>
                <button
                  onClick={handleCopyInviteCode}
                  className="btn-secondary flex items-center justify-center space-x-2 w-full"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Code</span>
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleJoinGame}
                  className="btn-primary w-full"
                >
                  Enter Game Lobby
                </button>
                
                <button
                  onClick={onClose}
                  className="btn-secondary w-full"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}