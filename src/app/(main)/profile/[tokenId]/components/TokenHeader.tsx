'use client';

import { Coin } from '@/types/types';
import React from 'react';

interface TokenHeaderProps {
  tokenData: Coin;
}

export function TokenHeader({ tokenData }: TokenHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="relative w-full ">
        <div className="size-42 rounded-xl w-full overflow-hidden">
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f12]/60 to-transparent" />
        <div className="absolute z-10 -bottom-30 w-full px-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="size-40 rounded-full overflow-hidden">
              
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#e5e7eb]">
                {tokenData.name}
              </h1>
              <p className="text-[#9ca3af]">Token: {tokenData.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-[#9ca3af]">Price</div>
            {/* <div className="text-2xl font-bold text-[#e5e7eb]">
              ${tokenData.price.toFixed(6)} USDC
            </div>
            <div
              className={`text-sm ${tokenData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              {tokenData.priceChange24h >= 0 ? '+' : ''}
              {tokenData.priceChange24h}%
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
