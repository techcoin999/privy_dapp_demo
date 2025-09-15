import React, { useState, useEffect } from 'react';
import { useConnectWallet, usePrivy, useWallets } from '@privy-io/react-auth';

interface PrivyCryptoWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected?: (wallet: any) => void;
}

interface WalletOption {
  name: string;
  icon: string;
  walletClientType: string;
  isAvailable?: boolean;
  description?: string;
}

// Enhanced wallet detection functions
const detectPhantom = (): boolean => {
  try {
    return !!(window as any).phantom?.solana?.isPhantom;
  } catch (error) {
    console.log('Phantom detection error:', error);
    return false;
  }
};

const detectSolflare = (): boolean => {
  try {
    return !!(window as any).solflare;
  } catch (error) {
    console.log('Solflare detection error:', error);
    return false;
  }
};

const detectBackpack = (): boolean => {
  try {
    return !!(window as any).backpack;
  } catch (error) {
    console.log('Backpack detection error:', error);
    return false;
  }
};

const detectGlow = (): boolean => {
  try {
    return !!(window as any).glow;
  } catch (error) {
    console.log('Glow detection error:', error);
    return false;
  }
};

// Wallet configurations with proper Privy wallet client types
const getWalletOptions = (): WalletOption[] => [
  {
    name: 'Phantom',
    walletClientType: 'phantom',
    description: 'Connect with Phantom wallet',
    isAvailable: detectPhantom(),
    icon: `data:image/svg+xml;base64,${btoa(`
      <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="108" height="108" rx="26" fill="url(#paint0_linear_107_46)"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M54 84C71.6731 84 86 69.6731 86 52C86 34.3269 71.6731 20 54 20C36.3269 20 22 34.3269 22 52C22 69.6731 36.3269 84 54 84ZM45.75 45.75C47.4069 45.75 48.75 44.4069 48.75 42.75C48.75 41.0931 47.4069 39.75 45.75 39.75C44.0931 39.75 42.75 41.0931 42.75 42.75C42.75 44.4069 44.0931 45.75 45.75 45.75ZM65.25 42.75C65.25 44.4069 63.9069 45.75 62.25 45.75C60.5931 45.75 59.25 44.4069 59.25 42.75C59.25 41.0931 60.5931 39.75 62.25 39.75C63.9069 39.75 65.25 41.0931 65.25 42.75ZM42 60C42 58.5 43 58 44.5 58H63.5C65 58 66 58.5 66 60C66 61.5 65 62 63.5 62H44.5C43 62 42 61.5 42 60Z" fill="white"/>
        <defs>
          <linearGradient id="paint0_linear_107_46" x1="54" y1="0" x2="54" y2="108" gradientUnits="userSpaceOnUse">
            <stop stop-color="#534BB1"/>
            <stop offset="1" stop-color="#551BF9"/>
          </linearGradient>
        </defs>
      </svg>
    `)}`
  },
  {
    name: 'Solflare',
    walletClientType: 'solflare',
    description: 'Connect with Solflare wallet',
    isAvailable: detectSolflare(),
    icon: `data:image/svg+xml;base64,${btoa(`
      <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="108" height="108" rx="26" fill="url(#paint0_linear_solflare)"/>
        <path d="M54 20C36.3 20 22 34.3 22 52s14.3 32 32 32 32-14.3 32-32S71.7 20 54 20zm0 58c-14.4 0-26-11.6-26-26s11.6-26 26-26 26 11.6 26 26-11.6 26-26 26z" fill="black"/>
        <circle cx="54" cy="52" r="20" fill="url(#paint1_radial_solflare)"/>
        <defs>
          <linearGradient id="paint0_linear_solflare" x1="54" y1="0" x2="54" y2="108" gradientUnits="userSpaceOnUse">
            <stop stop-color="#000000"/>
            <stop offset="1" stop-color="#2D2D2D"/>
          </linearGradient>
          <radialGradient id="paint1_radial_solflare" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54 52) scale(20)">
            <stop stop-color="#FFD700"/>
            <stop offset="1" stop-color="#FFA500"/>
          </radialGradient>
        </defs>
      </svg>
    `)}`
  },
  {
    name: 'Backpack',
    walletClientType: 'backpack',
    description: 'Connect with Backpack wallet',
    isAvailable: detectBackpack(),
    icon: `data:image/svg+xml;base64,${btoa(`
      <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="108" height="108" rx="26" fill="url(#paint0_linear_backpack)"/>
        <path d="M54 20C36.3 20 22 34.3 22 52s14.3 32 32 32 32-14.3 32-32S71.7 20 54 20zm12 46H42v-8h24v8zm0-16H42v-8h24v8z" fill="white"/>
        <defs>
          <linearGradient id="paint0_linear_backpack" x1="54" y1="0" x2="54" y2="108" gradientUnits="userSpaceOnUse">
            <stop stop-color="#E33E3E"/>
            <stop offset="1" stop-color="#B91C1C"/>
          </linearGradient>
        </defs>
      </svg>
    `)}`
  },
  {
    name: 'Glow',
    walletClientType: 'glow',
    description: 'Connect with Glow wallet',
    isAvailable: detectGlow(),
    icon: `data:image/svg+xml;base64,${btoa(`
      <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="108" height="108" rx="26" fill="url(#paint0_linear_glow)"/>
        <circle cx="54" cy="52" r="24" fill="url(#paint1_radial_glow)"/>
        <circle cx="54" cy="52" r="16" fill="url(#paint2_radial_glow)"/>
        <circle cx="54" cy="52" r="8" fill="white"/>
        <defs>
          <linearGradient id="paint0_linear_glow" x1="54" y1="0" x2="54" y2="108" gradientUnits="userSpaceOnUse">
            <stop stop-color="#3B82F6"/>
            <stop offset="1" stop-color="#1E40AF"/>
          </linearGradient>
          <radialGradient id="paint1_radial_glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54 52) scale(24)">
            <stop stop-color="#60A5FA" stop-opacity="0.8"/>
            <stop offset="1" stop-color="#3B82F6" stop-opacity="0.2"/>
          </radialGradient>
          <radialGradient id="paint2_radial_glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54 52) scale(16)">
            <stop stop-color="#BFDBFE"/>
            <stop offset="1" stop-color="#60A5FA"/>
          </radialGradient>
        </defs>
      </svg>
    `)}`
  },
];

export const PrivyCryptoWalletModal: React.FC<PrivyCryptoWalletModalProps> = ({ isOpen, onClose, onConnected }) => {
  const { ready: privyReady, authenticated } = usePrivy();
  const { connectWallet } = useConnectWallet({
    onSuccess: ({ wallet }) => {
      console.log('✅ Privy external wallet connected:', wallet);
      try {
        onConnected?.(wallet);
      } catch (e) {
        console.warn('onConnected callback error:', e);
      }
      setConnectionStatus('Connected successfully!');
      setIsConnecting(false);
      setTimeout(() => {
        onClose();
        setConnectionStatus('');
      }, 800);
    },
    onError: (code) => {
      console.error('❌ Privy connectWallet failed with code:', code);
      setError('Failed to connect wallet. Please try again.');
      setConnectionStatus('');
      setIsConnecting(false);
    },
  } as any);
  const { wallets } = useWallets();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');
  const [walletOptions, setWalletOptions] = useState<WalletOption[]>([]);

  // Update wallet availability on mount and when modal opens
  useEffect(() => {
    if (isOpen) {
      const options = getWalletOptions();
      setWalletOptions(options);
      console.log('🔍 Wallet Detection Results:', options.map(w => ({
        name: w.name,
        available: w.isAvailable
      })));
    }
  }, [isOpen]);

  const handleWalletSelect = async (walletOption: WalletOption) => {
    setIsConnecting(true);
    setError('');
    setConnectionStatus(`Connecting ${walletOption.name}...`);
    
    try {
      console.log(`🚀 Attempting to connect ${walletOption.name} via Privy external wallet...`);
      
      // Check if Privy is ready
      if (!privyReady) {
        throw new Error('Privy is not ready yet. Please try again in a moment.');
      }

      // Check if wallet is available
      if (!walletOption.isAvailable) {
        throw new Error(`${walletOption.name} wallet is not installed. Please install the ${walletOption.name} extension first.`);
      }

      // Open Privy's connect modal filtered to the selected Solana wallet
      console.log(`📞 Calling Privy connectWallet with walletList filter: ${walletOption.walletClientType}`);
      connectWallet({
        walletChainType: 'solana-only',
        walletList: [walletOption.walletClientType as any],
      } as any);
        
    } catch (error: any) {
      console.error(`❌ ${walletOption.name} connection failed:`, error);
      setError(error.message || `Failed to connect ${walletOption.name}. Please try again.`);
      setConnectionStatus('');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleInstallWallet = (walletName: string) => {
    const urls: Record<string, string> = {
      'Phantom': 'https://phantom.app/',
      'Solflare': 'https://solflare.com/',
      'Backpack': 'https://www.backpack.app/',
      'Glow': 'https://glow.app/',
    };
    
    if (urls[walletName]) {
      window.open(urls[walletName], '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Connect External Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isConnecting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Connection Status */}
        {connectionStatus && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm text-blue-800">{connectionStatus}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Wallet Options */}
        <div className="space-y-3">
          {walletOptions.map((wallet) => (
            <div key={wallet.name} className="relative">
              <button
                onClick={() => wallet.isAvailable ? handleWalletSelect(wallet) : handleInstallWallet(wallet.name)}
                disabled={isConnecting}
                className={`w-full flex items-center px-4 py-4 rounded-lg border-2 transition-all duration-200 ${
                  wallet.isAvailable
                    ? 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer'
                    : 'border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100'
                } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {/* Wallet Icon */}
                <div className="flex-shrink-0 w-12 h-12 mr-4">
                  <img
                    src={wallet.icon}
                    alt={`${wallet.name} icon`}
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      // Fallback to a generic wallet icon if the image fails
                      (e.target as HTMLImageElement).src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="48" height="48" rx="8" fill="#7C3AED"/>
                          <path d="M24 12C18.4772 12 14 16.4772 14 22C14 27.5228 18.4772 32 24 32C29.5228 32 34 27.5228 34 22C34 16.4772 29.5228 12 24 12ZM24 28C20.6863 28 18 25.3137 18 22C18 18.6863 20.6863 16 24 16C27.3137 16 30 18.6863 30 22C30 25.3137 27.3137 28 24 28Z" fill="white"/>
                          <path d="M24 36H12C10.8954 36 10 35.1046 10 34V30C10 28.8954 10.8954 28 12 28H36C37.1046 28 38 28.8954 38 30V34C38 35.1046 37.1046 36 36 36H24Z" fill="white"/>
                        </svg>
                      `)}`;
                    }}
                  />
                </div>

                {/* Wallet Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{wallet.name}</span>
                    <div className="flex items-center gap-2">
                      {wallet.isAvailable ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Install
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        via Privy
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {wallet.description}
                    {!wallet.isAvailable && ' - Click to install'}
                  </p>
                </div>

                {/* Arrow Icon */}
                <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Info Message */}
        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-purple-800">
              <p className="font-medium">External Wallet Connection</p>
              <p className="mt-1">
                These wallets connect through Privy but you maintain full control of your private keys. 
                Your wallet will open for transaction signing when needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
