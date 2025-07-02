
'use client';

import { motion } from 'framer-motion';
import { Navigation } from '@/components/ui/Navigation';
import { StaggeredAnimation } from '@/components/ui/PageTransitions';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { JSX } from 'react';

interface TransitionLayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  gameId?: string;
  onLeaveGame?: () => void;
  className?: string;
}

export function TransitionLayout({ 
  children, 
  showNavigation = true,
  gameId,
  onLeaveGame,
  className 
}: TransitionLayoutProps): JSX.Element {
  const pathname = usePathname();
  const isGamePage = pathname.startsWith('/game/');

  return (
    <motion.div 
      className={cn('min-h-screen bg-background-primary', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Enhanced Navigation */}
      {showNavigation && (
        <Navigation 
          gameId={gameId}
          onLeaveGame={onLeaveGame}
        />
      )}

      {/* Main Content with Staggered Animation */}
      <main className={cn(
        'pb-6 sm:pb-8 lg:pb-12',
        isGamePage ? 'pb-4 sm:pb-6 lg:pb-8' : ''
      )}>
        <div className={cn(
          'max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 pt-4 sm:pt-6 lg:pt-8',
          isGamePage ? 'px-2 sm:px-3 lg:px-4 xl:px-6 pt-2 sm:pt-4 lg:pt-6' : ''
        )}>
          <StaggeredAnimation>
            {children}
          </StaggeredAnimation>
        </div>
      </main>
    </motion.div>
  );
}