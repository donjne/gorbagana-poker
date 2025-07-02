'use client';

import { JSX, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Trophy, 
  User, 
  HelpCircle,
  Menu,
  X,
  Gamepad2,
  Settings,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const mobileNavItems = [
  { id: 'dashboard', name: 'Home', href: '/dashboard', icon: Home },
  { id: 'leaderboard', name: 'Rankings', href: '/leaderboard', icon: Trophy },
  { id: 'profile', name: 'Profile', href: '/profile', icon: User },
  { id: 'rules', name: 'Rules', href: '/rules', icon: HelpCircle }
];

export function MobileNavigation(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Bottom Tab Bar - Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-primary/95 backdrop-blur-sm border-t border-surface-tertiary safe-area-bottom z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors',
                  isActive 
                    ? 'bg-primary-500/20 text-primary-400' 
                    : 'text-gray-400 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button - Game Pages */}
      {pathname.startsWith('/game/') && (
        <motion.button
          className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-gor-500 hover:bg-gor-600 text-white rounded-full shadow-lg flex items-center justify-center z-40"
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </motion.button>
      )}

      {/* Slide-out Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[90vw] bg-surface-primary border-l border-surface-tertiary z-50 safe-area-top"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-surface-secondary rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="space-y-2 mb-8">
                  {mobileNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center space-x-3 p-3 rounded-lg transition-colors',
                          isActive 
                            ? 'bg-primary-500/20 text-primary-400 border border-primary-500/50' 
                            : 'text-gray-300 hover:text-white hover:bg-surface-secondary'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Additional Actions */}
                <div className="space-y-2 pt-4 border-t border-surface-tertiary">
                  <button className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-surface-secondary transition-colors w-full">
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Settings</span>
                  </button>
                  
                  <button className="flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full">
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Disconnect Wallet</span>
                  </button>
                </div>

                {/* Game Quick Actions */}
                {pathname.startsWith('/game/') && (
                  <div className="mt-8 pt-4 border-t border-surface-tertiary">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Game Actions</h3>
                    <div className="space-y-2">
                      <button className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:text-white hover:bg-surface-secondary transition-colors w-full">
                        <Gamepad2 className="h-5 w-5" />
                        <span className="font-medium">Game Stats</span>
                      </button>
                      
                      <button className="flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full">
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Leave Game</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
