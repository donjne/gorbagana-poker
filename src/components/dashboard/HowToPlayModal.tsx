'use client';

import { JSX, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Eye, EyeOff, DollarSign, Clock, Users } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TutorialStep {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps): JSX.Element | null {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tutorialSteps: TutorialStep[] = [
    {
      title: 'Welcome to Two-Card Indian Poker',
      icon: <Users className="h-8 w-8 text-primary-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Two-Card Indian Poker is a game of pure psychology and bluffing. Unlike traditional poker, 
            you can see everyone else's cards but not your own!
          </p>
          <div className="bg-surface-secondary rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Game Overview:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• 2-6 players per game</li>
              <li>• Each player gets one card face-down</li>
              <li>• Hold your card against your forehead</li>
              <li>• You can see everyone else's cards</li>
              <li>• Highest card wins the pot</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: 'The Card Setup',
      icon: <Eye className="h-8 w-8 text-gor-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            At the start of each round, every player receives one card that they must hold against 
            their forehead without looking at it.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
              <Eye className="h-8 w-8 text-success mx-auto mb-2" />
              <h4 className="font-semibold text-white mb-1">What You See</h4>
              <p className="text-sm text-gray-300">All other players' cards</p>
            </div>
            <div className="bg-danger/10 border border-danger/20 rounded-lg p-4 text-center">
              <EyeOff className="h-8 w-8 text-danger mx-auto mb-2" />
              <h4 className="font-semibold text-white mb-1">What You Don't See</h4>
              <p className="text-sm text-gray-300">Your own card</p>
            </div>
          </div>
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <p className="text-warning text-sm">
              <strong>Important:</strong> Never look at your own card! The game interface will hide it from you automatically.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Betting Actions',
      icon: <DollarSign className="h-8 w-8 text-gor-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Based on what you see and how you read your opponents, you can take these actions:
          </p>
          <div className="space-y-3">
            <div className="bg-surface-secondary rounded-lg p-3">
              <h4 className="font-semibold text-info mb-1">CHECK</h4>
              <p className="text-sm text-gray-300">Pass the action without betting if no one has bet yet</p>
            </div>
            <div className="bg-surface-secondary rounded-lg p-3">
              <h4 className="font-semibold text-gor-400 mb-1">BET</h4>
              <p className="text-sm text-gray-300">Make the first bet in a round</p>
            </div>
            <div className="bg-surface-secondary rounded-lg p-3">
              <h4 className="font-semibold text-success mb-1">CALL</h4>
              <p className="text-sm text-gray-300">Match the current bet to stay in the game</p>
            </div>
            <div className="bg-surface-secondary rounded-lg p-3">
              <h4 className="font-semibold text-primary-400 mb-1">RAISE</h4>
              <p className="text-sm text-gray-300">Increase the current bet</p>
            </div>
            <div className="bg-surface-secondary rounded-lg p-3">
              <h4 className="font-semibold text-danger mb-1">FOLD</h4>
              <p className="text-sm text-gray-300">Give up your hand and forfeit any bets made</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Strategy & Psychology',
      icon: <Users className="h-8 w-8 text-primary-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Two-Card Indian Poker is all about reading your opponents and managing your own reactions.
          </p>
          <div className="space-y-3">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <h4 className="font-semibold text-success mb-2">Reading Opponents</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Watch their betting patterns</li>
                <li>• Notice their reactions to your card</li>
                <li>• Look for tells and behavioral changes</li>
                <li>• Consider what they can see around the table</li>
              </ul>
            </div>
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <h4 className="font-semibold text-warning mb-2">Managing Yourself</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Control your reactions to what you see</li>
                <li>• Don't give away information through betting</li>
                <li>• Bluff confidently when you see low cards</li>
                <li>• Stay calm when you see high cards around</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Winning & Payouts',
      icon: <DollarSign className="h-8 w-8 text-gor-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            The game ends when all betting is complete and cards are revealed.
          </p>
          <div className="bg-surface-secondary rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">How to Win:</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p>• The player with the <strong className="text-gor-400">highest card</strong> wins the entire pot</p>
              <p>• Card rankings: Ace (highest) → King → Queen → Jack → 10 → 9 → ... → 2 (lowest)</p>
              <p>• Suits don't matter - only the card rank</p>
              <p>• Winner receives all GOR tokens from the pot</p>
            </div>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h4 className="font-semibold text-primary-400 mb-2">Pro Tip:</h4>
            <p className="text-sm text-gray-300">
              Sometimes the best strategy is to fold early if you see many high cards around the table. 
              Preserve your tokens for better opportunities!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Gorbagana Features',
      icon: <Clock className="h-8 w-8 text-success" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Playing on the Gorbagana testnet gives you unique advantages:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <h4 className="font-semibold text-success mb-2">⚡ Lightning Fast</h4>
              <p className="text-sm text-gray-300">
                Instant transaction confirmations mean no waiting between betting actions
              </p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold text-primary-400 mb-2">🛡️ Zero MEV</h4>
              <p className="text-sm text-gray-300">
                No front-running or sandwich attacks - completely fair play
              </p>
            </div>
            <div className="bg-gor-400/10 border border-gor-400/20 rounded-lg p-4">
              <h4 className="font-semibold text-gor-400 mb-2">🪙 Native GOR</h4>
              <p className="text-sm text-gray-300">
                Play with native GOR tokens - no bridging or wrapping needed
              </p>
            </div>
            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <h4 className="font-semibold text-info mb-2">🎮 Web2 Speed</h4>
              <p className="text-sm text-gray-300">
                Feels like a traditional online game with blockchain benefits
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-3">
              Ready to start playing? Get some test GOR tokens from the faucet!
            </p>
            <a
              href="https://faucet.gorbagana.wtf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gor inline-flex items-center space-x-2"
            >
              <DollarSign className="h-4 w-4" />
              <span>Get Test Tokens</span>
            </a>
          </div>
        </div>
      ),
    },
  ];

  const nextStep = (): void => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number): void => {
    setCurrentStep(step);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="bg-surface-primary rounded-xl max-w-2xl w-full mx-4 shadow-card max-h-[90vh] overflow-hidden flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-tertiary">
          <div className="flex items-center space-x-3">
            {tutorialSteps[currentStep]?.icon}
            <h2 className="text-xl font-bold text-white font-gaming">
              {tutorialSteps[currentStep]?.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-secondary rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 border-b border-surface-tertiary">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {tutorialSteps.length}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-surface-tertiary rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tutorialSteps[currentStep]?.content}
        </div>

        {/* Navigation */}
        <div className="p-6 border-t border-surface-tertiary">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            {/* Step Indicators */}
            <div className="flex space-x-2">
              {tutorialSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep 
                      ? 'bg-primary-500' 
                      : index < currentStep 
                      ? 'bg-success' 
                      : 'bg-surface-tertiary hover:bg-surface-secondary'
                  }`}
                  title={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {currentStep === tutorialSteps.length - 1 ? (
              <button
                onClick={onClose}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Start Playing</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}