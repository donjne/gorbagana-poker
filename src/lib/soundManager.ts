// src/lib/soundManager.ts
import { Howl, Howler } from 'howler';

interface SoundConfig {
  id: string;
  src: string[];
  volume?: number;
  loop?: boolean;
  sprite?: { [key: string]: [number, number] };
}

interface SoundInstance {
  howl: Howl;
  config: SoundConfig;
}

class SoundManager {
  private sounds: Map<string, SoundInstance> = new Map();
  private masterVolume = 0.7;
  private sfxVolume = 0.8;
  private musicVolume = 0.5;
  private muted = false;
  private initialized = false;

  constructor() {
    // Set global volume
    Howler.volume(this.masterVolume);
  }

  /**
   * Initialize sound manager with game sounds
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Define all game sounds
      const soundConfigs: SoundConfig[] = [
        // UI Sounds
        {
          id: 'button-click',
          src: ['/sounds/ui/button-click.mp3', '/sounds/ui/button-click.webm'],
          volume: 0.6,
        },
        {
          id: 'button-hover',
          src: ['/sounds/ui/button-hover.mp3', '/sounds/ui/button-hover.webm'],
          volume: 0.3,
        },
        {
          id: 'modal-open',
          src: ['/sounds/ui/modal-open.mp3', '/sounds/ui/modal-open.webm'],
          volume: 0.5,
        },
        {
          id: 'modal-close',
          src: ['/sounds/ui/modal-close.mp3', '/sounds/ui/modal-close.webm'],
          volume: 0.5,
        },

        // Game Action Sounds
        {
          id: 'card-flip',
          src: ['/sounds/game/card-flip.mp3', '/sounds/game/card-flip.webm'],
          volume: 0.7,
        },
        {
          id: 'card-deal',
          src: ['/sounds/game/card-deal.mp3', '/sounds/game/card-deal.webm'],
          volume: 0.6,
        },
        {
          id: 'chip-place',
          src: ['/sounds/game/chip-place.mp3', '/sounds/game/chip-place.webm'],
          volume: 0.8,
        },
        {
          id: 'chip-collect',
          src: ['/sounds/game/chip-collect.mp3', '/sounds/game/chip-collect.webm'],
          volume: 0.7,
        },

        // Player Actions
        {
          id: 'action-check',
          src: ['/sounds/actions/check.mp3', '/sounds/actions/check.webm'],
          volume: 0.5,
        },
        {
          id: 'action-call',
          src: ['/sounds/actions/call.mp3', '/sounds/actions/call.webm'],
          volume: 0.6,
        },
        {
          id: 'action-bet',
          src: ['/sounds/actions/bet.mp3', '/sounds/actions/bet.webm'],
          volume: 0.7,
        },
        {
          id: 'action-raise',
          src: ['/sounds/actions/raise.mp3', '/sounds/actions/raise.webm'],
          volume: 0.8,
        },
        {
          id: 'action-fold',
          src: ['/sounds/actions/fold.mp3', '/sounds/actions/fold.webm'],
          volume: 0.6,
        },

        // Game Events
        {
          id: 'round-start',
          src: ['/sounds/events/round-start.mp3', '/sounds/events/round-start.webm'],
          volume: 0.7,
        },
        {
          id: 'round-end',
          src: ['/sounds/events/round-end.mp3', '/sounds/events/round-end.webm'],
          volume: 0.8,
        },
        {
          id: 'game-win',
          src: ['/sounds/events/game-win.mp3', '/sounds/events/game-win.webm'],
          volume: 0.9,
        },
        {
          id: 'game-lose',
          src: ['/sounds/events/game-lose.mp3', '/sounds/events/game-lose.webm'],
          volume: 0.7,
        },
        {
          id: 'timer-warning',
          src: ['/sounds/events/timer-warning.mp3', '/sounds/events/timer-warning.webm'],
          volume: 0.8,
        },
        {
          id: 'timer-critical',
          src: ['/sounds/events/timer-critical.mp3', '/sounds/events/timer-critical.webm'],
          volume: 1.0,
        },

        // Ambient Sounds
        {
          id: 'casino-ambient',
          src: ['/sounds/ambient/casino.mp3', '/sounds/ambient/casino.webm'],
          volume: 0.3,
          loop: true,
        },
        {
          id: 'game-music',
          src: ['/sounds/music/game-bg.mp3', '/sounds/music/game-bg.webm'],
          volume: 0.4,
          loop: true,
        },

        // Notification Sounds
        {
          id: 'notification',
          src: ['/sounds/ui/notification.mp3', '/sounds/ui/notification.webm'],
          volume: 0.7,
        },
        {
          id: 'error',
          src: ['/sounds/ui/error.mp3', '/sounds/ui/error.webm'],
          volume: 0.8,
        },
        {
          id: 'success',
          src: ['/sounds/ui/success.mp3', '/sounds/ui/success.webm'],
          volume: 0.7,
        },

        // Connection Sounds
        {
          id: 'connect',
          src: ['/sounds/connection/connect.mp3', '/sounds/connection/connect.webm'],
          volume: 0.6,
        },
        {
          id: 'disconnect',
          src: ['/sounds/connection/disconnect.mp3', '/sounds/connection/disconnect.webm'],
          volume: 0.7,
        },
      ];

      // Load all sounds
      await Promise.all(soundConfigs.map(config => this.loadSound(config)));
      
      this.initialized = true;
      console.log('SoundManager initialized with', this.sounds.size, 'sounds');
    } catch (error) {
      console.error('Failed to initialize SoundManager:', error);
    }
  }

  /**
   * Load a single sound
   */
  private loadSound(config: SoundConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      const howl = new Howl({
        src: config.src,
        volume: (config.volume || 1.0) * this.sfxVolume,
        loop: config.loop || false,
        sprite: config.sprite,
        onload: () => {
          this.sounds.set(config.id, { howl, config });
          resolve();
        },
        onloaderror: (id, error) => {
          console.warn(`Failed to load sound ${config.id}:`, error);
          // Don't reject, just log warning and continue
          resolve();
        },
      });
    });
  }

  /**
   * Play a sound by ID
   */
  play(soundId: string, options?: { volume?: number; rate?: number; sprite?: string }): number | null {
    if (this.muted || !this.initialized) return null;

    const soundInstance = this.sounds.get(soundId);
    if (!soundInstance) {
      console.warn(`Sound ${soundId} not found`);
      return null;
    }

    try {
      const id = soundInstance.howl.play(options?.sprite);
      
      if (options?.volume !== undefined) {
        soundInstance.howl.volume(options.volume * this.sfxVolume, id);
      }
      
      if (options?.rate !== undefined) {
        soundInstance.howl.rate(options.rate, id);
      }

      return id;
    } catch (error) {
      console.error(`Error playing sound ${soundId}:`, error);
      return null;
    }
  }

  /**
   * Stop a sound
   */
  stop(soundId: string, id?: number): void {
    const soundInstance = this.sounds.get(soundId);
    if (soundInstance) {
      soundInstance.howl.stop(id);
    }
  }

  /**
   * Stop all sounds
   */
  stopAll(): void {
    this.sounds.forEach(({ howl }) => {
      howl.stop();
    });
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.masterVolume);
  }

  /**
   * Set SFX volume
   */
  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.updateSoundVolumes();
  }

  /**
   * Set music volume
   */
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateMusicVolumes();
  }

  /**
   * Mute/unmute all sounds
   */
  setMuted(muted: boolean): void {
    this.muted = muted;
    Howler.mute(muted);
  }

  /**
   * Update all sound volumes
   */
  private updateSoundVolumes(): void {
    this.sounds.forEach(({ howl, config }) => {
      if (!config.id.includes('music') && !config.id.includes('ambient')) {
        howl.volume((config.volume || 1.0) * this.sfxVolume);
      }
    });
  }

  /**
   * Update music volumes
   */
  private updateMusicVolumes(): void {
    this.sounds.forEach(({ howl, config }) => {
      if (config.id.includes('music') || config.id.includes('ambient')) {
        howl.volume((config.volume || 1.0) * this.musicVolume);
      }
    });
  }

  /**
   * Get current settings
   */
  getSettings() {
    return {
      masterVolume: this.masterVolume,
      sfxVolume: this.sfxVolume,
      musicVolume: this.musicVolume,
      muted: this.muted,
      initialized: this.initialized,
    };
  }

  /**
   * Convenience methods for common sounds
   */
  
  // UI Sounds
  playButtonClick() { this.play('button-click'); }
  playButtonHover() { this.play('button-hover'); }
  playModalOpen() { this.play('modal-open'); }
  playModalClose() { this.play('modal-close'); }

  // Game Sounds
  playCardFlip() { this.play('card-flip'); }
  playCardDeal() { this.play('card-deal'); }
  playChipPlace() { this.play('chip-place'); }
  playChipCollect() { this.play('chip-collect'); }

  // Player Actions
  playActionCheck() { this.play('action-check'); }
  playActionCall() { this.play('action-call'); }
  playActionBet() { this.play('action-bet'); }
  playActionRaise() { this.play('action-raise'); }
  playActionFold() { this.play('action-fold'); }

  // Game Events
  playRoundStart() { this.play('round-start'); }
  playRoundEnd() { this.play('round-end'); }
  playGameWin() { this.play('game-win'); }
  playGameLose() { this.play('game-lose'); }
  playTimerWarning() { this.play('timer-warning'); }
  playTimerCritical() { this.play('timer-critical'); }

  // Notifications
  playNotification() { this.play('notification'); }
  playError() { this.play('error'); }
  playSuccess() { this.play('success'); }

  // Connection
  playConnect() { this.play('connect'); }
  playDisconnect() { this.play('disconnect'); }

  // Ambient
  startCasinoAmbient() { this.play('casino-ambient'); }
  stopCasinoAmbient() { this.stop('casino-ambient'); }
  startGameMusic() { this.play('game-music'); }
  stopGameMusic() { this.stop('game-music'); }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Initialize sounds on first user interaction
let soundsInitialized = false;
export const initializeSounds = async (): Promise<void> => {
  if (soundsInitialized) return;
  
  try {
    await soundManager.initialize();
    soundsInitialized = true;
  } catch (error) {
    console.error('Failed to initialize sounds:', error);
  }
};

// Export convenience functions
export const playSound = (soundId: string, options?: { volume?: number; rate?: number }) => 
  soundManager.play(soundId, options);

export default soundManager;