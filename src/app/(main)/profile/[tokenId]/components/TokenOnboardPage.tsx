'use client';

import React, { useState, useEffect } from 'react';
import { useWalletUi } from '@wallet-ui/react';
import { toast } from 'sonner';
import axios from 'axios';
import { LoaderThree } from '@/components/ui/loader';
import { TokenHeader } from './TokenHeader';
import { TokenStats } from './TokenStats';
import { TokenSidebar } from './TokenSidebar';
import {
  TokenVesting,
  LPDetails,
  TokenLinks,
  LaunchConfiguration,
  HolderComments,
} from './TokenSections';
import { SwapModal } from '@/app/(main)/markets/[slug]/components/SwapModal'; // Create this component
import { Coin } from '@/types/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function TokenOnboardPage({ tokenId }: { tokenId: string }) {
  const { account } = useWalletUi();
  const [tokenData, setTokenData] = useState<Coin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadTokenData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/coins/mint/${tokenId}`);
        const coinData = response.data;
        setTokenData(coinData);
      } catch (error) {
        console.error('Error loading token data:', error);
        toast.error('Failed to load token data');
      } finally {
        setIsLoading(false);
      }
    };

    if (tokenId) {
      loadTokenData();
    }
  }, [tokenId]);

  const handleTrade = async (amount: number, type: 'buy' | 'sell') => {
    if (!account) {
      toast.error('Please connect your wallet');
      return;
    }

    // Implement actual trade logic here
    toast.success(`${type === 'buy' ? 'Bought' : 'Sold'} ${amount} tokens`);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoaderThree />
        </div>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-[#e5e7eb] mb-4">
            Token Not Found
          </h2>
          <p className="text-[#9ca3af]">
            The token with ID {tokenId} could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="pb-30">
        <TokenHeader tokenData={tokenData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TokenStats tokenData={tokenData} />

          {tokenData.description && (
            <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
              <h3 className="font-semibold text-muted-foreground">
                Description
              </h3>
              <p className="leading-relaxed">{tokenData.description}</p>
              <div className="mt-4 text-sm text-muted-foreground">
                <h4 className="font-semibold text-muted-foreground mb-2">
                  Creator Notes
                </h4>
                <p>Creator has not posted any updates yet.</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden">
            <div className="bg-neutral-950 border-t border-[#65e7fc]/20 p-4">
              <button
                onClick={handleOpenModal}
                className="w-full py-2 rounded-2xl font-funnel-display font-semibold text-lg bg-[#65e7fc] text-white hover:bg-[#65e7fc]/90 transition-all duration-200"
              >
                Swap {tokenData.symbol}
              </button>
            </div>
          </div>

          {/* Add the SwapModal component */}
          <SwapModal
            poolAddress={tokenData.bonding_curve}
            tokenSymbol={tokenData.symbol}
            tokenImage={tokenData.image_uri}
            tokenName={tokenData.name}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            mintAddress={tokenData.mint}
          />

          <TokenVesting tokenTicker={tokenData.symbol} />

          <LPDetails />

          <TokenLinks />

          {/* <AddContent /> */}

          <LaunchConfiguration />
        </div>
      </div>

      <div className="mt-8">
        <HolderComments />
      </div>

      {/* Add the swap button for mobile */}
    </div>
  );
}
