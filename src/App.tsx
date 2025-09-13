import React from 'react';
import { CombinedWalletProvider } from './providers/CombinedWalletProvider';
import { TransferComponent } from './components/TransferComponent';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePrivy } from '@privy-io/react-auth';
import { CustomWalletButton } from './components/CustomWalletButton';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import './App.css';
import { ErrorBoundary } from './ErrorBoundary';

function AppContent() {
  const { connected } = useWallet();
  const { authenticated: privyAuthenticated } = usePrivy();
  
  const isConnected = connected || privyAuthenticated;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <CustomWalletButton />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Solana DApp
          </h1>
          <p className="text-xl text-gray-600">
            Connect your wallet and start transferring SOL
          </p>
        </div>

        {isConnected ? (
          <div className="max-w-4xl mx-auto">
            <TransferComponent />
            
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Network Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Network:</span>
                  <span className="ml-2 font-medium text-gray-900">Devnet</span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className="ml-2 font-medium text-green-600">Connected</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-lg p-12">
              <svg
                className="w-24 h-24 mx-auto mb-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 mb-8">
                Connect your Solana wallet or login with social media to access all features of this DApp.
              </p>
              <WalletMultiButton className="!px-8 !py-3 !bg-purple-600 !text-white !rounded-lg hover:!bg-purple-700 !transition-colors !font-medium" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <CombinedWalletProvider>
        <AppContent />
      </CombinedWalletProvider>
    </ErrorBoundary>
  );
}

export default App;
