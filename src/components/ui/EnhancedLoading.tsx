// src/components/ui/EnhancedLoading.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Gamepad2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
  progress?: number;
  variant?: 'game' | 'connection' | 'transaction' | 'general';
  className?: string;
}

export function LoadingScreen({ 
  message = 'Loading...', 
  submessage,
  progress,
  variant = 'general',
  className 
}: LoadingScreenProps) {
  const variants = {
    game: {
      icon: Gamepad2,
      color: 'text-gor-400',
      bgColor: 'bg-gor-400',
      message: 'Preparing your game...',
    },
    connection: {
      icon: Zap,
      color: 'text-primary-400',
      bgColor: 'bg-primary-400',
      message: 'Connecting to Gorbagana...',
    },
    transaction: {
      icon: Coins,
      color: 'text-gor-400',
      bgColor: 'bg-gor-400',
      message: 'Processing transaction...',
    },
    general: {
      icon: Gamepad2,
      color: 'text-white',
      bgColor: 'bg-white',
      message: 'Loading...',
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <motion.div
      className={cn(
        'fixed inset-0 bg-background-primary/95 backdrop-blur-sm flex items-center justify-center z-50',
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        {/* Animated Logo/Icon */}
        <motion.div
          className={cn(
            'relative mx-auto w-24 h-24 rounded-full border-4 flex items-center justify-center',
            'border-surface-tertiary bg-surface-primary/50 backdrop-blur-sm'
          )}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Icon className={cn('h-10 w-10', config.color)} />
          
          {/* Orbiting particles */}
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              className={cn('absolute w-2 h-2 rounded-full', config.bgColor)}
              style={{
                top: '10%',
                left: '50%',
                originX: 0.5,
                originY: '200%',
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.7,
              }}
            />
          ))}
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <h2 className="text-2xl font-bold text-white font-gaming">
            {message || config.message}
          </h2>
          
          {submessage && (
            <p className="text-gray-400 text-sm">
              {submessage}
            </p>
          )}
        </motion.div>

        {/* Progress Bar */}
        {progress !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-sm text-gray-400">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-surface-tertiary rounded-full h-2 overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full', config.bgColor)}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}

        {/* Animated Dots */}
        <motion.div
          className="flex justify-center space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              className={cn('w-2 h-2 rounded-full', config.bgColor)}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Powered by Gorbagana */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex items-center justify-center space-x-2 text-xs text-gray-500"
        >
          <Zap className="h-3 w-3" />
          <span>Powered by Gorbagana</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Skeleton Components with Enhanced Animations
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  animated?: boolean;
}

export function Skeleton({ 
  className, 
  variant = 'rectangular',
  animated = true 
}: SkeletonProps) {
  const baseClasses = 'bg-surface-tertiary';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
    card: 'rounded-lg',
  };

  return (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      animate={animated ? {
        opacity: [0.6, 1, 0.6],
      } : {}}
      transition={animated ? {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      } : {}}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card space-y-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" className="h-12 w-12" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" className="w-5/6" />
      </div>
    </div>
  );
}

export function GameLoadingSkeleton() {
  return (
    <div className="game-board">
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-8 text-center">
          {/* Game Table Skeleton */}
          <motion.div
            className="w-96 h-96 rounded-full border-4 border-surface-tertiary bg-surface-primary/50 mx-auto relative"
            animate={{
              borderColor: ['#4b5563', '#3a9f3a', '#4b5563'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Player positions */}
            {Array.from({ length: 6 }, (_, i) => {
              const angle = (i * 60) * (Math.PI / 180);
              const radius = 140;
              const x = 50 + (radius * Math.cos(angle - Math.PI / 2)) / 4;
              const y = 50 + (radius * Math.sin(angle - Math.PI / 2)) / 4;
              
              return (
                <motion.div
                  key={i}
                  className="absolute w-16 h-16 rounded-full bg-surface-tertiary"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
            
            {/* Center pot */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gor-400/30"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Loading text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <h3 className="text-xl font-bold text-white font-gaming">
              Setting up your poker table...
            </h3>
            <div className="flex justify-center space-x-1">
              {Array.from({ length: 3 }, (_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gor-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Pulse Loading Component
export function PulseLoader({ 
  size = 'md',
  color = 'primary' 
}: { 
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'gor' | 'white';
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colors = {
    primary: 'bg-primary-500',
    gor: 'bg-gor-400',
    white: 'bg-white',
  };

  return (
    <motion.div
      className={cn(
        'rounded-full',
        sizes[size],
        colors[color]
      )}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Wave Loading Component
export function WaveLoader({ 
  color = 'primary',
  className 
}: { 
  color?: 'primary' | 'gor' | 'white';
  className?: string;
}) {
  const colors = {
    primary: 'bg-primary-500',
    gor: 'bg-gor-400',
    white: 'bg-white',
  };

  return (
    <div className={cn('flex space-x-1', className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <motion.div
          key={i}
          className={cn('w-2 h-8 rounded-full', colors[color])}
          animate={{
            scaleY: [1, 2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Spinning Cards Loader
export function CardSpinLoader({ className }: { className?: string }) {
  return (
    <div className={cn('relative w-16 h-16', className)}>
      {Array.from({ length: 3 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 w-12 h-16 bg-gradient-to-b from-white to-gray-200 rounded-lg border-2 border-gray-300"
          style={{
            transformOrigin: 'center center',
          }}
          animate={{
            rotateY: 360,
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-2 bg-primary-500 rounded opacity-20" />
        </motion.div>
      ))}
    </div>
  );
}