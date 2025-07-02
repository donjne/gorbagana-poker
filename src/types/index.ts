// User types
export interface User {
  id: string;
  walletAddress: string;
  username: string;
  gorBalance: number;
  totalStaked: number;
  gamesWon: number;
  gamesLost: number;
  winRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  gorBalance: number;
  totalStaked: number;
  gamesWon: number;
  gamesLost: number;
  winRate: number;
  recentTransactions: Transaction[];
}

// Game types
export interface Game {
  id: string;
  inviteCode: string;
  status: GameStatus;
  currentRound: number;
  maxPlayers: number;
  ante: number;
  pot: number;
  currentBet: number;
  currentPlayerIndex: number;
  players: Player[];
  deck: Card[];
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  winner?: string;
}

export type GameStatus = 
  | 'waiting'    // Waiting for players to join
  | 'starting'   // Game is starting (dealing cards)
  | 'betting'    // Betting round in progress
  | 'showdown'   // Revealing cards
  | 'finished'   // Game completed
  | 'cancelled'; // Game cancelled

export interface Player {
  id: string;
  userId: string;
  username: string;
  walletAddress: string;
  position: number;
  card: Card | null;
  chips: number;
  currentBet: number;
  isActive: boolean;
  isFolded: boolean;
  lastAction: PlayerAction | null;
  timeRemaining: number;
  isConnected: boolean;
}

export type PlayerAction = 
  | 'check'
  | 'bet'
  | 'call'
  | 'raise'
  | 'fold'
  | 'auto-fold'; // When timer expires

export interface PlayerActionData {
  playerId: string;
  action: PlayerAction;
  amount?: number;
  timestamp: string;
}

// Card types
export interface Card {
  suit: CardSuit;
  rank: CardRank;
  value: number;
}

export type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type CardRank = 
  | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
  | 'J' | 'Q' | 'K' | 'A';

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  gameId?: string;
  txHash?: string;
  status: TransactionStatus;
  createdAt: string;
}

export type TransactionType = 
  | 'ante'
  | 'bet'
  | 'win'
  | 'deposit'
  | 'withdrawal';

export type TransactionStatus = 
  | 'pending'
  | 'confirmed'
  | 'failed';

// Wallet types
export interface WalletState {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  balance: number | null;
  publicKey: string | null;
}

// Socket event types
export interface SocketEvents {
  // Existing game events
  'join-game': { gameId: string; userId: string };
  'leave-game': { gameId: string; userId: string };
  'player-action': PlayerActionData;
  'ready-for-next-round': { gameId: string; playerId: string };
  'request-game-state': { gameId: string };

  // Chat events (Client to Server)
  'join-chat': { gameId: string; playerId: string };
  'leave-chat': { gameId: string; playerId: string };
  'send-chat-message': {
    gameId: string;
    playerId: string;
    playerName: string;
    message: string;
    timestamp: string;
  };

  // Server events
  'game-updated': Game;
  'player-joined': { game: Game; player: Player };
  'player-left': { game: Game; playerId: string };
  'action-broadcast': PlayerActionData;
  'round-started': { game: Game };
  'round-ended': { game: Game; winner: Player };
  'game-ended': { game: Game; winner: Player };
  'timer-update': { playerId: string; timeRemaining: number };
  'error': { message: string };

  // Chat events (Server to Client)
  'chat-message': {
    playerId: string;
    playerName: string;
    message: string;
    timestamp: string;
  };
  'player-action-broadcast': {
    playerId: string;
    playerName: string;
    action: string;
    amount?: number;
  };
  'system-message': {
    message: string;
    type?: 'info' | 'warning' | 'success';
  };
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreateGameRequest {
  maxPlayers: number;
  ante: number;
}

export interface CreateGameResponse {
  game: Game;
  inviteCode: string;
}

export interface JoinGameRequest {
  inviteCode: string;
}

export interface JoinGameResponse {
  game: Game;
  player: Player;
}

export interface RegisterUserRequest {
  walletAddress: string;
  username: string;
}

export interface RegisterUserResponse {
  user: User;
  token: string;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Game Board component props
export interface GameBoardProps {
  gameId: string;
  game?: Game | null;
  className?: string;
}

export interface MobileGameBoardProps {
  gameId: string;
  game?: Game | null;
  className?: string;
}

// Game Chat component props
export interface GameChatProps {
  gameId: string;
  players: Player[];
  currentUser: User | null;
  compact?: boolean; // Make compact optional
}

// Mobile Betting Controls props
export interface MobileBettingControlsProps {
  currentBet: number;
  minBet: number;
  maxBet: number;
  playerStack: number;
  potSize: number;
  onAction: (action: PlayerAction, amount?: number) => Promise<void>;
  timeRemaining: number;
  isMyTurn: boolean;
  canCheck: boolean;
  callAmount: number;
}

// Hook return types
export interface UseWalletReturn {
  user: User | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  balance: number | null;
}

export interface UseRealtimeGameReturn {
  game: Game | null;
  isConnected: boolean;
  isSyncing: boolean;
  sendAction: (actionData: PlayerActionData) => Promise<void>;
  requestSync: () => void;
}

export interface UseRealtimeGameOptions {
  gameId: string;
  autoJoin?: boolean;
  onPlayerJoined?: (data: { game: Game; player: Player }) => void;
  onPlayerLeft?: (data: { game: Game; playerId: string }) => void;
  onGameUpdated?: (game: Game) => void;
  onActionBroadcast?: (actionData: PlayerActionData) => void;
  onRoundEnded?: (data: { game: Game; winner: Player }) => void;
}

// Game configuration
export interface GameConfig {
  minPlayers: number;
  maxPlayers: number;
  minAnte: number;
  maxAnte: number;
  turnTimeout: number; // seconds
  roundDelay: number; // seconds between rounds
}

// Constants
export const GAME_CONFIG: GameConfig = {
  minPlayers: 2,
  maxPlayers: 6,
  minAnte: 10,
  maxAnte: 1000,
  turnTimeout: 30,
  roundDelay: 3,
};

export const CARD_VALUES: Record<CardRank, number> = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 11, 'Q': 12, 'K': 13, 'A': 14,
};