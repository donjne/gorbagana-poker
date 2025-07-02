// src/hooks/useSocket.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import { socketManager, connectSocket, disconnectSocket } from '@/lib/socket';
import { useWallet } from '@/hooks/useWallet';
import { toast } from '@/components/ui/Toaster';

import type { SocketEvents, Game, Player, PlayerActionData } from '@/types';

interface UseSocketReturn {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  socketId?: string;
  
  // Connection methods
  connect: () => Promise<void>;
  disconnect: () => void;
  
  // Event methods
  on: <K extends keyof SocketEvents>(event: K, listener: (data: SocketEvents[K]) => void) => void;
  off: <K extends keyof SocketEvents>(event: K, listener: (data: SocketEvents[K]) => void) => void;
  emit: <K extends keyof SocketEvents>(event: K, data: SocketEvents[K]) => void;
  
  // Game-specific methods
  joinGame: (gameId: string) => void;
  leaveGame: (gameId: string) => void;
  sendPlayerAction: (actionData: PlayerActionData) => void;
  readyForNextRound: (gameId: string) => void;
}

export function useSocket(): UseSocketReturn {
  const { user } = useWallet();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [socketId, setSocketId] = useState<string>();
  
  // Use refs to store current values for event listeners
  const userRef = useRef(user);
  const isConnectedRef = useRef(isConnected);
  
  // Update refs when values change
  useEffect(() => {
    userRef.current = user;
  }, [user]);
  
  useEffect(() => {
    isConnectedRef.current = isConnected;
  }, [isConnected]);

  // Monitor socket connection status
  useEffect(() => {
    const checkConnection = () => {
      const connected = socketManager.isConnected;
      setIsConnected(connected);
      setSocketId(socketManager.socketId);
    };

    // Check immediately
    checkConnection();

    // Set up periodic checks
    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, []);

  // Connect to socket
  const connect = useCallback(async (): Promise<void> => {
    if (isConnecting || isConnected) return;
    
    setIsConnecting(true);
    try {
      await connectSocket(user?.id);
      setIsConnected(true);
      setSocketId(socketManager.socketId);
    } catch (error) {
      console.error('Failed to connect socket:', error);
      toast.error('Failed to connect to game server');
    } finally {
      setIsConnecting(false);
    }
  }, [user?.id, isConnecting, isConnected]);

  // Disconnect socket
  const disconnect = useCallback((): void => {
    disconnectSocket();
    setIsConnected(false);
    setSocketId(undefined);
  }, []);

  // Auto-connect when user is available
  useEffect(() => {
    if (user && !isConnected && !isConnecting) {
      connect();
    }
  }, [user, isConnected, isConnecting, connect]);

  // Auto-disconnect when user logs out
  useEffect(() => {
    if (!user && isConnected) {
      disconnect();
    }
  }, [user, isConnected, disconnect]);

  // Event listener wrapper
  const on = useCallback(<K extends keyof SocketEvents>(
    event: K, 
    listener: (data: SocketEvents[K]) => void
  ): void => {
    socketManager.on(event, listener);
  }, []);

  // Event listener removal wrapper
  const off = useCallback(<K extends keyof SocketEvents>(
    event: K, 
    listener: (data: SocketEvents[K]) => void
  ): void => {
    socketManager.off(event, listener);
  }, []);

  // Emit event wrapper
  const emit = useCallback(<K extends keyof SocketEvents>(
    event: K, 
    data: SocketEvents[K]
  ): void => {
    if (!isConnected) {
      toast.error('Cannot send action: not connected to server');
      return;
    }
    socketManager.emit(event, data);
  }, [isConnected]);

  // Game-specific methods
  const joinGame = useCallback((gameId: string): void => {
    if (!user) {
      toast.error('Must be logged in to join game');
      return;
    }
    socketManager.joinGame(gameId, user.id);
  }, [user]);

  const leaveGame = useCallback((gameId: string): void => {
    if (!user) return;
    socketManager.leaveGame(gameId, user.id);
  }, [user]);

  const sendPlayerAction = useCallback((actionData: PlayerActionData): void => {
    if (!isConnected) {
      toast.error('Cannot send action: not connected to server');
      return;
    }
    socketManager.sendPlayerAction(actionData);
  }, [isConnected]);

  const readyForNextRound = useCallback((gameId: string): void => {
    if (!user) return;
    socketManager.readyForNextRound(gameId, user.id);
  }, [user]);

  return {
    // Connection state
    isConnected,
    isConnecting,
    socketId,
    
    // Connection methods
    connect,
    disconnect,
    
    // Event methods
    on,
    off,
    emit,
    
    // Game-specific methods
    joinGame,
    leaveGame,
    sendPlayerAction,
    readyForNextRound,
  };
}