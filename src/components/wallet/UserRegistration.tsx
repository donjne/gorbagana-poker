'use client';

import { useState, useEffect, JSX } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { User, Check, AlertCircle } from 'lucide-react';

import { isValidUsername } from '@/lib/utils';
import { toast } from '@/components/ui/Toaster';
import { LoadingButton } from '@/components/ui/LoadingSpinner';

import type { User as UserType, RegisterUserRequest, RegisterUserResponse, ApiResponse } from '@/types';

interface UserRegistrationProps {
  onRegistrationComplete: (user: UserType) => void;
  onSkip?: () => void;
  className?: string;
}

export function UserRegistration({ 
  onRegistrationComplete, 
  onSkip,
  className 
}: UserRegistrationProps): JSX.Element {
  const { publicKey, connected } = useWallet();
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  // Validate username on change
  useEffect(() => {
    if (!username) {
      setUsernameError(null);
      return;
    }

    if (!isValidUsername(username)) {
      setUsernameError('Username must be 3-20 characters, letters, numbers, and underscores only');
      return;
    }

    setUsernameError(null);
  }, [username]);

  // Check if username is available (debounced)
  useEffect(() => {
    if (!username || usernameError) return;

    const timeoutId = setTimeout(async () => {
      setIsCheckingUsername(true);
      try {
        // TODO: Call API to check username availability
        // const response = await checkUsernameAvailability(username);
        // if (!response.available) {
        //   setUsernameError('Username is already taken');
        // }
      } catch (error) {
        console.error('Error checking username:', error);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username, usernameError]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!username || usernameError) {
      toast.error('Please enter a valid username');
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationData: RegisterUserRequest = {
        walletAddress: publicKey.toString(),
        username: username.trim(),
      };

      // TODO: Replace with actual API call
      const response = await registerUser(registrationData);
      
      if (response.success && response.data) {
        toast.success(`Welcome, ${username}!`);
        onRegistrationComplete(response.data.user);
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUsernameStatus = (): { icon: React.ReactNode; color: string } | null => {
    if (!username) return null;
    if (isCheckingUsername) {
      return {
        icon: <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-r-transparent" />,
        color: 'text-gray-400'
      };
    }
    if (usernameError) {
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        color: 'text-danger'
      };
    }
    if (isValidUsername(username)) {
      return {
        icon: <Check className="h-4 w-4" />,
        color: 'text-success'
      };
    }
    return null;
  };

  const usernameStatus = getUsernameStatus();

  return (
    <div className={`max-w-md mx-auto ${className}`}>
      <div className="card">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white font-gaming mb-2">
            Create Your Profile
          </h2>
          <p className="text-gray-400">
            Choose a username to get started with Gorbagana Poker
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={`input-primary w-full pr-10 ${
                  usernameError ? 'border-danger' : ''
                }`}
                disabled={isSubmitting}
                maxLength={20}
              />
              {usernameStatus && (
                <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${usernameStatus.color}`}>
                  {usernameStatus.icon}
                </div>
              )}
            </div>
            {usernameError && (
              <p className="text-danger text-sm mt-1">{usernameError}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              3-20 characters, letters, numbers, and underscores only
            </p>
          </div>

          <div className="space-y-3">
            <LoadingButton
              loading={isSubmitting}
              className="btn-primary w-full"
              disabled={!username || !!usernameError || isCheckingUsername}
            >
              Create Profile
            </LoadingButton>

            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="btn-secondary w-full"
                disabled={isSubmitting}
              >
                Skip for Now
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-surface-tertiary">
          <p className="text-xs text-gray-500 text-center">
            Your wallet address: {publicKey ? `${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}` : 'Not connected'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Mock API function - replace with actual implementation
async function registerUser(data: RegisterUserRequest): Promise<ApiResponse<RegisterUserResponse>> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful registration
  return {
    success: true,
    data: {
      user: {
        id: Math.random().toString(36).substring(7),
        walletAddress: data.walletAddress,
        username: data.username,
        gorBalance: 1000, // Starting balance
        totalStaked: 0,
        gamesWon: 0,
        gamesLost: 0,
        winRate: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: 'mock-jwt-token',
    },
  };
}