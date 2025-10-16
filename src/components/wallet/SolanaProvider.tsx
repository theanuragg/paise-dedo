'use client';

import React, { FC, ReactNode, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@solana/wallet-adapter-react-ui/styles.css';

const queryClient = new QueryClient();

interface SolanaProviderProps {
  children: ReactNode;
}

export const SolanaProvider: FC<SolanaProviderProps> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => {
    const fromEnv = process.env.NEXT_PUBLIC_RPC_URL;
    if (fromEnv) {
      try {
        new URL(fromEnv);
        return fromEnv;
      } catch {
        console.warn(
          '[SolanaProvider] Invalid NEXT_PUBLIC_RPC_URL. Falling back to clusterApiUrl(Mainnet).',
          fromEnv
        );
      }
    }
    return clusterApiUrl(network);
  }, [network]);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    [network]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
};
