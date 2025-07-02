'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Gamepad2, Zap, Coins } from 'lucide-react';
import type { JSX } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
  progress?: number;
  variant?: 'game' | 'connection' | 'transaction' | 'general';
  className?: string;
}

// LoadingScreen component
export function LoadingScreen({ 
  message = 'Loading...', 
  submessage,
  progress,
  variant = 'general',
  className 
}: LoadingScreenProps): JSX.Element {
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
        <motion.div
          className={cn(
            'relative mx-auto w-24 h-24 rounded-full border-4 flex items-center justify-center',
            'border-surface-tertiary bg-surface-primary/50 backdrop-blur-sm'
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Icon className={cn('w-10 h-10', config.color)} />
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">
            {message || config.message}
          </h2>
          {submessage && (
            <p className="text-gray-400 text-sm">{submessage}</p>
          )}
        </div>

        {typeof progress === 'number' && (
          <div className="w-full bg-surface-tertiary rounded-full h-2 overflow-hidden">
            <motion.div
              className={cn('h-full rounded-full', config.bgColor)}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        )}

        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={cn('w-2 h-2 rounded-full', config.bgColor)}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Main page transition wrapper
export function PageTransition({ children, className }: PageTransitionProps): JSX.Element {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  // Handle route change loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Different transition variants for different pages
  const getTransitionVariant = (path: string) => {
    if (path.startsWith('/game/')) return 'game';
    if (path === '/dashboard') return 'dashboard';
    if (path === '/profile') return 'profile';
    if (path === '/leaderboard') return 'leaderboard';
    if (path === '/rules') return 'rules';
    return 'default';
  };

  // Fixed transition variants with proper Framer Motion types
  const transitionVariants = {
    default: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3, ease: "easeOut" }
    },
    dashboard: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
      transition: { duration: 0.4, ease: "easeOut" }
    },
    game: {
      initial: { opacity: 0, rotateY: -90 },
      animate: { opacity: 1, rotateY: 0 },
      exit: { opacity: 0, rotateY: 90 },
      transition: { duration: 0.5, ease: "easeOut" }
    },
    profile: {
      initial: { opacity: 0, x: 100 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -100 },
      transition: { duration: 0.4, ease: "easeOut" }
    },
    leaderboard: {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 50 },
      transition: { duration: 0.4, ease: "easeOut" }
    },
    rules: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const variantKey = getTransitionVariant(pathname);
  const variant = transitionVariants[variantKey as keyof typeof transitionVariants] || transitionVariants.default;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className={cn('min-h-screen', className)}
        initial={variant.initial}
        animate={variant.animate}
        exit={variant.exit}
        transition={{
          duration: variant.transition.duration,
          // ease: variant.transition.ease
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Navigation transition component for smooth link changes
interface NavTransitionProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export function NavTransition({ children, href, className }: NavTransitionProps): JSX.Element {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = () => {
    setIsNavigating(true);
    // Reset after navigation completes
    setTimeout(() => setIsNavigating(false), 500);
  };

  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleNavigation}
      animate={isNavigating ? {
        opacity: [1, 0.7, 1],
        transition: { duration: 0.3 }
      } : {}}
    >
      {children}
    </motion.div>
  );
}

// Route loading indicator
export function RouteLoadingBar(): JSX.Element {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setProgress(0);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 30;
      });
    }, 100);

    // Complete loading
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsLoading(false), 200);
    }, 300);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
    };
  }, [pathname]);

  if (!isLoading) return <></>;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-surface-tertiary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-primary-500 to-gor-400"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
    </motion.div>
  );
}

// Staggered content animation for dashboard cards, lists, etc.
interface StaggeredAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export function StaggeredAnimation({ 
  children, 
  className, 
  delay = 0, 
  staggerDelay = 0.1 
}: StaggeredAnimationProps): JSX.Element {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Individual staggered item
interface StaggeredItemProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
}

export function StaggeredItem({ children, className, index }: StaggeredItemProps): JSX.Element {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { 
          opacity: 0, 
          y: 30,
          scale: 0.95 
        },
        visible: { 
          opacity: 1, 
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: "easeOut",
          }
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Slide in animation for panels/modals
interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  isVisible: boolean;
  className?: string;
}

export function SlideIn({ 
  children, 
  direction = 'right', 
  isVisible, 
  className 
}: SlideInProps): JSX.Element {
  const slideVariants = {
    left: { x: '-100%' },
    right: { x: '100%' },
    up: { y: '-100%' },
    down: { y: '100%' },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          initial={slideVariants[direction]}
          animate={{ x: 0, y: 0 }}
          exit={slideVariants[direction]}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Fade scale animation for cards
interface FadeScaleProps {
  children: React.ReactNode;
  isVisible: boolean;
  delay?: number;
  className?: string;
}

export function FadeScale({ 
  children, 
  isVisible, 
  delay = 0, 
  className 
}: FadeScaleProps): JSX.Element {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            duration: 0.4,
            delay,
            ease: "easeOut",
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Page background animation
interface AnimatedBackgroundProps {
  variant?: string;
}

export function AnimatedBackground({ variant = 'dashboard' }: AnimatedBackgroundProps): JSX.Element {
  const backgroundVariants: Record<string, string> = {
    dashboard: 'bg-gradient-to-br from-background-primary via-background-secondary to-background-primary',
    game: 'bg-gradient-to-r from-surface-primary via-background-primary to-surface-primary',
    profile: 'bg-gradient-to-bl from-background-primary via-surface-primary to-background-secondary',
    default: 'bg-background-primary',
  };

  return (
    <motion.div
      className={cn(
        'fixed inset-0 -z-10',
        backgroundVariants[variant] || backgroundVariants.default
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gor-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// Breadcrumb transition
interface BreadcrumbTransitionProps {
  items: Array<{ label: string; href?: string }>;
  className?: string;
}

export function BreadcrumbTransition({ items, className }: BreadcrumbTransitionProps): JSX.Element {
  return (
    <motion.nav
      className={cn('flex items-center space-x-2 text-sm', className)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 + index * 0.1 }}
        >
          {index > 0 && (
            <span className="mx-2 text-gray-500">/</span>
          )}
          {item.href ? (
            <motion.a
              href={item.href}
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              {item.label}
            </motion.a>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
        </motion.div>
      ))}
    </motion.nav>
  );
}