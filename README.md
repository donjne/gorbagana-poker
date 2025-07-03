# 🃏 Gorbagana Poker

**A Two-Card Indian Poker Game on Gorbagana Testnet**

A lightning-fast multiplayer poker game built on the Gorbagana testnet, showcasing zero-MEV execution, instant finality, and Web2-like speed for on-chain gaming.

![Gorbagana Poker](https://via.placeholder.com/800x400/1a1a1a/00ff88?text=GORBAGANA+POKER)

## 🎮 Game Overview

Gorbagana Poker is a multiplayer implementation of **Two-Card Indian Poker**, a psychological warfare card game where strategy meets speed. Players receive one face-down card (hidden from them) and one face-up card (visible to all), creating a unique dynamic where you know everyone else's partial hand but not your own.

### 🎯 Core Gameplay

- **Players**: 2-8 per game
- **Cards**: Each player gets 2 cards (1 face-down, 1 face-up)
- **Betting**: Multiple rounds with check, bet, raise, and fold actions
- **Strategy**: Read opponents' visible cards and betting patterns
- **Winning**: Best combination of hidden + visible card wins the pot

### 🚀 Why Two-Card Indian Poker?

- **Fast Rounds**: Perfect for showcasing Gorbagana's instant finality
- **Psychological Elements**: Betting patterns create engaging social dynamics
- **Simple Rules**: Easy to learn, impossible to master
- **High Replayability**: Every hand feels different due to incomplete information

## 🌐 Gorbagana Integration

### ⚡ Speed & Fairness Features

- **Instant Finality**: Actions are confirmed immediately with no waiting
- **Zero-MEV Execution**: No front-running or manipulation possible
- **Web2-like UX**: Transactions feel as fast as traditional web apps
- **Fair Randomness**: Card dealing uses Gorbagana's native entropy

### 🪙 Native Token Integration

- **Betting Currency**: Games use $GOR testnet tokens for all betting
- **Dynamic Pot Sizes**: From micro-stakes (1 $GOR) to high-roller tables (1000+ $GOR)
- **Instant Payouts**: Winners receive tokens immediately upon game completion
- **Balance Updates**: Real-time wallet balance synchronization

### 🔧 Technical Integration

- **RPC Endpoint**: Connected to `https://rpc.gorbagana.wtf`
- **Wallet Support**: Backpack wallet integration for seamless user experience
- **Transaction Speed**: Leverages Gorbagana's one-validator architecture for consistent performance
- **Network Effects**: Demonstrates how fast consensus enables real-time gaming

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom gaming theme
- **Animations**: Framer Motion for smooth card and betting animations
- **State Management**: Zustand for game state and wallet management

### Blockchain Integration

- **Network**: Gorbagana Testnet (Solana fork)
- **Wallet**: Backpack wallet adapter
- **RPC**: Direct integration with Gorbagana's RPC endpoint
- **Tokens**: Native $GOR token transfers for betting

### Real-time Features

- **Backend**: NestJS with Socket.io for multiplayer coordination
- **Communication**: Real-time game state synchronization
- **Rooms**: Private game lobbies with invite codes
- **Chat**: In-game messaging system

### UI/UX Design

- **Theme**: Gorbagana-inspired dark greens with gold accents
- **Mascot**: Strategic placement of Gorbagana character
- **Responsive**: Mobile-first design with touch-friendly controls
- **Accessibility**: ARIA labels and keyboard navigation support

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- Backpack wallet extension installed
- Gorbagana testnet tokens (request in [Telegram chat](https://t.me/gorbagana))

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/gorbagana-poker.git
   cd gorbagana-poker
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:

   ```env
   # Gorbagana Network
   NEXT_PUBLIC_RPC_URL=https://rpc.gorbagana.wtf
   NEXT_PUBLIC_NETWORK=devnet
   
   # Backend API (for multiplayer features)
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   
   # Optional: Analytics and monitoring
   NEXT_PUBLIC_GA_ID=your_google_analytics_id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Backend Setup (Optional for Full Multiplayer)

The frontend includes mock data for development. For full multiplayer functionality:

1. **Clone the backend repository**

   ```bash
   git clone https://github.com/your-username/gorbagana-poker-backend.git
   cd gorbagana-poker-backend
   ```

2. **Follow backend setup instructions**
   See the backend README for NestJS server setup with Socket.io

### Getting Testnet Tokens

1. **Join the Gorbagana Telegram**: [https://t.me/gorbagana](https://t.me/gorbagana)
2. **Request tokens**: Post a short description of your testing needs
3. **Fund your wallet**: Receive testnet $GOR tokens for gameplay

## 🎯 Live Demo

### 🌐 Play Now

**[https://gorbagana-poker.vercel.app](https://gorbagana-poker.vercel.app)**

### 🎮 Demo Features

- **Wallet Connection**: Connect your Backpack wallet to get started
- **User Registration**: Set your username (one-time setup)
- **Game Creation**: Create private games with invite codes
- **Game Browsing**: Join public games or spectate ongoing matches
- **Tutorial Mode**: Learn the rules with interactive guidance

### 📱 Mobile Experience

The game is fully responsive and optimized for mobile play:

- Touch-friendly betting controls
- Swipe gestures for quick actions
- Optimized layouts for portrait and landscape modes

## 🎲 How to Play

### Game Setup

1. **Connect Wallet**: Use Backpack wallet to connect to Gorbagana
2. **Set Username**: Choose your player name (one-time setup)
3. **Join/Create Game**: Enter a game lobby with 2-8 players
4. **Set Stakes**: Agree on minimum bet amounts

### Gameplay Flow

1. **Card Dealing**: Each player receives 2 cards
   - 1 face-down card (hidden from you)
   - 1 face-up card (visible to all players)

2. **Betting Rounds**: Multiple rounds of betting actions
   - **Check**: Pass the action without betting
   - **Bet**: Place a wager into the pot
   - **Raise**: Increase the current bet amount
   - **Fold**: Give up your hand and forfeit the pot

3. **Information Warfare**:
   - You can see everyone else's face-up cards
   - You cannot see your own hidden card
   - Use opponents' visible cards and betting patterns to strategize

4. **Showdown**: After final betting round
   - All hidden cards are revealed
   - Best 2-card combination wins the entire pot

### Strategy Tips

- **Card Combinations** (high to low): Pair > High Card
- **Reading Opponents**: Watch betting patterns and visible cards
- **Bluffing**: Bet confidently even with weak visible cards
- **Pot Odds**: Calculate risk vs. reward for each betting decision

## 🏗️ Project Structure

```
gorbagana-poker/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Dashboard page
│   │   ├── game/               # Game page
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── wallet/             # Wallet integration
│   │   ├── game/               # Game-specific components
│   │   └── dashboard/          # Dashboard components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── stores/                 # Zustand state management
│   ├── styles/                 # Global styles
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 🎨 Design System

### Color Palette

- **Primary**: Dark forest greens (#0a3b3c, #1a5b5c)
- **Accent**: Bright gold/orange (#ffb800, #ff8c00)
- **Background**: Deep charcoal (#0a0a0a, #1a1a1a)
- **Success**: Bright green (#00ff88)
- **Danger**: Deep red (#ff4444)

### Typography

- **Headers**: Orbitron (futuristic gaming font)
- **Body**: Inter (clean, readable)
- **Monospace**: JetBrains Mono (for numbers and codes)

### Gaming Elements

- Glowing borders and shadows
- Smooth hover animations
- Card flip animations
- Particle effects for wins
- Pulsing effects for active states

## 🧪 Development

### Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

### Testing

```bash
# Run component tests
npm run test

# Run E2E tests
npm run test:e2e
```

### Performance

- Optimized bundle splitting
- Image optimization with Next.js
- Lazy loading for game components
- Service worker for offline functionality

## 📈 Roadmap

### Phase 1: Core Game ✅

- [x] Basic poker game implementation
- [x] Wallet integration
- [x] Real-time multiplayer
- [x] Mobile responsive design

### Phase 2: Enhanced Features 🔄

- [ ] Tournament mode
- [ ] Leaderboards and statistics
- [ ] Achievement system
- [ ] Advanced animations

### Phase 3: Community Features 📋

- [ ] Spectator mode improvements
- [ ] Replay system
- [ ] Social sharing
- [ ] Community tournaments

### Phase 4: Advanced Gaming 💭

- [ ] Multiple game variants
- [ ] AI opponents for practice
- [ ] VIP rooms and exclusive tables
- [ ] NFT integration for unique cards/themes

## 🤝 Contributing

We welcome contributions to make Gorbagana Poker even better!

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/feature`
3. Follow the local development setup above
4. Make your changes with proper TypeScript types
5. Ensure all tests pass and ESLint rules are followed
6. Submit a pull request

### Contribution Areas

- 🎮 Game mechanics and new variants
- 🎨 UI/UX improvements and animations
- 🔧 Performance optimizations
- 📱 Mobile experience enhancements
- ♿ Accessibility improvements
- 🧪 Testing and quality assurance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **🌐 Live Demo**: [gorbagana-poker.vercel.app](https://gorbagana-poker.vercel.app)
- **📱 Gorbagana Telegram**: [t.me/gorbagana](https://t.me/gorbagana)
- **🐦 Twitter**: [@Gorbagana_chain](https://twitter.com/Gorbagana_chain)
- **📚 Gorbagana Docs**: [docs.gorbagana.wtf](https://docs.gorbagana.wtf)
- **🛡️ Backpack Wallet**: [backpack.app](https://backpack.app)

## 🙏 Acknowledgments

- **Gorbagana Team**: For creating an amazing experimental testnet
- **Solana Foundation**: For the underlying blockchain technology
- **Backpack Team**: For the seamless wallet experience
- **Gaming Community**: For testing and feedback

---

**Built with ❤️ for the Gorbagana community**

*Experience the future of on-chain gaming - where every action is instant, every game is fair, and every player matters.*
