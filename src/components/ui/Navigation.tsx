'use client';

import { JSX, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Gamepad2, 
  Trophy, 
  User, 
  Menu, 
  X,
  Coins,
  HelpCircle,
  ChevronRight,
  Clock,
  Users,
  Zap,
  LogOut
} from 'lucide-react';

import { WalletButton } from '@/components/wallet/WalletButton';
import { cn } from '@/lib/utils';
import { MobileNavigation } from '@/components/ui/MobileNavigation'
import { useResponsive } from '@/hooks/useResponsive';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Home and game lobby',
    shortName: 'Home'
  },
  {
    name: 'Leaderboard',
    href: '/leaderboard',
    icon: Trophy,
    description: 'Top players and stats',
    shortName: 'Rankings'
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    description: 'Your stats and history',
    shortName: 'Profile'
  },
  {
    name: 'How to Play',
    href: '/rules',
    icon: HelpCircle,
    description: 'Game rules and tutorial',
    shortName: 'Rules'
  },
] as const;

interface NavigationProps {
  className?: string;
  gameId?: string;
  onLeaveGame?: () => void;
}

export function Navigation({ 
  className, 
  gameId, 
  onLeaveGame 
}: NavigationProps): JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isGamePage = pathname.startsWith('/game/');

  // Get current page info with responsive considerations
  const getCurrentPageInfo = () => {
    if (isGamePage && gameId) {
      return {
        title: `Game #${gameId.slice(0, 8).toUpperCase()}`,
        subtitle: 'Two-Card Indian Poker',
        path: 'Dashboard > Game',
        icon: Gamepad2,
        color: 'text-gor-400',
        showStats: true
      };
    }

    const currentItem = navigationItems.find(item => item.href === pathname);
    if (currentItem) {
      return {
        title: currentItem.name,
        subtitle: currentItem.description,
        path: `Dashboard > ${currentItem.shortName}`,
        icon: currentItem.icon,
        color: 'text-primary-400',
        showStats: false
      };
    }

    return {
      title: 'Dashboard',
      subtitle: 'Welcome to Gorbagana Poker',
      path: 'Dashboard',
      icon: Home,
      color: 'text-primary-400',
      showStats: false
    };
  };

  const pageInfo = getCurrentPageInfo();
  const PageIcon = pageInfo.icon;

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav 
      className={cn(
        'bg-surface-primary/95 backdrop-blur-md border-b border-surface-tertiary/50 sticky top-0 z-40',
        className
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Main Navigation Bar */}
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo and Brand - Responsive */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity group"
              onClick={closeMobileMenu}
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Coins className="h-6 w-6 sm:h-8 sm:w-8 text-gor-400 group-hover:text-gor-300 transition-colors" />
                <Gamepad2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary-400 absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 group-hover:text-primary-300 transition-colors" />
              </motion.div>
              <div className="hidden xs:block">
                <h1 className="text-lg sm:text-xl font-bold text-white font-gaming group-hover:text-gray-100 transition-colors">
                  GORBAGANA
                </h1>
                <p className="text-xs text-gor-400 font-medium -mt-1 group-hover:text-gor-300 transition-colors">
                  POKER
                </p>
              </div>
            </Link>
          </div>

          {/* Center - Current Page Info (Large Desktop Only) */}
          <motion.div 
            className="hidden xl:flex items-center space-x-3 bg-surface-secondary/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-surface-tertiary/50"
            key={pathname}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <PageIcon className={cn('h-5 w-5', pageInfo.color)} />
            <div>
              <div className="text-white font-medium text-sm">{pageInfo.title}</div>
              <div className="text-xs text-gray-400 -mt-0.5">{pageInfo.path}</div>
            </div>
          </motion.div>

          {/* Right Side - Navigation + Wallet - Responsive */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Desktop Navigation - Hidden on Game Pages */}
            {!isGamePage && (
              <div className="hidden md:flex items-center space-x-1 mr-2 lg:mr-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <motion.div
                      key={item.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                            : 'text-gray-300 hover:text-white hover:bg-surface-secondary/70 backdrop-blur-sm'
                        )}
                        title={item.description}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden lg:block">{item.shortName}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Game Actions - Leave Game Button */}
            {isGamePage && onLeaveGame && (
              <motion.button
                type="button"
                onClick={onLeaveGame}
                className="hidden sm:flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:block">Leave</span>
              </motion.button>
            )}

            {/* Wallet Button - Responsive */}
            <div className="flex-shrink-0">
              <WalletButton variant={isGamePage ? "compact" : "default"} />
            </div>
            
            {/* Mobile Menu Button */}
            <motion.button
              type="button"
              className="flex md:hidden p-1.5 sm:p-2 rounded-lg text-gray-300 hover:text-white hover:bg-surface-secondary transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Secondary Info Bar - Mobile/Tablet */}
        <motion.div 
          className="xl:hidden border-t border-surface-tertiary/50 py-2 sm:py-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            {/* Page Info */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <PageIcon className={cn('h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0', pageInfo.color)} />
              <div className="min-w-0 flex-1">
                <div className="text-white font-medium text-sm truncate">{pageInfo.title}</div>
                <div className="text-xs text-gray-400 truncate">{pageInfo.subtitle}</div>
              </div>
            </div>
            
            {/* Quick Stats - Game Mode Only */}
            {pageInfo.showStats && (
              <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-gray-400 flex-shrink-0">
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span className="hidden sm:inline">6 players</span>
                  <span className="sm:hidden">6</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>30s</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="h-3 w-3 text-gor-400" />
                  <span className="hidden sm:inline">Fast</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-surface-tertiary"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Regular Navigation Items */}
                {!isGamePage && navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200',
                          isActive
                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                            : 'text-gray-300 hover:text-white hover:bg-surface-secondary'
                        )}
                        onClick={closeMobileMenu}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate">{item.name}</div>
                          <div className="text-xs text-gray-400 truncate">{item.description}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 opacity-50 flex-shrink-0" />
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Game Actions - Mobile */}
                {isGamePage && onLeaveGame && (
                  <motion.button
                    type="button"
                    onClick={() => {
                      onLeaveGame();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-base font-medium transition-all duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 text-left min-w-0">
                      <div className="truncate">Leave Game</div>
                      <div className="text-xs text-red-200 truncate">Return to dashboard</div>
                    </div>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}


export function ResponsiveNavigation({ 
  className, 
  gameId, 
  onLeaveGame 
}: NavigationProps): JSX.Element {
  const { isMobile } = useResponsive();
  
  if (isMobile) {
    return <MobileNavigation />;
  }
  
  // Return existing desktop navigation
  return (
    <Navigation 
      className={className}
      gameId={gameId}
      onLeaveGame={onLeaveGame}
    />
  );
}
