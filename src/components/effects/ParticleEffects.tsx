// src/components/effects/ParticleEffects.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'confetti' | 'star' | 'coin' | 'chip' | 'sparkle';
}

interface ParticleEffectsProps {
  trigger: 'win' | 'bigwin' | 'jackpot' | 'action' | 'deal' | null;
  intensity?: 'low' | 'medium' | 'high';
  duration?: number;
  className?: string;
}

export function ParticleEffects({ 
  trigger, 
  intensity = 'medium', 
  duration = 3000,
  className 
}: ParticleEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  // Particle configurations
  const configs = {
    win: {
      count: intensity === 'low' ? 30 : intensity === 'medium' ? 50 : 80,
      colors: ['#fbbf24', '#10b981', '#3b82f6', '#f59e0b'],
      types: ['confetti', 'star'] as const,
      spread: 0.8,
      velocity: 0.6,
    },
    bigwin: {
      count: intensity === 'low' ? 50 : intensity === 'medium' ? 80 : 120,
      colors: ['#fbbf24', '#f59e0b', '#d97706', '#fff'],
      types: ['coin', 'star', 'sparkle'] as const,
      spread: 1.0,
      velocity: 0.8,
    },
    jackpot: {
      count: intensity === 'low' ? 80 : intensity === 'medium' ? 120 : 200,
      colors: ['#fbbf24', '#f59e0b', '#fff', '#fbbf24'],
      types: ['coin', 'star', 'sparkle', 'confetti'] as const,
      spread: 1.2,
      velocity: 1.0,
    },
    action: {
      count: intensity === 'low' ? 15 : intensity === 'medium' ? 25 : 40,
      colors: ['#3a9f3a', '#10b981'],
      types: ['chip', 'sparkle'] as const,
      spread: 0.5,
      velocity: 0.4,
    },
    deal: {
      count: intensity === 'low' ? 10 : intensity === 'medium' ? 20 : 30,
      colors: ['#3b82f6', '#60a5fa'],
      types: ['sparkle'] as const,
      spread: 0.3,
      velocity: 0.3,
    },
  };

  // Create particles
  const createParticles = (type: NonNullable<typeof trigger>) => {
    const config = configs[type];
    const newParticles: Particle[] = [];

    for (let i = 0; i < config.count; i++) {
      const angle = (Math.random() * 360) * (Math.PI / 180);
      const velocity = (Math.random() * 0.5 + 0.5) * config.velocity;
      const spread = config.spread;
      
      newParticles.push({
        id: `${type}-${i}-${Date.now()}`,
        x: 50 + (Math.random() - 0.5) * 40, // Center with spread
        y: 50 + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * velocity * spread,
        vy: Math.sin(angle) * velocity * spread - Math.random() * 0.5,
        size: Math.random() * 8 + 4,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        life: 1,
        maxLife: Math.random() * 2000 + 1000,
        type: config.types[Math.floor(Math.random() * config.types.length)],
      });
    }

    return newParticles;
  };

  // Update particles
  useEffect(() => {
    if (!trigger) return;

    setIsActive(true);
    const newParticles = createParticles(trigger);
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(currentParticles => {
        return currentParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.02, // Gravity
            life: particle.life - (16 / particle.maxLife), // Fade based on frame time
          }))
          .filter(particle => particle.life > 0 && particle.y < 120);
      });
    }, 16); // ~60fps

    const cleanup = setTimeout(() => {
      setIsActive(false);
      setParticles([]);
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(cleanup);
    };
  }, [trigger, duration, intensity]);

  // Particle component
  const ParticleComponent = ({ particle }: { particle: Particle }) => {
    const getParticleContent = () => {
      switch (particle.type) {
        case 'confetti':
          return (
            <div 
              className="w-full h-full rounded-sm"
              style={{ backgroundColor: particle.color }}
            />
          );
        case 'star':
          return (
            <div 
              className="w-full h-full flex items-center justify-center text-white font-bold"
              style={{ color: particle.color }}
            >
              ★
            </div>
          );
        case 'coin':
          return (
            <div 
              className="w-full h-full rounded-full border-2 flex items-center justify-center text-xs font-bold"
              style={{ 
                backgroundColor: particle.color,
                borderColor: '#f59e0b',
                color: '#000'
              }}
            >
              $
            </div>
          );
        case 'chip':
          return (
            <div 
              className="w-full h-full rounded-full border-2 flex items-center justify-center"
              style={{ 
                backgroundColor: particle.color,
                borderColor: '#fff'
              }}
            />
          );
        case 'sparkle':
          return (
            <div 
              className="w-full h-full flex items-center justify-center text-white"
              style={{ color: particle.color }}
            >
              ✨
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          width: particle.size,
          height: particle.size,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: particle.life,
          rotate: particle.type === 'confetti' ? 360 : 0,
        }}
        transition={{
          scale: { duration: 0.2 },
          rotate: { duration: 2, ease: "linear" },
        }}
      >
        {getParticleContent()}
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className={cn(
            'fixed inset-0 pointer-events-none z-50 overflow-hidden',
            className
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {particles.map(particle => (
            <ParticleComponent key={particle.id} particle={particle} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Specialized particle components
export function WinCelebration({ 
  show, 
  intensity = 'medium' 
}: { 
  show: boolean; 
  intensity?: 'low' | 'medium' | 'high';
}) {
  return (
    <ParticleEffects 
      trigger={show ? 'win' : null} 
      intensity={intensity}
      duration={3000}
    />
  );
}

export function BigWinCelebration({ 
  show, 
  intensity = 'high' 
}: { 
  show: boolean; 
  intensity?: 'low' | 'medium' | 'high';
}) {
  return (
    <ParticleEffects 
      trigger={show ? 'bigwin' : null} 
      intensity={intensity}
      duration={5000}
    />
  );
}

export function JackpotCelebration({ 
  show 
}: { 
  show: boolean;
}) {
  return (
    <ParticleEffects 
      trigger={show ? 'jackpot' : null} 
      intensity="high"
      duration={8000}
    />
  );
}

export function ActionParticles({ 
  show, 
  intensity = 'low' 
}: { 
  show: boolean; 
  intensity?: 'low' | 'medium' | 'high';
}) {
  return (
    <ParticleEffects 
      trigger={show ? 'action' : null} 
      intensity={intensity}
      duration={1500}
    />
  );
}

export function DealParticles({ 
  show 
}: { 
  show: boolean;
}) {
  return (
    <ParticleEffects 
      trigger={show ? 'deal' : null} 
      intensity="low"
      duration={2000}
    />
  );
}