import React, { useEffect, useMemo, useState } from 'react';
import { usePrivy, useWallets, useLogout } from '@privy-io/react-auth';
import { SocialLoginModal } from './SocialLoginModal';
import { PrivyCryptoWalletModal } from './PrivyCryptoWalletModal';

export const CustomWalletButton: React.FC = () => {
  const { ready } = usePrivy();
  const { wallets } = useWallets();
  const { logout } = useLogout();

  const [showSocialModal, setShowSocialModal] = useState(false);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [showCryptoWalletModal, setShowCryptoWalletModal] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [extAddress, setExtAddress] = useState<string | undefined>();
  const [extWalletName, setExtWalletName] = useState<string | undefined>();

  // Derive connected wallet from Privy
  const connectedPrivyWallet = useMemo(() => {
    return (wallets as any[]).find(
      (w: any) => (w?.type === 'solana' || w?.chainType === 'solana') && w?.address
    );
  }, [wallets]);

  const address = extAddress || (connectedPrivyWallet as any)?.address;
  const walletName = extWalletName || (connectedPrivyWallet as any)?.meta?.name || (connectedPrivyWallet as any)?.walletClientType;
  const isConnected = Boolean(address);

  // Keep local state in sync with Privy wallet list
  useEffect(() => {
    if (connectedPrivyWallet?.address) {
      setExtAddress(connectedPrivyWallet.address);
      setExtWalletName(connectedPrivyWallet?.meta?.name || connectedPrivyWallet?.walletClientType);
    }
  }, [connectedPrivyWallet]);

  const handleConnectClick = () => setShowWalletOptions(true);
  const handleSocialLoginClick = () => { setShowSocialModal(true); setShowWalletOptions(false); };
  const handleCryptoWalletClick = () => { setShowCryptoWalletModal(true); setShowWalletOptions(false); };
  const handleCloseModals = () => { setShowSocialModal(false); setShowWalletOptions(false); setShowCryptoWalletModal(false); };

  const truncate = (a?: string) => a ? `${a.slice(0, 4)}...${a.slice(-4)}` : '';

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      try { await (connectedPrivyWallet as any)?.disconnect?.(); } catch {}

      // Clear Privy cached tokens and any persisted wallet selection
      try {
        const lsKeys = Object.keys(localStorage);
        lsKeys.forEach((k) => { if (k.startsWith('privy:')) localStorage.removeItem(k); });
        localStorage.removeItem('@solana/wallet-adapter-base:walletName');
      } catch {}

      try { sessionStorage.clear(); } catch {}

      await logout();

      setExtAddress(undefined);
      setExtWalletName(undefined);
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-40">
        {!isConnected ? (
          <button
            onClick={handleConnectClick}
            disabled={!ready}
            className={`px-6 py-3 rounded-lg font-medium shadow-lg transition-all duration-200 ${
              ready ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Connect
          </button>
        ) : (
          <div className="flex items-center gap-3 bg-white rounded-lg shadow-lg px-4 py-2.5 border border-gray-200">
            <span className="text-sm font-mono text-gray-700">{truncate(address)}</span>
            <button
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                isDisconnecting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
            </button>
          </div>
        )}
      </div>

      {showWalletOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Connect Wallet</h2>
              <button onClick={handleCloseModals} className="text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleSocialLoginClick}
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Login with Email or Social
              </button>

              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="mx-4 text-sm text-gray-500 font-medium">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCryptoWalletClick}
                  className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-purple-300 transition-all duration-200 font-medium group"
                >
                  <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 transition-all">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  Connect External Wallet
                  <svg className="w-4 h-4 ml-2 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Supports Phantom, Solflare, Backpack, and Glow wallets
              </p>
            </div>
          </div>
        </div>
      )}

      <SocialLoginModal isOpen={showSocialModal} onClose={handleCloseModals} />
      <PrivyCryptoWalletModal
        isOpen={showCryptoWalletModal}
        onClose={handleCloseModals}
        onConnected={(w) => {
          setExtAddress(w?.address);
          setExtWalletName(w?.meta?.name || w?.walletClientType || 'Wallet');
        }}
      />
    </>
  );
};
