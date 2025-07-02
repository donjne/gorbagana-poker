'use client';

import { useState, useRef, useEffect, JSX } from 'react';
import { Send, MessageSquare, Minimize2, Maximize2, Smile } from 'lucide-react';
import { useSocket } from '@/hooks/useSocket';
import { toast } from '@/components/ui/Toaster';

import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

import type { Player, User } from '@/types';

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: string;
  type: 'chat' | 'system' | 'action';
}

interface GameChatProps {
  gameId: string;
  players: Player[];
  currentUser: User | null;
  className?: string;
}

export function GameChat({ 
  gameId, 
  players, 
  currentUser,
  className 
}: GameChatProps): JSX.Element {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Socket integration
  const { isConnected, emit, on, off } = useSocket();

  // Initialize chat and socket listeners
  useEffect(() => {
    // Only proceed if user is authenticated
    if (!currentUser?.id) return;

    // Mock initial system message
    const systemMessage: ChatMessage = {
      id: 'system-welcome',
      playerId: 'system',
      playerName: 'System',
      message: 'Game chat connected. Good luck everyone!',
      timestamp: new Date().toISOString(),
      type: 'system'
    };
    setMessages([systemMessage]);

    // Socket event listeners for chat
    const handleChatMessage = (data: {
      playerId: string;
      playerName: string;
      message: string;
      timestamp: string;
    }) => {
      const chatMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random()}`,
        playerId: data.playerId,
        playerName: data.playerName,
        message: data.message,
        timestamp: data.timestamp,
        type: 'chat'
      };
      setMessages(prev => [...prev, chatMessage]);
    };

    const handlePlayerAction = (data: {
      playerId: string;
      playerName: string;
      action: string;
      amount?: number;
    }) => {
      const actionMessage: ChatMessage = {
        id: `action-${Date.now()}-${Math.random()}`,
        playerId: 'system',
        playerName: 'System',
        message: data.amount 
          ? `${data.playerName} ${data.action} ${data.amount} GOR`
          : `${data.playerName} ${data.action}`,
        timestamp: new Date().toISOString(),
        type: 'action'
      };
      setMessages(prev => [...prev, actionMessage]);
    };

    const handleSystemMessage = (data: {
      message: string;
      type?: 'info' | 'warning' | 'success';
    }) => {
      const systemMessage: ChatMessage = {
        id: `system-${Date.now()}-${Math.random()}`,
        playerId: 'system',
        playerName: 'System',
        message: data.message,
        timestamp: new Date().toISOString(),
        type: 'system'
      };
      setMessages(prev => [...prev, systemMessage]);
    };

    // Listen to socket events
    if (isConnected) {
      on('chat-message', handleChatMessage);
      on('player-action-broadcast', handlePlayerAction);
      on('system-message', handleSystemMessage);
      
      // Join chat room - now safe because we checked currentUser.id above
      emit('join-chat', { gameId, playerId: currentUser.id });
    }

    return () => {
      // Cleanup socket listeners
      if (isConnected && currentUser.id) {
        off('chat-message', handleChatMessage);
        off('player-action-broadcast', handlePlayerAction);
        off('system-message', handleSystemMessage);
        
        // Leave chat room
        emit('leave-chat', { gameId, playerId: currentUser.id });
      }
    };
  }, [gameId, currentUser?.id, isConnected, emit, on, off]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (): void => {
    if (!newMessage.trim() || !currentUser || !isConnected) {
      if (!isConnected) {
        toast.error('Not connected to chat server');
      }
      return;
    }

    const messageData = {
      gameId,
      playerId: currentUser.id,
      playerName: currentUser.username,
      message: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    // Send via socket
    emit('send-chat-message', messageData);

    // Add to local messages immediately (optimistic update)
    const localMessage: ChatMessage = {
      id: `local-${Date.now()}`,
      ...messageData,
      type: 'chat' as const
    };
    setMessages(prev => [...prev, localMessage]);
    
    setNewMessage('');
    
    console.log('Sent chat message:', messageData);
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addEmoji = (emoji: string): void => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const getMessageColor = (message: ChatMessage): string => {
    switch (message.type) {
      case 'system':
        return 'text-blue-400';
      case 'action':
        return 'text-gor-400';
      case 'chat':
        return message.playerId === currentUser?.id ? 'text-primary-400' : 'text-white';
      default:
        return 'text-gray-400';
    }
  };

  const getMessageBg = (message: ChatMessage): string => {
    if (message.type === 'system') return 'bg-blue-500/10';
    if (message.type === 'action') return 'bg-gor-400/10';
    if (message.playerId === currentUser?.id) return 'bg-primary-500/10';
    return 'bg-surface-secondary/50';
  };

  const commonEmojis = ['😀', '😂', '😎', '🤔', '😱', '🔥', '💪', '👍', '👎', '❤️', '🎉', '😈'];

  if (isMinimized) {
    return (
      <div className={cn(
        'fixed bottom-4 right-4 bg-surface-primary rounded-lg border border-surface-tertiary shadow-card',
        className
      )}>
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center space-x-2 p-3 hover:bg-surface-secondary rounded-lg transition-colors"
        >
          <MessageSquare className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-300">Chat</span>
          {/* Connection indicator */}
          <div className={cn(
            'w-2 h-2 rounded-full',
            isConnected ? 'bg-green-400' : 'bg-red-400'
          )} />
          <Maximize2 className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      'bg-surface-primary/95 backdrop-blur-md rounded-lg border border-surface-tertiary shadow-card flex flex-col h-full max-h-96',
      className
    )}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 border-b border-surface-tertiary">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-white">Game Chat</span>
          <span className="text-xs text-gray-500">
            ({players.length} players)
          </span>
          {/* Connection status */}
          <div className={cn(
            'w-2 h-2 rounded-full',
            isConnected ? 'bg-green-400' : 'bg-red-400'
          )} />
          {!isConnected && (
            <span className="text-xs text-red-400">Offline</span>
          )}
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1 hover:bg-surface-secondary rounded transition-colors"
        >
          <Minimize2 className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'p-2 rounded-lg text-sm transition-colors',
                getMessageBg(message)
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  'font-medium text-xs',
                  getMessageColor(message)
                )}>
                  {message.playerName}
                </span>
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(message.timestamp)}
                </span>
              </div>
              <div className={cn(
                'text-sm break-words',
                message.type === 'system' ? 'italic' : '',
                getMessageColor(message)
              )}>
                {message.message}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="p-2 border-t border-surface-tertiary bg-surface-secondary/50">
          <div className="grid grid-cols-6 gap-1">
            {commonEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="p-1 hover:bg-surface-tertiary rounded text-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-surface-tertiary">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isConnected ? "Type a message..." : "Connecting..."}
              className="input-primary w-full pr-8 text-sm"
              maxLength={200}
              disabled={!currentUser || !isConnected}
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-surface-secondary rounded transition-colors"
              disabled={!currentUser || !isConnected}
            >
              <Smile className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !currentUser || !isConnected}
            className="btn-primary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title={!isConnected ? "Not connected to chat" : "Send message"}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        
        {!currentUser ? (
          <div className="text-xs text-gray-500 mt-2">
            Connect your wallet to chat
          </div>
        ) : !isConnected ? (
          <div className="text-xs text-red-400 mt-2">
            Connecting to chat server...
          </div>
        ) : (
          <div className="text-xs text-gray-500 mt-2">
            Press Enter to send • {200 - newMessage.length} characters left
          </div>
        )}
      </div>
    </div>
  );
}