// src/components/ui/ConnectionStatus.tsx
'use client';

import { useState, useEffect, JSX } from 'react';
import { 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  RefreshCw,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium
} from 'lucide-react';

import { useSocket } from '@/hooks/useSocket';
import { useRealtimeStore } from '@/stores/realtimeStore';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  className?: string;
  showDetails?: boolean;
  variant?: 'minimal' | 'detailed' | 'indicator';
}

export function ConnectionStatus({ 
  className, 
  showDetails = false,
  variant = 'minimal'
}: ConnectionStatusProps): JSX.Element {
  const { isConnected, isConnecting, socketId, connect } = useSocket();
  const { reconnecting, lastConnectionTime, pendingSync } = useRealtimeStore();
  
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('disconnected');
  const [latency, setLatency] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Monitor connection quality
  useEffect(() => {
    if (!isConnected) {
      setConnectionQuality('disconnected');
      setLatency(null);
      return;
    }

    // Simulate latency checking (in real app, ping the server)
    const checkLatency = () => {
      const start = Date.now();
      // Simulate network check
      setTimeout(() => {
        const end = Date.now();
        const simulatedLatency = Math.random() * 200 + 20; // 20-220ms
        setLatency(simulatedLatency);

        if (simulatedLatency < 50) {
          setConnectionQuality('excellent');
        } else if (simulatedLatency < 100) {
          setConnectionQuality('good');
        } else {
          setConnectionQuality('poor');
        }
      }, Math.random() * 100);
    };

    checkLatency();
    const interval = setInterval(checkLatency, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const getStatusColor = (): string => {
    if (isConnecting || reconnecting) return 'text-warning';
    if (!isConnected) return 'text-danger';
    
    switch (connectionQuality) {
      case 'excellent':
        return 'text-success';
      case 'good':
        return 'text-info';
      case 'poor':
        return 'text-warning';
      default:
        return 'text-danger';
    }
  };

  const getStatusIcon = (): JSX.Element => {
    if (isConnecting || reconnecting) {
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    }
    
    if (!isConnected) {
      return <WifiOff className="h-4 w-4" />;
    }

    switch (connectionQuality) {
      case 'excellent':
        return <SignalHigh className="h-4 w-4" />;
      case 'good':
        return <SignalMedium className="h-4 w-4" />;
      case 'poor':
        return <SignalLow className="h-4 w-4" />;
      default:
        return <Signal className="h-4 w-4" />;
    }
  };

  const getStatusText = (): string => {
    if (isConnecting) return 'Connecting...';
    if (reconnecting) return 'Reconnecting...';
    if (!isConnected) return 'Disconnected';
    if (pendingSync) return 'Syncing...';
    
    switch (connectionQuality) {
      case 'excellent':
        return 'Connected';
      case 'good':
        return 'Connected';
      case 'poor':
        return 'Slow Connection';
      default:
        return 'Connected';
    }
  };

  const handleReconnect = (): void => {
    connect();
    setShowDropdown(false);
  };

  // Minimal indicator variant
  if (variant === 'indicator') {
    return (
      <div className={cn('flex items-center', className)}>
        <div className={cn(
          'w-2 h-2 rounded-full transition-colors',
          isConnected ? 'bg-success' : 'bg-danger',
          (isConnecting || reconnecting) && 'animate-pulse'
        )} />
      </div>
    );
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={cn(
        'flex items-center space-x-2 text-sm',
        getStatusColor(),
        className
      )}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>
    );
  }

  // Detailed variant
  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={cn(
          'flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200',
          'bg-surface-primary/90 backdrop-blur-md hover:bg-surface-secondary',
          isConnected 
            ? 'border-success/30' 
            : 'border-danger/30'
        )}
      >
        <div className={cn('flex items-center space-x-2', getStatusColor())}>
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
        
        {latency && (
          <span className="text-xs text-gray-400">
            {Math.round(latency)}ms
          </span>
        )}
      </button>

      {/* Detailed Dropdown */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-surface-primary border border-surface-tertiary rounded-lg shadow-card z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Connection Status</h3>
              <div className={cn('flex items-center space-x-1', getStatusColor())}>
                {getStatusIcon()}
                <span className="text-xs font-medium">{getStatusText()}</span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              {/* Connection Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-gray-400 text-xs">Status</div>
                  <div className={cn('font-medium', getStatusColor())}>
                    {isConnected ? 'Online' : 'Offline'}
                  </div>
                </div>
                
                {latency && (
                  <div>
                    <div className="text-gray-400 text-xs">Latency</div>
                    <div className={cn(
                      'font-medium',
                      latency < 50 ? 'text-success' : 
                      latency < 100 ? 'text-info' : 'text-warning'
                    )}>
                      {Math.round(latency)}ms
                    </div>
                  </div>
                )}
              </div>

              {/* Socket ID */}
              {socketId && (
                <div>
                  <div className="text-gray-400 text-xs">Socket ID</div>
                  <div className="font-mono text-xs text-gray-300">
                    {socketId.slice(0, 8)}...
                  </div>
                </div>
              )}

              {/* Last Connection */}
              {lastConnectionTime && (
                <div>
                  <div className="text-gray-400 text-xs">Connected Since</div>
                  <div className="text-gray-300 text-xs">
                    {new Date(lastConnectionTime).toLocaleTimeString()}
                  </div>
                </div>
              )}

              {/* Connection Quality Indicator */}
              <div>
                <div className="text-gray-400 text-xs mb-2">Connection Quality</div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4].map((bar) => (
                    <div
                      key={bar}
                      className={cn(
                        'w-2 h-4 rounded-sm transition-colors',
                        isConnected && (
                          (connectionQuality === 'excellent' && bar <= 4) ||
                          (connectionQuality === 'good' && bar <= 3) ||
                          (connectionQuality === 'poor' && bar <= 2)
                        ) ? 'bg-success' : 'bg-surface-tertiary'
                      )}
                    />
                  ))}
                  <span className="text-xs text-gray-400 ml-2">
                    {connectionQuality === 'excellent' && 'Excellent'}
                    {connectionQuality === 'good' && 'Good'}
                    {connectionQuality === 'poor' && 'Poor'}
                    {connectionQuality === 'disconnected' && 'Disconnected'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-surface-tertiary space-y-2">
                {!isConnected && (
                  <button
                    onClick={handleReconnect}
                    className="btn-primary w-full text-sm py-2"
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      'Reconnect'
                    )}
                  </button>
                )}

                {isConnected && connectionQuality === 'poor' && (
                  <div className="bg-warning/10 border border-warning/20 rounded p-2">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-3 w-3 text-warning" />
                      <span className="text-warning text-xs">
                        Poor connection may affect gameplay
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowDropdown(false)}
                  className="btn-secondary w-full text-sm py-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}