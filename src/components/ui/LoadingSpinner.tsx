'use client';

import { cn } from '@/lib/utils';
import { JSX } from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'gor' | 'white';
  className?: string;
}

const sizeClasses = {
  small: 'h-4 w-4',
  medium: 'h-8 w-8',
  large: 'h-12 w-12',
} as const;

const colorClasses = {
  primary: 'text-primary-500',
  gor: 'text-gor-400',
  white: 'text-white',
} as const;

export function LoadingSpinner({ 
  size = 'medium', 
  color = 'primary', 
  className 
}: LoadingSpinnerProps): JSX.Element {
  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Loading overlay for full-screen loading states
interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export function LoadingOverlay({ 
  message = 'Loading...', 
  className 
}: LoadingOverlayProps): JSX.Element {
  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm',
      className
    )}>
      <div className="bg-surface-primary rounded-xl p-8 shadow-card max-w-sm w-full mx-4">
        <div className="text-center">
          <LoadingSpinner size="large" className="mx-auto mb-4" />
          <p className="text-white text-lg font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton for content placeholders
interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  avatar?: boolean;
}

export function LoadingSkeleton({ 
  className, 
  lines = 3, 
  avatar = false 
}: LoadingSkeletonProps): JSX.Element {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="flex space-x-4">
        {avatar && (
          <div className="rounded-full bg-surface-tertiary h-10 w-10 flex-shrink-0" />
        )}
        <div className="flex-1 space-y-2">
          {Array.from({ length: lines }, (_, i) => (
            <div
              key={i}
              className={cn(
                'h-4 bg-surface-tertiary rounded',
                i === lines - 1 ? 'w-3/4' : 'w-full'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Loading card for dashboard cards
export function LoadingCard(): JSX.Element {
  return (
    <div className="card animate-pulse">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-surface-tertiary h-12 w-12" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-surface-tertiary rounded w-3/4" />
            <div className="h-3 bg-surface-tertiary rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-surface-tertiary rounded" />
          <div className="h-3 bg-surface-tertiary rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}

// Loading state for buttons
interface LoadingButtonProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export function LoadingButton({ 
  loading = false, 
  children, 
  className, 
  disabled,
  onClick 
}: LoadingButtonProps): JSX.Element {
  return (
    <button
      className={cn(
        'relative',
        loading && 'cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="small" color="white" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
    </button>
  );
}