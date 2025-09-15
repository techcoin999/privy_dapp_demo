import React, { FC, ReactNode } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { WalletContextProvider } from './WalletProvider';

interface CombinedWalletProviderProps {
  children: ReactNode;
}

export const CombinedWalletProvider: FC<CombinedWalletProviderProps> = ({ children }) => {
  // You'll need to get your Privy App ID from https://dashboard.privy.io
  const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || 'clxsmm6x702o6ur1pew7stfp0';

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        // Configure login methods - email and social providers
        loginMethods: ['email', 'google', 'twitter', 'apple'],
        // Customize appearance to match your purple theme
        appearance: {
          theme: 'light',
          accentColor: '#7c3aed', // Purple-600
          logo: undefined, // You can add your logo URL here
          showWalletLoginFirst: false, // Show social login first
          walletChainType: 'solana-only', // Focus on Solana for external wallets
        },
        // Configure embedded wallet settings (MPC wallets for social login)
        embeddedWallets: {
          createOnLogin: 'users-without-wallets', // Create MPC wallet for social login users
          requireUserPasswordOnCreate: false, // No password required for MPC wallets
          showWalletUIs: true, // Allow users to see their embedded wallet
        },
        // Configure external wallet connections (Phantom, Solflare, etc.)
        externalWallets: {
          solana: {
            // Enable external Solana wallet connections using Privy's Solana connectors helper
            connectors: toSolanaWalletConnectors(),
          },
        },
        // MPC wallet configuration
        mfa: {
          noPromptOnMfaRequired: false,
        },
        // Legal and compliance settings
        legal: {
          termsAndConditionsUrl: undefined,
          privacyPolicyUrl: undefined,
        },
      }}
    >
      {/* Wrap both Privy and Solana wallet providers */}
      <WalletContextProvider>
        {children}
      </WalletContextProvider>
    </PrivyProvider>
  );
};
