// src/components/ui/SoundSettings.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Settings, 
  Play,
  Music,
  Gamepad2,
  Headphones
} from 'lucide-react';

import { useSound } from '@/hooks/useSound';
import { cn } from '@/lib/utils';

interface SoundSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function SoundSettings({ isOpen, onClose, className }: SoundSettingsProps) {
  const { 
    settings, 
    setMasterVolume, 
    setSFXVolume, 
    setMusicVolume, 
    setMuted,
    ui,
    game,
    ambient
  } = useSound();

  const [localSettings, setLocalSettings] = useState(settings);

  // Sync with sound manager
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleMasterVolumeChange = (value: number) => {
    const volume = value / 100;
    setMasterVolume(volume);
    setLocalSettings(prev => ({ ...prev, masterVolume: volume }));
  };

  const handleSFXVolumeChange = (value: number) => {
    const volume = value / 100;
    setSFXVolume(volume);
    setLocalSettings(prev => ({ ...prev, sfxVolume: volume }));
  };

  const handleMusicVolumeChange = (value: number) => {
    const volume = value / 100;
    setMusicVolume(volume);
    setLocalSettings(prev => ({ ...prev, musicVolume: volume }));
  };

  const handleMuteToggle = () => {
    const newMuted = !localSettings.muted;
    setMuted(newMuted);
    setLocalSettings(prev => ({ ...prev, muted: newMuted }));
  };

  const testSound = (type: 'ui' | 'game' | 'music') => {
    switch (type) {
      case 'ui':
        ui.buttonClick();
        break;
      case 'game':
        game.chipPlace();
        break;
      case 'music':
        // Toggle music for testing
        if (settings.musicVolume > 0) {
          ambient.startMusic();
          setTimeout(() => ambient.stopMusic(), 2000);
        }
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={cn(
            'bg-surface-primary rounded-xl border border-surface-tertiary shadow-2xl max-w-md w-full',
            className
          )}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-surface-tertiary">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gor-400/20 rounded-lg">
                <Headphones className="h-5 w-5 text-gor-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-gaming">Sound Settings</h2>
                <p className="text-sm text-gray-400">Customize your audio experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-secondary rounded-lg transition-colors"
            >
              <Settings className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Master Volume */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {localSettings.muted ? (
                    <VolumeX className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-white" />
                  )}
                  <span className="text-white font-medium">Master Volume</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400 w-8 text-right">
                    {Math.round(localSettings.masterVolume * 100)}%
                  </span>
                  <button
                    onClick={handleMuteToggle}
                    className={cn(
                      'p-1 rounded transition-colors',
                      localSettings.muted 
                        ? 'bg-danger/20 text-danger' 
                        : 'bg-success/20 text-success'
                    )}
                  >
                    {localSettings.muted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(localSettings.masterVolume * 100)}
                  onChange={(e) => handleMasterVolumeChange(parseInt(e.target.value))}
                  disabled={localSettings.muted}
                  className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                  style={{
                    background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${localSettings.masterVolume * 100}%, #4b5563 ${localSettings.masterVolume * 100}%, #4b5563 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Sound Effects Volume */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gamepad2 className="h-5 w-5 text-primary-400" />
                  <span className="text-white font-medium">Sound Effects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400 w-8 text-right">
                    {Math.round(localSettings.sfxVolume * 100)}%
                  </span>
                  <button
                    onClick={() => testSound('ui')}
                    className="p-1 bg-primary-500/20 text-primary-400 rounded hover:bg-primary-500/30 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(localSettings.sfxVolume * 100)}
                onChange={(e) => handleSFXVolumeChange(parseInt(e.target.value))}
                disabled={localSettings.muted}
                className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                style={{
                  background: `linear-gradient(to right, #3a9f3a 0%, #3a9f3a ${localSettings.sfxVolume * 100}%, #4b5563 ${localSettings.sfxVolume * 100}%, #4b5563 100%)`,
                }}
              />
            </div>

            {/* Game Sounds Volume */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-gor-400 flex items-center justify-center">
                    <span className="text-black text-xs font-bold">G</span>
                  </div>
                  <span className="text-white font-medium">Game Sounds</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400 w-8 text-right">
                    {Math.round(localSettings.sfxVolume * 100)}%
                  </span>
                  <button
                    onClick={() => testSound('game')}
                    className="p-1 bg-gor-400/20 text-gor-400 rounded hover:bg-gor-400/30 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(localSettings.sfxVolume * 100)}
                onChange={(e) => handleSFXVolumeChange(parseInt(e.target.value))}
                disabled={localSettings.muted}
                className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                style={{
                  background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${localSettings.sfxVolume * 100}%, #4b5563 ${localSettings.sfxVolume * 100}%, #4b5563 100%)`,
                }}
              />
            </div>

            {/* Music Volume */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Music className="h-5 w-5 text-info" />
                  <span className="text-white font-medium">Background Music</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400 w-8 text-right">
                    {Math.round(localSettings.musicVolume * 100)}%
                  </span>
                  <button
                    onClick={() => testSound('music')}
                    className="p-1 bg-info/20 text-info rounded hover:bg-info/30 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(localSettings.musicVolume * 100)}
                onChange={(e) => handleMusicVolumeChange(parseInt(e.target.value))}
                disabled={localSettings.muted}
                className="w-full h-2 bg-surface-tertiary rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${localSettings.musicVolume * 100}%, #4b5563 ${localSettings.musicVolume * 100}%, #4b5563 100%)`,
                }}
              />
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-surface-tertiary">
              <h3 className="text-sm font-medium text-gray-300 mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    handleMasterVolumeChange(0);
                    handleSFXVolumeChange(0);
                    handleMusicVolumeChange(0);
                  }}
                  className="btn-secondary text-sm py-2"
                >
                  Mute All
                </button>
                <button
                  onClick={() => {
                    handleMasterVolumeChange(70);
                    handleSFXVolumeChange(80);
                    handleMusicVolumeChange(50);
                    setMuted(false);
                  }}
                  className="btn-primary text-sm py-2"
                >
                  Reset to Default
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="bg-surface-secondary/50 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Audio Status:</span>
                <span className={cn(
                  'font-medium',
                  localSettings.initialized 
                    ? 'text-success' 
                    : 'text-warning'
                )}>
                  {localSettings.initialized ? 'Ready' : 'Initializing...'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-0">
            <button
              onClick={onClose}
              className="btn-primary w-full"
            >
              Save Settings
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Quick sound toggle button
export function SoundToggle({ className }: { className?: string }) {
  const { settings, setMuted } = useSound();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <button
        onClick={() => setMuted(!settings.muted)}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowSettings(true);
        }}
        className={cn(
          'p-2 rounded-lg transition-colors',
          settings.muted 
            ? 'bg-danger/20 text-danger hover:bg-danger/30' 
            : 'bg-success/20 text-success hover:bg-success/30',
          className
        )}
        title={settings.muted ? 'Unmute' : 'Mute (Right-click for settings)'}
      >
        {settings.muted ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </button>

      <SoundSettings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </>
  );
}