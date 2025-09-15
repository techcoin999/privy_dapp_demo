# Solana dApp with Wallet Connection & Social Login

A modern Solana decentralized application featuring both traditional Web3 wallet connections and social login through Privy MPC wallets.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev
# OR
yarn start

# Build for production
yarn build
```

The app will be available at: **http://localhost:3000**

## ✨ Features

### 🔗 Dual Wallet System
- **Traditional Web3 Wallets**: Phantom, MetaMask, and other Solana-compatible wallets
- **Social Login**: Email, Google, Twitter, Apple via Privy MPC wallets
- **Seamless Integration**: Both wallet types work together in the same interface

### 🎨 User Experience
- **Upper Right Connect Button**: Clean, accessible wallet connection
- **Modal Overlay**: In-page wallet selection (no redirects)
- **Social Login Priority**: "Login with email or social" as the first option
- **Purple Theme**: Consistent #7c3aed branding throughout
- **Mobile Responsive**: Works on all device sizes

### 🔐 Security & Privacy
- **MPC Wallets**: Multi-party computation for enhanced security
- **Non-Custodial**: Users maintain control of their private keys
- **Environment Variables**: Secure configuration management
- **No Sensitive Data**: Client-side code contains no secrets

## 🛠 Technical Architecture

### Core Technologies
- **React 18.2.0** with TypeScript
- **Vite 7.1.5** for lightning-fast development
- **Tailwind CSS** for styling
- **Solana Wallet Adapter** for Web3 wallet integration
- **Privy SDK** for social authentication and MPC wallets

### Key Components

#### 1. CombinedWalletProvider (`src/providers/CombinedWalletProvider.tsx`)
- Unifies Privy and Solana wallet adapters
- Handles provider hierarchy and context management
- Configures social login methods and embedded wallets

#### 2. WalletConnectionButton (`src/components/WalletConnectionButton.tsx`)
- Main UI component for wallet connection
- Modal-based wallet selection interface
- Handles both social and traditional wallet flows

#### 3. WalletContext (`src/contexts/WalletContext.tsx`)
- Central state management for wallet connections
- Provides hooks for accessing wallet state
- Manages authentication status across providers

### Environment Configuration
Create a `.env.local` file with your Privy App ID:
```bash
VITE_PRIVY_APP_ID=your_privy_app_id_here
```

## 📋 Available Scripts

- `yarn dev` - Start development server (Vite)
- `yarn start` - Alternative start command  
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn test` - Run test suite

## Project Structure

```
src/
├── components/
│   ├── WalletConnectionModal.tsx  # Wallet selection modal
│   └── TransferComponent.tsx      # SOL transfer interface
├── providers/
│   └── WalletProvider.tsx         # Solana wallet context provider
├── App.tsx                         # Main application component
├── index.tsx                       # Application entry point
└── index.css                       # Global styles with Tailwind
```

## Usage

1. **Connect Wallet**
   - Click the "Connect" button in the upper right corner
   - Choose between social login or Web3 wallet
   - For social login: Select your preferred platform (Google, Twitter, Discord, Email)
   - For Web3 wallet: Select from available wallets (Phantom, Solflare, etc.)

2. **Transfer SOL**
   - After connecting, the transfer interface will appear
   - Enter recipient's Solana address
   - Enter amount of SOL to send
   - Click "Send SOL" to execute the transfer
   - View transaction confirmation with explorer link

3. **Disconnect/Switch Account**
   - Click "Disconnect" to disconnect current wallet
   - When switching accounts in Phantom, disconnect first then reconnect
   - The app will automatically detect the new account

## Network Configuration

The app is configured to use Solana Devnet by default. To change networks:
1. Update the network in `src/providers/WalletProvider.tsx`
2. Change `WalletAdapterNetwork.Devnet` to your desired network

## Important Notes

- This DApp runs on Solana Devnet for testing
- Make sure you have Devnet SOL for testing transfers
- Get free Devnet SOL from: https://solfaucet.com/
- Phantom wallet is recommended for the best experience

## Troubleshooting

If you encounter compilation errors:
1. Make sure you're using Node.js version 16 or higher
2. Use `npm install --legacy-peer-deps` for dependency conflicts
3. Clear node_modules and package-lock.json, then reinstall

## Security Considerations

- Never share your private keys or seed phrases
- Always verify transaction details before confirming
- This is a demo app - use appropriate security measures for production