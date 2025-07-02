'use client';

import { JSX, useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  DollarSign, 
  Target, 
  Zap, 
  Check, 
  X,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  Coins
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileBettingControlsProps {
  currentBet: number;
  minBet: number;
  maxBet: number;
  playerStack: number;
  potSize: number;
  onAction: (action: 'check' | 'call' | 'bet' | 'raise' | 'fold', amount?: number) => void;
  timeRemaining: number;
  isMyTurn: boolean;
  canCheck: boolean;
  callAmount: number;
}

export function MobileBettingControls({
  currentBet,
  minBet,
  maxBet,
  playerStack,
  potSize,
  onAction,
  timeRemaining,
  isMyTurn,
  canCheck,
  callAmount
}: MobileBettingControlsProps): JSX.Element {
  const [betAmount, setBetAmount] = useState(minBet);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Quick bet amounts
  const quickBets = [
    { label: '1/4 Pot', amount: Math.floor(potSize * 0.25) },
    { label: '1/2 Pot', amount: Math.floor(potSize * 0.5) },
    { label: 'Pot', amount: potSize },
    { label: 'All-In', amount: playerStack }
  ].filter(bet => bet.amount >= minBet && bet.amount <= maxBet);

  // Handle drag betting
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const deltaY = info.offset.y;
    const sensitivity = 2;
    const change = Math.floor(-deltaY / sensitivity);
    const newAmount = Math.max(minBet, Math.min(maxBet, betAmount + change));
    setBetAmount(newAmount);
  };

  const handleBetChange = (change: number) => {
    const newAmount = Math.max(minBet, Math.min(maxBet, betAmount + change));
    setBetAmount(newAmount);
  };

  if (!isMyTurn) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-surface-primary/95 backdrop-blur-sm border-t border-surface-tertiary p-4">
        <div className="text-center text-gray-400">
          Waiting for your turn...
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-surface-primary/95 backdrop-blur-sm border-t border-surface-tertiary"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Timer Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-surface-tertiary">
          <motion.div
            className={cn(
              'h-full',
              timeRemaining > 15 ? 'bg-green-400' :
              timeRemaining > 5 ? 'bg-yellow-400' : 'bg-red-400'
            )}
            initial={{ width: '100%' }}
            animate={{ width: `${(timeRemaining / 30) * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </div>

        <div className="p-4 space-y-4">
          {/* Current Situation */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="text-gray-400">
                Pot: <span className="text-gor-400 font-medium">{potSize} GOR</span>
              </div>
              {callAmount > 0 && (
                <div className="text-gray-400">
                  To Call: <span className="text-white font-medium">{callAmount} GOR</span>
                </div>
              )}
            </div>
            <div className="text-gray-400">
              Stack: <span className="text-white font-medium">{playerStack} GOR</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            {canCheck && (
              <motion.button
                onClick={() => onAction('check')}
                className="flex items-center justify-center space-x-2 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
              >
                <Check className="h-5 w-5" />
                <span>Check</span>
              </motion.button>
            )}

            {callAmount > 0 && (
              <motion.button
                onClick={() => onAction('call', callAmount)}
                className="flex items-center justify-center space-x-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
              >
                <Target className="h-5 w-5" />
                <span>Call {callAmount}</span>
              </motion.button>
            )}

            <motion.button
              onClick={() => onAction('fold')}
              className="flex items-center justify-center space-x-2 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
            >
              <X className="h-5 w-5" />
              <span>Fold</span>
            </motion.button>

            <motion.button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-center space-x-2 py-4 bg-gor-500 hover:bg-gor-600 text-white rounded-lg font-medium transition-colors"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
            >
              <TrendingUp className="h-5 w-5" />
              <span>Bet/Raise</span>
            </motion.button>
          </div>

          {/* Advanced Betting Controls */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 overflow-hidden"
              >
                {/* Bet Amount Display */}
                <div className="text-center py-4 bg-surface-secondary rounded-lg">
                  <div className="text-2xl font-bold text-gor-400">{betAmount} GOR</div>
                  <div className="text-sm text-gray-400">Bet Amount</div>
                </div>

                {/* Drag Slider */}
                <div className="relative">
                  <motion.div
                    className="w-full h-12 bg-surface-secondary rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing"
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    onDrag={handleDrag}
                    onDragStart={() => setIsDragging(true)}
                    onDragEnd={() => setIsDragging(false)}
                    whileDrag={{ scale: 1.05 }}
                  >
                    <div className="flex items-center space-x-2 text-white">
                      <ChevronUp className="h-4 w-4" />
                      <span className="font-medium">Drag to adjust bet</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </motion.div>
                  
                  {/* Min/Max indicators */}
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Min: {minBet}</span>
                    <span>Max: {maxBet}</span>
                  </div>
                </div>

                {/* Manual Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <motion.button
                    onClick={() => handleBetChange(-10)}
                    className="w-12 h-12 bg-surface-secondary hover:bg-surface-tertiary rounded-lg flex items-center justify-center text-white"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Minus className="h-5 w-5" />
                  </motion.button>

                  <motion.button
                    onClick={() => handleBetChange(-1)}
                    className="w-10 h-10 bg-surface-secondary hover:bg-surface-tertiary rounded-lg flex items-center justify-center text-white text-sm"
                    whileTap={{ scale: 0.9 }}
                  >
                    -1
                  </motion.button>

                  <div className="px-4 py-2 bg-surface-secondary rounded-lg">
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(Math.max(minBet, Math.min(maxBet, parseInt(e.target.value) || minBet)))}
                      className="w-24 bg-transparent text-center text-white border-none outline-none"
                      min={minBet}
                      max={maxBet}
                    />
                  </div>

                  <motion.button
                    onClick={() => handleBetChange(1)}
                    className="w-10 h-10 bg-surface-secondary hover:bg-surface-tertiary rounded-lg flex items-center justify-center text-white text-sm"
                    whileTap={{ scale: 0.9 }}
                  >
                    +1
                  </motion.button>

                  <motion.button
                    onClick={() => handleBetChange(10)}
                    className="w-12 h-12 bg-surface-secondary hover:bg-surface-tertiary rounded-lg flex items-center justify-center text-white"
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus className="h-5 w-5" />
                  </motion.button>
                </div>

                {/* Quick Bet Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {quickBets.map((quickBet) => (
                    <motion.button
                      key={quickBet.label}
                      onClick={() => setBetAmount(quickBet.amount)}
                      className="py-3 bg-surface-secondary hover:bg-surface-tertiary text-white rounded-lg font-medium transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-sm">{quickBet.label}</div>
                      <div className="text-xs text-gray-400">{quickBet.amount} GOR</div>
                    </motion.button>
                  ))}
                </div>

                {/* Confirm Bet */}
                <motion.button
                  onClick={() => {
                    const action = callAmount > 0 ? 'raise' : 'bet';
                    onAction(action, betAmount);
                    setShowAdvanced(false);
                  }}
                  className="w-full py-4 bg-gor-500 hover:bg-gor-600 text-white rounded-lg font-bold text-lg transition-colors"
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {callAmount > 0 ? `Raise to ${betAmount}` : `Bet ${betAmount}`} GOR
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
