import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePrivy } from '@privy-io/react-auth';

interface CryptoWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WalletOption {
  name: string;
  icon: string;
  adapter?: string;
  connectViaPrivy?: boolean;
}

// Wallet configurations with proper icons
const walletOptions: WalletOption[] = [
  {
    name: 'Phantom',
    icon: `data:image/svg+xml;base64,${btoa(`
      <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="108" height="108" rx="26" fill="url(#paint0_linear_107_46)"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M54 84C71.6731 84 86 69.6731 86 52C86 34.3269 71.6731 20 54 20C36.3269 20 22 34.3269 22 52C22 69.6731 36.3269 84 54 84ZM55.5 38C55.5 37.1716 54.8284 36.5 54 36.5C53.1716 36.5 52.5 37.1716 52.5 38C52.5 38.8284 53.1716 39.5 54 39.5C54.8284 39.5 55.5 38.8284 55.5 38ZM36.8047 57.375C34.7344 55.4766 34.8047 52.0234 37.0156 50.0156C43.9688 42.5859 55.4531 42.2578 62.8828 49.2109C64.5703 50.7891 65.4844 53.0859 65.4844 55.5C65.4844 57.9141 64.5703 60.2109 62.8828 61.7891L58.1719 66.0703C55.0781 68.9063 50.0547 68.9063 46.9609 66.0703L42.25 61.7891C40.5625 60.2109 39.6484 57.9141 39.6484 55.5C39.6484 55.3594 39.6484 55.2188 39.6719 55.0781C39.7656 54.2031 40.5156 53.5781 41.4062 53.6719C42.2812 53.7656 42.9062 54.5156 42.8125 55.4062C42.7891 55.4531 42.7891 55.5 42.7891 55.5C42.7891 56.7422 43.2734 57.9375 44.125 58.8594L48.8359 63.1406C50.2969 64.4688 52.5781 64.4688 54.0391 63.1406L58.75 58.8594C59.6016 57.9375 60.0859 56.7422 60.0859 55.5C60.0859 54.2578 59.6016 53.0625 58.75 52.1406C54.0625 47.8125 46.8125 48.0234 42.4844 52.7109C41.4062 53.9297 41.4844 55.7578 42.7031 56.8359L44.1484 58.1641C44.8438 58.7891 45.9219 58.7422 46.5469 58.0469C47.1719 57.3516 47.125 56.2734 46.4297 55.6484L45.7812 55.0547C45.6562 54.9531 45.5547 54.8281 45.4766 54.6875C45.0391 53.9688 45.2734 53.0391 46.0156 52.6016C46.7344 52.1641 47.6641 52.3984 48.1016 53.1406C48.2891 53.4844 48.5469 53.7891 48.8594 54.0391L49.5078 54.6328C51.7188 56.6406 51.6484 60.0938 49.3438 62.0234C47.0391 63.9531 43.5859 63.8828 41.3281 61.875L39.8828 60.5469C37.3906 58.3125 37.2969 54.4922 39.6016 52.125C45.9219 45.5391 56.9531 45.9141 62.8828 52.9531C64.3438 54.5078 65.1406 56.5391 65.1406 58.6719C65.1406 60.8047 64.3438 62.8359 62.8828 64.3906L58.1719 68.6719C53.8906 72.5859 47.2344 72.5859 42.9531 68.6719L38.2422 64.3906C36.7812 62.8359 35.9844 60.8047 35.9844 58.6719C35.9844 56.5391 36.7812 54.5078 38.2422 52.9531L42.9531 48.6719C47.2344 44.7578 53.8906 44.7578 58.1719 48.6719L60.6094 50.9219C61.3047 51.5469 62.3828 51.5 63.0078 50.8047C63.6328 50.1094 63.5859 49.0313 62.8906 48.4062L60.4531 46.1562C54.6875 40.9375 45.4375 40.9375 39.6719 46.1562L34.9609 50.4375C32.4688 52.7422 32.5625 56.5625 35.1562 58.7969L36.8047 57.375Z" fill="url(#paint1_linear_107_46)"/>
        <defs>
          <linearGradient id="paint0_linear_107_46" x1="54" y1="0" x2="54" y2="108" gradientUnits="userSpaceOnUse">
            <stop stop-color="#534BB1"/>
            <stop offset="1" stop-color="#551BF9"/>
          </linearGradient>
          <linearGradient id="paint1_linear_107_46" x1="54" y1="20" x2="54" y2="84" gradientUnits="userSpaceOnUse">
            <stop stop-color="white"/>
            <stop offset="1" stop-color="white" stop-opacity="0.82"/>
          </linearGradient>
        </defs>
      </svg>
    `)}`,
    adapter: 'phantom',
    connectViaPrivy: true // Special flag for Phantom to connect via Privy
  },
  {
    name: 'MetaMask',
    icon: `data:image/svg+xml;base64,${btoa(`
      <svg width="212" height="189" viewBox="0 0 212 189" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0)">
          <path d="M40.7 152.8L51.5 177.7L60.8 188.9H93.1L102.4 177.7L113.2 152.8L155.6 36.7L169.9 0.6H127.5L40.7 152.8Z" fill="#E17726" stroke="#E17726" stroke-width="0.25" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M171.9 152.8L161.1 177.7L151.8 188.9H119.5L110.2 177.7L99.4 152.8L57 36.7L42.7 0.6H85.1L171.9 152.8Z" fill="#E27625" stroke="#E27625" stroke-width="0.25" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M187.8 93.2L191.9 69L184.3 45.3L127.5 0.6L169.9 0.6L184.3 45.3L191.9 69L187.8 93.2Z" fill="#E27625" stroke="#E27625" stroke-width="0.25" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M24.8 93.2L20.7 69L28.3 45.3L85.1 0.6L42.7 0.6L28.3 45.3L20.7 69L24.8 93.2Z" fill="#E27625" stroke="#E27625" stroke-width="0.25" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
          <clipPath id="clip0">
            <rect width="212" height="189" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    `)}`,
    adapter: 'metamask'
  },
  {
    name: 'Solflare',
    icon: `data:image/svg+xml;base64,${btoa(`
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="12" fill="black"/>
        <path d="M32 8C37.5228 8 42 12.4772 42 18V46C42 51.5228 37.5228 56 32 56C26.4772 56 22 51.5228 22 46V18C22 12.4772 26.4772 8 32 8Z" fill="#FFC107"/>
        <path d="M32 20C35.3137 20 38 22.6863 38 26V38C38 41.3137 35.3137 44 32 44C28.6863 44 26 41.3137 26 38V26C26 22.6863 28.6863 20 32 20Z" fill="#FF9800"/>
      </svg>
    `)}`,
    adapter: 'solflare'
  },
  {
    name: 'Backpack',
    icon: `data:image/svg+xml;base64,${btoa(`
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="12" fill="#E33E3F"/>
        <path d="M32 12C38.6274 12 44 17.3726 44 24V40C44 46.6274 38.6274 52 32 52C25.3726 52 20 46.6274 20 40V24C20 17.3726 25.3726 12 32 12Z" fill="white"/>
        <path d="M32 20C35.3137 20 38 22.6863 38 26V38C38 41.3137 35.3137 44 32 44C28.6863 44 26 41.3137 26 38V26C26 22.6863 28.6863 20 32 20Z" fill="#E33E3F"/>
      </svg>
    `)}`,
    adapter: 'backpack'
  },
  {
    name: 'Glow',
    icon: `data:image/svg+xml;base64,${btoa(`
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="12" fill="#1A1A1A"/>
        <circle cx="32" cy="32" r="20" fill="#00D4AA"/>
        <circle cx="32" cy="32" r="12" fill="#1A1A1A"/>
        <circle cx="32" cy="32" r="6" fill="#00D4AA"/>
      </svg>
    `)}`,
    adapter: 'glow'
  }
];

export const CryptoWalletModal: React.FC<CryptoWalletModalProps> = ({ isOpen, onClose }) => {
  const { select, wallets } = useWallet();
  const { connectWallet } = usePrivy();

  const handleWalletSelect = async (walletOption: WalletOption) => {
    try {
      if (walletOption.connectViaPrivy) {
        // For Phantom, connect through Privy as requested
        await connectWallet();
        console.log(`Connecting ${walletOption.name} via Privy...`);
      } else {
        // For other wallets, use traditional Solana wallet adapter
        const wallet = wallets.find(w => 
          w.adapter.name.toLowerCase().includes(walletOption.adapter?.toLowerCase() || '')
        );
        
        if (wallet) {
          select(wallet.adapter.name);
          console.log(`Connecting ${walletOption.name} via Solana adapter...`);
        } else {
          console.error(`${walletOption.name} wallet not found`);
          // Fallback: try to connect via Privy if adapter not found
          await connectWallet();
        }
      }
      onClose();
    } catch (error) {
      console.error(`Failed to connect ${walletOption.name}:`, error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Connect Crypto Wallet</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Wallet Options */}
        <div className="space-y-3">
          {walletOptions.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => handleWalletSelect(wallet)}
              className="w-full flex items-center px-4 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-purple-300 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-12 h-12 mr-4 rounded-lg bg-gray-100 group-hover:bg-purple-50 transition-colors">
                <img 
                  src={wallet.icon} 
                  alt={wallet.name}
                  className="w-8 h-8"
                  onError={(e) => {
                    // Fallback to a generic wallet icon if image fails to load
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <svg 
                  className="w-8 h-8 text-gray-400 hidden" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              
              <div className="flex-1 text-left">
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-900">{wallet.name}</h3>
                  {wallet.connectViaPrivy && (
                    <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                      via Privy
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {wallet.name === 'Phantom' 
                    ? 'Popular Solana wallet (connects via Privy MPC)'
                    : wallet.name === 'MetaMask'
                    ? 'Multi-chain wallet with Solana support'
                    : `${wallet.name} wallet for Solana`
                  }
                </p>
              </div>

              <svg 
                className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-purple-900">Wallet Security</p>
              <p className="text-xs text-purple-700 mt-1">
                Your private keys remain secure. Phantom connects through Privy's MPC technology for enhanced security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};