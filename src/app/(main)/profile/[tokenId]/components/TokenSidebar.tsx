'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TradingInterface } from './TradingInterface';

interface TokenData {
  mint: string;
  symbol: string;
  price: number;
  volume24h: number;
  creatorManagement: {
    totalFees: number;
    preGraduationUnclaimed: number;
    postGraduationUnclaimed: number;
  };
}

interface TokenSidebarProps {
  tokenData: TokenData;
  onTrade: (amount: number, type: 'buy' | 'sell') => void;
}

export function TokenSidebar({ tokenData, onTrade }: TokenSidebarProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 backdrop-blur-xl">
        <div className="flex bg-neutral-800 rounded-full p-1 mb-6">
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 py-4 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === 'buy'
                ? 'bg-white text-black'
                : 'text-[#9ca3af] hover:text-muted-foreground'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex-1 py-4 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === 'sell'
                ? 'bg-red-600 text-white'
                : 'text-[#9ca3af] hover:text-muted-foreground'
            }`}
          >
            Sell
          </button>
        </div>

        <TradingInterface
          type={activeTab}
          tokenData={tokenData}
          onTrade={onTrade}
        />
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 backdrop-blur-xl">
        <h3 className="text-lg font-semibold mb-4">Creator Management</h3>

        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-muted-foreground">Fees</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Fees</span>
              <span className="font-semibold">
                {tokenData.creatorManagement.totalFees.toFixed(2)} USDC
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Pre-graduation Unclaimed
              </span>
              <span className="">
                {tokenData.creatorManagement.preGraduationUnclaimed} USDC
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Post-graduation Unclaimed
              </span>
              <span className="">
                {tokenData.creatorManagement.postGraduationUnclaimed} USDC
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            disabled={tokenData.creatorManagement.totalFees === 0}
          >
            Claim Fees
          </Button>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 backdrop-blur-xl">
        <h3 className="text-lg font-semibold mb-4">Token Info</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Contract</span>
            <span className="font-mono text-xs">
              {tokenData.mint.slice(0, 6)}...{tokenData.mint.slice(-4)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">24h Volume</span>
            <span>${tokenData.volume24h.toLocaleString()}</span>
          </div>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              navigator.clipboard.writeText(tokenData.mint);
              toast.success('Contract address copied!');
            }}
          >
            Copy Contract
          </Button>
        </div>
      </div>
    </div>
  );
}
