import React, { FC, ReactNode } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
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
        },
        // Configure embedded wallet settings
        embeddedWallets: {
          createOnLogin: 'users-without-wallets', // Create wallet for new users
          requireUserPasswordOnCreate: false, // No password required for MPC wallets
        },
        // MPC wallet configuration
        mfa: {
          noPromptOnMfaRequired: false,
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