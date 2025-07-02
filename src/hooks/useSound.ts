// src/hooks/useSound.ts
import { useEffect, useCallback, useState } from 'react';
import { soundManager, initializeSounds } from '@/lib/soundManager';

interface UseSoundReturn {
  // Sound control
  play: (soundId: string, options?: { volume?: number; rate?: number }) => void;
  stop: (soundId: string) => void;
  stopAll: () => void;
  
  // Volume control
  setMasterVolume: (volume: number) => void;
  setSFXVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  
  // Settings
  settings: {
    masterVolume: number;
    sfxVolume: number;
    musicVolume: number;
    muted: boolean;
    initialized: boolean;
  };
  
  // Convenience methods
  ui: {
    buttonClick: () => void;
    buttonHover: () => void;
    modalOpen: () => void;
    modalClose: () => void;
    notification: () => void;
    error: () => void;
    success: () => void;
  };
  
  game: {
    cardFlip: () => void;
    cardDeal: () => void;
    chipPlace: () => void;
    chipCollect: () => void;
    actionCheck: () => void;
    actionCall: () => void;
    actionBet: () => void;
    actionRaise: () => void;
    actionFold: () => void;
    roundStart: () => void;
    roundEnd: () => void;
    gameWin: () => void;
    gameLose: () => void;
    timerWarning: () => void;
    timerCritical: () => void;
  };
  
  ambient: {
    startCasino: () => void;
    stopCasino: () => void;
    startMusic: () => void;
    stopMusic: () => void;
  };
}

export function useSound(): UseSoundReturn {
  const [settings, setSettings] = useState(soundManager.getSettings());
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize sounds on mount
  useEffect(() => {
    const initSounds = async () => {
      if (!isInitialized) {
        await initializeSounds();
        setSettings(soundManager.getSettings());
        setIsInitialized(true);
      }
    };

    // Initialize on first user interaction
    const handleFirstInteraction = () => {
      initSounds();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isInitialized]);

  // Update settings when sound manager changes
  useEffect(() => {
    const updateSettings = () => {
      setSettings(soundManager.getSettings());
    };

    // Poll for settings changes (simple approach)
    const interval = setInterval(updateSettings, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sound control methods
  const play = useCallback((soundId: string, options?: { volume?: number; rate?: number }) => {
    soundManager.play(soundId, options);
  }, []);

  const stop = useCallback((soundId: string) => {
    soundManager.stop(soundId);
  }, []);

  const stopAll = useCallback(() => {
    soundManager.stopAll();
  }, []);

  // Volume control methods
  const setMasterVolume = useCallback((volume: number) => {
    soundManager.setMasterVolume(volume);
    setSettings(soundManager.getSettings());
  }, []);

  const setSFXVolume = useCallback((volume: number) => {
    soundManager.setSFXVolume(volume);
    setSettings(soundManager.getSettings());
  }, []);

  const setMusicVolume = useCallback((volume: number) => {
    soundManager.setMusicVolume(volume);
    setSettings(soundManager.getSettings());
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    soundManager.setMuted(muted);
    setSettings(soundManager.getSettings());
  }, []);

  // Convenience methods
  const ui = {
    buttonClick: () => soundManager.playButtonClick(),
    buttonHover: () => soundManager.playButtonHover(),
    modalOpen: () => soundManager.playModalOpen(),
    modalClose: () => soundManager.playModalClose(),
    notification: () => soundManager.playNotification(),
    error: () => soundManager.playError(),
    success: () => soundManager.playSuccess(),
  };

  const game = {
    cardFlip: () => soundManager.playCardFlip(),
    cardDeal: () => soundManager.playCardDeal(),
    chipPlace: () => soundManager.playChipPlace(),
    chipCollect: () => soundManager.playChipCollect(),
    actionCheck: () => soundManager.playActionCheck(),
    actionCall: () => soundManager.playActionCall(),
    actionBet: () => soundManager.playActionBet(),
    actionRaise: () => soundManager.playActionRaise(),
    actionFold: () => soundManager.playActionFold(),
    roundStart: () => soundManager.playRoundStart(),
    roundEnd: () => soundManager.playRoundEnd(),
    gameWin: () => soundManager.playGameWin(),
    gameLose: () => soundManager.playGameLose(),
    timerWarning: () => soundManager.playTimerWarning(),
    timerCritical: () => soundManager.playTimerCritical(),
  };

  const ambient = {
    startCasino: () => soundManager.startCasinoAmbient(),
    stopCasino: () => soundManager.stopCasinoAmbient(),
    startMusic: () => soundManager.startGameMusic(),
    stopMusic: () => soundManager.stopGameMusic(),
  };

  return {
    play,
    stop,
    stopAll,
    setMasterVolume,
    setSFXVolume,
    setMusicVolume,
    setMuted,
    settings,
    ui,
    game,
    ambient,
  };
}

// Hook for UI sounds specifically
export function useUISounds() {
  const { ui } = useSound();
  return ui;
}

// Hook for game sounds specifically
export function useGameSounds() {
  const { game } = useSound();
  return game;
}