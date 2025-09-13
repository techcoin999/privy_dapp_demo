import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { SocialLoginModal } from './SocialLoginModal';

export const CustomWalletButton: React.FC = () => {
  const { connected, publicKey, wallet } = useWallet();
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  const handleConnectClick = () => {
    setShowWalletOptions(true);
  };

  const handleSocialLoginClick = () => {
    setShowSocialModal(true);
    setShowWalletOptions(false);
  };

  const handleCloseModals = () => {
    setShowSocialModal(false);
    setShowWalletOptions(false);
  };

  if (connected) {
    return (
      <div className="fixed top-4 right-4 z-40">
        <div className="flex items-center gap-3 bg-white rounded-lg shadow-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
            </span>
          </div>
          <WalletDisconnectButton className="!px-4 !py-2 !bg-red-500 !text-white !rounded-lg hover:!bg-red-600 !transition-colors !font-medium !text-sm" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={handleConnectClick}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-lg"
        >
          Connect Wallet
        </button>
      </div>

      {/* Wallet Options Modal */}
      {showWalletOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Connect Wallet</h2>
              <button
                onClick={handleCloseModals}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Social Login Option - First */}
              <button
                onClick={handleSocialLoginClick}
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Login with Email or Social
              </button>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="mx-4 text-sm text-gray-500 font-medium">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Traditional Wallet Options */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // This will trigger the Solana wallet adapter modal
                    setShowWalletOptions(false);
                    // We'll need to integrate with the WalletMultiButton functionality
                  }}
                  className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <img 
                    src="https://phantom.app/img/phantom-icon.svg" 
                    alt="Phantom" 
                    className="w-5 h-5 mr-3"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Connect Crypto Wallet
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Supports Phantom, Solflare, Ledger, and other Solana wallets
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Social Login Modal */}
      <SocialLoginModal 
        isOpen={showSocialModal}
        onClose={handleCloseModals}
      />
    </>
  );
};