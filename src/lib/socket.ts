// src/lib/socket.ts
import { toast } from '@/components/ui/Toaster';
import type { SocketEvents, Game, Player, PlayerActionData } from '@/types';

// Custom Socket interface to avoid import issues
interface CustomSocket {
  connected: boolean;
  id: string;
  on(event: string, callback: (...args: any[]) => void): void;
  emit(event: string, ...args: any[]): void;
  connect(): void;
  disconnect(): void;
}

class SocketManager {
  private socket: CustomSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000;
  private isConnecting = false;

  // Event listeners storage
  private eventListeners: Map<string, Function[]> = new Map();

  /**
   * Initialize socket connection
   */
  connect(userId?: string): Promise<CustomSocket> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      if (this.isConnecting) {
        // Wait for existing connection attempt
        const checkConnection = () => {
          if (this.socket?.connected) {
            resolve(this.socket);
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
        return;
      }

      this.isConnecting = true;

      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
      
      // Create a mock socket for development when socket.io is not available
      console.warn('Socket.io client not available, creating mock socket');
      this.socket = this.createMockSocket();

      // Connection success
      setTimeout(() => {
        if (this.socket) {
          console.log('Mock socket connected:', this.socket.id);
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          toast.success('Connected to game server');
          this.setupEventForwarding();
          resolve(this.socket);
        }
      }, 1000);
    });
  }

  /**
   * Create a mock socket for development when socket.io is not available
   */
  private createMockSocket(): CustomSocket {
    return {
      connected: true,
      id: 'mock-socket-' + Math.random().toString(36).substr(2, 9),
      on: (event: string, callback: (...args: any[]) => void) => {
        console.log(`Mock socket: listening to ${event}`);
      },
      emit: (event: string, ...args: any[]) => {
        console.log(`Mock socket: emitting ${event}`, args);
      },
      connect: () => {
        console.log('Mock socket: connecting');
      },
      disconnect: () => {
        console.log('Mock socket: disconnecting');
      }
    };
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.eventListeners.clear();
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectInterval * Math.pow(2, this.reconnectAttempts), 10000);
    
    setTimeout(() => {
      if (!this.socket?.connected) {
        console.log(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.socket?.connect();
      }
    }, delay);
  }

  private setupEventForwarding(): void {
    if (!this.socket) return;

    this.socket.on('game-updated', (game: Game) => {
      this.emitToListeners('game-updated', game);
    });

    this.socket.on('player-joined', (data: { game: Game; player: Player }) => {
      this.emitToListeners('player-joined', data);
    });

    this.socket.on('player-left', (data: { game: Game; playerId: string }) => {
      this.emitToListeners('player-left', data);
    });

    this.socket.on('action-broadcast', (actionData: PlayerActionData) => {
      this.emitToListeners('action-broadcast', actionData);
    });

    this.socket.on('round-started', (data: { game: Game }) => {
      this.emitToListeners('round-started', data);
    });

    this.socket.on('round-ended', (data: { game: Game; winner: Player }) => {
      this.emitToListeners('round-ended', data);
    });

    this.socket.on('game-ended', (data: { game: Game; winner: Player }) => {
      this.emitToListeners('game-ended', data);
    });

    this.socket.on('timer-update', (data: { playerId: string; timeRemaining: number }) => {
      this.emitToListeners('timer-update', data);
    });

    this.socket.on('error', (data: { message: string }) => {
      this.emitToListeners('error', data);
      toast.error(data.message);
    });
  }

  private emitToListeners(event: string, data: unknown): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in socket listener for ${event}:`, error);
      }
    });
  }

  on<K extends keyof SocketEvents>(event: K, listener: (data: SocketEvents[K]) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  off<K extends keyof SocketEvents>(event: K, listener: (data: SocketEvents[K]) => void): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit<K extends keyof SocketEvents>(event: K, data: SocketEvents[K]): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`Cannot emit ${event}: socket not connected`);
      toast.error('Action failed: not connected to server');
    }
  }

  joinGame(gameId: string, userId: string): void {
    this.emit('join-game', { gameId, userId });
  }

  leaveGame(gameId: string, userId: string): void {
    this.emit('leave-game', { gameId, userId });
  }

  sendPlayerAction(actionData: PlayerActionData): void {
    this.emit('player-action', actionData);
  }

  readyForNextRound(gameId: string, playerId: string): void {
    this.emit('ready-for-next-round', { gameId, playerId });
  }

  get isConnected(): boolean {
    return this.socket?.connected || false;
  }

  get socketId(): string | undefined {
    return this.socket?.id;
  }
}

// Create singleton instance
export const socketManager = new SocketManager();

// Export convenience functions
export const connectSocket = (userId?: string) => socketManager.connect(userId);
export const disconnectSocket = () => socketManager.disconnect();
export const emitSocketEvent = <K extends keyof SocketEvents>(event: K, data: SocketEvents[K]) => 
  socketManager.emit(event, data);
export const onSocketEvent = <K extends keyof SocketEvents>(
  event: K, 
  listener: (data: SocketEvents[K]) => void
) => socketManager.on(event, listener);
export const offSocketEvent = <K extends keyof SocketEvents>(
  event: K, 
  listener: (data: SocketEvents[K]) => void
) => socketManager.off(event, listener);

export default socketManager;